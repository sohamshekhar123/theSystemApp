// QuestPanel Component - Angular quest item with accent bar
import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Svg, { Path, Line, Rect } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { colors, fontSizes, spacing, glowShadow, touchTarget } from '../styles/theme';
import { DailyQuest } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface QuestPanelProps {
    quest: DailyQuest;
    onComplete: (questId: string) => void;
}

export const QuestPanel: React.FC<QuestPanelProps> = ({ quest, onComplete }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const width = SCREEN_WIDTH * 0.85;
    const height = 70;

    const handlePress = async () => {
        if (quest.isComplete) return;

        try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) { }

        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.02, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();

        onComplete(quest.id);
    };

    // Angular panel path with left indent
    const panelPath = `
        M 20 5 
        L ${width - 5} 5 
        L ${width - 5} ${height - 5} 
        L 20 ${height - 5} 
        L 5 ${height - 20} 
        L 5 25 
        Z
    `;

    const checkboxSize = 18;
    const checkboxX = width - 40;
    const checkboxY = (height - checkboxSize) / 2;

    return (
        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                onPress={handlePress}
                disabled={quest.isComplete}
                activeOpacity={0.8}
                style={[styles.touchable, { width, height }]}
            >
                <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
                    {/* Panel background */}
                    <Path
                        d={panelPath}
                        fill={quest.isComplete ? 'rgba(255, 215, 0, 0.05)' : colors.darkPanel}
                    />

                    {/* Panel border */}
                    <Path
                        d={panelPath}
                        fill="none"
                        stroke={quest.isComplete ? colors.gold : colors.electricCyan}
                        strokeWidth={1}
                        strokeOpacity={quest.isComplete ? 0.5 : 0.8}
                    />

                    {/* Left accent bar */}
                    <Line
                        x1={7}
                        y1={28}
                        x2={7}
                        y2={height - 22}
                        stroke={quest.isComplete ? colors.gold : colors.electricCyan}
                        strokeWidth={2}
                    />

                    {/* Checkbox */}
                    <Rect
                        x={checkboxX}
                        y={checkboxY}
                        width={checkboxSize}
                        height={checkboxSize}
                        fill={quest.isComplete ? colors.gold : 'none'}
                        stroke={quest.isComplete ? colors.gold : colors.electricCyan}
                        strokeWidth={1}
                    />
                </Svg>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.textContainer}>
                        <Text style={[
                            styles.title,
                            quest.isComplete && styles.titleComplete
                        ]}>
                            {quest.title}
                        </Text>
                        <Text style={styles.reward}>
                            Reward: +{quest.xpReward} {quest.attribute}
                        </Text>
                    </View>

                    <Text style={styles.progress}>
                        [{quest.isComplete ? '1/1' : '0/1'}]
                    </Text>

                    {quest.isComplete && (
                        <Text style={styles.checkmark}>✓</Text>
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.sm,
        ...glowShadow.cyan,
    },
    touchable: {
        minHeight: touchTarget.minHeight,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 60,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.paleCyan,
        letterSpacing: 1,
    },
    titleComplete: {
        textDecorationLine: 'line-through',
        color: colors.dimmed,
    },
    reward: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.sm,
        color: colors.electricCyan,
        marginTop: 2,
    },
    progress: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        color: colors.paleCyan,
        marginRight: spacing.md,
    },
    checkmark: {
        position: 'absolute',
        right: 26,
        color: colors.voidBlack,
        fontSize: fontSizes.sm,
        fontWeight: 'bold',
    },
});

export default QuestPanel;
