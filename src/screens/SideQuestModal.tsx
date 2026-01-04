// Side Quest Modal - Create non-daily quests with deadlines
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import Svg, { Path, Line } from 'react-native-svg';
import { GlowButton } from '../components';
import { useGame } from '../context/GameContext';
import { colors, fontSizes, spacing, glowShadow, touchTarget } from '../styles/theme';
import { Attribute } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SideQuestModalProps {
    visible: boolean;
    onClose: () => void;
}

export const SideQuestModal: React.FC<SideQuestModalProps> = ({ visible, onClose }) => {
    const { state, dispatch } = useGame();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [attribute, setAttribute] = useState<Attribute['name']>('STR');
    const [xpReward, setXpReward] = useState(50);
    const [deadlineDate, setDeadlineDate] = useState('');
    const [deadlineTime, setDeadlineTime] = useState('23:59');

    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const modalWidth = SCREEN_WIDTH * 0.92;
    const modalHeight = 520;
    const cs = 15;

    useEffect(() => {
        if (visible) {
            // Set default date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setDeadlineDate(tomorrow.toISOString().split('T')[0]);

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

    const handleCreate = () => {
        if (title.trim() && deadlineDate) {
            // Create deadline datetime
            const [hours, minutes] = deadlineTime.split(':').map(Number);
            const deadline = new Date(deadlineDate);
            deadline.setHours(hours, minutes, 59, 999);

            dispatch({
                type: 'ADD_BOSS_RAID',
                payload: {
                    name: title.trim().toUpperCase(),
                    description: description.trim(),
                    totalHp: 100,
                    subQuests: [{
                        id: Date.now().toString(),
                        title: 'Complete Task',
                        xpReward: xpReward,
                        attribute,
                        isComplete: false,
                    }],
                    deadline: deadline.toISOString(),
                },
            });

            setTitle('');
            setDescription('');
            setXpReward(50);
            onClose();
        }
    };

    const framePath = `M ${cs} 0 L ${modalWidth - cs} 0 L ${modalWidth} ${cs} L ${modalWidth} ${modalHeight - cs} L ${modalWidth - cs} ${modalHeight} L ${cs} ${modalHeight} L 0 ${modalHeight - cs} L 0 ${cs} Z`;
    const corners = [
        `M 0 ${cs + 10} L 0 ${cs} L ${cs} 0 L ${cs + 10} 0`,
        `M ${modalWidth - cs - 10} 0 L ${modalWidth - cs} 0 L ${modalWidth} ${cs} L ${modalWidth} ${cs + 10}`,
        `M ${modalWidth} ${modalHeight - cs - 10} L ${modalWidth} ${modalHeight - cs} L ${modalWidth - cs} ${modalHeight} L ${modalWidth - cs - 10} ${modalHeight}`,
        `M ${cs + 10} ${modalHeight} L ${cs} ${modalHeight} L 0 ${modalHeight - cs} L 0 ${modalHeight - cs - 10}`,
    ];

    // Display existing side quests (boss raids)
    const sideQuests = state.bossRaids.filter(b => !b.isDefeated);

    return (
        <View style={styles.overlay}>
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />

            <Animated.View style={[
                styles.modalContainer,
                { width: modalWidth, height: modalHeight, opacity: opacityAnim, transform: [{ scale: scaleAnim }] }
            ]}>
                <Svg width={modalWidth} height={modalHeight} style={StyleSheet.absoluteFill}>
                    <Path d={framePath} fill={colors.voidBlack} fillOpacity={0.98} />
                    <Path d={framePath} fill="none" stroke={colors.gold} strokeWidth={1.5} />
                    {corners.map((path, i) => (
                        <Path key={i} d={path} fill="none" stroke={colors.gold} strokeWidth={2.5} />
                    ))}
                </Svg>

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>SIDE QUESTS</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>×</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Create New Quest Form */}
                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>CREATE NEW QUEST</Text>

                            <TextInput
                                style={styles.input}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="QUEST TITLE..."
                                placeholderTextColor={colors.dimmed}
                                autoCapitalize="characters"
                            />

                            <TextInput
                                style={[styles.input, styles.descInput]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Description (optional)..."
                                placeholderTextColor={colors.dimmed}
                                multiline
                            />

                            {/* Attribute selector */}
                            <View style={styles.attrSelect}>
                                {(['STR', 'INT', 'SOC', 'HLTH'] as const).map(attr => (
                                    <TouchableOpacity
                                        key={attr}
                                        style={[styles.attrBtn, attribute === attr && styles.attrBtnActive]}
                                        onPress={() => setAttribute(attr)}
                                    >
                                        <Text style={[styles.attrText, attribute === attr && styles.attrTextActive]}>
                                            {attr}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Deadline inputs */}
                            <View style={styles.deadlineRow}>
                                <View style={styles.deadlineInput}>
                                    <Text style={styles.inputLabel}>DATE</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={deadlineDate}
                                        onChangeText={setDeadlineDate}
                                        placeholder="YYYY-MM-DD"
                                        placeholderTextColor={colors.dimmed}
                                    />
                                </View>
                                <View style={styles.deadlineInput}>
                                    <Text style={styles.inputLabel}>TIME</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={deadlineTime}
                                        onChangeText={setDeadlineTime}
                                        placeholder="HH:MM"
                                        placeholderTextColor={colors.dimmed}
                                    />
                                </View>
                            </View>

                            {/* XP Reward Slider */}
                            <View style={styles.sliderSection}>
                                <Text style={styles.inputLabel}>XP REWARD: {xpReward}</Text>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={10}
                                    maximumValue={200}
                                    step={10}
                                    value={xpReward}
                                    onValueChange={setXpReward}
                                    minimumTrackTintColor={colors.gold}
                                    maximumTrackTintColor={colors.dimmed}
                                    thumbTintColor={colors.gold}
                                />
                                <View style={styles.sliderLabels}>
                                    <Text style={styles.sliderLabel}>10</Text>
                                    <Text style={styles.sliderLabel}>200</Text>
                                </View>
                            </View>

                            <GlowButton
                                title="CREATE QUEST"
                                onPress={handleCreate}
                                disabled={!title.trim() || !deadlineDate}
                            />
                        </View>

                        {/* Existing Side Quests */}
                        {sideQuests.length > 0 && (
                            <View style={styles.listSection}>
                                <Text style={styles.sectionTitle}>ACTIVE QUESTS</Text>
                                {sideQuests.map(quest => (
                                    <TouchableOpacity
                                        key={quest.id}
                                        style={styles.questItem}
                                        onPress={() => {
                                            if (quest.subQuests.length > 0) {
                                                dispatch({
                                                    type: 'COMPLETE_SUB_QUEST',
                                                    payload: {
                                                        bossId: quest.id,
                                                        subQuestId: quest.subQuests[0].id
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        <View style={styles.questContent}>
                                            <Text style={styles.questTitle}>{quest.name}</Text>
                                            <Text style={styles.questDeadline}>
                                                DUE: {new Date(quest.deadline).toLocaleDateString()} {new Date(quest.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </View>
                                        <View style={styles.checkbox}>
                                            <View style={styles.checkboxInner} />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
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
        ...glowShadow.gold,
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
        color: colors.gold,
        letterSpacing: 2,
        textShadowColor: colors.gold,
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
    formSection: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.gold,
        letterSpacing: 2,
        marginBottom: spacing.md,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gold,
        backgroundColor: 'transparent',
        color: colors.paleCyan,
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    descInput: {
        minHeight: 60,
        textAlignVertical: 'top',
    },
    inputLabel: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xs,
        color: colors.dimmed,
        marginBottom: spacing.xs,
    },
    attrSelect: {
        flexDirection: 'row',
        gap: spacing.xs,
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
        borderColor: colors.gold,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    attrText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
    },
    attrTextActive: {
        color: colors.gold,
    },
    deadlineRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    deadlineInput: {
        flex: 1,
    },
    listSection: {
        marginTop: spacing.md,
    },
    questItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.gold,
        padding: spacing.md,
        marginBottom: spacing.sm,
        backgroundColor: 'rgba(255, 215, 0, 0.05)',
    },
    questContent: {
        flex: 1,
        marginRight: spacing.md,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: colors.gold,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxInner: {
        width: 14,
        height: 14,
        backgroundColor: 'transparent',
    },
    questTitle: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.paleCyan,
    },
    questDeadline: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.sm,
        color: colors.gold,
        marginTop: spacing.xs,
    },
    sliderSection: {
        marginBottom: spacing.md,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sliderLabel: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.xs,
        color: colors.dimmed,
    },
});

export default SideQuestModal;
