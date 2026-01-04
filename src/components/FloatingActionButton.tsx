// FloatingActionButton Component - Expandable menu button
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fontSizes, spacing, touchTarget } from '../styles/theme';

interface FABItem {
    id: string;
    label: string;
    onPress: () => void;
}

interface FloatingActionButtonProps {
    items: FABItem[];
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ items }) => {
    const [isOpen, setIsOpen] = useState(false);
    const rotationAnim = useRef(new Animated.Value(0)).current;
    const menuAnim = useRef(new Animated.Value(0)).current;

    const toggleMenu = async () => {
        try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (e) { }

        const toValue = isOpen ? 0 : 1;

        Animated.parallel([
            Animated.spring(rotationAnim, {
                toValue,
                useNativeDriver: true,
                tension: 100,
                friction: 10,
            }),
            Animated.spring(menuAnim, {
                toValue,
                useNativeDriver: true,
                tension: 100,
                friction: 10,
            }),
        ]).start();

        setIsOpen(!isOpen);
    };

    const handleItemPress = async (item: FABItem) => {
        try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (e) { }

        toggleMenu();
        item.onPress();
    };

    const rotation = rotationAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    return (
        <View style={styles.container}>
            {/* Menu Items */}
            {items.map((item, index) => {
                const translateY = menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -(60 * (index + 1))],
                });

                return (
                    <Animated.View
                        key={item.id}
                        style={[
                            styles.menuItem,
                            {
                                opacity: menuAnim,
                                transform: [{ translateY }],
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => handleItemPress(item)}
                        >
                            <Text style={styles.menuLabel}>{item.label}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}

            {/* Main FAB */}
            <TouchableOpacity style={styles.fab} onPress={toggleMenu} activeOpacity={0.8}>
                <Animated.Text style={[styles.fabIcon, { transform: [{ rotate: rotation }] }]}>
                    +
                </Animated.Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: spacing.lg,
        right: spacing.lg,
        alignItems: 'center',
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.electricCyan,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.electricCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    fabIcon: {
        fontSize: 32,
        color: colors.voidBlack,
        fontWeight: 'bold',
    },
    menuItem: {
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    menuButton: {
        backgroundColor: 'rgba(5, 5, 5, 0.95)',
        borderWidth: 1,
        borderColor: colors.electricCyan,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        minHeight: touchTarget.minHeight,
        justifyContent: 'center',
    },
    menuLabel: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.electricCyan,
        letterSpacing: 2,
    },
});

export default FloatingActionButton;
