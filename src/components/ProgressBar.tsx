// ProgressBar Component - Animated progress bar for HP/MP/XP
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
import { colors, fontSizes, spacing } from '../styles/theme';

interface ProgressBarProps {
    current: number;
    max: number;
    variant?: 'hp' | 'mp' | 'xp' | 'boss';
    label?: string;
    showValue?: boolean;
    height?: number;
    style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    current,
    max,
    variant = 'hp',
    label,
    showValue = true,
    height = 16,
    style,
}) => {
    const progress = Math.min(current / max, 1);
    const widthAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(widthAnim, {
            toValue: progress,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const getColor = () => {
        switch (variant) {
            case 'hp': return colors.alertRed;
            case 'mp': return colors.electricCyan;
            case 'xp': return colors.gold;
            case 'boss': return colors.alertRed;
            default: return colors.electricCyan;
        }
    };

    const color = getColor();
    const isLowHp = variant === 'hp' && progress < 0.25;

    return (
        <View style={[styles.container, style]}>
            {label && (
                <View style={styles.labelRow}>
                    <Text style={styles.label}>{label}</Text>
                    {showValue && (
                        <Text style={[styles.value, { color }]}>
                            {Math.round(current)}/{max}
                        </Text>
                    )}
                </View>
            )}
            <View style={[styles.track, { height }]}>
                <Animated.View
                    style={[
                        styles.fill,
                        {
                            backgroundColor: color,
                            width: widthAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%'],
                            }),
                            shadowColor: color,
                            opacity: isLowHp ? 0.8 : 1,
                        },
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.xs,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    label: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
        letterSpacing: 1,
    },
    value: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        letterSpacing: 1,
    },
    track: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 3,
    },
});

export default ProgressBar;
