"use client";
import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { Leaf, Globe, ArrowRight } from "lucide-react-native";
import { Card } from "react-native-paper";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export function SaveEarthBanner() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  // Animation values
  const leafPosition = useRef(new Animated.Value(0)).current;
  const globeRotation = useRef(new Animated.Value(0)).current;

  // Start animations when component mounts
  useEffect(() => {
    // Leaf floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(leafPosition, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(leafPosition, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Globe rotation animation
    Animated.loop(
      Animated.timing(globeRotation, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolate values for animations
  const leafTranslateX = leafPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });

  const globeRotate = globeRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Card
      style={[styles.container, isDark && styles.containerDark]}
      elevation={3}
    >
      <LinearGradient
        colors={isDark ? ["#0A3D2E", "#052118"] : ["#E6F4EA", "#C8E6C9"]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.textSection}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, isDark && styles.titleDark]}>
                Help us to save Earth
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Urgent</Text>
              </View>
            </View>

            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              Small actions today can make a big difference tomorrow
            </Text>
          </View>

          <View style={styles.animationContainer}>
            <Animated.View
              style={[
                styles.leafContainer,
                { transform: [{ translateX: leafTranslateX }] },
              ]}
            >
              <Leaf size={20} color={isDark ? "#4CAF50" : "#2E7D32"} />
            </Animated.View>

            <Animated.View
              style={[
                styles.globeContainer,
                { transform: [{ rotate: globeRotate }] },
              ]}
            >
              <Globe size={35} color={isDark ? "#64B5F6" : "#1976D2"} />
            </Animated.View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDark && styles.statValueDark]}>
              27%
            </Text>
            <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
              Forest Loss
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDark && styles.statValueDark]}>
              1.5°C
            </Text>
            <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
              Target
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={[styles.statValue, isDark && styles.statValueDark]}>
              8M+
            </Text>
            <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
              Actions
            </Text>
          </View>
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
    width: "100%",
    padding: 0,
  },
  content: {
    flexDirection: "row",
    padding: 14,
    alignItems: "center",
  },
  textSection: {
    flex: 1,
    paddingRight: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#0A3D2E",
    marginRight: 8,
  },
  titleDark: {
    color: "#FFFFFF",
  },
  badge: {
    backgroundColor: "#F44336",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontFamily: "Inter-Medium",
    fontSize: 10,
    color: "#FFFFFF",
  },
  subtitle: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#1B5E20",
    marginBottom: 4,
    opacity: 0.8,
  },
  subtitleDark: {
    color: "#A5D6A7",
  },

  animationContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  leafContainer: {
    position: "absolute",
    top: -5,
    zIndex: 2,
  },
  globeContainer: {
    position: "absolute",
    zIndex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingVertical: 4,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#0A3D2E",
    marginBottom: 2,
  },
  statValueDark: {
    color: "#FFFFFF",
  },
  statLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#1B5E20",
    opacity: 0.7,
  },
  statLabelDark: {
    color: "#A5D6A7",
  },
  divider: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});
