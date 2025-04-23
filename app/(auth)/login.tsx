import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Lock, Phone } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { theme } from "@/constants/theme";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_REST_API}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: phoneNumber,
            password: password,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        await SecureStore.setItemAsync("user", JSON.stringify(data.user));

        router.replace("/(tabs)");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require("@/assets/images/adaptive-icon.png")}
              style={{ width: 85, height: 85 }}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>BillBuckz</Text>
            <Text style={styles.headerSubtitle}>
              Scan bills. Earn cashback. Save money.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                mode="outlined"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                left={
                  <TextInput.Icon
                    icon={() => (
                      <Phone size={20} color={theme.colors.primary} />
                    )}
                  />
                }
                style={styles.input}
                placeholder="Enter your phone number"
                outlineStyle={styles.inputOutline}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                mode="outlined"
                value={password}
                onChangeText={setPassword}
                left={
                  <TextInput.Icon
                    icon={() => <Lock size={20} color={theme.colors.primary} />}
                  />
                }
                secureTextEntry
                style={styles.input}
                placeholder="Enter your password"
                outlineStyle={styles.inputOutline}
              />
            </View>

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              loading={loading}
              disabled={
                phoneNumber.length < 10 || password.length < 4 || loading
              }
            >
              <Text style={styles.loginText}>Login</Text>
            </Button>
          </View>

          {/* Register Link */}
          <View style={styles.registerLinkContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              style={styles.registerLink}
            >
              <Text style={styles.registerLinkText}>Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  headerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 28,
    color: "#0A0A0A",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#6B6B6B",
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: "#FFECEC",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#FF3B30",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },
  inputOutline: {
    borderRadius: 8,
    borderWidth: 1,
  },
  button: {
    height: 56,
    justifyContent: "center",
    borderRadius: 28,
  },
  loginText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 20,
  },
  registerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
  },
  registerText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#6B6B6B",
    marginRight: 4,
  },
  registerLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  registerLinkText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A84FF",
  },
});
