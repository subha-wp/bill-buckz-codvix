import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Leaf,
  TreePine,
  Cloud,
  Droplets,
  Share2,
  Receipt,
  CircleHelp as HelpCircle,
  ArrowUp,
  Sparkles,
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Card, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { theme } from "@/constants/theme";

export default function GreenImpactScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();
  const router = useRouter();

  const [impact, setImpact] = useState({
    treesPlanted: 0,
    co2Reduced: 0,
    waterSaved: 0,
    totalInvoices: 0,
    rank: 0,
    totalParticipants: 0,
    carbonFootprint: 0,
    energySaved: 0,
  });

  useEffect(() => {
    fetchImpactData();
  }, []);

  const fetchImpactData = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_REST_API}/api/expo/invoices?userId=${user.id}&limit=1000`
      );
      const data = await response.json();

      const totalInvoices = data.totalInvoices || 0;
      const treesPlanted = Math.floor(totalInvoices / 10);

      // Calculate environmental impact
      const co2Reduced = treesPlanted * 22;
      const waterSaved = treesPlanted * 100;
      const energySaved = treesPlanted * 50; // kWh per tree annually
      const carbonFootprint = co2Reduced * 0.5; // Carbon footprint reduction

      setImpact({
        treesPlanted,
        co2Reduced,
        waterSaved,
        totalInvoices,
        rank: data.rank || 0,
        totalParticipants: data.totalParticipants || 0,
        carbonFootprint,
        energySaved,
      });
    } catch (error) {
      console.error("Error fetching impact data:", error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I've helped plant ${impact.treesPlanted} trees and reduced ${impact.co2Reduced}kg of CO2 through my shopping! Join me on BillBuckz to make a difference while earning cashback. 🌱`,
      });
    } catch (error) {
      console.error(error);
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
            Your Green Impact
          </Text>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Share2 size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Impact Summary */}
        <LinearGradient
          colors={["#4CAF50", "#2E7D32"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.impactCard}
        >
          <View style={styles.impactHeader}>
            <Leaf size={24} color="#FFFFFF" />
            <Text style={styles.impactTitle}>Total Impact</Text>
          </View>
          <Text style={styles.impactAmount}>
            {impact.treesPlanted} Trees Planted
          </Text>
          <Text style={styles.impactSubtitle}>
            Through your sustainable shopping
          </Text>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/upload-invoice")}
          >
            <Receipt size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Upload Bill</Text>
            <Text style={styles.actionButtonSubtext}>
              Help plant more trees
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/help")}
          >
            <HelpCircle size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Learn More</Text>
            <Text style={styles.actionButtonSubtext}>About our initiative</Text>
          </TouchableOpacity>
        </View>

        {/* Impact Stats */}
        <View style={styles.statsContainer}>
          <Card style={[styles.statCard, isDark && styles.cardDark]}>
            <View style={styles.statContent}>
              <TreePine size={24} color="#4CAF50" />
              <Text style={[styles.statTitle, isDark && styles.textLight]}>
                Trees Planted
              </Text>
              <Text style={[styles.statValue, isDark && styles.textLight]}>
                {impact.treesPlanted}
              </Text>
              <Text style={styles.statDescription}>
                Each tree absorbs ~22kg CO₂ annually
              </Text>
            </View>
          </Card>

          <Card style={[styles.statCard, isDark && styles.cardDark]}>
            <View style={styles.statContent}>
              <Cloud size={24} color="#2196F3" />
              <Text style={[styles.statTitle, isDark && styles.textLight]}>
                CO₂ Reduced
              </Text>
              <Text style={[styles.statValue, isDark && styles.textLight]}>
                {impact.co2Reduced}kg
              </Text>
              <Text style={styles.statDescription}>
                Equivalent to {Math.round(impact.co2Reduced / 100)} car trips
                avoided
              </Text>
            </View>
          </Card>

          <Card style={[styles.statCard, isDark && styles.cardDark]}>
            <View style={styles.statContent}>
              <Droplets size={24} color="#00BCD4" />
              <Text style={[styles.statTitle, isDark && styles.textLight]}>
                Water Saved
              </Text>
              <Text style={[styles.statValue, isDark && styles.textLight]}>
                {impact.waterSaved}L
              </Text>
              <Text style={styles.statDescription}>
                Through reduced water runoff
              </Text>
            </View>
          </Card>
        </View>

        {/* Additional Impact Stats */}
        <Card style={[styles.additionalStatsCard, isDark && styles.cardDark]}>
          <Text
            style={[styles.additionalStatsTitle, isDark && styles.textLight]}
          >
            Additional Impact
          </Text>

          <View style={styles.additionalStat}>
            <Text
              style={[styles.additionalStatLabel, isDark && styles.textLight]}
            >
              Carbon Footprint Reduction
            </Text>
            <Text
              style={[styles.additionalStatValue, isDark && styles.textLight]}
            >
              {impact.carbonFootprint.toFixed(1)} tons
            </Text>
          </View>

          <View style={styles.additionalStat}>
            <Text
              style={[styles.additionalStatLabel, isDark && styles.textLight]}
            >
              Energy Saved
            </Text>
            <Text
              style={[styles.additionalStatValue, isDark && styles.textLight]}
            >
              {impact.energySaved} kWh
            </Text>
          </View>

          <View style={styles.additionalStat}>
            <Text
              style={[styles.additionalStatLabel, isDark && styles.textLight]}
            >
              Total Bills Processed
            </Text>
            <Text
              style={[styles.additionalStatValue, isDark && styles.textLight]}
            >
              {impact.totalInvoices}
            </Text>
          </View>
        </Card>

        {/* Impact Image */}
        <Image
          source={{
            uri: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg",
          }}
          style={styles.impactImage}
          resizeMode="cover"
        />

        {/* Share Impact */}
        <Button
          mode="contained"
          icon={() => <ArrowUp size={18} color="#FFFFFF" />}
          style={styles.shareImpactButton}
          onPress={handleShare}
        >
          Share Your Impact
        </Button>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#0A0A0A",
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  impactCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  impactHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  impactTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#FFFFFF",
    marginLeft: 8,
  },
  impactAmount: {
    fontFamily: "Inter-Bold",
    fontSize: 32,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  impactSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 12,
  },
  rankInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  rankText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  actionButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 8,
  },
  actionButtonSubtext: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.8,
    marginTop: 4,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  statContent: {
    padding: 16,
    alignItems: "center",
  },
  statTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  statDescription: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
  },
  additionalStatsCard: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
  },
  additionalStatsTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#0A0A0A",
    marginBottom: 16,
  },
  additionalStat: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  additionalStatLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#0A0A0A",
  },
  additionalStatValue: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
  },
  impactImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 24,
  },
  shareImpactButton: {
    marginBottom: 24,
    borderRadius: 8,
  },
  textLight: {
    color: "#FFFFFF",
  },
});
