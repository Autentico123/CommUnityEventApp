import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useAuth } from "./AuthContext";
import Toast from "react-native-toast-message";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // Register for push notifications
  useEffect(() => {
    if (isAuthenticated && user) {
      registerForPushNotificationsAsync().then((token) => {
        setExpoPushToken(token);
        console.log("📱 Push token:", token);
      });

      // This listener is fired whenever a notification is received while app is foregrounded
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("🔔 Notification received:", notification);
          setNotification(notification);
        });

      // This listener is fired whenever a user taps on or interacts with a notification
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("👆 Notification tapped:", response);
          // Handle notification tap (e.g., navigate to specific screen)
          handleNotificationResponse(response);
        });

      return () => {
        if (notificationListener.current) {
          notificationListener.current.remove();
        }
        if (responseListener.current) {
          responseListener.current.remove();
        }
      };
    }
  }, [isAuthenticated, user]);

  // Handle notification tap
  const handleNotificationResponse = (response) => {
    const data = response.notification.request.content.data;

    if (data.type === "event") {
      // Navigate to event details
      console.log("Navigate to event:", data.eventId);
    } else if (data.type === "chat") {
      // Navigate to chat
      console.log("Navigate to chat:", data.chatUserId);
    }
  };

  // Schedule a local notification
  const scheduleNotification = async (
    title,
    body,
    data = {},
    trigger = null
  ) => {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: trigger || null, // null = immediate
      });

      console.log("📅 Notification scheduled:", id);
      return id;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      Toast.show({
        type: "error",
        text1: "Notification Error",
        text2: "Failed to schedule notification",
      });
      return null;
    }
  };

  // Schedule event reminder
  const scheduleEventReminder = async (event, minutesBefore = 30) => {
    try {
      const eventDate = new Date(event.date);
      const reminderTime = new Date(
        eventDate.getTime() - minutesBefore * 60000
      );
      const now = new Date();

      // Don't schedule if reminder time is in the past
      if (reminderTime <= now) {
        console.log("⏰ Reminder time is in the past, not scheduling");
        return null;
      }

      const trigger = {
        date: reminderTime,
      };

      return await scheduleNotification(
        `Event Reminder: ${event.title}`,
        `Starting in ${minutesBefore} minutes at ${event.location}`,
        {
          type: "event",
          eventId: event._id || event.id,
        },
        trigger
      );
    } catch (error) {
      console.error("Error scheduling event reminder:", error);
      return null;
    }
  };

  // Cancel a notification
  const cancelNotification = async (notificationId) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log("❌ Notification cancelled:", notificationId);
    } catch (error) {
      console.error("Error cancelling notification:", error);
    }
  };

  // Cancel all notifications
  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("❌ All notifications cancelled");
    } catch (error) {
      console.error("Error cancelling all notifications:", error);
    }
  };

  // Get all scheduled notifications
  const getScheduledNotifications = async () => {
    try {
      const notifications =
        await Notifications.getAllScheduledNotificationsAsync();
      console.log("📋 Scheduled notifications:", notifications.length);
      return notifications;
    } catch (error) {
      console.error("Error getting scheduled notifications:", error);
      return [];
    }
  };

  // Send immediate notification (for testing or instant alerts)
  const sendImmediateNotification = async (title, body, data = {}) => {
    return await scheduleNotification(title, body, data, null);
  };

  const value = {
    expoPushToken,
    notification,
    scheduleNotification,
    scheduleEventReminder,
    cancelNotification,
    cancelAllNotifications,
    getScheduledNotifications,
    sendImmediateNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Helper function to register for push notifications
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  // Check if we have permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permission if we don't have it
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("⚠️ Failed to get push token for push notification!");
    Toast.show({
      type: "info",
      text1: "Notifications Disabled",
      text2: "Enable notifications in settings to get event reminders",
    });
    return "";
  }

  // Get the token
  try {
    // For Expo Go, we can skip projectId. Local notifications will still work.
    // For production builds, add projectId to app.json under "expo.extra.eas.projectId"
    const tokenData = await Notifications.getExpoPushTokenAsync();
    token = tokenData.data;
    console.log("✅ Push token obtained:", token);
  } catch (error) {
    // If projectId is missing (common in Expo Go), local notifications still work
    if (error.message?.includes("projectId")) {
      console.log("ℹ️ No projectId configured - local notifications only");
      console.log("ℹ️ Remote push notifications require EAS project setup");
    } else {
      console.error("Error getting push token:", error);
    }
    token = "";
  }

  return token;
}
