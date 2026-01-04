// Status Window Modal - Full stats view with Solo Leveling style
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { ProgressBar, StatIcon } from '../components';
import { useGame } from '../context/GameContext';
import { getTotalLevels, getRankProgress, getLevelsToNextRank, RANK_NAMES } from '../utils/rankCalculator';
import { colors, fontSizes, spacing, glowShadow } from '../styles/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface StatusModalProps {
    visible: boolean;
    onClose: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({ visible, onClose }) => {
    const { state } = useGame();
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const totalLevels = getTotalLevels(state.player.attributes);
    const rankProgress = getRankProgress(totalLevels);
    const levelsToNext = getLevelsToNextRank(totalLevels);

    const modalWidth = SCREEN_WIDTH * 0.92;
    const modalHeight = 500;
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

    const framePath = `M ${cs} 0 L ${modalWidth - cs} 0 L ${modalWidth} ${cs} L ${modalWidth} ${modalHeight - cs} L ${modalWidth - cs} ${modalHeight} L ${cs} ${modalHeight} L 0 ${modalHeight - cs} L 0 ${cs} Z`;

    const corners = [
        `M 0 ${cs + 10} L 0 ${cs} L ${cs} 0 L ${cs + 10} 0`,
        `M ${modalWidth - cs - 10} 0 L ${modalWidth - cs} 0 L ${modalWidth} ${cs} L ${modalWidth} ${cs + 10}`,
        `M ${modalWidth} ${modalHeight - cs - 10} L ${modalWidth} ${modalHeight - cs} L ${modalWidth - cs} ${modalHeight} L ${modalWidth - cs - 10} ${modalHeight}`,
        `M ${cs + 10} ${modalHeight} L ${cs} ${modalHeight} L 0 ${modalHeight - cs} L 0 ${modalHeight - cs - 10}`,
    ];

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
                        <Text style={styles.title}>STATUS WINDOW</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>×</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Player Info */}
                        <View style={styles.infoSection}>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>NAME:</Text>
                                <Text style={styles.value}>{state.player.name}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>RANK:</Text>
                                <Text style={[styles.value, styles.goldText]}>{RANK_NAMES[state.player.rank]}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>TOTAL LV:</Text>
                                <Text style={styles.value}>{totalLevels}</Text>
                            </View>
                        </View>

                        {/* Rank Progress */}
                        {state.player.rank !== 'S' && (
                            <View style={styles.progressSection}>
                                <ProgressBar current={rankProgress * 100} max={100} variant="xp" showValue={false} height={12} />
                                <Text style={styles.progressText}>{levelsToNext} LEVELS TO NEXT RANK</Text>
                            </View>
                        )}

                        <View style={styles.divider} />

                        {/* Attributes */}
                        <Text style={styles.sectionTitle}>ATTRIBUTES</Text>
                        <View style={styles.statsGrid}>
                            {Object.entries(state.player.attributes).map(([key, attr]) => (
                                <View key={key} style={styles.statRow}>
                                    <StatIcon stat={key as any} value={attr.level} />
                                    <View style={styles.xpBarContainer}>
                                        <ProgressBar current={attr.xp} max={attr.maxXp} variant="xp" height={8} showValue={false} />
                                        <Text style={styles.xpText}>{attr.xp}/{attr.maxXp} XP</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <View style={styles.divider} />

                        {/* Vitals */}
                        <Text style={styles.sectionTitle}>VITALS</Text>
                        <View style={styles.vitalsRow}>
                            <View style={styles.vitalItem}>
                                <StatIcon stat="HP" value={state.player.hp} />
                                <Text style={styles.vitalMax}>/ {state.player.maxHp}</Text>
                            </View>
                            <View style={styles.vitalItem}>
                                <StatIcon stat="MP" value={state.player.mp} />
                                <Text style={styles.vitalMax}>/ {state.player.maxMp}</Text>
                            </View>
                        </View>
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
        padding: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
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
    infoSection: {
        marginBottom: spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: spacing.xs,
    },
    label: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        color: colors.dimmed,
        width: 100,
    },
    value: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.paleCyan,
    },
    goldText: {
        color: colors.gold,
    },
    progressSection: {
        marginBottom: spacing.md,
    },
    progressText: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.sm,
        color: colors.gold,
        textAlign: 'center',
        marginTop: spacing.xs,
    },
    divider: {
        height: 1,
        backgroundColor: colors.electricCyan,
        opacity: 0.3,
        marginVertical: spacing.md,
    },
    sectionTitle: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.electricCyan,
        letterSpacing: 2,
        marginBottom: spacing.md,
    },
    statsGrid: {
        gap: spacing.sm,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    xpBarContainer: {
        flex: 1,
        marginLeft: spacing.md,
    },
    xpText: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.xs,
        color: colors.dimmed,
        marginTop: 2,
    },
    vitalsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    vitalItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vitalMax: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        color: colors.dimmed,
    },
});

export default StatusModal;
