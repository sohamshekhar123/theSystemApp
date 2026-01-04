// Settings Modal - Solo Leveling style
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Animated, Dimensions } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { useGame } from '../context/GameContext';
import { colors, fontSizes, spacing, glowShadow, touchTarget } from '../styles/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
    const { state, dispatch } = useGame();
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [hapticsEnabled, setHapticsEnabled] = useState(true);

    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const modalWidth = SCREEN_WIDTH * 0.92;
    const modalHeight = 400;
    const cs = 15;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 100, friction: 10 }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start();
        } else {
            scaleAnim.setValue(0.9);
            opacityAnim.setValue(0);
        }
    }, [visible]);

    if (!visible) return null;

    const handleReset = () => {
        Alert.alert(
            'RESET DATA',
            'This will erase all progress. Are you sure?',
            [
                { text: 'CANCEL', style: 'cancel' },
                { text: 'RESET', style: 'destructive', onPress: () => dispatch({ type: 'RESET_ALL' }) }
            ]
        );
    };

    const framePath = `M ${cs} 0 L ${modalWidth - cs} 0 L ${modalWidth} ${cs} L ${modalWidth} ${modalHeight - cs} L ${modalWidth - cs} ${modalHeight} L ${cs} ${modalHeight} L 0 ${modalHeight - cs} L 0 ${cs} Z`;
    const corners = [
        `M 0 ${cs + 10} L 0 ${cs} L ${cs} 0 L ${cs + 10} 0`,
        `M ${modalWidth - cs - 10} 0 L ${modalWidth - cs} 0 L ${modalWidth} ${cs} L ${modalWidth} ${cs + 10}`,
        `M ${modalWidth} ${modalHeight - cs - 10} L ${modalWidth} ${modalHeight - cs} L ${modalWidth - cs} ${modalHeight} L ${modalWidth - cs - 10} ${modalHeight}`,
        `M ${cs + 10} ${modalHeight} L ${cs} ${modalHeight} L 0 ${modalHeight - cs} L 0 ${modalHeight - cs - 10}`,
    ];

    return (
        <View style={styles.overlay}>
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />

            <Animated.View style={[
                styles.modalContainer,
                { width: modalWidth, height: modalHeight, opacity: opacityAnim, transform: [{ scale: scaleAnim }] }
            ]}>
                <Svg width={modalWidth} height={modalHeight} style={StyleSheet.absoluteFill}>
                    <Path d={framePath} fill={colors.voidBlack} fillOpacity={0.98} />
                    <Path d={framePath} fill="none" stroke={colors.electricCyan} strokeWidth={1.5} />
                    {corners.map((path, i) => (
                        <Path key={i} d={path} fill="none" stroke={colors.electricCyan} strokeWidth={2.5} />
                    ))}
                </Svg>

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>SETTINGS</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>×</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>SOUND EFFECTS</Text>
                            <Switch
                                value={soundEnabled}
                                onValueChange={setSoundEnabled}
                                trackColor={{ false: colors.dimmed, true: colors.electricCyan }}
                                thumbColor={colors.paleCyan}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>HAPTIC FEEDBACK</Text>
                            <Switch
                                value={hapticsEnabled}
                                onValueChange={setHapticsEnabled}
                                trackColor={{ false: colors.dimmed, true: colors.electricCyan }}
                                thumbColor={colors.paleCyan}
                            />
                        </View>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.dangerButton} onPress={handleReset}>
                            <Text style={styles.dangerButtonText}>RESET ALL DATA</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(2, 2, 10, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContainer: {
        ...glowShadow.cyanIntense,
    },
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xl,
        color: colors.electricCyan,
        letterSpacing: 2,
        textShadowColor: colors.electricCyan,
        textShadowRadius: 10,
    },
    closeButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xxl,
        color: colors.paleCyan,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.dimmed,
        minHeight: touchTarget.minHeight,
    },
    settingLabel: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        color: colors.paleCyan,
        letterSpacing: 1,
    },
    divider: {
        height: spacing.xl,
    },
    dangerButton: {
        borderWidth: 1,
        borderColor: colors.alertRed,
        padding: spacing.md,
        alignItems: 'center',
        minHeight: touchTarget.minHeight,
    },
    dangerButtonText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.alertRed,
        letterSpacing: 2,
    },
});

export default SettingsModal;
