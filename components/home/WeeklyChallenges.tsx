import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Trophy, Gift, ChevronRight } from "lucide-react-native";
import { Card } from "react-native-paper";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/constants/theme";

const weeklyPrizes = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    image:
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQiPVzda82ZrYDYc730nqGZQRvyetAMlZYzEMxxw4nGF2fUSGaZz_U8HmvOQLF60X6nL5XzAV801EU_a782B0jUHF8hDYRmr0nGepyFTZT5j1yHmTCk5ENFig",
    minSpend: 25000,
  },
  {
    id: 2,
    name: "Smart AC",
    image:
      "https://img.freepik.com/free-photo/air-conditioner-mounted-white-wall_53876-128235.jpg",
    minSpend: 15000,
  },
  {
    id: 3,
    name: "Refrigerator",
    image:
      "https://i.pinimg.com/736x/54/ce/1b/54ce1bda53ddffd7c39777cdf3335021.jpg",
    minSpend: 20000,
  },
];

export function WeeklyChallenges() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  return (
    <Card style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Trophy size={20} color="#FFD700" />
          <Text style={[styles.headerTitle, isDark && styles.textLight]}>
            Weekly Challenges
          </Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>New</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push("/leaderboard")}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={16} color="#0A84FF" />
        </TouchableOpacity>
      </View>

      <View style={styles.prizesList}>
        {weeklyPrizes.map((prize, index) => (
          <TouchableOpacity
            key={prize.id}
            onPress={() => router.push("/leaderboard")}
          >
            <LinearGradient
              colors={
                index === 0
                  ? ["rgba(255, 215, 0, 0.1)", "rgba(255, 165, 0, 0.1)"]
                  : [
                      isDark ? "#1E1E1E" : "#FFFFFF",
                      isDark ? "#1E1E1E" : "#FFFFFF",
                    ]
              }
              style={styles.prizeCard}
            >
              <Image source={{ uri: prize.image }} style={styles.prizeImage} />
              <View style={styles.prizeInfo}>
                <Text style={[styles.prizeName, isDark && styles.textLight]}>
                  {prize.name}
                </Text>
                <View style={styles.prizeRequirement}>
                  <Gift size={14} color={theme.colors.primary} />
                  <Text style={styles.requirementText}>
                    Min spend ₹{prize.minSpend.toLocaleString()}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={theme.colors.primary} />
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  containerDark: {
    backgroundColor: "#1E1E1E",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginLeft: 8,
    marginRight: 8,
  },
  headerBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  headerBadgeText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#FFFFFF",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#0A84FF",
    marginRight: 4,
  },
  prizesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  prizeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  prizeImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  prizeInfo: {
    flex: 1,
  },
  prizeName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  prizeRequirement: {
    flexDirection: "row",
    alignItems: "center",
  },
  requirementText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#6B6B6B",
    marginLeft: 4,
  },
  textLight: {
    color: "#FFFFFF",
  },
});
