// Calendar Modal - Dark grid calendar with deadlines
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SystemWindow } from '../components';
import { useGame } from '../context/GameContext';
import { colors, fontSizes, spacing } from '../styles/theme';

interface CalendarModalProps {
    visible: boolean;
    onClose: () => void;
}

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const CalendarModal: React.FC<CalendarModalProps> = ({ visible, onClose }) => {
    const { state } = useGame();
    const [currentDate] = useState(new Date());
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = currentDate.getDate();

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(0);
        }
    }, [visible]);

    // Get first day of month and total days
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Generate calendar grid
    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    // Check if a day has a deadline
    const hasDeadline = (day: number): boolean => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return state.deadlines.some(d => d.date.startsWith(dateStr)) ||
            state.bossRaids.some(b => b.deadline?.startsWith(dateStr) && !b.isDefeated);
    };

    return (
        <SystemWindow visible={visible} onClose={onClose}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>CALENDAR</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>×</Text>
                    </TouchableOpacity>
                </View>

                {/* Month/Year */}
                <Text style={styles.monthYear}>
                    {MONTHS[month]} {year}
                </Text>

                {/* Day headers */}
                <View style={styles.dayHeaders}>
                    {DAYS.map(day => (
                        <View key={day} style={styles.dayHeader}>
                            <Text style={styles.dayHeaderText}>{day}</Text>
                        </View>
                    ))}
                </View>

                {/* Calendar grid */}
                <View style={styles.calendarGrid}>
                    {calendarDays.map((day, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dayCell,
                                day === today && styles.todayCell,
                            ]}
                        >
                            {day && (
                                <>
                                    <Text
                                        style={[
                                            styles.dayText,
                                            day === today && styles.todayText,
                                            hasDeadline(day) && styles.deadlineDayText,
                                        ]}
                                    >
                                        {day}
                                    </Text>
                                    {hasDeadline(day) && (
                                        <View style={styles.deadlineIndicator}>
                                            <Text style={styles.deadlineIcon}>!</Text>
                                        </View>
                                    )}
                                </>
                            )}
                        </View>
                    ))}
                </View>

                {/* Upcoming Deadlines */}
                <View style={styles.upcomingSection}>
                    <Text style={styles.sectionTitle}>UPCOMING DEADLINES</Text>
                    <ScrollView style={styles.deadlineList} showsVerticalScrollIndicator={false}>
                        {state.deadlines.length === 0 && state.bossRaids.filter(b => b.deadline && !b.isDefeated).length === 0 ? (
                            <Text style={styles.emptyText}>NO UPCOMING DEADLINES.</Text>
                        ) : (
                            <>
                                {state.deadlines.map((deadline) => (
                                    <Animated.View
                                        key={deadline.id}
                                        style={[styles.deadlineItem, { opacity: fadeAnim }]}
                                    >
                                        <View style={styles.deadlineMarker} />
                                        <View style={styles.deadlineInfo}>
                                            <Text style={styles.deadlineTitle}>{deadline.title}</Text>
                                            <Text style={styles.deadlineDate}>
                                                {new Date(deadline.date).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </Animated.View>
                                ))}
                                {state.bossRaids.filter(b => b.deadline && !b.isDefeated).map((boss) => (
                                    <Animated.View
                                        key={boss.id}
                                        style={[styles.deadlineItem, styles.bossDeadline, { opacity: fadeAnim }]}
                                    >
                                        <View style={[styles.deadlineMarker, { backgroundColor: colors.alertRed }]} />
                                        <View style={styles.deadlineInfo}>
                                            <Text style={[styles.deadlineTitle, { color: colors.alertRed }]}>
                                                ⚔ {boss.name}
                                            </Text>
                                            <Text style={styles.deadlineDate}>
                                                {boss.deadline ? new Date(boss.deadline).toLocaleDateString() : 'NO DEADLINE'}
                                            </Text>
                                        </View>
                                    </Animated.View>
                                ))}
                            </>
                        )}
                    </ScrollView>
                </View>
            </View>
        </SystemWindow>
    );
};

const styles = StyleSheet.create({
    content: {
        minWidth: 320,
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
        paddingVertical: spacing.xs,
    },
    dayHeaderText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xs,
        color: colors.dimmed,
        letterSpacing: 1,
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
        position: 'relative',
    },
    todayCell: {
        borderColor: colors.electricCyan,
        backgroundColor: 'rgba(0, 234, 255, 0.1)',
        shadowColor: colors.electricCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 3,
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
    deadlineDayText: {
        color: colors.alertRed,
    },
    deadlineIndicator: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 14,
        height: 14,
        backgroundColor: colors.alertRed,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deadlineIcon: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: 10,
        color: colors.voidBlack,
    },
    upcomingSection: {
        marginTop: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.dimmed,
        paddingTop: spacing.md,
        maxHeight: 150,
    },
    sectionTitle: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.electricCyan,
        letterSpacing: 2,
        marginBottom: spacing.sm,
    },
    deadlineList: {
        maxHeight: 120,
    },
    emptyText: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
        textAlign: 'center',
        letterSpacing: 1,
    },
    deadlineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.dimmed,
    },
    bossDeadline: {
        borderBottomColor: colors.alertRed,
    },
    deadlineMarker: {
        width: 8,
        height: 8,
        backgroundColor: colors.gold,
        marginRight: spacing.sm,
    },
    deadlineInfo: {
        flex: 1,
    },
    deadlineTitle: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.sm,
        color: colors.paleCyan,
        letterSpacing: 1,
    },
    deadlineDate: {
        fontFamily: 'Rajdhani-Regular',
        fontSize: fontSizes.xs,
        color: colors.dimmed,
        letterSpacing: 1,
    },
});

export default CalendarModal;
