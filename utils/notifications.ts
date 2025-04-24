import messaging from "@react-native-firebase/messaging";
import { Platform, Alert, Linking } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestUserPermission = async () => {
  try {
    if (!Device.isDevice) {
      return false; // Exit if running in simulator/emulator
    }

    // Configure notification settings
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "custom_notification.wav", // Custom sound file
    });

    // Request permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
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
        console.log("✅ Device registered for notifications");
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
      const { title, body, data } = notification.request.content;

      // Show in-app popup
      Alert.alert(title || "New Notification", body || "", [
        { text: "OK", onPress: () => handleNotificationPress(data) },
      ]);
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
    console.log("Background message:", remoteMessage);
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

const handleNotificationPress = (data: any) => {
  // Handle notification press based on data
  if (data?.type === "cashback") {
    // Navigate to cashback screen
  } else if (data?.type === "bill") {
    // Navigate to bill details
  }
};
