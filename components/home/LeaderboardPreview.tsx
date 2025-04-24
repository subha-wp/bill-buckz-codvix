import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Trophy, ChevronRight, Crown, Medal } from "lucide-react-native";
import { Card } from "react-native-paper";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

// Mock data for top 3 users
const topUsers = [
  {
    id: "1",
    name: "Rahul Sharma",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    totalSpent: "52,450",
    rank: 1,
  },
  {
    id: "2",
    name: "Priya Patel",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    totalSpent: "48,920",
    rank: 2,
  },
  {
    id: "3",
    name: "Amit Kumar",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    totalSpent: "45,780",
    rank: 3,
  },
];

export function LeaderboardPreview() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={20} color="#FFD700" />;
      case 2:
        return <Medal size={20} color="#C0C0C0" />;
      case 3:
        return <Medal size={20} color="#CD7F32" />;
      default:
        return <Trophy size={20} color="#0A84FF" />;
    }
  };

  return (
    <Card style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Trophy size={20} color="#0A84FF" />
          <Text style={[styles.headerTitle, isDark && styles.textLight]}>
            Top Spenders
          </Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>April</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push("/(tabs)/leaderboard")}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={16} color="#0A84FF" />
        </TouchableOpacity>
      </View>

      <View style={styles.leadersList}>
        {topUsers.map((user, index) => (
          <LinearGradient
            key={user.id}
            colors={
              index === 0
                ? ["rgba(255, 215, 0, 0.1)", "rgba(255, 165, 0, 0.1)"]
                : [
                    isDark ? "#1E1E1E" : "#FFFFFF",
                    isDark ? "#1E1E1E" : "#FFFFFF",
                  ]
            }
            style={styles.userCard}
          >
            <View style={styles.rankContainer}>
              {getRankIcon(user.rank)}
              <Text
                style={[
                  styles.rankText,
                  isDark && styles.textLight,
                  index === 0 && styles.goldText,
                ]}
              >
                #{user.rank}
              </Text>
            </View>

            <Image source={{ uri: user.avatar }} style={styles.avatar} />

            <View style={styles.userInfo}>
              <Text
                style={[
                  styles.userName,
                  isDark && styles.textLight,
                  index === 0 && styles.goldText,
                ]}
                numberOfLines={1}
              >
                {user.name}
              </Text>
              <Text style={styles.userAmount}>₹{user.totalSpent}</Text>
            </View>
          </LinearGradient>
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
    backgroundColor: "#0A84FF",
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
  leadersList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  rankContainer: {
    alignItems: "center",
    width: 40,
  },
  rankText: {
    fontFamily: "Inter-Bold",
    fontSize: 12,
    color: "#0A0A0A",
    marginTop: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#0A0A0A",
    marginBottom: 2,
  },
  userAmount: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#6B6B6B",
  },
  goldText: {
    color: "#FFD700",
  },
  textLight: {
    color: "#FFFFFF",
  },
});
