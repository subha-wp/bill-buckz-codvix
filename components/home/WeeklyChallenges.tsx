"use client";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Trophy, Gift, ArrowRight } from "lucide-react-native";
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
    <Card
      style={[styles.container, isDark && styles.containerDark]}
      elevation={2}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Trophy size={18} color="#FFD700" />
          </View>
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
          <ArrowRight size={14} color="#0A84FF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {weeklyPrizes.map((prize, index) => (
          <TouchableOpacity
            key={prize.id}
            onPress={() => router.push("/leaderboard")}
            style={styles.prizeCardWrapper}
          >
            <LinearGradient
              colors={["#fff", "#fff"]}
              style={[
                styles.prizeCard,
                index === 0 && styles.featuredCard,
                isDark && styles.prizeCardDark,
              ]}
            >
              {index === 0 && (
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredText}>Featured</Text>
                </View>
              )}
              <Image source={{ uri: prize.image }} style={styles.prizeImage} />
              <View style={styles.prizeInfo}>
                <Text
                  style={[
                    styles.prizeName,
                    isDark && styles.textLight,
                    index === 0 && styles.featuredPrizeName,
                  ]}
                  numberOfLines={1}
                >
                  {prize.name}
                </Text>
                <View style={styles.prizeRequirement}>
                  <Gift
                    size={12}
                    color={index === 0 ? "#FFD700" : theme.colors.primary}
                  />
                  <Text
                    style={[
                      styles.requirementText,
                      index === 0 && styles.featuredRequirementText,
                    ]}
                  >
                    Min spend ₹{prize.minSpend.toLocaleString()}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderRadius: 16,
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
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginRight: 8,
  },
  headerBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  headerBadgeText: {
    fontFamily: "Inter-Medium",
    fontSize: 10,
    color: "#FFFFFF",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 132, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewAllText: {
    fontFamily: "Inter-Medium",
    fontSize: 13,
    color: "#0A84FF",
    marginRight: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  prizeCardWrapper: {
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  prizeCard: {
    width: 110,
    borderRadius: 16,
    overflow: "hidden",
    padding: 0,
  },
  prizeCardDark: {
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
  },
  featuredCard: {
    width: 120,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  featuredBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 215, 0, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 1,
  },
  featuredText: {
    fontFamily: "Inter-Medium",
    fontSize: 10,
    color: "#000000",
  },
  prizeImage: {
    width: "100%",
    height: 50,
    objectFit: "contain",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  prizeInfo: {
    padding: 12,
  },
  prizeName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 10,
    color: "#0A0A0A",
    marginBottom: 6,
  },
  featuredPrizeName: {
    fontSize: 10,
  },
  prizeRequirement: {
    flexDirection: "row",
    alignItems: "center",
  },
  requirementText: {
    fontFamily: "Inter-Medium",
    fontSize: 7,
    color: "#6B6B6B",
    marginLeft: 4,
  },
  featuredRequirementText: {
    color: "#8A6D00",
  },
  textLight: {
    color: "#FFFFFF",
  },
});
