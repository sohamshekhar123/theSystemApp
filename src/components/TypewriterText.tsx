// TypewriterText Component - Letter-by-letter text animation
import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, TextStyle, Animated } from 'react-native';
import { colors, fontSizes } from '../styles/theme';

interface TypewriterTextProps {
    text: string;
    speed?: number;
    delay?: number;
    onComplete?: () => void;
    style?: TextStyle;
    showCursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
    text,
    speed = 50,
    delay = 0,
    onComplete,
    style,
    showCursor = true,
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const cursorOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        let currentIndex = 0;
        let timeoutId: NodeJS.Timeout;

        const startTyping = () => {
            const typeNextChar = () => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.substring(0, currentIndex + 1));
                    currentIndex++;
                    timeoutId = setTimeout(typeNextChar, speed);
                } else {
                    setIsComplete(true);
                    onComplete?.();
                }
            };

            typeNextChar();
        };

        const delayTimeout = setTimeout(startTyping, delay);

        return () => {
            clearTimeout(delayTimeout);
            clearTimeout(timeoutId);
        };
    }, [text, speed, delay, onComplete]);

    // Blinking cursor animation
    useEffect(() => {
        if (showCursor && !isComplete) {
            const blinkAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(cursorOpacity, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(cursorOpacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            );
            blinkAnimation.start();
            return () => blinkAnimation.stop();
        }
    }, [showCursor, isComplete]);

    return (
        <Text style={[styles.text, style]}>
            {displayedText}
            {showCursor && !isComplete && (
                <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>
                    |
                </Animated.Text>
            )}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        color: colors.paleCyan,
        letterSpacing: 1,
    },
    cursor: {
        fontFamily: 'Rajdhani-Bold',
        color: colors.electricCyan,
    },
});

export default TypewriterText;
