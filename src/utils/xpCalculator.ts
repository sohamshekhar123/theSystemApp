// XP calculation utilities

// Base XP required per level
export const BASE_XP_PER_LEVEL = 100;

// XP growth rate per level (10% increase each level)
export const XP_GROWTH_RATE = 1.1;

// Calculate XP required for a specific level
export const getXpForLevel = (level: number): number => {
    return Math.floor(BASE_XP_PER_LEVEL * Math.pow(XP_GROWTH_RATE, level - 1));
};

// Calculate total XP from level 1 to target level
export const getTotalXpToLevel = (level: number): number => {
    let total = 0;
    for (let i = 1; i < level; i++) {
        total += getXpForLevel(i);
    }
    return total;
};

// Award XP and return new level and remaining XP
export const awardXp = (
    currentLevel: number,
    currentXp: number,
    currentMaxXp: number,
    xpAmount: number
): { newLevel: number; newXp: number; newMaxXp: number; leveledUp: boolean; levelsGained: number } => {
    let level = currentLevel;
    let xp = currentXp + xpAmount;
    let maxXp = currentMaxXp;
    let levelsGained = 0;

    // Process level ups
    while (xp >= maxXp) {
        xp -= maxXp;
        level += 1;
        levelsGained += 1;
        maxXp = getXpForLevel(level);
    }

    return {
        newLevel: level,
        newXp: xp,
        newMaxXp: maxXp,
        leveledUp: levelsGained > 0,
        levelsGained,
    };
};

// Calculate XP reward based on quest difficulty
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export const DIFFICULTY_XP_MULTIPLIERS: Record<QuestDifficulty, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
    extreme: 5,
};

export const BASE_QUEST_XP = 25;

export const getQuestXpReward = (difficulty: QuestDifficulty = 'medium'): number => {
    return BASE_QUEST_XP * DIFFICULTY_XP_MULTIPLIERS[difficulty];
};

// Format XP display
export const formatXp = (xp: number, maxXp: number): string => {
    return `${Math.floor(xp)} / ${Math.floor(maxXp)}`;
};

// Get XP progress percentage (0-100)
export const getXpProgress = (xp: number, maxXp: number): number => {
    return (xp / maxXp) * 100;
};
