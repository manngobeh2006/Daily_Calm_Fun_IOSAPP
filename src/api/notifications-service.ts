import * as Notifications from "expo-notifications";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
    return false;
  }
};

export const scheduleDailyReminder = async (hour: number = 9, minute: number = 0): Promise<void> => {
  try {
    // Cancel existing daily reminders
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Schedule new daily reminder
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Calm & Fun 🌟",
        body: "Your daily activities are ready! Take a moment for yourself today.",
        data: { type: "daily_reminder" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    
    console.log("Daily reminder scheduled for", `${hour}:${minute.toString().padStart(2, "0")}`);
  } catch (error) {
    console.error("Error scheduling daily reminder:", error);
  }
};

export const scheduleStreakReminder = async (): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Don't break your streak! 🔥",
        body: "You haven't completed your activities today. Keep your momentum going!",
        data: { type: "streak_reminder" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60 * 60 * 18, // 18 hours from now
      },
    });
  } catch (error) {
    console.error("Error scheduling streak reminder:", error);
  }
};

export const scheduleMilestoneNotification = async (milestone: string): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Achievement Unlocked! 🏆",
        body: `Congratulations! You've earned the ${milestone} badge!`,
        data: { type: "milestone", milestone },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2, // Show immediately
      },
    });
  } catch (error) {
    console.error("Error scheduling milestone notification:", error);
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Error canceling notifications:", error);
  }
};

export const initializeNotifications = async (): Promise<void> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    
    if (hasPermission) {
      // Schedule default daily reminder
      await scheduleDailyReminder();
    }
  } catch (error) {
    console.error("Error initializing notifications:", error);
  }
};