// Calendar Modal - Solo Leveling style angular frame
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { useGame } from '../context/GameContext';
import { colors, fontSizes, spacing, glowShadow } from '../styles/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CalendarModalProps {
    visible: boolean;
    onClose: () => void;
}

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const CalendarModal: React.FC<CalendarModalProps> = ({ visible, onClose }) => {
    const { state } = useGame();
    const [currentDate] = useState(new Date());
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = currentDate.getDate();

    const modalWidth = SCREEN_WIDTH * 0.92;
    const modalHeight = 450;
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

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    const hasDeadline = (day: number): boolean => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return state.deadlines.some(d => d.date.startsWith(dateStr)) ||
            state.bossRaids.some(b => b.deadline?.startsWith(dateStr) && !b.isDefeated);
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
                        <Text style={styles.title}>CALENDAR</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>×</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.monthYear}>{MONTHS[month]} {year}</Text>

                    <View style={styles.dayHeaders}>
                        {DAYS.map(day => (
                            <View key={day} style={styles.dayHeader}>
                                <Text style={styles.dayHeaderText}>{day}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.calendarGrid}>
                        {calendarDays.map((day, index) => (
                            <View key={index} style={[styles.dayCell, day === today && styles.todayCell]}>
                                {day && (
                                    <>
                                        <Text style={[styles.dayText, day === today && styles.todayText, hasDeadline(day) && styles.deadlineText]}>
                                            {day}
                                        </Text>
                                        {hasDeadline(day) && <View style={styles.deadlineIndicator} />}
                                    </>
                                )}
                            </View>
                        ))}
                    </View>
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
        marginBottom: spacing.md,
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
    monthYear: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.lg,
        color: colors.paleCyan,
        textAlign: 'center',
        letterSpacing: 2,
        marginBottom: spacing.md,
    },
    dayHeaders: {
        flexDirection: 'row',
        marginBottom: spacing.xs,
    },
    dayHeader: {
        flex: 1,
        alignItems: 'center',
    },
    dayHeaderText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xs,
        color: colors.dimmed,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.dimmed,
    },
    todayCell: {
        borderColor: colors.electricCyan,
        backgroundColor: colors.glowOverlay,
    },
    dayText: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        color: colors.paleCyan,
    },
    todayText: {
        color: colors.electricCyan,
        fontFamily: 'Rajdhani-Bold',
    },
    deadlineText: {
        color: colors.alertRed,
    },
    deadlineIndicator: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 6,
        height: 6,
        backgroundColor: colors.alertRed,
    },
});

export default CalendarModal;
