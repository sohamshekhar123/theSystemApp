// Quest Log Modal - Daily Quests and Boss Raids
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Animated } from 'react-native';
import { SystemWindow, QuestItem, ProgressBar, GlowButton } from '../components';
import { useGame } from '../context/GameContext';
import { colors, fontSizes, spacing, touchTarget } from '../styles/theme';
import { Attribute } from '../types';

interface QuestLogModalProps {
    visible: boolean;
    onClose: () => void;
}

type TabType = 'daily' | 'boss';

export const QuestLogModal: React.FC<QuestLogModalProps> = ({ visible, onClose }) => {
    const { state, dispatch } = useGame();
    const [activeTab, setActiveTab] = useState<TabType>('daily');
    const [showAddQuest, setShowAddQuest] = useState(false);
    const [newQuestTitle, setNewQuestTitle] = useState('');
    const [newQuestAttribute, setNewQuestAttribute] = useState<Attribute['name']>('STR');
    const fadeAnim = useRef(new Animated.Value(0)).current;

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

    const handleCompleteQuest = (questId: string) => {
        dispatch({ type: 'COMPLETE_DAILY_QUEST', payload: questId });
    };

    const handleAddQuest = () => {
        if (newQuestTitle.trim()) {
            dispatch({
                type: 'ADD_DAILY_QUEST',
                payload: {
                    title: newQuestTitle.trim().toUpperCase(),
                    description: '',
                    attribute: newQuestAttribute,
                    xpReward: 25,
                },
            });
            setNewQuestTitle('');
            setShowAddQuest(false);
        }
    };

    const handleCompleteBossSubQuest = (bossId: string, subQuestId: string) => {
        dispatch({
            type: 'COMPLETE_SUB_QUEST',
            payload: { bossId, subQuestId },
        });
    };

    const incompleteQuests = state.dailyQuests.filter(q => !q.isComplete);
    const completeQuests = state.dailyQuests.filter(q => q.isComplete);
    const activeBosses = state.bossRaids.filter(b => !b.isDefeated);

    return (
        <SystemWindow visible={visible} onClose={onClose}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>QUEST LOG</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>×</Text>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
                        onPress={() => setActiveTab('daily')}
                    >
                        <Text style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}>
                            DAILY QUESTS
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'boss' && styles.activeTab]}
                        onPress={() => setActiveTab('boss')}
                    >
                        <Text style={[styles.tabText, activeTab === 'boss' && styles.activeTabText]}>
                            BOSS RAIDS
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Daily Quests Tab */}
                {activeTab === 'daily' && (
                    <ScrollView style={styles.questList} showsVerticalScrollIndicator={false}>
                        {/* Warning */}
                        <Animated.View style={[styles.warning, { opacity: fadeAnim }]}>
                            <Text style={styles.warningText}>
                                ⚠ WARNING: FAILURE TO COMPLETE WILL RESULT IN PENALTY.
                            </Text>
                        </Animated.View>

                        {/* Add Quest */}
                        {showAddQuest ? (
                            <Animated.View style={[styles.addQuestForm, { opacity: fadeAnim }]}>
                                <TextInput
                                    style={styles.questInput}
                                    value={newQuestTitle}
                                    onChangeText={setNewQuestTitle}
                                    placeholder="ENTER QUEST..."
                                    placeholderTextColor={colors.dimmed}
                                    autoCapitalize="characters"
                                />
                                <View style={styles.attributeSelect}>
                                    {(['STR', 'INT', 'SOC', 'HLTH'] as const).map(attr => (
                                        <TouchableOpacity
                                            key={attr}
                                            style={[
                                                styles.attrButton,
                                                newQuestAttribute === attr && styles.attrButtonActive,
                                            ]}
                                            onPress={() => setNewQuestAttribute(attr)}
                                        >
                                            <Text style={[
                                                styles.attrButtonText,
                                                newQuestAttribute === attr && styles.attrButtonTextActive,
                                            ]}>
                                                {attr}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <View style={styles.formButtons}>
                                    <GlowButton title="ADD" onPress={handleAddQuest} size="small" />
                                    <GlowButton
                                        title="CANCEL"
                                        onPress={() => setShowAddQuest(false)}
                                        variant="danger"
                                        size="small"
                                    />
                                </View>
                            </Animated.View>
                        ) : (
                            <TouchableOpacity style={styles.addButton} onPress={() => setShowAddQuest(true)}>
                                <Text style={styles.addButtonText}>+ ADD QUEST</Text>
                            </TouchableOpacity>
                        )}

                        {/* Incomplete Quests */}
                        {incompleteQuests.length > 0 && (
                            <View style={styles.questSection}>
                                <Text style={styles.sectionLabel}>[INCOMPLETE]</Text>
                                {incompleteQuests.map((quest) => (
                                    <View key={quest.id}>
                                        <QuestItem quest={quest} onComplete={handleCompleteQuest} />
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Complete Quests */}
                        {completeQuests.length > 0 && (
                            <View style={styles.questSection}>
                                <Text style={[styles.sectionLabel, { color: colors.gold }]}>[COMPLETE]</Text>
                                {completeQuests.map((quest) => (
                                    <View key={quest.id}>
                                        <QuestItem quest={quest} onComplete={handleCompleteQuest} />
                                    </View>
                                ))}
                            </View>
                        )}

                        {state.dailyQuests.length === 0 && (
                            <Text style={styles.emptyText}>NO QUESTS ASSIGNED.</Text>
                        )}
                    </ScrollView>
                )}

                {/* Boss Raids Tab */}
                {activeTab === 'boss' && (
                    <ScrollView style={styles.questList} showsVerticalScrollIndicator={false}>
                        {activeBosses.map((boss) => (
                            <Animated.View key={boss.id} style={[styles.bossCard, { opacity: fadeAnim }]}>
                                <Text style={styles.bossName}>⚔ {boss.name}</Text>
                                <Text style={styles.bossDescription}>{boss.description}</Text>

                                {/* Boss HP Bar */}
                                <ProgressBar
                                    current={boss.currentHp}
                                    max={boss.totalHp}
                                    variant="boss"
                                    label="BOSS HP"
                                    height={20}
                                    style={styles.bossHpBar}
                                />

                                {/* Sub Quests */}
                                <View style={styles.subQuests}>
                                    {boss.subQuests.map(sq => (
                                        <TouchableOpacity
                                            key={sq.id}
                                            style={[styles.subQuest, sq.isComplete && styles.subQuestComplete]}
                                            onPress={() => !sq.isComplete && handleCompleteBossSubQuest(boss.id, sq.id)}
                                            disabled={sq.isComplete}
                                        >
                                            <View style={[styles.subQuestCheck, sq.isComplete && styles.subQuestCheckComplete]}>
                                                {sq.isComplete && <Text style={styles.checkmark}>✓</Text>}
                                            </View>
                                            <Text style={[styles.subQuestText, sq.isComplete && styles.subQuestTextComplete]}>
                                                {sq.title}
                                            </Text>
                                            <Text style={styles.subQuestXp}>+{sq.xpReward}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </Animated.View>
                        ))}

                        {activeBosses.length === 0 && (
                            <Text style={styles.emptyText}>NO ACTIVE BOSS RAIDS.</Text>
                        )}
                    </ScrollView>
                )}
            </View>
        </SystemWindow>
    );
};

const styles = StyleSheet.create({
    content: {
        maxHeight: 500,
        minWidth: 300,
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
    tabs: {
        flexDirection: 'row',
        marginBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.dimmed,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: colors.electricCyan,
    },
    tabText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
        letterSpacing: 2,
    },
    activeTabText: {
        color: colors.electricCyan,
    },
    questList: {
        maxHeight: 380,
    },
    warning: {
        backgroundColor: 'rgba(255, 51, 51, 0.1)',
        borderWidth: 1,
        borderColor: colors.alertRed,
        padding: spacing.sm,
        marginBottom: spacing.md,
    },
    warningText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.xs,
        color: colors.alertRed,
        textAlign: 'center',
        letterSpacing: 1,
    },
    addButton: {
        borderWidth: 1,
        borderColor: colors.electricCyan,
        borderStyle: 'dashed',
        padding: spacing.md,
        alignItems: 'center',
        marginBottom: spacing.md,
        minHeight: touchTarget.minHeight,
        justifyContent: 'center',
    },
    addButtonText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.md,
        color: colors.electricCyan,
        letterSpacing: 2,
    },
    addQuestForm: {
        borderWidth: 1,
        borderColor: colors.electricCyan,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    questInput: {
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
    attributeSelect: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    attrButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderWidth: 1,
        borderColor: colors.dimmed,
        alignItems: 'center',
    },
    attrButtonActive: {
        borderColor: colors.electricCyan,
        backgroundColor: 'rgba(0, 234, 255, 0.1)',
    },
    attrButtonText: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.dimmed,
        letterSpacing: 1,
    },
    attrButtonTextActive: {
        color: colors.electricCyan,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacing.sm,
    },
    questSection: {
        marginBottom: spacing.md,
    },
    sectionLabel: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.alertRed,
        letterSpacing: 2,
        marginBottom: spacing.sm,
    },
    emptyText: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.md,
        color: colors.dimmed,
        textAlign: 'center',
        marginTop: spacing.xl,
        letterSpacing: 1,
    },
    bossCard: {
        borderWidth: 1,
        borderColor: colors.alertRed,
        padding: spacing.md,
        marginBottom: spacing.md,
        backgroundColor: 'rgba(255, 51, 51, 0.05)',
    },
    bossName: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.lg,
        color: colors.alertRed,
        letterSpacing: 2,
        marginBottom: spacing.xs,
    },
    bossDescription: {
        fontFamily: 'Rajdhani-Regular',
        fontSize: fontSizes.sm,
        color: colors.paleCyan,
        marginBottom: spacing.md,
    },
    bossHpBar: {
        marginBottom: spacing.md,
    },
    subQuests: {
        borderTopWidth: 1,
        borderTopColor: colors.dimmed,
        paddingTop: spacing.md,
    },
    subQuest: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        minHeight: touchTarget.minHeight,
    },
    subQuestComplete: {
        opacity: 0.5,
    },
    subQuestCheck: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: colors.dimmed,
        marginRight: spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subQuestCheckComplete: {
        borderColor: colors.gold,
        backgroundColor: colors.gold,
    },
    checkmark: {
        color: colors.voidBlack,
        fontSize: fontSizes.sm,
        fontWeight: 'bold',
    },
    subQuestText: {
        flex: 1,
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: fontSizes.sm,
        color: colors.paleCyan,
        letterSpacing: 1,
    },
    subQuestTextComplete: {
        textDecorationLine: 'line-through',
        color: colors.dimmed,
    },
    subQuestXp: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: fontSizes.sm,
        color: colors.gold,
    },
});

export default QuestLogModal;
