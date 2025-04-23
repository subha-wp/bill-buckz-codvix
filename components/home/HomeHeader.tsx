import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import * as SecureStore from "expo-secure-store";

export function HomeHeader() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await SecureStore.getItemAsync("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const firstName = parsedUser.name?.split(" ")[0] || "User";
          const capitalized =
            firstName.charAt(0).toUpperCase() +
            firstName.slice(1).toLowerCase();
          setUserName(capitalized);
        } catch (err) {
          console.error("Failed to parse stored user", err);
        }
      }
    };

    fetchUser();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <View style={styles.header}>
      <Text style={[styles.greeting, isDark && styles.textLight]}>
        {getGreeting()}, {userName || "User"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#0A0A0A",
  },
  textLight: {
    color: "#FFFFFF",
  },
});
