// Quest Log Modal - Daily Quests with Solo Leveling angular panels
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, Dimensions } from 'react-native';
import Svg, { Path, Line, Rect } from 'react-native-svg';
import { QuestPanel, ProgressBar, GlowButton, CountdownTimer } from '../components';
import { useGame } from '../context/GameContext';
import { colors, fontSizes, spacing, glowShadow, touchTarget } from '../styles/theme';
import { Attribute } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface QuestLogModalProps {
    visible: boolean;
    onClose: () => void;
}

export const QuestLogModal: React.FC<QuestLogModalProps> = ({ visible, onClose }) => {
    const { state, dispatch } = useGame();
    const [showAddQuest, setShowAddQuest] = useState(false);
    const [newQuestTitle, setNewQuestTitle] = useState('');
    const [newQuestAttribute, setNewQuestAttribute] = useState<Attribute['name']>('STR');

    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const modalWidth = SCREEN_WIDTH * 0.92;
    const modalHeight = 550;
    const cs = 15;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 100, friction: 10 }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start();
        } else {
            scaleAnim.setValue(0.9);
            opacityAnim.setValue(0);
        }
    }, [visible]);

    if (!visible) return null;

    const handleCompleteQuest = (questId: string) => {
        dispatch({ type: 'COMPLETE_DAILY_QUEST', payload: questId });
    };

    const handleAddQuest = () => {
        if (newQuestTitle.trim()) {
            // Generate end of day deadline
            const today = new Date();
            today.setHours(23, 59, 59, 999);

            dispatch({
                type: 'ADD_DAILY_QUEST',
                payload: {
                    title: newQuestTitle.trim().toUpperCase(),
                    description: '',
                    attribute: newQuestAttribute,
                    xpReward: 25,
                    deadline: today.toISOString(),
                },
            });
            setNewQuestTitle('');
            setShowAddQuest(false);
        }
    };

    // Get deadline from first quest or use end of today
    const getDeadline = () => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return today.toISOString();
    };

    const framePath = `M ${cs} 0 L ${modalWidth - cs} 0 L ${modalWidth} ${cs} L ${modalWidth} ${modalHeight - cs} L ${modalWidth - cs} ${modalHeight} L ${cs} ${modalHeight} L 0 ${modalHeight - cs} L 0 ${cs} Z`;

    const corners = [
        `M 0 ${cs + 10} L 0 ${cs} L ${cs} 0 L ${cs + 10} 0`,
        `M ${modalWidth - cs - 10} 0 L ${modalWidth - cs} 0 L ${modalWidth} ${cs} L ${modalWidth} ${cs + 10}`,
        `M ${modalWidth} ${modalHeight - cs - 10} L ${modalWidth} ${modalHeight - cs} L ${modalWidth - cs} ${modalHeight} L ${modalWidth - cs - 10} ${modalHeight}`,
        `M ${cs + 10} ${modalHeight} L ${cs} ${modalHeight} L 0 ${modalHeight - cs} L 0 ${modalHeight - cs - 10}`,
    ];

    const incompleteQuests = state.dailyQuests.filter(q => !q.isComplete);
    const completeQuests = state.dailyQuests.filter(q => q.isComplete);

    return (
        <View style={styles.overlay}>
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />

            <Animated.View style={[
                styles.modalContainer,
                { width: modalWidth, height: modalHeight, opacity: opacityAnim, transform: [{ scale: scaleAnim }] }
            ]}>
                <Svg width={modalWidth} height={modalHeight} style={StyleSheet.absoluteFill}>
                    <Path d={framePath} fill={colors.voidBlack} fillOpacity={0.98} />
                    {Array.from({ length: Math.floor(modalHeight / 4) }).map((_, i) => (
                        <Line key={i} x1={cs} y1={i * 4} x2={modalWidth - cs} y2={i * 4} stroke={colors.electricCyan} strokeOpacity={0.02} strokeWidth={1} />
                    ))}
                    <Path d={framePath} fill="none" stroke={colors.electricCyan} strokeWidth={1.5} />
                    {corners.map((path, i) => (
                        <Path key={i} d={path} fill="none" stroke={colors.electricCyan} strokeWidth={2.5} />
                    ))}
                </Svg>

                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>DAILY QUESTS</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>×</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Countdown Timer */}
                    <CountdownTimer deadline={getDeadline()} />

                    {/* Warning */}
                    <View style={styles.warning}>
                        <Text style={styles.warningText}>⚠ FAILURE TO COMPLETE WILL RESULT IN PENALTY</Text>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={styles.questList}>
                        {/* Add Quest */}
                        {showAddQuest ? (
                            <View style={styles.addQuestForm}>
                                <TextInput
                                    style={styles.questInput}
                                    value={newQuestTitle}
                                    onChangeText={setNewQuestTitle}
                                    placeholder="ENTER QUEST..."
                                    placeholderTextColor={colors.dimmed}
                                    autoCapitalize="characters"
                                />
                                <View style={styles.attrSelect}>
                                    {(['STR', 'INT', 'SOC', 'HLTH'] as const).map(attr => (
                                        <TouchableOpacity
                                            key={attr}
                                            style={[styles.attrBtn, newQuestAttribute === attr && styles.attrBtnActive]}
                                            onPress={() => setNewQuestAttribute(attr)}
                                        >
                                            <Text style={[styles.attrText, newQuestAttribute === attr && styles.attrTextActive]}>
                                                {attr}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <View style={styles.formBtns}>
                                    <GlowButton title="ADD" onPress={handleAddQuest} size="small" />
                                    <GlowButton title="CANCEL" onPress={() => setShowAddQuest(false)} variant="danger" size="small" />
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.addButton} onPress={() => setShowAddQuest(true)}>
                                <Text style={styles.addButtonText}>+ Add a Quest</Text>
                            </TouchableOpacity>
                        )}

                        {/* Quest Panels */}
                        {incompleteQuests.map(quest => (
                            <QuestPanel key={quest.id} quest={quest} onComplete={handleCompleteQuest} />
                        ))}

                        {completeQuests.length > 0 && (
                            <>
                                <Text style={styles.sectionLabel}>[COMPLETE]</Text>
                                {completeQuests.map(quest => (
                                    <QuestPanel key={quest.id} quest={quest} onComplete={handleCompleteQuest} />
                                ))}
                            </>
                        )}

                        {state.dailyQuests.length === 0 && (
                            <Text style={styles.emptyText}>NO QUESTS ASSIGNED</Text>
                        )}
                    </ScrollView>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(2, 2, 10, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContainer: {
        ...glowShadow.cyanIntense,
    },
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    title: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xl,
        color: colors.electricCyan,
        letterSpacing: 2,
        textShadowColor: colors.electricCyan,
        textShadowRadius: 10,
    },
    closeButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xxl,
        color: colors.paleCyan,
    },
    warning: {
        backgroundColor: 'rgba(255, 51, 51, 0.1)',
        borderWidth: 1,
        borderColor: colors.alertRed,
        padding: spacing.sm,
        marginBottom: spacing.md,
    },
    warningText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xs,
        color: colors.alertRed,
        textAlign: 'center',
        letterSpacing: 1,
    },
    questList: {
        flex: 1,
    },
    addButton: {
        borderWidth: 1,
        borderColor: colors.electricCyan,
        borderStyle: 'dashed',
        padding: spacing.md,
        alignItems: 'center',
        marginBottom: spacing.md,
        minHeight: touchTarget.minHeight,
    },
    addButtonText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.electricCyan,
    },
    addQuestForm: {
        borderWidth: 1,
        borderColor: colors.electricCyan,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    questInput: {
        borderWidth: 1,
        borderColor: colors.dimmed,
        color: colors.paleCyan,
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        padding: spacing.sm,
        marginBottom: spacing.sm,
    },
    attrSelect: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    attrBtn: {
        flex: 1,
        padding: spacing.sm,
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
        fontSize: fontSizes.sm,
        color: colors.dimmed,
    },
    attrTextActive: {
        color: colors.electricCyan,
    },
    formBtns: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacing.sm,
    },
    sectionLabel: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.gold,
        letterSpacing: 2,
        marginVertical: spacing.sm,
    },
    emptyText: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        color: colors.dimmed,
        textAlign: 'center',
        marginTop: spacing.xl,
    },
});

export default QuestLogModal;
