import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import {
  TreePine,
  Cloud,
  Droplets,
  ArrowRight,
  Globe,
  Leaf,
} from "lucide-react-native";
import { Card } from "react-native-paper";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";

export function EnhancedGreenImpact() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();

  const [impact, setImpact] = useState({
    treesPlanted: 0,
    co2Reduced: 0,
    waterSaved: 0,
    invoicesUntilNextTree: 10,
    rank: 0,
    totalParticipants: 0,
  });

  // Animation values
  const progressAnimation = new Animated.Value(0);
  const globeRotation = new Animated.Value(0);
  const leafFloat = new Animated.Value(0);

  useEffect(() => {
    fetchImpactData();
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Progress bar animation
    Animated.timing(progressAnimation, {
      toValue: (10 - impact.invoicesUntilNextTree) / 10,
      duration: 1500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();

    // Globe rotation
    Animated.loop(
      Animated.timing(globeRotation, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Leaf floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(leafFloat, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(leafFloat, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const fetchImpactData = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_REST_API}/api/expo/invoices?userId=${user.id}&limit=1000`
      );
      const data = await response.json();

      const totalInvoices = data.totalInvoices || 0;
      const treesPlanted = Math.floor(totalInvoices / 10);
      const invoicesUntilNextTree = 10 - (totalInvoices % 10);

      setImpact({
        treesPlanted,
        co2Reduced: treesPlanted * 22,
        waterSaved: treesPlanted * 100,
        invoicesUntilNextTree,
        rank: data.rank || 0,
        totalParticipants: data.totalParticipants || 0,
      });

      // Restart animations with new values
      startAnimations();
    } catch (error) {
      console.error("Error fetching impact data:", error);
    }
  };

  const globeRotateInterpolate = globeRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const leafTranslateY = leafFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <Card style={[styles.container, isDark && styles.containerDark]}>
      <LinearGradient
        colors={isDark ? ["#0A3D2E", "#052118"] : ["#E6F4EA", "#C8E6C9"]}
        style={styles.gradient}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Animated.View
              style={[
                styles.leafContainer,
                { transform: [{ translateY: leafTranslateY }] },
              ]}
            >
              <Leaf size={24} color={isDark ? "#4CAF50" : "#2E7D32"} />
            </Animated.View>
            <Text style={[styles.headerTitle, isDark && styles.textLight]}>
              Your Green Impact
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.statsContainer}>
            <View style={styles.globeContainer}>
              <Animated.View
                style={[
                  styles.globe,
                  { transform: [{ rotate: globeRotateInterpolate }] },
                ]}
              >
                <Globe size={80} color={isDark ? "#64B5F6" : "#1976D2"} />
              </Animated.View>
            </View>

            <View style={styles.stats}>
              <View style={styles.statItem}>
                <TreePine size={24} color="#4CAF50" />
                <Text style={[styles.statValue, isDark && styles.textLight]}>
                  {impact.treesPlanted}
                </Text>
                <Text style={styles.statLabel}>Trees Planted</Text>
              </View>

              <View style={styles.statItem}>
                <Cloud size={24} color="#2196F3" />
                <Text style={[styles.statValue, isDark && styles.textLight]}>
                  {impact.co2Reduced}kg
                </Text>
                <Text style={styles.statLabel}>CO₂ Reduced</Text>
              </View>

              <View style={styles.statItem}>
                <Droplets size={24} color="#00BCD4" />
                <Text style={[styles.statValue, isDark && styles.textLight]}>
                  {impact.waterSaved}L
                </Text>
                <Text style={styles.statLabel}>Water Saved</Text>
              </View>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <Text style={[styles.progressTitle, isDark && styles.textLight]}>
              Next Tree in {impact.invoicesUntilNextTree} Bills
            </Text>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      ((10 - impact.invoicesUntilNextTree) / 10) * 100
                    }%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/(tabs)/green-impact")}
          >
            <Text style={styles.actionButtonText}>View Full Impact</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
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
    backgroundColor: "#0A3D2E",
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  leafContainer: {
    marginRight: 8,
  },
  headerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#0A3D2E",
  },
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  rankText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#FFD700",
  },
  content: {
    gap: 24,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  globeContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  globe: {
    position: "absolute",
  },
  stats: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#0A3D2E",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#1B5E20",
    opacity: 0.8,
  },
  progressSection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    borderRadius: 12,
  },
  progressTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A3D2E",
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 8,
  },
  actionButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  textLight: {
    color: "#FFFFFF",
  },
});
