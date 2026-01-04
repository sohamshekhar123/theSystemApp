// System Configuration Screen - Initial setup for daily quests and penalty
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Animated } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { useGame } from '../context/GameContext';
import { colors, fontSizes, spacing, glowShadow, touchTarget } from '../styles/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface QuestInput {
    id: string;
    title: string;
    attribute: 'STR' | 'INT' | 'SOC' | 'HLTH';
}

export const SystemConfigScreen: React.FC = () => {
    const { dispatch } = useGame();
    const [quests, setQuests] = useState<QuestInput[]>([
        { id: '1', title: '', attribute: 'STR' },
    ]);
    const [penalty, setPenalty] = useState('');

    const frameWidth = SCREEN_WIDTH - 32;
    const frameHeight = SCREEN_HEIGHT - 100;
    const cs = 15;

    const framePath = `M ${cs} 0 L ${frameWidth - cs} 0 L ${frameWidth} ${cs} L ${frameWidth} ${frameHeight - cs} L ${frameWidth - cs} ${frameHeight} L ${cs} ${frameHeight} L 0 ${frameHeight - cs} L 0 ${cs} Z`;
    const corners = [
        `M 0 ${cs + 10} L 0 ${cs} L ${cs} 0 L ${cs + 10} 0`,
        `M ${frameWidth - cs - 10} 0 L ${frameWidth - cs} 0 L ${frameWidth} ${cs} L ${frameWidth} ${cs + 10}`,
        `M ${frameWidth} ${frameHeight - cs - 10} L ${frameWidth} ${frameHeight - cs} L ${frameWidth - cs} ${frameHeight} L ${frameWidth - cs - 10} ${frameHeight}`,
        `M ${cs + 10} ${frameHeight} L ${cs} ${frameHeight} L 0 ${frameHeight - cs} L 0 ${frameHeight - cs - 10}`,
    ];

    const addQuest = () => {
        if (quests.length < 5) {
            setQuests([...quests, { id: String(Date.now()), title: '', attribute: 'STR' }]);
        }
    };

    const removeQuest = (id: string) => {
        if (quests.length > 1) {
            setQuests(quests.filter(q => q.id !== id));
        }
    };

    const updateQuest = (id: string, title: string) => {
        setQuests(quests.map(q => q.id === id ? { ...q, title } : q));
    };

    const updateQuestAttribute = (id: string, attribute: QuestInput['attribute']) => {
        setQuests(quests.map(q => q.id === id ? { ...q, attribute } : q));
    };

    const handleSubmit = () => {
        // Filter out empty quests
        const validQuests = quests.filter(q => q.title.trim());

        if (validQuests.length === 0) {
            return; // Need at least one quest
        }

        // Get end of day deadline
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const deadline = today.toISOString();

        // Add each quest as a core quest
        validQuests.forEach(q => {
            dispatch({
                type: 'ADD_CORE_QUEST',
                payload: {
                    title: q.title.trim().toUpperCase(),
                    description: '',
                    attribute: q.attribute,
                    xpReward: 25,
                    deadline,
                },
            });
        });

        // Set penalty if provided
        if (penalty.trim()) {
            dispatch({
                type: 'SET_PENALTY_TASK',
                payload: {
                    title: 'PENALTY',
                    description: penalty.trim().toUpperCase(),
                },
            });
        }

        // Mark configuration as complete
        dispatch({ type: 'COMPLETE_CONFIGURATION' });
    };

    const canSubmit = quests.some(q => q.title.trim());

    return (
        <View style={styles.container}>
            {/* Background scanlines */}
            <View style={styles.scanlinesBg}>
                {Array.from({ length: Math.floor(SCREEN_HEIGHT / 3) }).map((_, i) => (
                    <View key={i} style={styles.bgScanline} />
                ))}
            </View>

            <View style={[styles.frame, { width: frameWidth, height: frameHeight }]}>
                <Svg width={frameWidth} height={frameHeight} style={StyleSheet.absoluteFill}>
                    <Path d={framePath} fill={colors.voidBlack} fillOpacity={0.98} />
                    {Array.from({ length: Math.floor(frameHeight / 4) }).map((_, i) => (
                        <Line key={i} x1={cs} y1={i * 4} x2={frameWidth - cs} y2={i * 4} stroke={colors.electricCyan} strokeOpacity={0.02} strokeWidth={1} />
                    ))}
                    <Path d={framePath} fill="none" stroke={colors.electricCyan} strokeWidth={1.5} />
                    {corners.map((path, i) => (
                        <Path key={i} d={path} fill="none" stroke={colors.electricCyan} strokeWidth={2.5} />
                    ))}
                </Svg>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <Text style={styles.title}>SYSTEM CONFIGURATION</Text>
                    <Text style={styles.subtitle}>INITIALIZE YOUR DAILY TRAINING PROTOCOL</Text>

                    {/* Daily Quests Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>DAILY QUESTS ({quests.length}/5)</Text>
                        <Text style={styles.sectionHint}>These quests must be completed every day</Text>

                        {quests.map((quest, index) => (
                            <View key={quest.id} style={styles.questRow}>
                                <View style={styles.questInputContainer}>
                                    <TextInput
                                        style={styles.questInput}
                                        value={quest.title}
                                        onChangeText={(text) => updateQuest(quest.id, text)}
                                        placeholder={`Quest ${index + 1}...`}
                                        placeholderTextColor={colors.dimmed}
                                        autoCapitalize="characters"
                                    />
                                    <View style={styles.attrSelect}>
                                        {(['STR', 'INT', 'SOC', 'HLTH'] as const).map(attr => (
                                            <TouchableOpacity
                                                key={attr}
                                                style={[styles.attrBtn, quest.attribute === attr && styles.attrBtnActive]}
                                                onPress={() => updateQuestAttribute(quest.id, attr)}
                                            >
                                                <Text style={[styles.attrText, quest.attribute === attr && styles.attrTextActive]}>
                                                    {attr}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                                {quests.length > 1 && (
                                    <TouchableOpacity style={styles.removeBtn} onPress={() => removeQuest(quest.id)}>
                                        <Text style={styles.removeBtnText}>×</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}

                        {quests.length < 5 && (
                            <TouchableOpacity style={styles.addBtn} onPress={addQuest}>
                                <Text style={styles.addBtnText}>+ ADD QUEST</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Penalty Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.alertRed }]}>PENALTY</Text>
                        <Text style={styles.sectionHint}>Consequence for failing daily quests</Text>

                        <TextInput
                            style={[styles.questInput, styles.penaltyInput]}
                            value={penalty}
                            onChangeText={setPenalty}
                            placeholder="e.g., NO SOCIAL MEDIA FOR 24H"
                            placeholderTextColor={colors.dimmed}
                            autoCapitalize="characters"
                            multiline
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
                        onPress={handleSubmit}
                        disabled={!canSubmit}
                    >
                        <Text style={styles.submitBtnText}>INITIALIZE SYSTEM</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.voidBlack,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanlinesBg: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.3,
    },
    bgScanline: {
        height: 1,
        backgroundColor: colors.electricCyan,
        opacity: 0.02,
        marginBottom: 2,
    },
    frame: {
        ...glowShadow.cyan,
    },
    content: {
        flex: 1,
        padding: spacing.xl,
    },
    title: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xxl,
        color: colors.electricCyan,
        letterSpacing: 3,
        textAlign: 'center',
        textShadowColor: colors.electricCyan,
        textShadowRadius: 15,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
        textAlign: 'center',
        letterSpacing: 2,
        marginBottom: spacing.xl,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.electricCyan,
        letterSpacing: 2,
        marginBottom: spacing.xs,
    },
    sectionHint: {
        fontFamily: 'Rajdhani-Regular',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
        marginBottom: spacing.md,
    },
    questRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    questInputContainer: {
        flex: 1,
    },
    questInput: {
        borderWidth: 1,
        borderColor: colors.electricCyan,
        backgroundColor: 'transparent',
        color: colors.paleCyan,
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        padding: spacing.md,
        letterSpacing: 1,
    },
    attrSelect: {
        flexDirection: 'row',
        marginTop: spacing.xs,
        gap: spacing.xs,
    },
    attrBtn: {
        flex: 1,
        padding: spacing.xs,
        borderWidth: 1,
        borderColor: colors.dimmed,
        alignItems: 'center',
    },
    attrBtnActive: {
        borderColor: colors.electricCyan,
        backgroundColor: colors.glowOverlay,
    },
    attrText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xs,
        color: colors.dimmed,
    },
    attrTextActive: {
        color: colors.electricCyan,
    },
    removeBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: spacing.sm,
    },
    removeBtnText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xxl,
        color: colors.alertRed,
    },
    addBtn: {
        borderWidth: 1,
        borderColor: colors.electricCyan,
        borderStyle: 'dashed',
        padding: spacing.md,
        alignItems: 'center',
        minHeight: touchTarget.minHeight,
    },
    addBtnText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.electricCyan,
    },
    penaltyInput: {
        borderColor: colors.alertRed,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    submitBtn: {
        borderWidth: 2,
        borderColor: colors.electricCyan,
        padding: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.lg,
        marginBottom: spacing.xxl,
        ...glowShadow.cyanIntense,
    },
    submitBtnDisabled: {
        borderColor: colors.dimmed,
        opacity: 0.5,
    },
    submitBtnText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.lg,
        color: colors.electricCyan,
        letterSpacing: 3,
    },
});

export default SystemConfigScreen;
