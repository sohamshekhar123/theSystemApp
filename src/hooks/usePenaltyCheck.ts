// Penalty check hook - monitors daily quest completion
import { useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useGame } from '../context/GameContext';

export const usePenaltyCheck = () => {
    const { state, dispatch } = useGame();
    const appState = useRef(AppState.currentState);

    // Check if it's past midnight and daily quests are incomplete
    const checkPenalty = useCallback(() => {
        if (!state.settings.penaltyEnabled) return;
        if (state.isPenaltyActive) return;

        const now = new Date();
        const lastReset = new Date(state.lastDailyReset);

        // Check if we've crossed midnight since last reset
        const isSameDay =
            now.getFullYear() === lastReset.getFullYear() &&
            now.getMonth() === lastReset.getMonth() &&
            now.getDate() === lastReset.getDate();

        if (!isSameDay) {
            // Check if there were incomplete quests yesterday
            const incompleteQuests = state.dailyQuests.filter(q => !q.isComplete);

            if (incompleteQuests.length > 0 && state.penaltyTask) {
                // Activate penalty!
                dispatch({ type: 'ACTIVATE_PENALTY' });
            } else {
                // Reset daily quests for new day
                dispatch({ type: 'RESET_DAILY_QUESTS' });
            }
        }
    }, [state, dispatch]);

    // Check penalty when app comes to foreground
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                checkPenalty();
            }
            appState.current = nextAppState;
        });

        // Initial check
        checkPenalty();

        return () => {
            subscription.remove();
        };
    }, [checkPenalty]);

    // Check every minute while app is active
    useEffect(() => {
        const interval = setInterval(checkPenalty, 60000);
        return () => clearInterval(interval);
    }, [checkPenalty]);

    const completePenalty = useCallback(() => {
        dispatch({ type: 'COMPLETE_PENALTY' });
        dispatch({ type: 'RESET_DAILY_QUESTS' });
    }, [dispatch]);

    return {
        isPenaltyActive: state.isPenaltyActive,
        penaltyTask: state.penaltyTask,
        completePenalty,
    };
};

export default usePenaltyCheck;
