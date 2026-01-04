// QuestItem Component - Single quest display with checkbox
import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fontSizes, spacing, touchTarget } from '../styles/theme';
import { DailyQuest } from '../types';

interface QuestItemProps {
    quest: DailyQuest;
    onComplete: (questId: string) => void;
}

const ATTRIBUTE_COLORS: Record<string, string> = {
    STR: colors.alertRed,
    INT: colors.electricCyan,
    SOC: '#FF9F43',
    HLTH: '#00D68F',
};

export const QuestItem: React.FC<QuestItemProps> = ({ quest, onComplete }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = async () => {
        if (quest.isComplete) return;

        try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) { }

        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.05,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        onComplete(quest.id);
    };

    const attrColor = ATTRIBUTE_COLORS[quest.attribute] || colors.electricCyan;

    return (
        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                style={[
                    styles.questRow,
                    quest.isComplete && styles.completeRow,
                ]}
                onPress={handlePress}
                disabled={quest.isComplete}
                activeOpacity={0.7}
            >
                {/* Checkbox */}
                <View style={[
                    styles.checkbox,
                    quest.isComplete && styles.checkboxComplete,
                    { borderColor: attrColor },
                ]}>
                    {quest.isComplete && (
                        <Text style={styles.checkmark}>✓</Text>
                    )}
                </View>

                {/* Quest Info */}
                <View style={styles.questInfo}>
                    <Text style={[
                        styles.questTitle,
                        quest.isComplete && styles.completeText,
                    ]}>
                        {quest.title}
                    </Text>
                    <View style={styles.questMeta}>
                        <View style={[styles.attrTag, { borderColor: attrColor }]}>
                            <Text style={[styles.attrText, { color: attrColor }]}>
                                {quest.attribute}
                            </Text>
                        </View>
                        <Text style={styles.xpText}>+{quest.xpReward} XP</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.sm,
    },
    questRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.dimmed,
        backgroundColor: 'rgba(0, 234, 255, 0.02)',
        minHeight: touchTarget.minHeight,
    },
    completeRow: {
        opacity: 0.6,
        backgroundColor: 'rgba(255, 215, 0, 0.05)',
        borderColor: colors.gold,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        marginRight: spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxComplete: {
        backgroundColor: colors.gold,
        borderColor: colors.gold,
    },
    checkmark: {
        color: colors.voidBlack,
        fontSize: fontSizes.md,
        fontWeight: 'bold',
    },
    questInfo: {
        flex: 1,
    },
    questTitle: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        color: colors.paleCyan,
        letterSpacing: 1,
        marginBottom: spacing.xs,
    },
    completeText: {
        textDecorationLine: 'line-through',
        color: colors.dimmed,
    },
    questMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    attrTag: {
        borderWidth: 1,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
    },
    attrText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xs,
        letterSpacing: 1,
    },
    xpText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.gold,
    },
});

export default QuestItem;
