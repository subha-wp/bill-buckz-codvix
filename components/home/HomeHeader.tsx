import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { theme } from "@/constants/theme";

export function HomeHeader() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { user } = useAuth();

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
          {getGreeting()},{" "}
          {user.name
            ? user.name.split(" ")[0].charAt(0).toUpperCase() +
              user.name.split(" ")[0].slice(1).toLowerCase()
            : "User"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => router.push("/profile")}
      >
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>
              {user.name?.charAt(0).toUpperCase() || "U"}
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
    backgroundColor: theme.colors.secondaryContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#000000",
  },
});
