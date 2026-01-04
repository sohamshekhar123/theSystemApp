// Custom In-App System Notification Component
// Displays a holographic blue box mimicking the Solo Leveling system notifications
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { useGame } from '../context/GameContext';
import { colors, fontSizes, spacing, glowShadow, touchTarget } from '../styles/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const SystemNotification: React.FC = () => {
    const { state, dispatch } = useGame();
    const notification = state.systemNotification;

    const opacityAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(-50)).current;

    useEffect(() => {
        if (notification) {
            // Show notification
            Animated.parallel([
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(translateYAnim, {
                    toValue: 0,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto hide if not confirm type (though typically system notifications stay until addressed or timeout)
            if (!notification.showConfirm) {
                const timer = setTimeout(() => {
                    handleClose();
                }, 5000);
                return () => clearTimeout(timer);
            }
        }
    }, [notification]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
                toValue: -50,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            dispatch({ type: 'HIDE_NOTIFICATION' });
        });
    };

    if (!notification) return null;

    const typeColors = {
        info: colors.electricCyan,
        warning: colors.gold,
        penalty: colors.crimson,
    };

    const mainColor = typeColors[notification.type] || colors.electricCyan;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: opacityAnim,
                    transform: [{ translateY: translateYAnim }],
                    borderColor: mainColor,
                    shadowColor: mainColor,
                }
            ]}
        >
            <View style={[styles.header, { backgroundColor: mainColor }]}>
                <Text style={styles.headerText}>NOTIFICATION</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>{notification.title}</Text>
                <Text style={styles.message}>{notification.message}</Text>

                {notification.showConfirm ? (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, { borderColor: mainColor }]} onPress={handleClose}>
                            <Text style={[styles.buttonText, { color: mainColor }]}>OK</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.closeArea} onPress={handleClose} />
                )}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        alignSelf: 'center',
        width: SCREEN_WIDTH * 0.9,
        backgroundColor: 'rgba(0, 10, 20, 0.95)',
        borderWidth: 1,
        borderRadius: 4,
        zIndex: 1000,
        ...glowShadow.blue,
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        paddingVertical: 4,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
    },
    headerText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.voidBlack,
        letterSpacing: 2,
    },
    content: {
        padding: spacing.md,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.lg,
        color: colors.white,
        marginBottom: spacing.xs,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    message: {
        fontFamily: 'Rajdhani-Medium',
        fontSize: fontSizes.md,
        color: colors.dimmed,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    buttonContainer: {
        marginTop: spacing.sm,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderWidth: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    buttonText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
    },
    closeArea: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default SystemNotification;
