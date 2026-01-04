// Status Window Modal - Detailed attributes display
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SystemWindow, ProgressBar } from '../components';
import { useGame } from '../context/GameContext';
import { getTotalLevels, getRankProgress, getLevelsToNextRank, RANK_NAMES } from '../utils/rankCalculator';
import { colors, fontSizes, spacing } from '../styles/theme';

interface StatusModalProps {
    visible: boolean;
    onClose: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({ visible, onClose }) => {
    const { state } = useGame();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const totalLevels = getTotalLevels(state.player.attributes);
    const rankProgress = getRankProgress(totalLevels);
    const levelsToNext = getLevelsToNextRank(totalLevels);

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(0);
        }
    }, [visible]);

    const getAttributeColor = (attr: string) => {
        switch (attr) {
            case 'STR': return colors.alertRed;
            case 'INT': return colors.electricCyan;
            case 'SOC': return '#FF9F43';
            case 'HLTH': return '#00D68F';
            default: return colors.electricCyan;
        }
    };

    return (
        <SystemWindow visible={visible} onClose={onClose}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>STATUS WINDOW</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>×</Text>
                    </TouchableOpacity>
                </View>

                {/* Player Info */}
                <View style={styles.playerSection}>
                    <View style={styles.nameRow}>
                        <Text style={styles.label}>NAME:</Text>
                        <Text style={styles.value}>{state.player.name}</Text>
                    </View>
                    <View style={styles.nameRow}>
                        <Text style={styles.label}>RANK:</Text>
                        <Text style={[styles.value, { color: colors.gold }]}>
                            {RANK_NAMES[state.player.rank]}
                        </Text>
                    </View>
                    <View style={styles.nameRow}>
                        <Text style={styles.label}>TOTAL LEVEL:</Text>
                        <Text style={styles.value}>{totalLevels}</Text>
                    </View>
                </View>

                {/* Rank Progress */}
                {state.player.rank !== 'S' && (
                    <View style={styles.rankProgress}>
                        <Text style={styles.sectionTitle}>RANK ADVANCEMENT</Text>
                        <ProgressBar
                            current={rankProgress * 100}
                            max={100}
                            variant="xp"
                            showValue={false}
                            height={12}
                        />
                        <Text style={styles.progressText}>
                            {levelsToNext} LEVELS TO NEXT RANK
                        </Text>
                    </View>
                )}

                {/* Divider */}
                <View style={styles.divider} />

                {/* Attributes */}
                <Text style={styles.sectionTitle}>ATTRIBUTES</Text>
                {Object.entries(state.player.attributes).map(([key, attr]) => (
                    <Animated.View
                        key={key}
                        style={[styles.attributeRow, { opacity: fadeAnim }]}
                    >
                        <View style={styles.attributeHeader}>
                            <View style={[styles.attributeIcon, { borderColor: getAttributeColor(key) }]}>
                                <Text style={[styles.attributeIconText, { color: getAttributeColor(key) }]}>
                                    {attr.name}
                                </Text>
                            </View>
                            <View style={styles.attributeInfo}>
                                <Text style={styles.attributeName}>{attr.fullName}</Text>
                                <Text style={styles.attributeLevel}>LV. {attr.level}</Text>
                            </View>
                        </View>
                        <View style={styles.xpBar}>
                            <ProgressBar
                                current={attr.xp}
                                max={attr.maxXp}
                                variant="xp"
                                label="XP"
                                height={10}
                            />
                        </View>
                    </Animated.View>
                ))}

                {/* Stats Summary */}
                <View style={styles.divider} />
                <Text style={styles.sectionTitle}>VITALS</Text>
                <View style={styles.vitalsRow}>
                    <View style={styles.vitalItem}>
                        <Text style={styles.vitalLabel}>HP</Text>
                        <Text style={[styles.vitalValue, { color: colors.alertRed }]}>
                            {state.player.hp}/{state.player.maxHp}
                        </Text>
                    </View>
                    <View style={styles.vitalItem}>
                        <Text style={styles.vitalLabel}>MP</Text>
                        <Text style={[styles.vitalValue, { color: colors.electricCyan }]}>
                            {state.player.mp}/{state.player.maxMp}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SystemWindow>
    );
};

const styles = StyleSheet.create({
    content: {
        maxHeight: 500,
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
    playerSection: {
        marginBottom: spacing.lg,
    },
    nameRow: {
        flexDirection: 'row',
        marginBottom: spacing.xs,
    },
    label: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        color: colors.dimmed,
        width: 120,
        letterSpacing: 1,
    },
    value: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.paleCyan,
        letterSpacing: 1,
    },
    rankProgress: {
        marginBottom: spacing.md,
    },
    progressText: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.sm,
        color: colors.gold,
        marginTop: spacing.xs,
        textAlign: 'center',
        letterSpacing: 1,
    },
    divider: {
        height: 1,
        backgroundColor: colors.dimmed,
        marginVertical: spacing.lg,
    },
    sectionTitle: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.electricCyan,
        letterSpacing: 2,
        marginBottom: spacing.md,
    },
    attributeRow: {
        marginBottom: spacing.lg,
    },
    attributeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    attributeIcon: {
        width: 50,
        height: 50,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    attributeIconText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        letterSpacing: 1,
    },
    attributeInfo: {
        flex: 1,
    },
    attributeName: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        color: colors.paleCyan,
        letterSpacing: 1,
    },
    attributeLevel: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.lg,
        color: colors.gold,
    },
    xpBar: {
        marginLeft: 66,
    },
    vitalsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    vitalItem: {
        alignItems: 'center',
    },
    vitalLabel: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
        letterSpacing: 1,
    },
    vitalValue: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xl,
    },
});

export default StatusModal;
