// @ts-nocheck
import React from "react";
import { StyleSheet, Platform, TouchableOpacity, View } from "react-native";
import { Tabs } from "expo-router";
import { Wallet, Leaf, Store, Home, QrCode } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "@/context/ThemeContext";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const getTabBarIcon = (
    routeName: string,
    focused: boolean,
    color: string
  ) => {
    const iconSize = 22;
    const iconColor = focused
      ? theme.colors.primary
      : isDark
      ? "#AFAFAF"
      : "#6B6B6B";

    switch (routeName) {
      case "index":
        return <Home size={iconSize} color={iconColor} />;
      case "nearby":
        return <Store size={iconSize} color={iconColor} />;
      case "green-impact":
        return <Leaf size={iconSize} color={iconColor} />;
      case "wallet":
        return <Wallet size={iconSize} color={iconColor} />;
      default:
        return null;
    }
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) =>
          getTabBarIcon(route.name, focused, color),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: isDark ? "#AFAFAF" : "#6B6B6B",
        tabBarStyle: {
          height: 80,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          backgroundColor: isDark ? "#121212" : "#FFFFFF",
          borderTopColor: isDark ? "#2A2A2A" : "#E5E5E5",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter-Medium",
          fontSize: 12,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={isDark ? 40 : 60}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: "Products",
        }}
      />

      {/* Scan Button */}
      <Tabs.Screen
        name="scan"
        options={{
          title: "",
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={styles.scanButton}
              onPress={() => router.push("/upload-invoice")}
            >
              <View
                style={[
                  styles.scanButtonInner,
                  isDark && styles.scanButtonInnerDark,
                ]}
              >
                <QrCode size={24} color={theme.colors.primary} />
              </View>
            </TouchableOpacity>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/upload-invoice");
          },
        }}
      />

      <Tabs.Screen
        name="green-impact"
        options={{
          title: "Green",
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    top: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scanButtonInnerDark: {
    backgroundColor: "#2A2A2A",
  },
});
