// @ts-nocheck
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Trophy,
  Crown,
  Medal,
  ChevronRight,
  ArrowUp,
  Sparkles,
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Card } from "react-native-paper";

// Mock data for leaderboard
const leaderboardData = [
  {
    id: "1",
    name: "Rahul Sharma",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    totalSpent: "52,450",
    cashback: "2,622",
    rank: 1,
  },
  {
    id: "2",
    name: "Priya Patel",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    totalSpent: "48,920",
    cashback: "2,446",
    rank: 2,
  },
  {
    id: "3",
    name: "Amit Kumar",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    totalSpent: "45,780",
    cashback: "2,289",
    rank: 3,
  },
  {
    id: "4",
    name: "Neha Singh",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    totalSpent: "42,650",
    cashback: "2,132",
    rank: 4,
  },
  {
    id: "5",
    name: "Vikram Reddy",
    avatar:
      "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg",
    totalSpent: "40,120",
    cashback: "2,006",
    rank: 5,
  },
];

export default function LeaderboardScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={24} color="#FFA500" />;
      case 2:
        return <Medal size={24} color="#A9A9A9" />;
      case 3:
        return <Medal size={24} color="#8B4513" />;
      default:
        return <Trophy size={24} color="#0A84FF" />;
    }
  };

  const getGradientColors = (rank: number) => {
    switch (rank) {
      case 1:
        return ["#FFD700", "#FFA500"];
      case 2:
        return ["#C0C0C0", "#A9A9A9"];
      case 3:
        return ["#CD7F32", "#8B4513"];
      default:
        return [isDark ? "#2C2C2E" : "#FFFFFF", isDark ? "#2C2C2E" : "#FFFFFF"];
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, isDark && styles.textLight]}>
            Leaderboard
          </Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>April 2025</Text>
          </View>
        </View>

        {/* Top 3 Winners */}
        <View style={styles.topWinners}>
          {/* Second Place */}
          <View style={[styles.winnerCard, styles.secondPlace]}>
            <Image
              source={{ uri: leaderboardData[1].avatar }}
              style={styles.winnerAvatar}
            />
            <View style={styles.winnerBadge}>
              <Medal size={20} color="#C0C0C0" />
            </View>
            <Text style={[styles.winnerName, { color: "#C0C0C0" }]}>
              {leaderboardData[1].name}
            </Text>
            <Text style={styles.winnerAmount}>
              ₹{leaderboardData[1].totalSpent}
            </Text>
          </View>

          {/* First Place */}
          <View style={[styles.winnerCard, styles.firstPlace]}>
            <LinearGradient
              colors={["#FFD700", "#FFA500"]}
              style={styles.crownContainer}
            >
              <Crown size={32} color="#FFFFFF" />
            </LinearGradient>
            <Image
              source={{ uri: leaderboardData[0].avatar }}
              style={[styles.winnerAvatar, styles.firstPlaceAvatar]}
            />
            <View style={styles.winnerBadge}>
              <Crown size={24} color="#FFD700" />
            </View>
            <Text style={[styles.winnerName, { color: "#FFD700" }]}>
              {leaderboardData[0].name}
            </Text>
            <Text style={styles.winnerAmount}>
              ₹{leaderboardData[0].totalSpent}
            </Text>
            <View style={styles.sparklesContainer}>
              <Sparkles size={16} color="#FFD700" />
              <Text style={styles.cashbackText}>
                ₹{leaderboardData[0].cashback} Cashback
              </Text>
            </View>
          </View>

          {/* Third Place */}
          <View style={[styles.winnerCard, styles.thirdPlace]}>
            <Image
              source={{ uri: leaderboardData[2].avatar }}
              style={styles.winnerAvatar}
            />
            <View style={styles.winnerBadge}>
              <Medal size={20} color="#CD7F32" />
            </View>
            <Text style={[styles.winnerName, { color: "#CD7F32" }]}>
              {leaderboardData[2].name}
            </Text>
            <Text style={styles.winnerAmount}>
              ₹{leaderboardData[2].totalSpent}
            </Text>
          </View>
        </View>

        {/* Leaderboard List */}
        <View style={styles.leaderboardList}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
            Top Spenders
          </Text>

          {leaderboardData.map((user) => (
            <TouchableOpacity key={user.id} activeOpacity={0.7}>
              <LinearGradient
                colors={getGradientColors(user.rank)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.leaderboardCard,
                  user.rank <= 3 && styles.topRankCard,
                ]}
              >
                <View style={styles.rankContainer}>
                  {getRankIcon(user.rank)}
                  <Text
                    style={[
                      styles.rankText,
                      user.rank <= 3 && styles.topRankText,
                    ]}
                  >
                    #{user.rank}
                  </Text>
                </View>

                <Image
                  source={{ uri: user.avatar }}
                  style={styles.userAvatar}
                />

                <View style={styles.userInfo}>
                  <Text
                    style={[
                      styles.userName,
                      isDark && styles.textLight,
                      user.rank <= 3 && styles.topRankText,
                    ]}
                  >
                    {user.name}
                  </Text>
                  <View style={styles.userStats}>
                    <ArrowUp size={12} color="#30D158" />
                    <Text style={styles.statText}>
                      ₹{user.totalSpent} spent
                    </Text>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Sparkles size={12} color="#FFD700" />
                    <Text style={styles.statText}>₹{user.cashback} earned</Text>
                  </View>
                </View>

                <ChevronRight
                  size={20}
                  color={user.rank <= 3 ? "#FFFFFF" : "#AFAFAF"}
                />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Rules Card */}
        <Card style={[styles.rulesCard, isDark && styles.cardDark]}>
          <View style={styles.rulesHeader}>
            <Trophy size={20} color="#0A84FF" />
            <Text style={[styles.rulesTitle, isDark && styles.textLight]}>
              How to Win?
            </Text>
          </View>
          <Text style={styles.rulesText}>
            1. Upload more bills to earn points{"\n"}
            2. Get extra points for high-value purchases{"\n"}
            3. Monthly winners get special rewards{"\n"}
            4. Top 3 winners get additional cashback
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    marginBottom: 24,
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#0A0A0A",
    marginRight: 12,
  },
  headerBadge: {
    backgroundColor: "#0A84FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  headerBadgeText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#FFFFFF",
  },
  topWinners: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 32,
    height: 240,
  },
  winnerCard: {
    alignItems: "center",
    width: 100,
  },
  firstPlace: {
    marginHorizontal: 16,
    marginBottom: 0,
  },
  secondPlace: {
    marginBottom: 30,
  },
  thirdPlace: {
    marginBottom: 50,
  },
  crownContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -24,
    zIndex: 1,
  },
  winnerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  firstPlaceAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#FFD700",
  },
  winnerBadge: {
    position: "absolute",
    top: 50,
    right: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  winnerName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 4,
  },
  winnerAmount: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  sparklesContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cashbackText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#FFD700",
    marginLeft: 4,
  },
  leaderboardList: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
    marginBottom: 16,
  },
  leaderboardCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  topRankCard: {
    backgroundColor: "transparent",
  },
  rankContainer: {
    alignItems: "center",
    marginRight: 16,
  },
  rankText: {
    fontFamily: "Inter-Bold",
    fontSize: 14,
    color: "#0A0A0A",
    marginTop: 4,
  },
  topRankText: {
    color: "#FFFFFF",
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  userStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#6B6B6B",
    marginLeft: 4,
  },
  bulletPoint: {
    color: "#6B6B6B",
    marginHorizontal: 8,
  },
  rulesCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  rulesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rulesTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginLeft: 8,
  },
  rulesText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
    lineHeight: 24,
  },
  textLight: {
    color: "#FFFFFF",
  },
});
