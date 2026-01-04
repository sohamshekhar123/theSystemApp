// Rank calculation utilities
import { Rank } from '../types';

// Rank thresholds based on total attribute levels
export const RANK_THRESHOLDS: Record<Rank, number> = {
    E: 0,
    D: 40,   // Average 10 per stat
    C: 80,   // Average 20 per stat
    B: 120,  // Average 30 per stat
    A: 160,  // Average 40 per stat
    S: 200,  // Average 50 per stat
};

export const RANK_NAMES: Record<Rank, string> = {
    E: 'E-RANK',
    D: 'D-RANK',
    C: 'C-RANK',
    B: 'B-RANK',
    A: 'A-RANK',
    S: 'S-RANK',
};

export const RANK_ORDER: Rank[] = ['E', 'D', 'C', 'B', 'A', 'S'];

// Calculate rank based on total levels
export const calculateRank = (totalLevels: number): Rank => {
    const ranks = RANK_ORDER.slice().reverse();
    for (const rank of ranks) {
        if (totalLevels >= RANK_THRESHOLDS[rank]) {
            return rank;
        }
    }
    return 'E';
};

// Get total attribute levels
export const getTotalLevels = (attributes: {
    STR: { level: number };
    INT: { level: number };
    SOC: { level: number };
    HLTH: { level: number };
}): number => {
    return attributes.STR.level + attributes.INT.level + attributes.SOC.level + attributes.HLTH.level;
};

// Get progress to next rank (0-1)
export const getRankProgress = (totalLevels: number): number => {
    const currentRank = calculateRank(totalLevels);
    const currentIndex = RANK_ORDER.indexOf(currentRank);

    if (currentRank === 'S') {
        // S-Rank: Show levels beyond S threshold
        return 1;
    }

    const currentThreshold = RANK_THRESHOLDS[currentRank];
    const nextRank = RANK_ORDER[currentIndex + 1];
    const nextThreshold = RANK_THRESHOLDS[nextRank];

    return (totalLevels - currentThreshold) / (nextThreshold - currentThreshold);
};

// Get levels needed for next rank
export const getLevelsToNextRank = (totalLevels: number): number => {
    const currentRank = calculateRank(totalLevels);
    const currentIndex = RANK_ORDER.indexOf(currentRank);

    if (currentRank === 'S') {
        return 0;
    }

    const nextRank = RANK_ORDER[currentIndex + 1];
    return RANK_THRESHOLDS[nextRank] - totalLevels;
};

// Format rank display for S-Rank with level
export const formatRankDisplay = (rank: Rank, totalLevels: number): string => {
    if (rank === 'S') {
        return `S-RANK (LV.${totalLevels})`;
    }
    return RANK_NAMES[rank];
};
