import React from "react";
import { StyleSheet, Platform } from "react-native";
import { Tabs } from "expo-router";
import { Map, Wallet, Trophy, HomeIcon, Store } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "@/context/ThemeContext";
import { theme } from "@/constants/theme";

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

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
        return <HomeIcon size={iconSize} color={iconColor} />;
      case "nearby":
        return <Store size={iconSize} color={iconColor} />;
      case "merchants":
        return <Map size={iconSize} color={iconColor} />;
      case "leaderboard":
        return <Trophy size={iconSize} color={iconColor} />;
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
      <Tabs.Screen
        name="merchants"
        options={{
          title: "Merchants",
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaders",
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
