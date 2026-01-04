// Penalty Screen - Solo Leveling danger style
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { useGame } from '../context/GameContext';
import { colors, fontSizes, spacing, glowShadow } from '../styles/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PenaltyScreenProps {
    onComplete: () => void;
}

export const PenaltyScreen: React.FC<PenaltyScreenProps> = ({ onComplete }) => {
    const { state } = useGame();
    const pulseAnim = useRef(new Animated.Value(0.8)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const frameWidth = SCREEN_WIDTH - 48;
    const frameHeight = 250;
    const cs = 15;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0.8, duration: 500, useNativeDriver: true }),
            ])
        ).start();

        Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
    }, []);

    const framePath = `M ${cs} 0 L ${frameWidth - cs} 0 L ${frameWidth} ${cs} L ${frameWidth} ${frameHeight - cs} L ${frameWidth - cs} ${frameHeight} L ${cs} ${frameHeight} L 0 ${frameHeight - cs} L 0 ${cs} Z`;
    const corners = [
        `M 0 ${cs + 10} L 0 ${cs} L ${cs} 0 L ${cs + 10} 0`,
        `M ${frameWidth - cs - 10} 0 L ${frameWidth - cs} 0 L ${frameWidth} ${cs} L ${frameWidth} ${cs + 10}`,
        `M ${frameWidth} ${frameHeight - cs - 10} L ${frameWidth} ${frameHeight - cs} L ${frameWidth - cs} ${frameHeight} L ${frameWidth - cs - 10} ${frameHeight}`,
        `M ${cs + 10} ${frameHeight} L ${cs} ${frameHeight} L 0 ${frameHeight - cs} L 0 ${frameHeight - cs - 10}`,
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.voidBlack} />

            {/* Red danger overlay */}
            <Animated.View style={[styles.dangerOverlay, { opacity: pulseAnim }]} />

            {/* Warning Header */}
            <Animated.View style={[styles.warningHeader, { opacity: fadeAnim }]}>
                <Text style={styles.warningIcon}>⚠</Text>
                <Text style={styles.warningTitle}>PENALTY ZONE</Text>
            </Animated.View>

            {/* Penalty Frame */}
            <Animated.View style={[styles.penaltyFrame, { width: frameWidth, height: frameHeight, opacity: fadeAnim }]}>
                <Svg width={frameWidth} height={frameHeight} style={StyleSheet.absoluteFill}>
                    <Path d={framePath} fill={colors.voidBlack} fillOpacity={0.95} />
                    <Path d={framePath} fill="none" stroke={colors.alertRed} strokeWidth={2} />
                    {corners.map((path, i) => (
                        <Path key={i} d={path} fill="none" stroke={colors.alertRed} strokeWidth={3} />
                    ))}
                </Svg>

                <View style={styles.frameContent}>
                    <Text style={styles.penaltyLabel}>PENALTY TASK:</Text>
                    <Text style={styles.penaltyTask}>{state.penaltyTask?.title || 'NO PENALTY SET'}</Text>
                    <Text style={styles.penaltyDescription}>{state.penaltyTask?.description || 'COMPLETE TO RESTORE ACCESS'}</Text>
                    <Text style={styles.damageText}>HP -20</Text>
                </View>
            </Animated.View>

            {/* Survive Button */}
            <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
                <TouchableOpacity style={styles.surviveButton} onPress={onComplete}>
                    <Svg width={200} height={50} style={StyleSheet.absoluteFill}>
                        <Path d="M 10 0 L 190 0 L 200 10 L 200 40 L 190 50 L 10 50 L 0 40 L 0 10 Z" fill="none" stroke={colors.alertRed} strokeWidth={2} />
                    </Svg>
                    <Text style={styles.surviveText}>SURVIVE</Text>
                </TouchableOpacity>
                <Text style={styles.surviveSubtext}>MARK PENALTY AS COMPLETE TO CONTINUE</Text>
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
    },
    dangerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 51, 51, 0.1)',
    },
    warningHeader: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    warningIcon: {
        fontSize: 50,
        marginBottom: spacing.sm,
    },
    warningTitle: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xxxl,
        color: colors.alertRed,
        letterSpacing: 4,
        textShadowColor: colors.alertRed,
        textShadowRadius: 20,
    },
    penaltyFrame: {
        ...glowShadow.red,
        marginBottom: spacing.xl,
    },
    frameContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
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
        fontSize: fontSizes.xl,
        color: colors.paleCyan,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    penaltyDescription: {
        fontFamily: 'Rajdhani-Regular',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    damageText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xl,
        color: colors.alertRed,
        textShadowColor: colors.alertRed,
        textShadowRadius: 10,
    },
    buttonContainer: {
        alignItems: 'center',
    },
    surviveButton: {
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        ...glowShadow.red,
    },
    surviveText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.lg,
        color: colors.alertRed,
        letterSpacing: 4,
    },
    surviveSubtext: {
        fontFamily: 'Rajdhani-Regular',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
        marginTop: spacing.md,
    },
});

export default PenaltyScreen;
