// CountdownTimer Component - Shows remaining time for daily quests
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, fontSizes, spacing, glowShadow } from '../styles/theme';

interface CountdownTimerProps {
    deadline: string; // ISO date string
    label?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline, label = 'REMAINING TIME' }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isCritical, setIsCritical] = useState(false);
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const end = new Date(deadline).getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft('00:00:00');
                setIsCritical(true);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            );

            // Critical when less than 1 hour
            setIsCritical(hours < 1);
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [deadline]);

    // Pulse animation for critical time
    useEffect(() => {
        if (isCritical) {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 0.6, duration: 500, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isCritical]);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}:</Text>
            <Animated.Text
                style={[
                    styles.time,
                    isCritical && styles.timeCritical,
                    { opacity: isCritical ? pulseAnim : 1 },
                ]}
            >
                {timeLeft}
            </Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        backgroundColor: colors.darkPanel,
        borderWidth: 1,
        borderColor: colors.electricCyan,
        marginBottom: spacing.md,
    },
    label: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.electricCyan,
        letterSpacing: 1,
        marginRight: spacing.sm,
    },
    time: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xl,
        color: colors.paleCyan,
        letterSpacing: 2,
    },
    timeCritical: {
        color: colors.alertRed,
        textShadowColor: colors.alertRed,
        textShadowRadius: 10,
    },
});

export default CountdownTimer;
