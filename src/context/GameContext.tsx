// Global game state context
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { GameState, DailyQuest, BossRaid, SubQuest, Player, PenaltyTask, GameSettings } from '../types';
import storage, { getDefaultGameState } from '../storage/storage';
import { calculateRank, getTotalLevels } from '../utils/rankCalculator';

// Action types
type GameAction =
    | { type: 'LOAD_STATE'; payload: GameState }
    | { type: 'SET_PLAYER_NAME'; payload: string }
    | { type: 'COMPLETE_AWAKENING' }
    | { type: 'COMPLETE_CONFIGURATION' }
    | { type: 'ADD_DAILY_QUEST'; payload: Omit<DailyQuest, 'id' | 'createdAt' | 'isComplete' | 'isCore'> }
    | { type: 'ADD_CORE_QUEST'; payload: Omit<DailyQuest, 'id' | 'createdAt' | 'isComplete' | 'isCore'> }
    | { type: 'COMPLETE_DAILY_QUEST'; payload: string }
    | { type: 'DELETE_DAILY_QUEST'; payload: string }
    | { type: 'ADD_BOSS_RAID'; payload: Omit<BossRaid, 'id' | 'createdAt' | 'currentHp' | 'isDefeated'> }
    | { type: 'COMPLETE_SUB_QUEST'; payload: { bossId: string; subQuestId: string } }
    | { type: 'DELETE_BOSS_RAID'; payload: string }
    | { type: 'SET_PENALTY_TASK'; payload: Omit<PenaltyTask, 'id'> }
    | { type: 'ACTIVATE_PENALTY' }
    | { type: 'COMPLETE_PENALTY' }
    | { type: 'UPDATE_SETTINGS'; payload: Partial<GameSettings> }
    | { type: 'UPDATE_HP_MP'; payload: { hp?: number; mp?: number } }
    | { type: 'RESET_DAILY_QUESTS' }
    | { type: 'RESET_ALL' };


// Game reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'LOAD_STATE':
            return action.payload;

        case 'SET_PLAYER_NAME':
            return {
                ...state,
                player: { ...state.player, name: action.payload },
            };

        case 'COMPLETE_AWAKENING':
            return {
                ...state,
                isFirstLaunch: false,
            };

        case 'COMPLETE_CONFIGURATION':
            return {
                ...state,
                isConfigured: true,
            };

        case 'ADD_DAILY_QUEST': {
            // Get end of day deadline for daily quests
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            const newQuest: DailyQuest = {
                ...action.payload,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                isComplete: false,
                isCore: false,
                deadline: action.payload.deadline || today.toISOString(),
            };
            return {
                ...state,
                dailyQuests: [...state.dailyQuests, newQuest],
            };
        }

        case 'ADD_CORE_QUEST': {
            // Core quests are locked and set during initial configuration
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            const coreQuest: DailyQuest = {
                ...action.payload,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                createdAt: new Date().toISOString(),
                isComplete: false,
                isCore: true,
                deadline: action.payload.deadline || today.toISOString(),
            };
            return {
                ...state,
                dailyQuests: [...state.dailyQuests, coreQuest],
            };
        }

        case 'COMPLETE_DAILY_QUEST': {
            const questIndex = state.dailyQuests.findIndex(q => q.id === action.payload);
            if (questIndex === -1) return state;

            const quest = state.dailyQuests[questIndex];
            const updatedQuests = [...state.dailyQuests];
            updatedQuests[questIndex] = {
                ...quest,
                isComplete: true,
                completedAt: new Date().toISOString(),
            };

            // Award XP
            const attr = { ...state.player.attributes[quest.attribute] };
            attr.xp += quest.xpReward;
            while (attr.xp >= attr.maxXp) {
                attr.xp -= attr.maxXp;
                attr.level += 1;
                attr.maxXp = Math.floor(attr.maxXp * 1.1);
            }

            const updatedAttributes = {
                ...state.player.attributes,
                [quest.attribute]: attr,
            };

            const totalLevels = getTotalLevels(updatedAttributes);
            const newRank = calculateRank(totalLevels);

            return {
                ...state,
                dailyQuests: updatedQuests,
                player: {
                    ...state.player,
                    attributes: updatedAttributes,
                    rank: newRank,
                    mp: Math.min(state.player.mp + 5, state.player.maxMp), // Restore MP on quest completion
                },
            };
        }

        case 'DELETE_DAILY_QUEST':
            return {
                ...state,
                dailyQuests: state.dailyQuests.filter(q => q.id !== action.payload),
            };

        case 'ADD_BOSS_RAID': {
            const newBoss: BossRaid = {
                ...action.payload,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                currentHp: action.payload.totalHp,
                isDefeated: false,
            };
            return {
                ...state,
                bossRaids: [...state.bossRaids, newBoss],
            };
        }

        case 'COMPLETE_SUB_QUEST': {
            const { bossId, subQuestId } = action.payload;
            const bossIndex = state.bossRaids.findIndex(b => b.id === bossId);
            if (bossIndex === -1) return state;

            const boss = { ...state.bossRaids[bossIndex] };
            const subQuestIndex = boss.subQuests.findIndex(sq => sq.id === subQuestId);
            if (subQuestIndex === -1) return state;

            const subQuest = boss.subQuests[subQuestIndex];
            const updatedSubQuests = [...boss.subQuests];
            updatedSubQuests[subQuestIndex] = {
                ...subQuest,
                isComplete: true,
                completedAt: new Date().toISOString(),
            };

            // Damage boss
            const damagePerSubQuest = boss.totalHp / boss.subQuests.length;
            boss.currentHp = Math.max(0, boss.currentHp - damagePerSubQuest);
            boss.subQuests = updatedSubQuests;

            // Award XP
            const attr = { ...state.player.attributes[subQuest.attribute] };
            attr.xp += subQuest.xpReward;
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

            const updatedAttributes = {
                ...state.player.attributes,
                [subQuest.attribute]: attr,
            };

            const totalLevels = getTotalLevels(updatedAttributes);
            const newRank = calculateRank(totalLevels);

            const updatedBossRaids = [...state.bossRaids];
            updatedBossRaids[bossIndex] = boss;

            return {
                ...state,
                bossRaids: updatedBossRaids,
                player: {
                    ...state.player,
                    attributes: updatedAttributes,
                    rank: newRank,
                },
            };
        }

        case 'DELETE_BOSS_RAID':
            return {
                ...state,
                bossRaids: state.bossRaids.filter(b => b.id !== action.payload),
            };

        case 'SET_PENALTY_TASK':
            return {
                ...state,
                penaltyTask: {
                    ...action.payload,
                    id: Date.now().toString(),
                },
            };

        case 'ACTIVATE_PENALTY':
            return {
                ...state,
                isPenaltyActive: true,
                player: {
                    ...state.player,
                    hp: Math.max(0, state.player.hp - 20), // Penalty damages HP
                },
            };

        case 'COMPLETE_PENALTY':
            return {
                ...state,
                isPenaltyActive: false,
            };

        case 'UPDATE_SETTINGS':
            return {
                ...state,
                settings: { ...state.settings, ...action.payload },
            };

        case 'UPDATE_HP_MP':
            return {
                ...state,
                player: {
                    ...state.player,
                    hp: action.payload.hp ?? state.player.hp,
                    mp: action.payload.mp ?? state.player.mp,
                },
            };

        case 'RESET_DAILY_QUESTS':
            return {
                ...state,
                dailyQuests: state.dailyQuests.map(q => ({ ...q, isComplete: false, completedAt: undefined })),
                lastDailyReset: new Date().toISOString(),
            };

        case 'RESET_ALL':
            return getDefaultGameState();

        default:
            return state;
    }
};

// Context
interface GameContextType {
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
    isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider
interface GameProviderProps {
    children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, getDefaultGameState());
    const [isLoading, setIsLoading] = React.useState(true);

    // Load saved state on mount
    useEffect(() => {
        const loadState = async () => {
            try {
                const savedState = await storage.loadGameState();
                if (savedState) {
                    dispatch({ type: 'LOAD_STATE', payload: savedState });
                }
            } catch (error) {
                console.error('Failed to load game state:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadState();
    }, []);

    // Save state on changes
    useEffect(() => {
        if (!isLoading) {
            storage.saveGameState(state);
        }
    }, [state, isLoading]);

    return (
        <GameContext.Provider value={{ state, dispatch, isLoading }}>
            {children}
        </GameContext.Provider>
    );
};

// Hook
export const useGame = (): GameContextType => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

export default GameContext;
