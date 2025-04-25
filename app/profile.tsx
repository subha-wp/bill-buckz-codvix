// @ts-nocheck
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  User,
  ChevronRight,
  LogOut,
  ShieldCheck,
  CircleHelp as HelpCircle,
  Settings,
  Share2,
  ChevronLeft,
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Divider, Switch, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { theme } from "@/constants/theme";

export default function ProfileScreen() {
  const { colorScheme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const [user, setUser] = useState<{
    name: string;
    phoneNumber: string;
    referralCode: string;
    avatarUrl: string;
  } | null>(null);
  const { signOut } = useAuth();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await SecureStore.getItemAsync("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
        } catch (err) {
          console.error("Failed to parse user", err);
        }
      }
    };

    fetchUser();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          "Join BillBuckz and get cashback on every bill! Use my referral code ALEX123 to get ₹50 bonus. Download now: https://billbuckz.app/invite/ALEX123",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={20} color={theme.colors.primary} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, isDark && styles.textLight]}>
            Profile
          </Text>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              await SecureStore.deleteItemAsync("user");
              router.replace("/(auth)/login");
            }}
          >
            <LogOut
              size={20}
              color={isDark ? theme.colors.primary : theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <Card style={[styles.profileCard, isDark && styles.cardDark]}>
          <View style={styles.profileCardContent}>
            <View style={styles.profileAvatar}>
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={styles.avatarImageLarge}
                />
              ) : user?.name ? (
                <Text style={styles.avatarTextLarge}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              ) : (
                <User size={32} color="#FFFFFF" />
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, isDark && styles.textLight]}>
                {user?.name || "Loading..."}
              </Text>
              <Text style={styles.profilePhone}>
                +91 {user?.phoneNumber || "••••••••••"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => router.push("/edit-profile")}
            >
              <Text style={styles.editProfileText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Referral Card */}
        <Card style={[styles.referralCard, isDark && styles.cardDark]}>
          <View style={styles.referralCardContent}>
            <View style={styles.referralInfo}>
              <Text style={[styles.referralTitle, isDark && styles.textLight]}>
                Share & Earn
              </Text>
              <Text style={styles.referralDescription}>
                Invite friends to BillBuckz and earn ₹50 per referral
              </Text>
            </View>
            <View style={styles.referralCode}>
              <Text style={styles.referralCodeLabel}>Your Code</Text>
              <Text style={styles.referralCodeValue}>
                {user?.referralCode || "••••••"}
              </Text>
            </View>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Share2 size={16} color="#FFFFFF" />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
            Settings
          </Text>
          <Card style={[styles.settingsCard, isDark && styles.cardDark]}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, isDark && styles.textLight]}>
                  Dark Mode
                </Text>
                <Text style={styles.settingDescription}>
                  Toggle between light and dark theme
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleColorScheme}
                color={theme.colors.primary}
              />
            </View>

            <Divider style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, isDark && styles.textLight]}>
                  Notifications
                </Text>
                <Text style={styles.settingDescription}>
                  Receive cashback alerts and updates
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                color={theme.colors.primary}
              />
            </View>
          </Card>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
            Support
          </Text>
          <Card style={[styles.supportCard, isDark && styles.cardDark]}>
            <TouchableOpacity
              style={styles.supportItem}
              onPress={() => router.push("/help")}
            >
              <View style={styles.supportItemHeader}>
                <HelpCircle size={20} color={theme.colors.primary} />
                <Text
                  style={[styles.supportItemTitle, isDark && styles.textLight]}
                >
                  Help & Support
                </Text>
              </View>
              <ChevronRight size={18} color={theme.colors.primary} />
            </TouchableOpacity>

            <Divider style={styles.supportDivider} />

            <TouchableOpacity
              style={styles.supportItem}
              onPress={() => router.push("/privacy")}
            >
              <View style={styles.supportItemHeader}>
                <ShieldCheck size={20} color={theme.colors.primary} />
                <Text
                  style={[styles.supportItemTitle, isDark && styles.textLight]}
                >
                  Privacy Policy
                </Text>
              </View>
              <ChevronRight size={18} color={theme.colors.primary} />
            </TouchableOpacity>

            <Divider style={styles.supportDivider} />

            <TouchableOpacity
              style={styles.supportItem}
              onPress={() => router.push("/terms")}
            >
              <View style={styles.supportItemHeader}>
                <Settings size={20} color={theme.colors.primary} />
                <Text
                  style={[styles.supportItemTitle, isDark && styles.textLight]}
                >
                  Terms & Conditions
                </Text>
              </View>
              <ChevronRight size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>BillBuckz v1.0.4</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImageLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarTextLarge: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#FFFFFF",
  },
  headerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#0A0A0A",
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  profileCardContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  profilePhone: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
  },
  editProfileButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryContainer,
  },
  editProfileText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: theme.colors.primary,
  },
  referralCard: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },
  referralCardContent: {
    padding: 16,
  },
  referralInfo: {
    marginBottom: 16,
  },
  referralTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  referralDescription: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
  },
  referralCode: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  referralCodeLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#6B6B6B",
    marginBottom: 4,
  },
  referralCodeValue: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: theme.colors.primary,
  },
  shareButton: {
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
    marginBottom: 12,
  },
  settingsCard: {
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
  },
  settingDivider: {
    marginLeft: 16,
  },
  supportCard: {
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },
  supportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  supportItemHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  supportItemTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#0A0A0A",
    marginLeft: 12,
  },
  supportDivider: {
    marginLeft: 16,
  },
  appInfo: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: Platform.OS === "ios" ? 24 : 0,
  },
  appInfoText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
    marginBottom: 8,
  },
  appInfoLinks: {
    flexDirection: "row",
    alignItems: "center",
  },
  appInfoLink: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#0A84FF",
  },
  appInfoDot: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
    marginHorizontal: 8,
  },
  textLight: {
    color: "#FFFFFF",
  },
});
