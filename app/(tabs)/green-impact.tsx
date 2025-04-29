// @ts-nocheck
import React, { useState, useEffect } from "react";
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
import { Leaf, TreePine, Cloud, Droplets, Share2 } from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Card, Button } from "react-native-paper";
import { useAuth } from "@/context/AuthContext";
import { theme } from "@/constants/theme";

export default function GreenImpactScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();

  const [impact, setImpact] = useState({
    treesPlanted: 0,
    co2Reduced: 0,
    waterSaved: 0,
  });

  useEffect(() => {
    fetchImpactData();
  }, []);

  const fetchImpactData = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_REST_API}/api/green-impact/${user.id}`
      );
      const data = await response.json();
      setImpact(data);
    } catch (error) {
      console.error("Error fetching impact data:", error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I've helped plant ${impact.treesPlanted} trees and reduced ${impact.co2Reduced}kg of CO2 through my sustainable shopping! Join me on BillBuckz to make a difference. 🌱`,
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
            </View>
          </Card>
        </View>

        {/* How It Works */}
        <Card style={[styles.howItWorksCard, isDark && styles.cardDark]}>
          <Text style={[styles.howItWorksTitle, isDark && styles.textLight]}>
            How It Works
          </Text>
          <View style={styles.howItWorksStep}>
            <Text style={[styles.stepNumber, isDark && styles.textLight]}>
              1
            </Text>
            <Text style={[styles.stepText, isDark && styles.textLight]}>
              For every ₹1000 spent, we plant one tree
            </Text>
          </View>
          <View style={styles.howItWorksStep}>
            <Text style={[styles.stepNumber, isDark && styles.textLight]}>
              2
            </Text>
            <Text style={[styles.stepText, isDark && styles.textLight]}>
              Each tree absorbs about 22kg of CO₂ annually
            </Text>
          </View>
          <View style={styles.howItWorksStep}>
            <Text style={[styles.stepNumber, isDark && styles.textLight]}>
              3
            </Text>
            <Text style={[styles.stepText, isDark && styles.textLight]}>
              Trees help conserve water and prevent soil erosion
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

        <Button
          mode="contained"
          style={styles.learnMoreButton}
          onPress={() => {
            /* Add navigation to detailed impact page */
          }}
        >
          Learn More About Our Initiative
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
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  statContent: {
    alignItems: "center",
  },
  statTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#0A0A0A",
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#0A0A0A",
  },
  howItWorksCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  howItWorksTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#0A0A0A",
    marginBottom: 16,
  },
  howItWorksStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepNumber: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#0A0A0A",
    width: 24,
  },
  stepText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#0A0A0A",
    flex: 1,
    marginLeft: 8,
  },
  impactImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 24,
  },
  learnMoreButton: {
    marginBottom: 24,
  },
  textLight: {
    color: "#FFFFFF",
  },
});
