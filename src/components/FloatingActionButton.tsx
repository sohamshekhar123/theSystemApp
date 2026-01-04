// FloatingActionButton Component - Expandable menu with glowing icons
import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { User, Scroll, Calendar, Settings, Menu, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, touchTarget, glowShadow } from '../styles/theme';

interface FABItem {
    id: string;
    label: string;
    icon: 'status' | 'quests' | 'calendar' | 'settings';
    onPress: () => void;
}

interface FloatingActionButtonProps {
    items: FABItem[];
}

const ICONS = {
    status: User,
    quests: Scroll,
    calendar: Calendar,
    settings: Settings,
};

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
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={styles.container}>
            {/* Menu Items */}
            {items.map((item, index) => {
                const translateY = menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -(56 * (index + 1))],
                });

                const Icon = ICONS[item.icon];

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
                            <Icon
                                size={24}
                                color={colors.electricCyan}
                                strokeWidth={2}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}

            {/* Main FAB */}
            <TouchableOpacity style={styles.fab} onPress={toggleMenu} activeOpacity={0.8}>
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    {isOpen ? (
                        <X size={28} color={colors.voidBlack} strokeWidth={2.5} />
                    ) : (
                        <Menu size={28} color={colors.voidBlack} strokeWidth={2.5} />
                    )}
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: spacing.xl,
        left: spacing.xl,
        alignItems: 'center',
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.electricCyan,
        justifyContent: 'center',
        alignItems: 'center',
        ...glowShadow.cyanIntense,
    },
    menuItem: {
        position: 'absolute',
        left: 0,
        bottom: 0,
    },
    menuButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(2, 2, 10, 0.95)',
        borderWidth: 1,
        borderColor: colors.electricCyan,
        justifyContent: 'center',
        alignItems: 'center',
        ...glowShadow.cyan,
    },
});

export default FloatingActionButton;
