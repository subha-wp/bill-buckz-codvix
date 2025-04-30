// @ts-nocheck
import messaging from "@react-native-firebase/messaging";
import { Platform, Alert, Linking } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "@/constants/theme";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX, // Maximum priority
  }),
});

export const requestUserPermission = async () => {
  try {
    if (!Device.isDevice) {
      return false; // Exit if running in simulator/emulator
    }

    // Configure notification channel with high importance and visibility
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: theme.colors.primary,
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
        showBadge: true,
      });

      // Create a high priority channel for critical notifications
      await Notifications.setNotificationChannelAsync("high_priority", {
        name: "Important Notifications",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: theme.colors.primary,
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
        showBadge: true,
      });
    }

    // Request permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
        },
      });
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Enable Notifications",
        "Please enable notifications to receive important updates",
        [
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
          {
            text: "Retry",
            onPress: () => requestUserPermission(),
          },
        ]
      );
      return false;
    }

    // Get FCM token
    if (Platform.OS !== "web") {
      const token = await messaging().getToken();
      if (token) {
        await registerDeviceForNotifications(token);
      }
    }

    return true;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

const registerDeviceForNotifications = async (token: string) => {
  try {
    const storedToken = await AsyncStorage.getItem("fcmToken");

    // Only send to server if token has changed
    if (storedToken !== token) {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_REST_API}/api/register-push-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

      if (response.ok) {
        await AsyncStorage.setItem("fcmToken", token);
        
      }
    }
  } catch (error) {
    console.error("Error registering device:", error);
  }
};

export const setupNotificationListeners = () => {
  // Foreground notification handler
  const foregroundSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      // You can handle foreground notifications differently if needed
    }
  );

  // Background/quit state notification handler
  const backgroundSubscription =
    Notifications.addNotificationResponseReceivedListener((response) => {
      const { data } = response.notification.request.content;
      handleNotificationPress(data);
    });

  // FCM background message handler
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    // This ensures proper heads-up display in the background
    if (remoteMessage.notification) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          data: remoteMessage.data,
        },
        trigger: null,
      });
    }
  });

  // FCM foreground message handler
  const messageSubscription = messaging().onMessage(async (remoteMessage) => {
    if (remoteMessage.notification) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          data: remoteMessage.data,
          sound: "custom_notification.wav",
          priority: "max",
          android: {
            channelId: "high_priority",
            smallIcon: "./assets/images/adaptive-icon.png", // Reference to the icon resource name
            priority: "max",
            showWhen: true,
          },
        },
        trigger: null,
      });
    }
  });

  // Cleanup function
  return () => {
    foregroundSubscription.remove();
    backgroundSubscription.remove();
    messageSubscription();
  };
};

// // Function to send local notifications with high priority
export const sendHighPriorityNotification = async (
  title: string,
  body: string,
  data: any = {}
) => {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      priority: "max",
      // For Android, specify the channel
      android: {
        channelId: "high_priority",
        smallIcon: "./assets/images/adaptive-icon.png",
        priority: "max",
      },
    },
    trigger: null, // Send immediately
  });
};

const handleNotificationPress = (data: any) => {
  // Handle notification press based on data
  if (data?.type === "cashback") {
    // Navigate to cashback screen
  } else if (data?.type === "bill") {
    // Navigate to bill details
  }
};
