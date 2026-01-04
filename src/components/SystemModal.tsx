// SystemModal Component - Dark overlay modal with angular frame
import React, { useEffect, useRef } from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback, Animated, Dimensions } from 'react-native';
import Svg, { Path, Line, Rect } from 'react-native-svg';
import { colors, glowShadow, spacing } from '../styles/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SystemModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    width?: number;
    height?: number;
    variant?: 'primary' | 'danger';
}

export const SystemModal: React.FC<SystemModalProps> = ({
    visible,
    onClose,
    children,
    width = SCREEN_WIDTH * 0.9,
    height = 400,
    variant = 'primary',
}) => {
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const color = variant === 'danger' ? colors.alertRed : colors.electricCyan;
    const cs = 15; // Corner size

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 10,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleAnim.setValue(0.9);
            opacityAnim.setValue(0);
        }
    }, [visible]);

    // Frame path
    const framePath = `
        M ${cs} 0 
        L ${width - cs} 0 
        L ${width} ${cs} 
        L ${width} ${height - cs} 
        L ${width - cs} ${height} 
        L ${cs} ${height} 
        L 0 ${height - cs} 
        L 0 ${cs} 
        Z
    `;

    // Corner accents
    const corners = [
        `M 0 ${cs + 10} L 0 ${cs} L ${cs} 0 L ${cs + 10} 0`,
        `M ${width - cs - 10} 0 L ${width - cs} 0 L ${width} ${cs} L ${width} ${cs + 10}`,
        `M ${width} ${height - cs - 10} L ${width} ${height - cs} L ${width - cs} ${height} L ${width - cs - 10} ${height}`,
        `M ${cs + 10} ${height} L ${cs} ${height} L 0 ${height - cs} L 0 ${height - cs - 10}`,
    ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    {/* Scanlines on overlay */}
                    <View style={styles.scanlinesOverlay}>
                        {Array.from({ length: Math.floor(SCREEN_HEIGHT / 3) }).map((_, i) => (
                            <View key={i} style={styles.scanline} />
                        ))}
                    </View>

                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.modalContainer,
                                {
                                    width,
                                    height,
                                    opacity: opacityAnim,
                                    transform: [{ scale: scaleAnim }],
                                },
                            ]}
                        >
                            <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
                                {/* Background */}
                                <Path d={framePath} fill={colors.voidBlack} fillOpacity={0.98} />

                                {/* Inner scanlines */}
                                {Array.from({ length: Math.floor(height / 4) }).map((_, i) => (
                                    <Line
                                        key={i}
                                        x1={cs}
                                        y1={i * 4}
                                        x2={width - cs}
                                        y2={i * 4}
                                        stroke={color}
                                        strokeOpacity={0.03}
                                        strokeWidth={1}
                                    />
                                ))}

                                {/* Outer frame */}
                                <Path d={framePath} fill="none" stroke={color} strokeWidth={1.5} />

                                {/* Inner decorative lines */}
                                <Line x1={10} y1={10} x2={width - 10} y2={10} stroke={color} strokeWidth={0.5} strokeOpacity={0.5} />
                                <Line x1={10} y1={height - 10} x2={width - 10} y2={height - 10} stroke={color} strokeWidth={0.5} strokeOpacity={0.5} />

                                {/* Corner accents */}
                                {corners.map((path, i) => (
                                    <Path key={i} d={path} fill="none" stroke={color} strokeWidth={2.5} />
                                ))}
                            </Svg>

                            <View style={[styles.content, { padding: cs + spacing.md }]}>
                                {children}
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(2, 2, 10, 0.92)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanlinesOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.3,
    },
    scanline: {
        height: 1,
        backgroundColor: colors.electricCyan,
        opacity: 0.05,
        marginBottom: 2,
    },
    modalContainer: {
        ...glowShadow.cyanIntense,
    },
    content: {
        flex: 1,
    },
});

export default SystemModal;
