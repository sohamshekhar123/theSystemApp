// The HUD Screen - Main Dashboard
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar, RankBadge, FloatingActionButton } from '../components';
import { useGame } from '../context/GameContext';
import { getTotalLevels } from '../utils/rankCalculator';
import { colors, fontSizes, spacing } from '../styles/theme';
import { StatusModal } from './StatusModal';
import { QuestLogModal } from './QuestLogModal';
import { CalendarModal } from './CalendarModal';
import { SettingsModal } from './SettingsModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ModalType = 'status' | 'quests' | 'calendar' | 'settings' | null;

export const HUDScreen: React.FC = () => {
    const { state } = useGame();
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const silhouetteGlow = useRef(new Animated.Value(0.3)).current;

    // Pulsing glow for player silhouette
    useEffect(() => {
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(silhouetteGlow, {
                    toValue: 0.6,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(silhouetteGlow, {
                    toValue: 0.3,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulseAnimation.start();
        return () => pulseAnimation.stop();
    }, []);

    const totalLevels = getTotalLevels(state.player.attributes);

    const fabItems = [
        { id: 'status', label: 'STATUS', onPress: () => setActiveModal('status') },
        { id: 'quests', label: 'QUESTS', onPress: () => setActiveModal('quests') },
        { id: 'calendar', label: 'CALENDAR', onPress: () => setActiveModal('calendar') },
        { id: 'settings', label: 'SETTINGS', onPress: () => setActiveModal('settings') },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.voidBlack} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{state.player.name}</Text>
                    <Text style={styles.levelText}>LV. {totalLevels}</Text>
                </View>
                <RankBadge rank={state.player.rank} totalLevels={totalLevels} />
            </View>

            {/* HP/MP Bars */}
            <View style={styles.barsContainer}>
                <ProgressBar
                    current={state.player.hp}
                    max={state.player.maxHp}
                    variant="hp"
                    label="HP"
                    style={styles.bar}
                />
                <ProgressBar
                    current={state.player.mp}
                    max={state.player.maxMp}
                    variant="mp"
                    label="MP"
                    style={styles.bar}
                />
            </View>

            {/* Player Silhouette */}
            <View style={styles.centerArea}>
                <Animated.View style={[styles.silhouette, { opacity: silhouetteGlow }]}>
                    <View style={styles.silhouetteBody}>
                        {/* Head */}
                        <View style={styles.silhouetteHead} />
                        {/* Body */}
                        <View style={styles.silhouetteBodyShape} />
                        {/* Arms */}
                        <View style={styles.silhouetteArms}>
                            <View style={styles.silhouetteArm} />
                            <View style={styles.silhouetteArm} />
                        </View>
                        {/* Legs */}
                        <View style={styles.silhouetteLegs}>
                            <View style={styles.silhouetteLeg} />
                            <View style={styles.silhouetteLeg} />
                        </View>
                    </View>
                </Animated.View>

                {/* Stats Preview */}
                <View style={styles.statsPreview}>
                    {Object.entries(state.player.attributes).map(([key, attr]) => (
                        <View key={key} style={styles.statItem}>
                            <Text style={styles.statLabel}>{attr.name}</Text>
                            <Text style={styles.statValue}>{attr.level}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Daily Quest Summary */}
            <View style={styles.questSummary}>
                <Text style={styles.questSummaryTitle}>DAILY QUEST</Text>
                <View style={styles.questProgress}>
                    <Text style={styles.questProgressText}>
                        {state.dailyQuests.filter(q => q.isComplete).length} / {state.dailyQuests.length}
                    </Text>
                    <Text style={styles.questStatus}>
                        {state.dailyQuests.length === 0
                            ? '[NO QUESTS]'
                            : state.dailyQuests.every(q => q.isComplete)
                                ? '[ALL COMPLETE]'
                                : '[IN PROGRESS]'}
                    </Text>
                </View>
            </View>

            {/* FAB Menu */}
            <FloatingActionButton items={fabItems} />

            {/* Modals */}
            <StatusModal
                visible={activeModal === 'status'}
                onClose={() => setActiveModal(null)}
            />
            <QuestLogModal
                visible={activeModal === 'quests'}
                onClose={() => setActiveModal(null)}
            />
            <CalendarModal
                visible={activeModal === 'calendar'}
                onClose={() => setActiveModal(null)}
            />
            <SettingsModal
                visible={activeModal === 'settings'}
                onClose={() => setActiveModal(null)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.voidBlack,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xxl,
        color: colors.paleCyan,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    levelText: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        color: colors.electricCyan,
        letterSpacing: 1,
    },
    barsContainer: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        gap: spacing.sm,
    },
    bar: {
        marginBottom: spacing.xs,
    },
    centerArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    silhouette: {
        width: 120,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.electricCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 30,
        elevation: 10,
    },
    silhouetteBody: {
        alignItems: 'center',
    },
    silhouetteHead: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.dimmed,
        marginBottom: spacing.sm,
    },
    silhouetteBodyShape: {
        width: 50,
        height: 70,
        backgroundColor: colors.dimmed,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    silhouetteArms: {
        position: 'absolute',
        top: 50,
        flexDirection: 'row',
        width: 100,
        justifyContent: 'space-between',
    },
    silhouetteArm: {
        width: 15,
        height: 50,
        backgroundColor: colors.dimmed,
        borderRadius: 5,
    },
    silhouetteLegs: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: -2,
    },
    silhouetteLeg: {
        width: 20,
        height: 60,
        backgroundColor: colors.dimmed,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    statsPreview: {
        flexDirection: 'row',
        marginTop: spacing.xl,
        gap: spacing.lg,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderWidth: 1,
        borderColor: colors.dimmed,
        minWidth: 60,
    },
    statLabel: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xs,
        color: colors.dimmed,
        letterSpacing: 1,
    },
    statValue: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.lg,
        color: colors.paleCyan,
    },
    questSummary: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.dimmed,
        marginTop: 'auto',
        marginBottom: 80,
    },
    questSummaryTitle: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.electricCyan,
        letterSpacing: 2,
        marginBottom: spacing.xs,
    },
    questProgress: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    questProgressText: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.lg,
        color: colors.paleCyan,
    },
    questStatus: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.gold,
        letterSpacing: 1,
    },
});

export default HUDScreen;
