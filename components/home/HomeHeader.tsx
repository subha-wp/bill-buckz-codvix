import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export function HomeHeader() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");

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
          setAvatar(parsedUser.avatarUrl);
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
      <View>
        <Text style={[styles.greeting, isDark && styles.textLight]}>
          {getGreeting()}, {userName || "User"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => router.push("/profile")}
      >
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>
              {userName?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
        )}
      </TouchableOpacity>
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
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  textLight: {
    color: "#FFFFFF",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D0D0D0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#000000",
  },
});
