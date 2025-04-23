// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as Contacts from "expo-contacts";
import { Camera } from "expo-camera";
import {
  Camera as CameraIcon,
  MapPin,
  Bell,
  Users,
  CircleCheck as CheckCircle,
  Circle as XCircle,
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";

export default function PermissionsScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const [permissions, setPermissions] = useState({
    camera: false,
    location: false,
    notifications: false,
    contacts: false,
  });

  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    setLoading(true);

    // Camera Permission
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    if (cameraPermission.granted) {
      setPermissions((prev) => ({ ...prev, camera: true }));
    }

    // Location Permission
    const locationPermission =
      await Location.requestForegroundPermissionsAsync();
    if (locationPermission.granted) {
      setPermissions((prev) => ({ ...prev, location: true }));
    }

    // Notification Permission (iOS only, Android grants by default)
    if (Platform.OS === "ios") {
      const notificationPermission =
        await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
        });
      if (notificationPermission.granted) {
        setPermissions((prev) => ({ ...prev, notifications: true }));
      }
    } else {
      setPermissions((prev) => ({ ...prev, notifications: true }));
    }

    // Contacts Permission
    const contactsPermission = await Contacts.requestPermissionsAsync();
    if (contactsPermission.granted) {
      setPermissions((prev) => ({ ...prev, contacts: true }));
    }

    setLoading(false);
  };

  const handleContinue = () => {
    router.replace("/(tabs)");
  };

  const allPermissionsGranted = Object.values(permissions).every(
    (permission) => permission
  );

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/adaptive-icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.headerTitle, isDark && styles.textLight]}>
            App Permissions
          </Text>
          <Text style={styles.headerSubtitle}>
            BillBuckz needs the following permissions to provide you with the
            best experience
          </Text>
        </View>

        {/* Permissions List */}
        <View style={styles.permissionsList}>
          {/* Camera Permission */}
          <View
            style={[styles.permissionItem, isDark && styles.permissionItemDark]}
          >
            <View style={styles.permissionIcon}>
              <CameraIcon size={24} color="#0A84FF" />
            </View>
            <View style={styles.permissionInfo}>
              <Text
                style={[styles.permissionTitle, isDark && styles.textLight]}
              >
                Camera Access
              </Text>
              <Text style={styles.permissionDescription}>
                Required to scan bills and receipts for cashback processing
              </Text>
            </View>
            {permissions.camera ? (
              <CheckCircle size={24} color="#30D158" />
            ) : (
              <XCircle size={24} color="#FF3B30" />
            )}
          </View>

          {/* Location Permission */}
          <View
            style={[styles.permissionItem, isDark && styles.permissionItemDark]}
          >
            <View style={styles.permissionIcon}>
              <MapPin size={24} color="#0A84FF" />
            </View>
            <View style={styles.permissionInfo}>
              <Text
                style={[styles.permissionTitle, isDark && styles.textLight]}
              >
                Location Access
              </Text>
              <Text style={styles.permissionDescription}>
                Find nearby merchants and personalized offers
              </Text>
            </View>
            {permissions.location ? (
              <CheckCircle size={24} color="#30D158" />
            ) : (
              <XCircle size={24} color="#FF3B30" />
            )}
          </View>

          {/* Notifications Permission */}
          <View
            style={[styles.permissionItem, isDark && styles.permissionItemDark]}
          >
            <View style={styles.permissionIcon}>
              <Bell size={24} color="#0A84FF" />
            </View>
            <View style={styles.permissionInfo}>
              <Text
                style={[styles.permissionTitle, isDark && styles.textLight]}
              >
                Push Notifications
              </Text>
              <Text style={styles.permissionDescription}>
                Get instant updates about cashback and offers
              </Text>
            </View>
            {permissions.notifications ? (
              <CheckCircle size={24} color="#30D158" />
            ) : (
              <XCircle size={24} color="#FF3B30" />
            )}
          </View>

          {/* Contacts Permission */}
          <View
            style={[styles.permissionItem, isDark && styles.permissionItemDark]}
          >
            <View style={styles.permissionIcon}>
              <Users size={24} color="#0A84FF" />
            </View>
            <View style={styles.permissionInfo}>
              <Text
                style={[styles.permissionTitle, isDark && styles.textLight]}
              >
                Contacts Access
              </Text>
              <Text style={styles.permissionDescription}>
                Share cashback opportunities with friends
              </Text>
            </View>
            {permissions.contacts ? (
              <CheckCircle size={24} color="#30D158" />
            ) : (
              <XCircle size={24} color="#FF3B30" />
            )}
          </View>
        </View>

        {/* Privacy Note */}
        <Text style={styles.privacyNote}>
          We value your privacy. Your data is secure and will only be used to
          provide you with the best service. You can manage these permissions
          anytime in your device settings.
        </Text>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={requestPermissions}
            style={styles.button}
            loading={loading}
          >
            Allow Permissions
          </Button>

          <Button
            mode="outlined"
            onPress={handleContinue}
            style={styles.skipButton}
            disabled={loading}
          >
            {allPermissionsGranted ? "Continue" : "Skip for Now"}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#0A0A0A",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#6B6B6B",
    textAlign: "center",
  },
  permissionsList: {
    marginBottom: 24,
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  permissionItemDark: {
    backgroundColor: "#1E1E1E",
  },
  permissionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EBF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  permissionInfo: {
    flex: 1,
    marginRight: 16,
  },
  permissionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  permissionDescription: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
  },
  privacyNote: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
    marginBottom: 24,
  },
  actions: {
    gap: 12,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 8,
  },
  skipButton: {
    borderRadius: 8,
  },
  textLight: {
    color: "#FFFFFF",
  },
});
