// AngularFrame Component - SVG-based cut-corner container with glow
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path, Defs, Filter, FeGaussianBlur, FeMerge, FeMergeNode, Rect, Line } from 'react-native-svg';
import { colors, glowShadow } from '../styles/theme';

interface AngularFrameProps {
    width: number;
    height: number;
    children?: React.ReactNode;
    variant?: 'primary' | 'danger' | 'gold';
    cornerSize?: number;
    showScanlines?: boolean;
    style?: ViewStyle;
}

export const AngularFrame: React.FC<AngularFrameProps> = ({
    width,
    height,
    children,
    variant = 'primary',
    cornerSize = 20,
    showScanlines = true,
    style,
}) => {
    const getColor = () => {
        switch (variant) {
            case 'danger': return colors.alertRed;
            case 'gold': return colors.gold;
            default: return colors.electricCyan;
        }
    };

    const color = getColor();
    const cs = cornerSize;

    // Outer frame path with cut corners
    const outerPath = `
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

    // Inner frame path (slightly inset)
    const inset = 8;
    const innerPath = `
        M ${cs + inset} ${inset} 
        L ${width - cs - inset} ${inset} 
        L ${width - inset} ${cs + inset} 
        L ${width - inset} ${height - cs - inset} 
        L ${width - cs - inset} ${height - inset} 
        L ${cs + inset} ${height - inset} 
        L ${inset} ${height - cs - inset} 
        L ${inset} ${cs + inset} 
        Z
    `;

    // Corner accent paths (thicker lines at corners)
    const cornerAccents = [
        `M 0 ${cs + 15} L 0 ${cs} L ${cs} 0 L ${cs + 15} 0`, // Top-left
        `M ${width - cs - 15} 0 L ${width - cs} 0 L ${width} ${cs} L ${width} ${cs + 15}`, // Top-right
        `M ${width} ${height - cs - 15} L ${width} ${height - cs} L ${width - cs} ${height} L ${width - cs - 15} ${height}`, // Bottom-right
        `M ${cs + 15} ${height} L ${cs} ${height} L 0 ${height - cs} L 0 ${height - cs - 15}`, // Bottom-left
    ];

    return (
        <View style={[styles.container, { width, height }, style]}>
            <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
                <Defs>
                    <Filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <FeGaussianBlur in="SourceGraphic" stdDeviation="3" />
                    </Filter>
                </Defs>

                {/* Background fill */}
                <Path d={outerPath} fill={colors.voidBlack} fillOpacity={0.95} />

                {/* Scanlines overlay */}
                {showScanlines && (
                    <>
                        {Array.from({ length: Math.floor(height / 4) }).map((_, i) => (
                            <Line
                                key={i}
                                x1={0}
                                y1={i * 4}
                                x2={width}
                                y2={i * 4}
                                stroke={color}
                                strokeOpacity={0.05}
                                strokeWidth={1}
                            />
                        ))}
                    </>
                )}

                {/* Inner glow fill */}
                <Path d={innerPath} fill={color} fillOpacity={0.03} />

                {/* Outer border with glow effect */}
                <Path d={outerPath} fill="none" stroke={color} strokeWidth={2} opacity={0.9} />

                {/* Inner border */}
                <Path d={innerPath} fill="none" stroke={color} strokeWidth={1} opacity={0.5} />

                {/* Corner accents (thicker) */}
                {cornerAccents.map((path, i) => (
                    <Path key={i} d={path} fill="none" stroke={color} strokeWidth={3} />
                ))}
            </Svg>

            {/* Content container */}
            <View style={[styles.content, { padding: cornerSize + 10 }]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        ...glowShadow.cyan,
    },
    content: {
        flex: 1,
    },
});

export default AngularFrame;
