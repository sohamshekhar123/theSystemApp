// RankBadge Component - Displays player rank with glow
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, fontSizes, spacing } from '../styles/theme';
import { Rank } from '../types';

interface RankBadgeProps {
    rank: Rank;
    totalLevels: number;
    size?: 'small' | 'medium' | 'large';
}

const RANK_COLORS: Record<Rank, string> = {
    E: '#888888',
    D: '#4A90D9',
    C: '#00D68F',
    B: '#FF9F43',
    A: '#FF3333',
    S: '#FFD700',
};

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, totalLevels, size = 'medium' }) => {
    const glowAnim = useRef(new Animated.Value(0.5)).current;
    const color = RANK_COLORS[rank];
    const isS = rank === 'S';

    useEffect(() => {
        if (isS) {
            const glowAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0.5,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            );
            glowAnimation.start();
            return () => glowAnimation.stop();
        }
    }, [isS]);

    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return { width: 40, height: 40, fontSize: fontSizes.lg };
            case 'large':
                return { width: 80, height: 80, fontSize: fontSizes.xxxl };
            default:
                return { width: 60, height: 60, fontSize: fontSizes.xxl };
        }
    };

    const sizeStyle = getSizeStyle();

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    width: sizeStyle.width,
                    height: sizeStyle.height,
                    borderColor: color,
                    shadowColor: color,
                    opacity: isS ? glowAnim : 1,
                },
            ]}
        >
            <Text style={[styles.rank, { color, fontSize: sizeStyle.fontSize }]}>
                {rank}
            </Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    rank: {
        fontFamily: 'Rajdhani-Bold',
        letterSpacing: 2,
    },
});

export default RankBadge;
