// Hook to manage quest notifications
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useGame } from '../context/GameContext';
import {
    requestNotificationPermissions,
    checkAndNotifyUncompletedQuests,
    showUncompletedQuestWarning,
} from '../utils/notificationService';

export const useQuestNotifications = () => {
    const { state, dispatch } = useGame();
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        // Request permissions on mount but don't block if it fails
        requestNotificationPermissions().catch(() => { });
    }, []);

    useEffect(() => {
        // Schedule notifications when quests change (for background reminders)
        const incompleteCount = state.dailyQuests.filter(q => !q.isComplete).length;
        const activeSideQuests = state.bossRaids.filter(b => !b.isDefeated);

        // Schedule background pings
        checkAndNotifyUncompletedQuests(state.dailyQuests, state.bossRaids).catch(() => { });

        // Show warning if there are uncompleted quests when app comes to foreground
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                // App has come to the foreground
                const totalIncomplete = incompleteCount + activeSideQuests.length;
                if (totalIncomplete > 0) {
                    dispatch({
                        type: 'SHOW_NOTIFICATION',
                        payload: {
                            id: Date.now().toString(),
                            title: 'SYSTEM WARNING',
                            message: `You have ${totalIncomplete} uncompleted quest${totalIncomplete > 1 ? 's' : ''}! Complete them to avoid penalty.`,
                            type: 'warning',
                            showConfirm: true,
                        }
                    });
                }
            }
            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [state.dailyQuests, state.bossRaids, dispatch]);
};

export default useQuestNotifications;
