// @ts-nocheck
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
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
  Gift,
  TreePine,
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Card } from "react-native-paper";
import { theme } from "@/constants/theme";

interface LeaderboardUser {
  name: string;
  avatarUrl: string;
  totalSpent: number;
  totalEarned: number;
  totalTree: number;
}

const weeklyPrizes = [
  {
    id: 1,
    name: "iPhone 16 Pro",
    image:
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQiPVzda82ZrYDYc730nqGZQRvyetAMlZYzEMxxw4nGF2fUSGaZz_U8HmvOQLF60X6nL5XzAV801EU_a782B0jUHF8hDYRmr0nGepyFTZT5j1yHmTCk5ENFig",
    minSpend: "1st",
  },
  {
    id: 2,
    name: "Smart AC",
    image:
      "https://img.freepik.com/free-photo/air-conditioner-mounted-white-wall_53876-128235.jpg",
    minSpend: "2nd",
  },
  {
    id: 3,
    name: "Refrigerator",
    image:
      "https://i.pinimg.com/736x/54/ce/1b/54ce1bda53ddffd7c39777cdf3335021.jpg",
    minSpend: "3rd",
  },
];

export default function LeaderboardScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbx7bk0brszvZ4908Rs5mFZeeKmT6GuZ4VN-MQSPBACxe3dBU2i_d5TllGzWAIkKn5mv/exec"
      );
      const data = await response.json();
      // Sort data by totalSpent in descending order
      const sortedData = [...data].sort((a, b) => b.totalSpent - a.totalSpent);
      setLeaderboardData(sortedData);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const getGradientColors = (idx: number) => {
    switch (idx) {
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

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDark && styles.containerDark]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, isDark && styles.textLight]}>
          Loading leaderboard...
        </Text>
      </View>
    );
  }

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
            <Text style={styles.headerBadgeText}>Weekly Challenge</Text>
          </View>
        </View>

        {/* Weekly Prizes */}
        <View style={styles.prizesSection}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
            This Week's Prizes
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {weeklyPrizes.map((prize, index) => (
              <Card
                key={prize.id}
                style={[styles.prizeCard, isDark && styles.cardDark]}
              >
                <Image
                  source={{ uri: prize.image }}
                  style={styles.prizeImage}
                />
                <View style={styles.prizeContent}>
                  <Text style={[styles.prizeName, isDark && styles.textLight]}>
                    {prize.name}
                  </Text>
                  <View style={styles.prizeRequirement}>
                    <Gift size={14} color={theme.colors.primary} />
                    <Text style={styles.requirementText}>
                      Prize {prize.minSpend.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Top 3 Winners */}
        <View style={styles.topWinners}>
          {/* Second Place */}
          {leaderboardData.length > 1 && (
            <View style={[styles.winnerCard, styles.secondPlace]}>
              <Image
                source={{ uri: leaderboardData[1].avatarUrl }}
                style={styles.winnerAvatar}
              />
              <View style={styles.winnerBadge}>
                <Medal size={20} color="#C0C0C0" />
              </View>
              <Text style={[styles.winnerName, { color: "#C0C0C0" }]}>
                {leaderboardData[1].name}
              </Text>
              <Text style={styles.winnerAmount}>
                ₹{leaderboardData[1].totalSpent.toLocaleString()}
              </Text>
            </View>
          )}

          {/* First Place */}
          {leaderboardData.length > 0 && (
            <View style={[styles.winnerCard, styles.firstPlace]}>
              <LinearGradient
                colors={["#FFD700", "#FFA500"]}
                style={styles.crownContainer}
              >
                <Crown size={32} color="#FFFFFF" />
              </LinearGradient>
              <Image
                source={{ uri: leaderboardData[0].avatarUrl }}
                style={[styles.winnerAvatar, styles.firstPlaceAvatar]}
              />
              <View style={styles.winnerBadge}>
                <Crown size={24} color="#FFD700" />
              </View>
              <Text style={[styles.winnerName, { color: "#FFD700" }]}>
                {leaderboardData[0].name}
              </Text>
              <Text style={styles.winnerAmount}>
                ₹{leaderboardData[0].totalSpent.toLocaleString()}
              </Text>
              <View style={styles.sparklesContainer}>
                <Sparkles size={16} color="#FFD700" />
                <Text style={styles.cashbackText}>
                  ₹{leaderboardData[0].totalEarned.toLocaleString()} Earned
                </Text>
              </View>
            </View>
          )}

          {/* Third Place */}
          {leaderboardData.length > 2 && (
            <View style={[styles.winnerCard, styles.thirdPlace]}>
              <Image
                source={{ uri: leaderboardData[2].avatarUrl }}
                style={styles.winnerAvatar}
              />
              <View style={styles.winnerBadge}>
                <Medal size={20} color="#CD7F32" />
              </View>
              <Text style={[styles.winnerName, { color: "#CD7F32" }]}>
                {leaderboardData[2].name}
              </Text>
              <Text style={styles.winnerAmount}>
                ₹{leaderboardData[2].totalSpent.toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* Leaderboard List */}
        <View style={styles.leaderboardList}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
            Top Spenders
          </Text>

          {leaderboardData.map((user, index) => (
            <TouchableOpacity key={index} activeOpacity={0.7}>
              <LinearGradient
                colors={
                  index < 3
                    ? getGradientColors(index + 1)
                    : [
                        isDark ? "#1E1E1E" : "#FFFFFF",
                        isDark ? "#1E1E1E" : "#FFFFFF",
                      ]
                }
                style={[
                  styles.leaderboardCard,
                  index <= 2 && styles.topRankCard,
                ]}
              >
                <View style={styles.rankContainer}>
                  {getRankIcon(index + 1)}
                  <Text
                    style={[
                      styles.rankText,
                      index <= 2 && styles.topRankText,
                      isDark && styles.textLight,
                    ]}
                  >
                    #{index + 1}
                  </Text>
                </View>

                <Image
                  source={{ uri: user.avatarUrl }}
                  style={styles.userAvatar}
                />

                <View style={styles.userInfo}>
                  <View style={styles.userNameRow}>
                    <Text
                      style={[
                        styles.userName,
                        isDark && styles.textLight,
                        index <= 2 && styles.topRankText,
                      ]}
                    >
                      {user.name}
                    </Text>
                    <View style={styles.treeContainer}>
                      <TreePine
                        size={14}
                        color={index <= 2 ? "#FFFFFF" : "#30D158"}
                      />
                      <Text
                        style={[
                          styles.treeCount,
                          index <= 2 && styles.topRankText,
                        ]}
                      >
                        {user.totalTree}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.userStats}>
                    <ArrowUp size={12} color="#30D158" />
                    <Text style={styles.statText}>
                      ₹{user.totalSpent.toLocaleString()} spent
                    </Text>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Sparkles size={12} color="#FFD700" />
                    <Text style={styles.statText}>
                      ₹{user.totalEarned.toLocaleString()} earned
                    </Text>
                  </View>
                </View>

                <ChevronRight
                  size={20}
                  color={index <= 2 ? "#FFFFFF" : "#AFAFAF"}
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
            3. Weekly winners get amazing prizes{"\n"}
            4. Top 3 winners get additional rewards
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
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#0A0A0A",
    fontFamily: "Inter-Medium",
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
  prizesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
    marginBottom: 16,
  },
  prizeCard: {
    width: 200,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  prizeImage: {
    width: "100%",
    height: 120,
    padding: 2,
    objectFit: "contain",
  },
  prizeContent: {
    padding: 12,
  },
  prizeName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
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
  userNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 4,
  },
  treeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(48, 209, 88, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  treeCount: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#30D158",
    marginLeft: 4,
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
