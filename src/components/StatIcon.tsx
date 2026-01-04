// StatIcon Component - Icon + label + value stat display
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors, fontSizes, spacing } from '../styles/theme';

interface StatIconProps {
    stat: 'STR' | 'AGI' | 'INT' | 'VIT' | 'PER' | 'HP' | 'MP';
    value: number;
    bonus?: number;
    size?: 'small' | 'medium';
}

const STAT_ICONS: Record<string, (color: string) => React.ReactElement> = {
    STR: (c) => (
        <Svg width="16" height="16" viewBox="0 0 24 24">
            <Path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14 4.14 5.57 2 7.71 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57 16.29 22 18.43 19.86 19.86 18.43 22 16.29 20.57 14.86Z" fill={c} />
        </Svg>
    ),
    AGI: (c) => (
        <Svg width="16" height="16" viewBox="0 0 24 24">
            <Path d="M13.5,5.5C14.59,5.5 15.5,4.58 15.5,3.5C15.5,2.38 14.59,1.5 13.5,1.5C12.39,1.5 11.5,2.38 11.5,3.5C11.5,4.58 12.39,5.5 13.5,5.5M9.89,19.38L10.89,15L13,17V23H15V15.5L12.89,13.5L13.5,10.5C14.79,12 16.79,13 19,13V11C17.09,11 15.5,10 14.69,8.58L13.69,7C13.29,6.38 12.69,6 12,6C11.69,6 11.5,6.08 11.19,6.08L6,8.28V13H8V9.58L9.79,8.88L8.19,17L3.29,16L2.89,18L9.89,19.38Z" fill={c} />
        </Svg>
    ),
    INT: (c) => (
        <Svg width="16" height="16" viewBox="0 0 24 24">
            <Path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" fill={c} />
        </Svg>
    ),
    VIT: (c) => (
        <Svg width="16" height="16" viewBox="0 0 24 24">
            <Path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" fill={c} />
        </Svg>
    ),
    PER: (c) => (
        <Svg width="16" height="16" viewBox="0 0 24 24">
            <Path d="M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" fill={c} />
        </Svg>
    ),
    HP: (c) => (
        <Svg width="16" height="16" viewBox="0 0 24 24">
            <Path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" fill={c} />
        </Svg>
    ),
    MP: (c) => (
        <Svg width="16" height="16" viewBox="0 0 24 24">
            <Path d="M12,3L2,12H5V20H19V12H22L12,3M12,8.75A2.25,2.25 0 0,1 14.25,11A2.25,2.25 0 0,1 12,13.25A2.25,2.25 0 0,1 9.75,11A2.25,2.25 0 0,1 12,8.75Z" fill={c} />
        </Svg>
    ),
};

const STAT_COLORS: Record<string, string> = {
    STR: colors.alertRed,
    AGI: '#00D68F',
    INT: colors.electricCyan,
    VIT: colors.alertRed,
    PER: '#FF9F43',
    HP: colors.alertRed,
    MP: colors.electricCyan,
};

export const StatIcon: React.FC<StatIconProps> = ({ stat, value, bonus, size = 'medium' }) => {
    const color = STAT_COLORS[stat] || colors.electricCyan;
    const isSmall = size === 'small';

    return (
        <View style={[styles.container, isSmall && styles.containerSmall]}>
            <View style={styles.iconContainer}>
                {STAT_ICONS[stat]?.(color) || STAT_ICONS['INT'](color)}
            </View>
            <Text style={[styles.label, { color }]}>{stat}:</Text>
            <Text style={[styles.value, isSmall && styles.valueSmall]}>{value}</Text>
            {bonus !== undefined && bonus > 0 && (
                <Text style={styles.bonus}>+{bonus}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    containerSmall: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
    },
    iconContainer: {
        marginRight: spacing.sm,
    },
    label: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        letterSpacing: 1,
        marginRight: spacing.xs,
    },
    value: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.lg,
        color: colors.paleCyan,
    },
    valueSmall: {
        fontSize: fontSizes.md,
    },
    bonus: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.gold,
        marginLeft: spacing.xs,
    },
});

export default StatIcon;
