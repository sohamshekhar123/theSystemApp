// Penalty Screen - Full screen lockout when daily quests miss deadline
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated } from 'react-native';
import { GlowButton } from '../components';
import { useGame } from '../context/GameContext';
import { colors, fontSizes, spacing } from '../styles/theme';

interface PenaltyScreenProps {
    onComplete: () => void;
}

export const PenaltyScreen: React.FC<PenaltyScreenProps> = ({ onComplete }) => {
    const { state } = useGame();
    const warningOpacity = useRef(new Animated.Value(1)).current;
    const borderGlow = useRef(new Animated.Value(0.3)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Warning pulse
    useEffect(() => {
        const warningAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(warningOpacity, {
                    toValue: 0.5,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(warningOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        );

        const glowAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(borderGlow, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(borderGlow, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );

        warningAnimation.start();
        glowAnimation.start();

        // Staggered fade in
        Animated.stagger(500, [
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();

        return () => {
            warningAnimation.stop();
            glowAnimation.stop();
        };
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.voidBlack} />

            {/* Warning Header */}
            <Animated.View style={[styles.warningHeader, { opacity: warningOpacity }]}>
                <Text style={styles.warningIcon}>⚠</Text>
                <Text style={styles.warningTitle}>PENALTY ZONE</Text>
            </Animated.View>

            {/* System Message */}
            <Animated.View style={[styles.messageBox, { opacity: fadeAnim }]}>
                <Text style={styles.systemLabel}>[SYSTEM ALERT]</Text>
                <Text style={styles.systemMessage}>
                    DAILY QUEST FAILURE DETECTED.
                </Text>
                <Text style={styles.systemMessage}>
                    PENALTY PROTOCOL INITIATED.
                </Text>
            </Animated.View>

            {/* Penalty Task */}
            <Animated.View style={[styles.penaltyBox, { opacity: fadeAnim }]}>
                <Text style={styles.penaltyLabel}>PENALTY TASK:</Text>
                <Text style={styles.penaltyTask}>
                    {state.penaltyTask?.title || 'NO PENALTY SET'}
                </Text>
                <Text style={styles.penaltyDescription}>
                    {state.penaltyTask?.description || 'COMPLETE THE TASK TO RESTORE ACCESS.'}
                </Text>
            </Animated.View>

            {/* Stats Damage */}
            <Animated.View style={[styles.damageBox, { opacity: fadeAnim }]}>
                <Text style={styles.damageLabel}>PENALTY EFFECT:</Text>
                <Text style={styles.damageText}>HP -20</Text>
            </Animated.View>

            {/* Survive Button */}
            <Animated.View style={[styles.surviveContainer, { opacity: fadeAnim }]}>
                <GlowButton
                    title="SURVIVE"
                    onPress={onComplete}
                    variant="danger"
                    size="large"
                    pulsing
                    style={styles.surviveButton}
                />
                <Text style={styles.surviveSubtext}>
                    MARK PENALTY AS COMPLETE TO CONTINUE.
                </Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.voidBlack,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
        borderWidth: 4,
        borderColor: colors.alertRed,
        shadowColor: colors.alertRed,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 30,
        elevation: 20,
    },
    warningHeader: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    warningIcon: {
        fontSize: 60,
        marginBottom: spacing.md,
    },
    warningTitle: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xxxl,
        color: colors.alertRed,
        letterSpacing: 4,
        textTransform: 'uppercase',
    },
    messageBox: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    systemLabel: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.electricCyan,
        letterSpacing: 2,
        marginBottom: spacing.sm,
    },
    systemMessage: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.lg,
        color: colors.paleCyan,
        letterSpacing: 1,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    penaltyBox: {
        width: '100%',
        borderWidth: 2,
        borderColor: colors.alertRed,
        padding: spacing.lg,
        alignItems: 'center',
        marginBottom: spacing.xl,
        backgroundColor: 'rgba(255, 51, 51, 0.1)',
    },
    penaltyLabel: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.alertRed,
        letterSpacing: 2,
        marginBottom: spacing.sm,
    },
    penaltyTask: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xxl,
        color: colors.paleCyan,
        letterSpacing: 2,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    penaltyDescription: {
        fontFamily: 'Rajdhani-Regular',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
        letterSpacing: 1,
        textAlign: 'center',
    },
    damageBox: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    damageLabel: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
        letterSpacing: 2,
        marginBottom: spacing.xs,
    },
    damageText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xl,
        color: colors.alertRed,
        letterSpacing: 2,
    },
    surviveContainer: {
        alignItems: 'center',
    },
    surviveButton: {
        minWidth: 200,
    },
    surviveSubtext: {
        fontFamily: 'Rajdhani-Regular',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
        letterSpacing: 1,
        marginTop: spacing.md,
        textAlign: 'center',
    },
});

export default PenaltyScreen;
