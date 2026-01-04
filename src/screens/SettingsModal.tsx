// Settings Modal - User configuration
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
import { SystemWindow, GlowButton } from '../components';
import { useGame } from '../context/GameContext';
import storage from '../storage/storage';
import { colors, fontSizes, spacing, touchTarget } from '../styles/theme';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
    const { state, dispatch } = useGame();
    const [penaltyInput, setPenaltyInput] = useState(state.penaltyTask?.title || '');
    const [showPenaltyForm, setShowPenaltyForm] = useState(false);

    const handleTogglePenalty = (value: boolean) => {
        dispatch({ type: 'UPDATE_SETTINGS', payload: { penaltyEnabled: value } });
    };

    const handleToggleSound = (value: boolean) => {
        dispatch({ type: 'UPDATE_SETTINGS', payload: { soundEnabled: value } });
    };

    const handleToggleHaptic = (value: boolean) => {
        dispatch({ type: 'UPDATE_SETTINGS', payload: { hapticEnabled: value } });
    };

    const handleSavePenalty = () => {
        if (penaltyInput.trim()) {
            dispatch({
                type: 'SET_PENALTY_TASK',
                payload: {
                    id: Date.now().toString(),
                    title: penaltyInput.trim().toUpperCase(),
                    description: '',
                },
            });
            setShowPenaltyForm(false);
        }
    };

    const handleResetData = () => {
        Alert.alert(
            'RESET ALL DATA',
            'THIS WILL DELETE ALL YOUR PROGRESS. THIS ACTION CANNOT BE UNDONE.',
            [
                { text: 'CANCEL', style: 'cancel' },
                {
                    text: 'RESET',
                    style: 'destructive',
                    onPress: async () => {
                        await storage.resetAllData();
                        dispatch({ type: 'RESET_ALL' });
                        onClose();
                    },
                },
            ]
        );
    };

    return (
        <SystemWindow visible={visible} onClose={onClose}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>SETTINGS</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>×</Text>
                    </TouchableOpacity>
                </View>

                {/* Penalty Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>THE PENALTY</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>PENALTY ENABLED</Text>
                            <Text style={styles.settingDesc}>
                                Activate penalty for incomplete daily quests
                            </Text>
                        </View>
                        <Switch
                            value={state.settings.penaltyEnabled}
                            onValueChange={handleTogglePenalty}
                            trackColor={{ false: colors.dimmed, true: colors.alertRed }}
                            thumbColor={colors.paleCyan}
                        />
                    </View>

                    <View style={styles.penaltyTaskSection}>
                        <Text style={styles.settingLabel}>PENALTY TASK:</Text>
                        {state.penaltyTask ? (
                            <View style={styles.penaltyDisplay}>
                                <Text style={styles.penaltyText}>{state.penaltyTask.title}</Text>
                                <TouchableOpacity onPress={() => setShowPenaltyForm(true)}>
                                    <Text style={styles.editText}>EDIT</Text>
                                </TouchableOpacity>
                            </View>
                        ) : showPenaltyForm ? (
                            <View style={styles.penaltyForm}>
                                <TextInput
                                    style={styles.penaltyInput}
                                    value={penaltyInput}
                                    onChangeText={setPenaltyInput}
                                    placeholder="E.G. RUN 5KM"
                                    placeholderTextColor={colors.dimmed}
                                    autoCapitalize="characters"
                                />
                                <View style={styles.formButtons}>
                                    <GlowButton title="SAVE" onPress={handleSavePenalty} size="small" />
                                    <GlowButton
                                        title="CANCEL"
                                        onPress={() => setShowPenaltyForm(false)}
                                        variant="danger"
                                        size="small"
                                    />
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.setPenaltyButton}
                                onPress={() => setShowPenaltyForm(true)}
                            >
                                <Text style={styles.setPenaltyText}>+ SET PENALTY TASK</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Audio/Haptic Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>FEEDBACK</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>SOUND EFFECTS</Text>
                        </View>
                        <Switch
                            value={state.settings.soundEnabled}
                            onValueChange={handleToggleSound}
                            trackColor={{ false: colors.dimmed, true: colors.electricCyan }}
                            thumbColor={colors.paleCyan}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>HAPTIC FEEDBACK</Text>
                        </View>
                        <Switch
                            value={state.settings.hapticEnabled}
                            onValueChange={handleToggleHaptic}
                            trackColor={{ false: colors.dimmed, true: colors.electricCyan }}
                            thumbColor={colors.paleCyan}
                        />
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Danger Zone */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.alertRed }]}>DANGER ZONE</Text>
                    <GlowButton
                        title="RESET ALL DATA"
                        onPress={handleResetData}
                        variant="danger"
                    />
                </View>

                {/* Version */}
                <Text style={styles.version}>VERSION 1.0.0</Text>
            </View>
        </SystemWindow>
    );
};

const styles = StyleSheet.create({
    content: {
        minWidth: 300,
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
    section: {
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.electricCyan,
        letterSpacing: 2,
        marginBottom: spacing.md,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        minHeight: touchTarget.minHeight,
    },
    settingInfo: {
        flex: 1,
        marginRight: spacing.md,
    },
    settingLabel: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        color: colors.paleCyan,
        letterSpacing: 1,
    },
    settingDesc: {
        fontFamily: 'Rajdhani-Regular',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
        marginTop: 2,
    },
    penaltyTaskSection: {
        marginTop: spacing.sm,
    },
    penaltyDisplay: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: colors.alertRed,
        marginTop: spacing.xs,
    },
    penaltyText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.alertRed,
        letterSpacing: 1,
    },
    editText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.electricCyan,
        letterSpacing: 1,
    },
    penaltyForm: {
        marginTop: spacing.sm,
    },
    penaltyInput: {
        borderWidth: 1,
        borderColor: colors.dimmed,
        backgroundColor: 'transparent',
        color: colors.paleCyan,
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        padding: spacing.sm,
        marginBottom: spacing.sm,
        letterSpacing: 1,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacing.sm,
    },
    setPenaltyButton: {
        borderWidth: 1,
        borderColor: colors.alertRed,
        borderStyle: 'dashed',
        padding: spacing.md,
        alignItems: 'center',
        marginTop: spacing.xs,
        minHeight: touchTarget.minHeight,
        justifyContent: 'center',
    },
    setPenaltyText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.alertRed,
        letterSpacing: 2,
    },
    divider: {
        height: 1,
        backgroundColor: colors.dimmed,
        marginVertical: spacing.md,
    },
    version: {
        fontFamily: 'Rajdhani-Regular',
        fontSize: fontSizes.xs,
        color: colors.dimmed,
        textAlign: 'center',
        marginTop: spacing.lg,
        letterSpacing: 1,
    },
});

export default SettingsModal;
