// AsyncStorage wrapper for local data persistence
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, DEFAULT_PLAYER, DEFAULT_SETTINGS } from '../types';

const STORAGE_KEYS = {
    GAME_STATE: '@system_game_state',
    PLAYER: '@system_player',
    DAILY_QUESTS: '@system_daily_quests',
    BOSS_RAIDS: '@system_boss_raids',
    DEADLINES: '@system_deadlines',
    SETTINGS: '@system_settings',
    IS_FIRST_LAUNCH: '@system_first_launch',
    LAST_DAILY_RESET: '@system_last_reset',
    PENALTY_TASK: '@system_penalty_task',
};

// Initialize default game state
export const getDefaultGameState = (): GameState => ({
    player: { ...DEFAULT_PLAYER, createdAt: new Date().toISOString(), lastActive: new Date().toISOString() },
    dailyQuests: [],
    bossRaids: [],
    deadlines: [],
    penaltyTask: null,
    isPenaltyActive: false,
    isFirstLaunch: true,
    isConfigured: false,
    lastDailyReset: new Date().toISOString(),
    settings: DEFAULT_SETTINGS,
});

// Save entire game state
export const saveGameState = async (state: GameState): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
    } catch (error) {
        console.error('Error saving game state:', error);
        throw error;
    }
};

// Load game state
export const loadGameState = async (): Promise<GameState | null> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading game state:', error);
        return null;
    }
};

// Check if first launch
export const isFirstLaunch = async (): Promise<boolean> => {
    try {
        const state = await loadGameState();
        return state === null || state.isFirstLaunch;
    } catch (error) {
        return true;
    }
};

// Mark awakening complete
export const markAwakeningComplete = async (playerName: string): Promise<GameState> => {
    const state = await loadGameState() || getDefaultGameState();
    state.isFirstLaunch = false;
    state.player.name = playerName;
    await saveGameState(state);
    return state;
};

// Reset all data
export const resetAllData = async (): Promise<void> => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('Error resetting data:', error);
        throw error;
    }
};

// Daily quest operations
export const addDailyQuest = async (state: GameState, quest: Omit<GameState['dailyQuests'][0], 'id' | 'createdAt' | 'isComplete'>): Promise<GameState> => {
    const newQuest = {
        ...quest,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        isComplete: false,
    };
    state.dailyQuests.push(newQuest);
    await saveGameState(state);
    return state;
};

export const completeQuest = async (state: GameState, questId: string): Promise<GameState> => {
    const questIndex = state.dailyQuests.findIndex(q => q.id === questId);
    if (questIndex !== -1) {
        state.dailyQuests[questIndex].isComplete = true;
        state.dailyQuests[questIndex].completedAt = new Date().toISOString();

        // Award XP
        const quest = state.dailyQuests[questIndex];
        state.player.attributes[quest.attribute].xp += quest.xpReward;

        // Check for level up
        const attr = state.player.attributes[quest.attribute];
        while (attr.xp >= attr.maxXp) {
            attr.xp -= attr.maxXp;
            attr.level += 1;
            attr.maxXp = Math.floor(attr.maxXp * 1.1); // Increase XP needed for next level
        }

        await saveGameState(state);
    }
    return state;
};

// Boss raid operations
export const addBossRaid = async (state: GameState, boss: Omit<GameState['bossRaids'][0], 'id' | 'createdAt' | 'currentHp' | 'isDefeated'>): Promise<GameState> => {
    const newBoss = {
        ...boss,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        currentHp: boss.totalHp,
        isDefeated: false,
    };
    state.bossRaids.push(newBoss);
    await saveGameState(state);
    return state;
};

export const completeSubQuest = async (state: GameState, bossId: string, subQuestId: string): Promise<GameState> => {
    const bossIndex = state.bossRaids.findIndex(b => b.id === bossId);
    if (bossIndex !== -1) {
        const boss = state.bossRaids[bossIndex];
        const subQuestIndex = boss.subQuests.findIndex(sq => sq.id === subQuestId);
        if (subQuestIndex !== -1) {
            boss.subQuests[subQuestIndex].isComplete = true;
            boss.subQuests[subQuestIndex].completedAt = new Date().toISOString();

            // Damage boss
            const damagePerSubQuest = boss.totalHp / boss.subQuests.length;
            boss.currentHp = Math.max(0, boss.currentHp - damagePerSubQuest);

            // Award XP
            const subQuest = boss.subQuests[subQuestIndex];
            state.player.attributes[subQuest.attribute].xp += subQuest.xpReward;

            // Check for level up
            const attr = state.player.attributes[subQuest.attribute];
            while (attr.xp >= attr.maxXp) {
                attr.xp -= attr.maxXp;
                attr.level += 1;
                attr.maxXp = Math.floor(attr.maxXp * 1.1);
            }

            // Check if boss defeated
            if (boss.currentHp <= 0) {
                boss.isDefeated = true;
                boss.defeatedAt = new Date().toISOString();
            }

            await saveGameState(state);
        }
    }
    return state;
};

export default {
    saveGameState,
    loadGameState,
    isFirstLaunch,
    markAwakeningComplete,
    resetAllData,
    addDailyQuest,
    completeQuest,
    addBossRaid,
    completeSubQuest,
    getDefaultGameState,
};
