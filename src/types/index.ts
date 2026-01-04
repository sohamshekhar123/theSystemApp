// Type definitions for Solo Leveling System App

export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface Attribute {
    name: 'STR' | 'INT' | 'SOC' | 'HLTH';
    fullName: string;
    level: number;
    xp: number;
    maxXp: number;
}

export interface Player {
    id: string;
    name: string;
    rank: Rank;
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    attributes: {
        STR: Attribute;
        INT: Attribute;
        SOC: Attribute;
        HLTH: Attribute;
    };
    createdAt: string;
    lastActive: string;
}

export interface DailyQuest {
    id: string;
    title: string;
    description: string;
    attribute: 'STR' | 'INT' | 'SOC' | 'HLTH';
    xpReward: number;
    isComplete: boolean;
    createdAt: string;
    completedAt?: string;
}

export interface BossRaid {
    id: string;
    name: string;
    description: string;
    totalHp: number;
    currentHp: number;
    subQuests: SubQuest[];
    deadline?: string;
    isDefeated: boolean;
    createdAt: string;
    defeatedAt?: string;
}

export interface SubQuest {
    id: string;
    title: string;
    xpReward: number;
    attribute: 'STR' | 'INT' | 'SOC' | 'HLTH';
    isComplete: boolean;
    completedAt?: string;
}

export interface Deadline {
    id: string;
    title: string;
    date: string;
    bossRaidId?: string;
}

export interface PenaltyTask {
    id: string;
    title: string;
    description: string;
}

export interface GameState {
    player: Player;
    dailyQuests: DailyQuest[];
    bossRaids: BossRaid[];
    deadlines: Deadline[];
    penaltyTask: PenaltyTask | null;
    isPenaltyActive: boolean;
    isFirstLaunch: boolean;
    lastDailyReset: string;
    settings: GameSettings;
}

export interface GameSettings {
    penaltyEnabled: boolean;
    notificationsEnabled: boolean;
    soundEnabled: boolean;
    hapticEnabled: boolean;
}

export const DEFAULT_PLAYER: Player = {
    id: '1',
    name: 'PLAYER',
    rank: 'E',
    hp: 100,
    maxHp: 100,
    mp: 100,
    maxMp: 100,
    attributes: {
        STR: { name: 'STR', fullName: 'Strength', level: 1, xp: 0, maxXp: 100 },
        INT: { name: 'INT', fullName: 'Intelligence', level: 1, xp: 0, maxXp: 100 },
        SOC: { name: 'SOC', fullName: 'Social', level: 1, xp: 0, maxXp: 100 },
        HLTH: { name: 'HLTH', fullName: 'Health', level: 1, xp: 0, maxXp: 100 },
    },
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
};

export const DEFAULT_SETTINGS: GameSettings = {
    penaltyEnabled: true,
    notificationsEnabled: true,
    soundEnabled: true,
    hapticEnabled: true,
};
