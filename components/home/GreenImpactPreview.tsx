import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Leaf, TreePine, Cloud, Droplets } from "lucide-react-native";
import { Card } from "react-native-paper";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/constants/theme";

interface GreenImpactPreviewProps {
  impact: {
    treesPlanted: number;
    co2Reduced: number;
    waterSaved: number;
    invoicesUntilNextTree: number;
  };
}

export function GreenImpactPreview({ impact }: GreenImpactPreviewProps) {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  return (
    <Card style={[styles.container, isDark && styles.containerDark]}>
      <LinearGradient
        colors={["#4CAF50", "#2E7D32"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <Leaf size={20} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Green Impact</Text>
        </View>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push("/(tabs)/green-impact")}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <TreePine size={24} color="#4CAF50" />
            </View>
            <Text style={[styles.statValue, isDark && styles.textLight]}>
              {impact.treesPlanted}
            </Text>
            <Text style={styles.statLabel}>Trees Planted</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Cloud size={24} color="#2196F3" />
            </View>
            <Text style={[styles.statValue, isDark && styles.textLight]}>
              {impact.co2Reduced}kg
            </Text>
            <Text style={styles.statLabel}>CO₂ Reduced</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Droplets size={24} color="#00BCD4" />
            </View>
            <Text style={[styles.statValue, isDark && styles.textLight]}>
              {impact.waterSaved}L
            </Text>
            <Text style={styles.statLabel}>Water Saved</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={[styles.progressTitle, isDark && styles.textLight]}>
            Next Tree in {impact.invoicesUntilNextTree} Invoices
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((10 - impact.invoicesUntilNextTree) / 10) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Upload {impact.invoicesUntilNextTree} more invoices to plant a tree
          </Text>
        </View>
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
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 8,
  },
  viewAllButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewAllText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#FFFFFF",
  },
  content: {
    padding: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#6B6B6B",
  },
  progressContainer: {
    backgroundColor: theme.colors.primaryContainer,
    padding: 16,
    borderRadius: 12,
  },
  progressTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  progressText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
  },
  textLight: {
    color: "#FFFFFF",
  },
});
