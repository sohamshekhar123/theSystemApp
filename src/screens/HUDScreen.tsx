// The HUD Screen - Main Dashboard with Solo Leveling STATUS frame
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Animated, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Line, Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { ProgressBar, FloatingActionButton, StatIcon, QuestPanel, CountdownTimer } from '../components';
import { useGame } from '../context/GameContext';
import { getTotalLevels, RANK_NAMES } from '../utils/rankCalculator';
import { colors, fontSizes, spacing, glowShadow } from '../styles/theme';
import { StatusModal } from './StatusModal';
import { QuestLogModal } from './QuestLogModal';
import { CalendarModal } from './CalendarModal';
import { SettingsModal } from './SettingsModal';
import { SideQuestModal } from './SideQuestModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ModalType = 'status' | 'quests' | 'calendar' | 'settings' | 'sidequests' | null;

export const HUDScreen: React.FC = () => {
    const { state, dispatch } = useGame();
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const pulseAnim = useRef(new Animated.Value(0.8)).current;

    // Pulse animation for glow effects
    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0.8, duration: 2000, useNativeDriver: true }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    const totalLevels = getTotalLevels(state.player.attributes);
    const statusFrameWidth = SCREEN_WIDTH - 32;
    const statusFrameHeight = 280; // Reduced to make room for quests
    const cs = 18; // Corner size

    // STATUS frame path
    const framePath = `M ${cs} 0 L ${statusFrameWidth - cs} 0 L ${statusFrameWidth} ${cs} L ${statusFrameWidth} ${statusFrameHeight - cs} L ${statusFrameWidth - cs} ${statusFrameHeight} L ${cs} ${statusFrameHeight} L 0 ${statusFrameHeight - cs} L 0 ${cs} Z`;

    const corners = [
        `M 0 ${cs + 12} L 0 ${cs} L ${cs} 0 L ${cs + 12} 0`,
        `M ${statusFrameWidth - cs - 12} 0 L ${statusFrameWidth - cs} 0 L ${statusFrameWidth} ${cs} L ${statusFrameWidth} ${cs + 12}`,
        `M ${statusFrameWidth} ${statusFrameHeight - cs - 12} L ${statusFrameWidth} ${statusFrameHeight - cs} L ${statusFrameWidth - cs} ${statusFrameHeight} L ${statusFrameWidth - cs - 12} ${statusFrameHeight}`,
        `M ${cs + 12} ${statusFrameHeight} L ${cs} ${statusFrameHeight} L 0 ${statusFrameHeight - cs} L 0 ${statusFrameHeight - cs - 12}`,
    ];

    // Get end of day deadline for display
    const getDeadline = () => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return today.toISOString();
    };

    const handleCompleteQuest = (questId: string) => {
        dispatch({ type: 'COMPLETE_DAILY_QUEST', payload: questId });
    };

    const fabItems = [
        { id: 'status', label: 'STATUS', icon: 'status' as const, onPress: () => setActiveModal('status') },
        { id: 'quests', label: 'QUESTS', icon: 'quests' as const, onPress: () => setActiveModal('quests') },
        { id: 'sidequests', label: 'SIDE QUESTS', icon: 'add' as const, onPress: () => setActiveModal('sidequests') },
        { id: 'calendar', label: 'CALENDAR', icon: 'calendar' as const, onPress: () => setActiveModal('calendar') },
        { id: 'settings', label: 'SETTINGS', icon: 'settings' as const, onPress: () => setActiveModal('settings') },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.voidBlack} />

            {/* Background scanlines */}
            <View style={styles.scanlinesBg}>
                {Array.from({ length: Math.floor(SCREEN_HEIGHT / 3) }).map((_, i) => (
                    <View key={i} style={styles.bgScanline} />
                ))}
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* STATUS Frame */}
                <Animated.View style={[styles.statusFrame, { width: statusFrameWidth, height: statusFrameHeight, opacity: pulseAnim }]}>
                    <Svg width={statusFrameWidth} height={statusFrameHeight} style={StyleSheet.absoluteFill}>
                        {/* Background */}
                        <Path d={framePath} fill={colors.voidBlack} fillOpacity={0.95} />

                        {/* Scanlines */}
                        {Array.from({ length: Math.floor(statusFrameHeight / 4) }).map((_, i) => (
                            <Line key={i} x1={cs} y1={i * 4} x2={statusFrameWidth - cs} y2={i * 4} stroke={colors.electricCyan} strokeOpacity={0.02} strokeWidth={1} />
                        ))}

                        {/* Outer frame */}
                        <Path d={framePath} fill="none" stroke={colors.electricCyan} strokeWidth={2} />

                        {/* Inner frame */}
                        <Path d={`M ${cs + 8} 8 L ${statusFrameWidth - cs - 8} 8 L ${statusFrameWidth - 8} ${cs + 8} L ${statusFrameWidth - 8} ${statusFrameHeight - cs - 8} L ${statusFrameWidth - cs - 8} ${statusFrameHeight - 8} L ${cs + 8} ${statusFrameHeight - 8} L 8 ${statusFrameHeight - cs - 8} L 8 ${cs + 8} Z`}
                            fill="none" stroke={colors.electricCyan} strokeWidth={1} strokeOpacity={0.5} />

                        {/* Corner accents */}
                        {corners.map((path, i) => (
                            <Path key={i} d={path} fill="none" stroke={colors.electricCyan} strokeWidth={3} />
                        ))}
                    </Svg>

                    <View style={styles.statusContent}>
                        {/* Profile Row */}
                        <View style={styles.profileRow}>
                            {/* Avatar */}
                            <View style={styles.avatarContainer}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{state.player.name.charAt(0)}</Text>
                                </View>
                            </View>

                            {/* Info */}
                            <View style={styles.profileInfo}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>TITLE: </Text>
                                    <Text style={styles.infoValue}>{state.player.name}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>JOB: </Text>
                                    <Text style={styles.infoValue}>Hunter</Text>
                                </View>
                            </View>

                            {/* Level */}
                            <View style={styles.levelContainer}>
                                <Text style={styles.levelNumber}>{totalLevels}</Text>
                                <Text style={styles.levelLabel}>LEVEL</Text>
                            </View>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Stats Grid - 2 columns */}
                        <View style={styles.statsGrid}>
                            <View style={styles.statsColumn}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statIcon}>💪</Text>
                                    <Text style={styles.statLabel}>STR:</Text>
                                    <Text style={styles.statValue}>{state.player.attributes.STR.level}</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statIcon}>⚡</Text>
                                    <Text style={styles.statLabel}>AGI:</Text>
                                    <Text style={styles.statValue}>35</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statIcon}>👁</Text>
                                    <Text style={styles.statLabel}>PER:</Text>
                                    <Text style={styles.statValue}>{state.player.attributes.SOC.level}</Text>
                                    <Text style={styles.statBonus}>+1</Text>
                                </View>
                            </View>
                            <View style={styles.statsColumn}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statIcon}>❤️</Text>
                                    <Text style={styles.statLabel}>VIT:</Text>
                                    <Text style={styles.statValue}>{state.player.attributes.HLTH.level}</Text>
                                    <Text style={styles.statBonus}>+1</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statIcon}>🧠</Text>
                                    <Text style={styles.statLabel}>INT:</Text>
                                    <Text style={styles.statValue}>{state.player.attributes.INT.level}</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Ability</Text>
                                    <Text style={styles.statLabel}>Points</Text>
                                    <Text style={styles.statValue}>7</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Daily Quests Section */}
                <View style={styles.questSection}>
                    <View style={styles.questHeader}>
                        <Text style={styles.sectionTitle}>DAILY QUESTS</Text>
                    </View>
                    <CountdownTimer deadline={getDeadline()} label="TIME LEFT" />

                    {/* Quest Items */}
                    {state.dailyQuests.length === 0 ? (
                        <Text style={styles.noQuests}>No quests configured</Text>
                    ) : (
                        state.dailyQuests.map(quest => (
                            <QuestPanel
                                key={quest.id}
                                quest={quest}
                                onComplete={handleCompleteQuest}
                            />
                        ))
                    )}

                    {/* Quest Progress Summary */}
                    <View style={styles.questSummary}>
                        <Text style={styles.questProgress}>
                            {state.dailyQuests.filter(q => q.isComplete).length} / {state.dailyQuests.length} COMPLETE
                        </Text>
                    </View>
                </View>

                {/* Side Quests Preview */}
                {state.bossRaids.filter(b => !b.isDefeated).length > 0 && (
                    <View style={styles.sideQuestSection}>
                        <Text style={styles.sectionTitle}>SIDE QUESTS</Text>
                        {state.bossRaids.filter(b => !b.isDefeated).slice(0, 2).map(quest => (
                            <View key={quest.id} style={styles.sideQuestPreview}>
                                <Text style={styles.sideQuestTitle}>{quest.name}</Text>
                                <Text style={styles.sideQuestDeadline}>
                                    DUE: {new Date(quest.deadline).toLocaleDateString()}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* FAB Menu */}
            <FloatingActionButton items={fabItems} />

            {/* Modals */}
            <StatusModal visible={activeModal === 'status'} onClose={() => setActiveModal(null)} />
            <QuestLogModal visible={activeModal === 'quests'} onClose={() => setActiveModal(null)} />
            <SideQuestModal visible={activeModal === 'sidequests'} onClose={() => setActiveModal(null)} />
            <CalendarModal visible={activeModal === 'calendar'} onClose={() => setActiveModal(null)} />
            <SettingsModal visible={activeModal === 'settings'} onClose={() => setActiveModal(null)} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.voidBlack,
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
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    statusFrame: {
        marginTop: spacing.lg,
        alignSelf: 'center',
        ...glowShadow.cyan,
    },
    statusContent: {
        flex: 1,
        padding: spacing.xl,
    },
    statusTitle: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xl,
        color: colors.electricCyan,
        letterSpacing: 4,
        textAlign: 'center',
        textShadowColor: colors.electricCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
        marginBottom: spacing.md,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    avatarContainer: {
        marginRight: spacing.md,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.dimmed,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.electricCyan,
    },
    avatarText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xl,
        color: colors.paleCyan,
    },
    profileInfo: {
        flex: 1,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    infoLabel: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
        width: 50,
    },
    infoValue: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.paleCyan,
    },
    levelContainer: {
        alignItems: 'center',
    },
    levelNumber: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xxxl,
        color: colors.electricCyan,
        textShadowColor: colors.electricCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    levelLabel: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xs,
        color: colors.electricCyan,
        letterSpacing: 2,
    },
    divider: {
        height: 1,
        backgroundColor: colors.electricCyan,
        opacity: 0.3,
        marginVertical: spacing.md,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statsColumn: {
        flex: 1,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    statIcon: {
        fontSize: fontSizes.md,
        marginRight: spacing.xs,
    },
    statLabel: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
        marginRight: spacing.xs,
    },
    statValue: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.paleCyan,
    },
    statBonus: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.electricCyan,
        marginLeft: 2,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    abilityPoints: {
        alignItems: 'flex-end',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    abilityLabel: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.xs,
        color: colors.dimmed,
        lineHeight: fontSizes.xs + 2,
    },
    abilityValue: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.lg,
        color: colors.paleCyan,
    },
    questSection: {
        marginTop: spacing.xl,
        paddingBottom: 100,
    },
    questHeader: {
        marginBottom: spacing.md,
    },
    noQuests: {
        fontFamily: 'Rajdhani-Regular',
        fontSize: fontSizes.md,
        color: colors.dimmed,
        textAlign: 'center',
        padding: spacing.lg,
    },
    sectionTitle: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xl,
        color: colors.electricCyan,
        textAlign: 'center',
        letterSpacing: 2,
        marginBottom: spacing.xs,
    },
    sectionSubtitle: {
        fontFamily: 'Rajdhani-Regular',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    questSummary: {
        alignItems: 'center',
        marginTop: spacing.md,
    },
    questProgress: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        color: colors.electricCyan,
    },
    sideQuestSection: {
        marginTop: spacing.lg,
        marginBottom: spacing.xxl,
    },
    sideQuestPreview: {
        borderWidth: 1,
        borderColor: colors.gold,
        padding: spacing.md,
        marginBottom: spacing.sm,
        backgroundColor: 'rgba(255, 215, 0, 0.05)',
    },
    sideQuestTitle: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.paleCyan,
    },
    sideQuestDeadline: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.sm,
        color: colors.gold,
        marginTop: spacing.xs,
    },
});

export default HUDScreen;
