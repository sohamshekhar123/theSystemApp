// The Awakening Screen - Cinematic intro sequence
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, StatusBar, Dimensions, TextInput, Animated, Text } from 'react-native';
import { TypewriterText, GlowButton } from '../components';
import { useGame } from '../context/GameContext';
import { colors, fontSizes, spacing } from '../styles/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type AwakeningStep = 'intro' | 'qualification' | 'choice' | 'rejection' | 'nameInput' | 'accepted';

export const AwakeningScreen: React.FC = () => {
    const { dispatch } = useGame();
    const [step, setStep] = useState<AwakeningStep>('intro');
    const [playerName, setPlayerName] = useState('');

    const windowOpacity = useRef(new Animated.Value(0)).current;
    const windowScale = useRef(new Animated.Value(0.9)).current;
    const rejectionOpacity = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Animate window appearance
    useEffect(() => {
        if (step === 'choice' || step === 'nameInput') {
            Animated.parallel([
                Animated.timing(windowOpacity, {
                    toValue: 1,
                    duration: 500,
                    delay: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(windowScale, {
                    toValue: 1,
                    duration: 500,
                    delay: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [step]);

    // Fade in for intro steps
    useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [step]);

    const handleIntroComplete = () => {
        setStep('qualification');
    };

    const handleQualificationComplete = () => {
        setStep('choice');
    };

    const handleAccept = () => {
        setStep('nameInput');
    };

    const handleReject = () => {
        setStep('rejection');
        Animated.timing(rejectionOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();

        // After fake death warning, force accept
        setTimeout(() => {
            Animated.timing(rejectionOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => setStep('choice'));
        }, 2000);
    };

    const handleNameSubmit = () => {
        if (playerName.trim()) {
            dispatch({ type: 'SET_PLAYER_NAME', payload: playerName.trim().toUpperCase() });
            dispatch({ type: 'COMPLETE_AWAKENING' });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.voidBlack} />

            {/* Intro text */}
            {step === 'intro' && (
                <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
                    <TypewriterText
                        text="..."
                        speed={300}
                        delay={1000}
                        onComplete={handleIntroComplete}
                        style={styles.introText}
                    />
                </Animated.View>
            )}

            {/* Qualification message */}
            {step === 'qualification' && (
                <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
                    <TypewriterText
                        text="YOU HAVE QUALIFIED TO BECOME A PLAYER."
                        speed={60}
                        delay={500}
                        onComplete={handleQualificationComplete}
                        style={styles.qualificationText}
                    />
                </Animated.View>
            )}

            {/* Choice window */}
            {step === 'choice' && (
                <Animated.View style={[
                    styles.windowContainer,
                    { opacity: windowOpacity, transform: [{ scale: windowScale }] }
                ]}>
                    <View style={styles.systemWindow}>
                        <Text style={styles.choiceText}>WILL YOU ACCEPT?</Text>
                        <View style={styles.buttonRow}>
                            <GlowButton
                                title="YES"
                                onPress={handleAccept}
                                variant="primary"
                                pulsing
                                style={styles.choiceButton}
                            />
                            <GlowButton
                                title="NO"
                                onPress={handleReject}
                                variant="danger"
                                style={styles.choiceButton}
                            />
                        </View>
                    </View>
                </Animated.View>
            )}

            {/* Rejection warning */}
            {step === 'rejection' && (
                <Animated.View style={[styles.rejectionContainer, { opacity: rejectionOpacity }]}>
                    <Text style={styles.rejectionText}>
                        HEART WILL STOP IN 0.02 SECONDS.
                    </Text>
                </Animated.View>
            )}

            {/* Name input */}
            {step === 'nameInput' && (
                <Animated.View style={[
                    styles.windowContainer,
                    { opacity: fadeAnim }
                ]}>
                    <View style={styles.systemWindow}>
                        <Text style={styles.choiceText}>ENTER YOUR NAME, PLAYER.</Text>
                        <TextInput
                            style={styles.nameInput}
                            value={playerName}
                            onChangeText={setPlayerName}
                            placeholder="ENTER NAME"
                            placeholderTextColor={colors.dimmed}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            maxLength={20}
                        />
                        <GlowButton
                            title="ACCEPT"
                            onPress={handleNameSubmit}
                            variant="primary"
                            pulsing
                            disabled={!playerName.trim()}
                        />
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.voidBlack,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        paddingHorizontal: spacing.xl,
        alignItems: 'center',
    },
    introText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xxxl,
        color: colors.electricCyan,
        textAlign: 'center',
    },
    qualificationText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xl,
        color: colors.paleCyan,
        textAlign: 'center',
        lineHeight: fontSizes.xl * 1.5,
    },
    windowContainer: {
        padding: spacing.lg,
    },
    systemWindow: {
        backgroundColor: 'rgba(5, 5, 5, 0.95)',
        borderWidth: 1,
        borderColor: colors.electricCyan,
        padding: spacing.xl,
        alignItems: 'center',
        shadowColor: colors.electricCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        minWidth: SCREEN_WIDTH * 0.8,
    },
    choiceText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xl,
        color: colors.paleCyan,
        textAlign: 'center',
        marginBottom: spacing.xl,
        letterSpacing: 2,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    choiceButton: {
        minWidth: 100,
    },
    rejectionContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 51, 51, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rejectionText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xl,
        color: colors.alertRed,
        textAlign: 'center',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    nameInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: colors.electricCyan,
        backgroundColor: 'transparent',
        color: colors.paleCyan,
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.lg,
        padding: spacing.md,
        marginBottom: spacing.lg,
        textAlign: 'center',
        letterSpacing: 2,
    },
});

export default AwakeningScreen;
