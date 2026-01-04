// The Awakening Screen - NOTIFICATION modal matching Solo Leveling reference
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, StatusBar, Dimensions, TextInput, Animated, Text, TouchableOpacity } from 'react-native';
import Svg, { Path, Line, Rect } from 'react-native-svg';
import { TypewriterText } from '../components';
import { useGame } from '../context/GameContext';
import { colors, fontSizes, spacing, glowShadow } from '../styles/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type AwakeningStep = 'intro' | 'qualification' | 'notification' | 'rejection' | 'nameInput';

export const AwakeningScreen: React.FC = () => {
    const { dispatch } = useGame();
    const [step, setStep] = useState<AwakeningStep>('intro');
    const [playerName, setPlayerName] = useState('');
    const [countdown, setCountdown] = useState(2);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const modalScale = useRef(new Animated.Value(0.9)).current;
    const modalOpacity = useRef(new Animated.Value(0)).current;

    // Fade animation for each step
    useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [step]);

    // Modal animation
    useEffect(() => {
        if (step === 'notification' || step === 'nameInput') {
            Animated.parallel([
                Animated.spring(modalScale, { toValue: 1, useNativeDriver: true, tension: 100, friction: 10 }),
                Animated.timing(modalOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();
        }
    }, [step]);

    // Countdown timer for rejection
    useEffect(() => {
        if (step === 'rejection' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        } else if (step === 'rejection' && countdown === 0) {
            setStep('notification');
            setCountdown(2);
        }
    }, [step, countdown]);

    const handleIntroComplete = () => setStep('qualification');
    const handleQualificationComplete = () => setStep('notification');

    const handleAccept = () => setStep('nameInput');

    const handleReject = () => {
        setStep('rejection');
        setCountdown(2);
    };

    const handleNameSubmit = () => {
        if (playerName.trim()) {
            dispatch({ type: 'SET_PLAYER_NAME', payload: playerName.trim().toUpperCase() });
            dispatch({ type: 'COMPLETE_AWAKENING' });
        }
    };

    // Modal dimensions
    const modalWidth = SCREEN_WIDTH * 0.88;
    const modalHeight = 280;
    const cs = 12; // Corner size

    const framePath = `M ${cs} 0 L ${modalWidth - cs} 0 L ${modalWidth} ${cs} L ${modalWidth} ${modalHeight - cs} L ${modalWidth - cs} ${modalHeight} L ${cs} ${modalHeight} L 0 ${modalHeight - cs} L 0 ${cs} Z`;

    const corners = [
        `M 0 ${cs + 8} L 0 ${cs} L ${cs} 0 L ${cs + 8} 0`,
        `M ${modalWidth - cs - 8} 0 L ${modalWidth - cs} 0 L ${modalWidth} ${cs} L ${modalWidth} ${cs + 8}`,
        `M ${modalWidth} ${modalHeight - cs - 8} L ${modalWidth} ${modalHeight - cs} L ${modalWidth - cs} ${modalHeight} L ${modalWidth - cs - 8} ${modalHeight}`,
        `M ${cs + 8} ${modalHeight} L ${cs} ${modalHeight} L 0 ${modalHeight - cs} L 0 ${modalHeight - cs - 8}`,
    ];

    const renderModal = (title: string, content: React.ReactNode) => (
        <Animated.View style={[
            styles.modalContainer,
            { width: modalWidth, height: modalHeight, opacity: modalOpacity, transform: [{ scale: modalScale }] }
        ]}>
            <Svg width={modalWidth} height={modalHeight} style={StyleSheet.absoluteFill}>
                {/* Background */}
                <Path d={framePath} fill={colors.voidBlack} fillOpacity={0.98} />

                {/* Scanlines */}
                {Array.from({ length: Math.floor(modalHeight / 4) }).map((_, i) => (
                    <Line key={i} x1={cs} y1={i * 4} x2={modalWidth - cs} y2={i * 4} stroke={colors.electricCyan} strokeOpacity={0.03} strokeWidth={1} />
                ))}

                {/* Frame border */}
                <Path d={framePath} fill="none" stroke={colors.electricCyan} strokeWidth={1.5} />

                {/* Inner decorative lines */}
                <Line x1={8} y1={8} x2={modalWidth - 8} y2={8} stroke={colors.electricCyan} strokeWidth={0.5} strokeOpacity={0.4} />
                <Line x1={8} y1={modalHeight - 8} x2={modalWidth - 8} y2={modalHeight - 8} stroke={colors.electricCyan} strokeWidth={0.5} strokeOpacity={0.4} />

                {/* Corner accents */}
                {corners.map((path, i) => (
                    <Path key={i} d={path} fill="none" stroke={colors.electricCyan} strokeWidth={2} />
                ))}
            </Svg>

            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>! {title}</Text>
                {content}
            </View>
        </Animated.View>
    );

    const renderButton = (label: string, onPress: () => void, variant: 'primary' | 'secondary' = 'primary') => {
        const btnWidth = 100;
        const btnHeight = 40;
        return (
            <TouchableOpacity onPress={onPress} style={[styles.button, { width: btnWidth, height: btnHeight }]}>
                <Svg width={btnWidth} height={btnHeight} style={StyleSheet.absoluteFill}>
                    <Rect x={0} y={0} width={btnWidth} height={btnHeight} fill="none" stroke={colors.electricCyan} strokeWidth={1} />
                </Svg>
                <Text style={styles.buttonText}>{label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.voidBlack} />

            {/* Background scanlines */}
            <View style={styles.scanlinesBg}>
                {Array.from({ length: Math.floor(SCREEN_HEIGHT / 3) }).map((_, i) => (
                    <View key={i} style={styles.bgScanline} />
                ))}
            </View>

            {/* Intro text */}
            {step === 'intro' && (
                <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
                    <TypewriterText
                        text="..."
                        speed={400}
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
                        speed={50}
                        delay={300}
                        onComplete={handleQualificationComplete}
                        style={styles.qualificationText}
                    />
                </Animated.View>
            )}

            {/* NOTIFICATION modal - matches reference image */}
            {step === 'notification' && renderModal('NOTIFICATION', (
                <>
                    <Text style={styles.modalText}>You are qualified to be a Player.</Text>
                    <Text style={styles.modalTextRed}>Your heart will stop in 0:02 seconds.</Text>
                    <Text style={styles.modalText}>Will you accept?</Text>
                    <View style={styles.buttonRow}>
                        {renderButton('YES', handleAccept)}
                        {renderButton('NO', handleReject)}
                    </View>
                </>
            ))}

            {/* Rejection countdown */}
            {step === 'rejection' && (
                <View style={styles.rejectionContainer}>
                    <Text style={styles.rejectionText}>
                        YOUR HEART WILL STOP IN 0:0{countdown} SECONDS.
                    </Text>
                </View>
            )}

            {/* Name input modal */}
            {step === 'nameInput' && renderModal('PLAYER REGISTRATION', (
                <>
                    <Text style={styles.modalText}>Enter your name, Player.</Text>
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
                    <View style={styles.buttonRow}>
                        {renderButton('ACCEPT', handleNameSubmit)}
                    </View>
                </>
            ))}
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
    scanlinesBg: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.4,
    },
    bgScanline: {
        height: 1,
        backgroundColor: colors.electricCyan,
        opacity: 0.03,
        marginBottom: 2,
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
        textShadowColor: colors.electricCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    qualificationText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xl,
        color: colors.paleCyan,
        textAlign: 'center',
        lineHeight: fontSizes.xl * 1.5,
    },
    modalContainer: {
        ...glowShadow.cyanIntense,
    },
    modalContent: {
        flex: 1,
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.lg,
        color: colors.electricCyan,
        letterSpacing: 2,
        marginBottom: spacing.lg,
        textShadowColor: colors.electricCyan,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    modalText: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        color: colors.paleCyan,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    modalTextRed: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.alertRed,
        textAlign: 'center',
        marginBottom: spacing.sm,
        textShadowColor: colors.alertRed,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: spacing.lg,
        marginTop: spacing.lg,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        ...glowShadow.cyan,
    },
    buttonText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.paleCyan,
        letterSpacing: 2,
    },
    rejectionContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 51, 51, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rejectionText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xl,
        color: colors.alertRed,
        textAlign: 'center',
        letterSpacing: 2,
        textShadowColor: colors.alertRed,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
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
        marginVertical: spacing.md,
        textAlign: 'center',
        letterSpacing: 2,
    },
});

export default AwakeningScreen;
