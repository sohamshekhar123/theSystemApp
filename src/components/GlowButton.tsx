// GlowButton Component - Cyan glow button with haptic feedback
import React, { useRef } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    Animated,
    Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fontSizes, spacing, touchTarget } from '../styles/theme';

interface GlowButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'danger' | 'gold';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    pulsing?: boolean;
    style?: ViewStyle;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    pulsing = false,
    style,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const getColor = () => {
        switch (variant) {
            case 'danger': return colors.alertRed;
            case 'gold': return colors.gold;
            default: return colors.electricCyan;
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return {
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.md,
                    minHeight: 36,
                };
            case 'large':
                return {
                    paddingVertical: spacing.lg,
                    paddingHorizontal: spacing.xl,
                    minHeight: touchTarget.minHeight + 8,
                };
            default:
                return {
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.lg,
                    minHeight: touchTarget.minHeight,
                };
        }
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const handlePress = async () => {
        if (disabled) return;
        try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (e) {
            // Haptics not available
        }
        onPress();
    };

    const color = getColor();

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
                style={[
                    styles.button,
                    getSizeStyle(),
                    {
                        borderColor: color,
                        opacity: disabled ? 0.5 : 1,
                        shadowColor: color,
                    },
                    style,
                ]}
            >
                <Text style={[styles.text, { color }]}>{title}</Text>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    text: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});

export default GlowButton;
