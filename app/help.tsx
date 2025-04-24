// @ts-nocheck
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft, Phone, MessageCircle, Mail } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { theme } from "@/constants/theme";

export default function HelpScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const phoneNumber = "+911169313594";
  const whatsappLink = `https://wa.me/${phoneNumber}`;
  const email = "contact@nextcoder.co.in";

  const handleCall = () => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() =>
      Alert.alert("Error", "Unable to make a call from this device")
    );
  };

  const handleWhatsApp = () => {
    Linking.openURL(whatsappLink).catch(() =>
      Alert.alert("Error", "Unable to open WhatsApp")
    );
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${email}`).catch(() =>
      Alert.alert("Error", "Unable to open email app")
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft
            size={24}
            color={isDark ? theme.colors.primary : theme.colors.secondary}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.textLight]}>
          Help & Support
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.label, isDark && styles.textLight]}>
          Business Hours:
        </Text>
        <Text style={[styles.value, isDark && styles.textLight]}>
          10:00 AM – 7:00 PM (Monday – Saturday)
        </Text>

        <Text
          style={[styles.label, isDark && styles.textLight, { marginTop: 20 }]}
        >
          Email:
        </Text>
        <TouchableOpacity onPress={handleEmail}>
          <Text style={[styles.value, styles.linkText]}>
            contact@nextcoder.co.in
          </Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCall}>
            <Phone size={20} color="#fff" />
            <Text style={styles.buttonText}>Call Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleWhatsApp}>
            <MessageCircle size={20} color="#fff" />
            <Text style={styles.buttonText}>WhatsApp Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  containerDark: { backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
  },
  headerRight: { width: 40 },
  content: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  value: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#555",
  },
  linkText: {
    color: theme.colors.primary,
    textDecorationLine: "underline",
  },
  buttonContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 16,
    width: "100%",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
  },
  textLight: {
    color: "#FFFFFF",
  },
});
