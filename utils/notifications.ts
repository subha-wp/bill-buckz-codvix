// @ts-nocheck
import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";

// Request notification permissions
export const requestUserPermission = async () => {
  try {
    if (!Device.isDevice) return false;

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);

      // Get FCM token
      const token = await messaging().getToken();
      if (token) await registerDeviceForNotifications(token);

      return true;
    }

    console.log("User notification permission denied");
    return false;
  } catch (error) {
    console.error("Permission error:", error);
    return false;
  }
};

// Register device token with your backend
const registerDeviceForNotifications = async (token: string) => {
  try {
    const storedToken = await AsyncStorage.getItem("fcmToken");
    if (storedToken !== token) {
      await fetch(
        `${process.env.EXPO_PUBLIC_REST_API}/api/register-push-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            platform: Platform.OS,
            deviceInfo: {
              brand: Device.brand,
              modelName: Device.modelName,
              osVersion: Device.osVersion,
              deviceName: Device.deviceName,
            },
          }),
        }
      );
      await AsyncStorage.setItem("fcmToken", token);
      console.log("FCM Token registered:", token);
    }
  } catch (error) {
    console.error("Registration error:", error);
  }
};

// Create notification channels for Android
export const createNotificationChannel = () => {
  if (Platform.OS === "android") {
    // Default channel
    messaging().createChannel({
      id: "default-channel",
      name: "Default Channel",
      description: "Default notifications channel",
      importance: messaging.Android.Importance.HIGH,
      vibration: true,
      sound: "default",
    });

    // Channel for notifications with images
    messaging().createChannel({
      id: "high-priority",
      name: "High Priority",
      description: "Channel for important notifications with images",
      importance: messaging.Android.Importance.MAX,
      vibration: true,
      sound: "default",
    });
  }
};

// Set up notification listeners
export const setupNotificationListeners = () => {
  // Handle notifications when app is in foreground
  const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
    // Firebase will automatically display the notification when in foreground
    // No need to manually create a notification
  });

  // Handle notification open events
  const unsubscribeNotificationOpen = messaging().onNotificationOpenedApp(
    (remoteMessage) => {
      handleNotificationPress(remoteMessage.data);
    }
  );

  // Check if app was opened from a notification
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "App opened from quit state by notification:",
          remoteMessage
        );
        handleNotificationPress(remoteMessage.data);
      }
    });

  // Handle token refresh
  const unsubscribeTokenRefresh = messaging().onTokenRefresh((token) => {
    registerDeviceForNotifications(token);
  });

  // Return cleanup function
  return () => {
    unsubscribeForeground();
    unsubscribeNotificationOpen();
    unsubscribeTokenRefresh();
  };
};

// Handle notification press actions
const handleNotificationPress = (data: any) => {
  if (data?.type === "cashback") {
    // Handle cashback notification
    // Navigation logic here
  } else if (data?.type === "bill") {
    // Handle bill notification
    // Navigation logic here
  } else {
    console.log("Handling general notification");
    // Default handling
  }
};
