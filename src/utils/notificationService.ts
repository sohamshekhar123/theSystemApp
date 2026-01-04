// Quest notification service using expo-notifications
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { DailyQuest, BossRaid } from '../types';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        return finalStatus === 'granted';
    } catch (error) {
        console.warn('Error requesting notification permissions:', error);
        return false;
    }
};

// Schedule quest reminder notification
export const scheduleQuestReminder = async (
    title: string,
    body: string,
    triggerDate: Date
): Promise<string | null> => {
    try {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) return null;

        // Don't schedule if date is in the past
        if (triggerDate.getTime() <= Date.now()) return null;

        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: `⚠️ ${title}`,
                body,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                data: { type: 'quest_reminder' },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate,
            },
        });

        return id;
    } catch (error) {
        console.warn('Error scheduling notification:', error);
        return null;
    }
};

// Check and notify for uncompleted quests
export const checkAndNotifyUncompletedQuests = async (
    dailyQuests: DailyQuest[],
    bossRaids: BossRaid[]
): Promise<void> => {
    const now = new Date();
    const incompleteDaily = dailyQuests.filter(q => !q.isComplete);
    const activeSideQuests = bossRaids.filter(b => !b.isDefeated);

    // Schedule reminder 1 hour before daily quest deadline
    for (const quest of incompleteDaily) {
        const deadline = new Date(quest.deadline);
        const reminderTime = new Date(deadline.getTime() - 60 * 60 * 1000); // 1 hour before

        if (reminderTime > now) {
            await scheduleQuestReminder(
                'QUEST DEADLINE APPROACHING',
                `"${quest.title}" must be completed soon!`,
                reminderTime
            );
        }
    }

    // Schedule reminder 2 hours before side quest deadline
    for (const quest of activeSideQuests) {
        const deadline = new Date(quest.deadline);
        const reminderTime = new Date(deadline.getTime() - 2 * 60 * 60 * 1000); // 2 hours before

        if (reminderTime > now) {
            await scheduleQuestReminder(
                'SIDE QUEST DEADLINE',
                `"${quest.name}" deadline approaching!`,
                reminderTime
            );
        }
    }
};

// Show immediate notification for uncompleted quests
export const showUncompletedQuestWarning = async (count: number): Promise<void> => {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission || count === 0) return;

    await Notifications.scheduleNotificationAsync({
        content: {
            title: '⚠️ SYSTEM ALERT',
            body: `You have ${count} uncompleted quest${count > 1 ? 's' : ''}! Complete them to avoid penalty.`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            data: { type: 'quest_warning' },
        },
        trigger: null, // Show immediately
    });
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async (): Promise<void> => {
    await Notifications.cancelAllScheduledNotificationsAsync();
};

export default {
    requestNotificationPermissions,
    scheduleQuestReminder,
    checkAndNotifyUncompletedQuests,
    showUncompletedQuestWarning,
    cancelAllNotifications,
};
