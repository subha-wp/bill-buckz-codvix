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
import { TextInput, Button, Checkbox } from "react-native-paper";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  User,
  Phone,
  Lock,
  Gift,
  Eye,
  EyeOff,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { theme } from "@/constants/theme";

export default function Register() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      console.log("Haptics not available on web");
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_REST_API}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phoneNumber,
            password,
            referralCode,
          }),
        }
      );

      const result = await response.json();

      if (result.message) {
        // Handle any message (e.g., error or info)
        alert(`${result.message}, use login instead`);
        return; // Stop further execution
      }

      if (result.user) {
        await SecureStore.setItemAsync("user", JSON.stringify(result.user));
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Registration failed", error);
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color="#0A0A0A" />
            </TouchableOpacity>
            <Image
              source={require("@/assets/images/adaptive-icon.png")}
              style={{ width: 85, height: 85 }}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>
              Join BillBuckz and start saving on every bill
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                mode="outlined"
                value={name}
                onChangeText={setName}
                left={
                  <TextInput.Icon
                    icon={() => <User size={20} color={theme.colors.primary} />}
                  />
                }
                style={styles.input}
                placeholder="Enter your name"
                outlineStyle={styles.inputOutline}
              />
            </View>

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
                secureTextEntry={!showPassword}
                left={
                  <TextInput.Icon
                    icon={() => <Lock size={20} color={theme.colors.primary} />}
                  />
                }
                right={
                  <TextInput.Icon
                    icon={() =>
                      showPassword ? (
                        <EyeOff size={20} color={theme.colors.primary} />
                      ) : (
                        <Eye size={20} color={theme.colors.primary} />
                      )
                    }
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
                placeholder="Enter your password"
                outlineStyle={styles.inputOutline}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                mode="outlined"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                left={
                  <TextInput.Icon
                    icon={() => <Lock size={20} color={theme.colors.primary} />}
                  />
                }
                right={
                  <TextInput.Icon
                    icon={() =>
                      showConfirmPassword ? (
                        <EyeOff size={20} color={theme.colors.primary} />
                      ) : (
                        <Eye size={20} color={theme.colors.primary} />
                      )
                    }
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                style={styles.input}
                placeholder="Confirm your password"
                outlineStyle={styles.inputOutline}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Referral Code (Optional)</Text>
              <TextInput
                mode="outlined"
                value={referralCode}
                onChangeText={setReferralCode}
                left={
                  <TextInput.Icon
                    icon={() => <Gift size={20} color={theme.colors.primary} />}
                  />
                }
                style={styles.input}
                placeholder="Enter referral code"
                outlineStyle={styles.inputOutline}
              />
            </View>

            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                <Checkbox
                  status={acceptTerms ? "checked" : "unchecked"}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                />
                <Text style={{ marginLeft: 8 }}>
                  I accept the{" "}
                  <Text
                    style={{
                      color: theme.colors.primary,
                      textDecorationLine: "underline",
                    }}
                  >
                    terms and conditions
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              loading={loading}
              disabled={
                name.length < 2 ||
                phoneNumber.length < 10 ||
                password.length < 8 ||
                confirmPassword !== password ||
                !acceptTerms ||
                loading
              }
            >
              Register
            </Button>
          </View>

          {/* Login Link */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.loginLinkText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  keyboardAvoidingView: { flex: 1 },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 24,
    color: "#0A0A0A",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B6B6B",
    textAlign: "center",
  },
  formContainer: { marginBottom: 32 },
  inputContainer: { marginBottom: 16 },
  inputLabel: {
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 8,
  },
  input: { backgroundColor: "#FFFFFF", fontSize: 16 },
  inputOutline: { borderRadius: 8, borderWidth: 1 },
  button: {
    height: 56,
    justifyContent: "center",
    borderRadius: 28,
    marginTop: 8,
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#6B6B6B",
    marginRight: 4,
  },
  loginLinkText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
});
