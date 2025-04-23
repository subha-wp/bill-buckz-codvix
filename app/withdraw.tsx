import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  CreditCard,
  User,
  IndianRupee,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import {
  TextInput,
  Button,
  Chip,
  Card,
  Portal,
  Dialog,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

export default function WithdrawScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [showUPIInfo, setShowUPIInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const availableBalance = 1245.85;
  const predefinedAmounts = [200, 500, 1000];

  const handleAmountSelection = (selectedAmount: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setAmount(selectedAmount.toString());
  };

  const handleWithdraw = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setLoading(true);

    // Simulate API call for withdrawal
    setTimeout(() => {
      setLoading(false);
      setShowSuccessDialog(true);

      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        setShowSuccessDialog(false);
        router.replace("/(tabs)/wallet");
      }, 3000);
    }, 1500);
  };

  const isWithdrawDisabled = () => {
    const amountValue = parseFloat(amount);
    return (
      loading ||
      !amount ||
      !upiId ||
      !upiId.includes("@") ||
      isNaN(amountValue) ||
      amountValue <= 0 ||
      amountValue > availableBalance
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
          <ChevronLeft size={24} color={isDark ? "#FFFFFF" : "#0A0A0A"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.textLight]}>
          Withdraw Funds
        </Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Available Balance */}
          <Card style={[styles.balanceCard, isDark && styles.cardDark]}>
            <View style={styles.balanceCardContent}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>
                ₹{availableBalance.toFixed(2)}
              </Text>
            </View>
          </Card>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, isDark && styles.textLight]}>
              Withdrawal Amount
            </Text>
            <TextInput
              mode="outlined"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
              left={
                <TextInput.Icon
                  icon={() => <IndianRupee size={20} color="#0A84FF" />}
                />
              }
              style={styles.input}
              outlineStyle={styles.inputOutline}
            />
            {parseFloat(amount) > availableBalance && (
              <Text style={styles.errorText}>
                Amount exceeds available balance
              </Text>
            )}
            <Text style={styles.helperText}>
              Min: ₹100 • Max: ₹10,000 per transaction
            </Text>

            {/* Predefined Amounts */}
            <View style={styles.predefinedAmounts}>
              {predefinedAmounts.map((predefinedAmount) => (
                <Chip
                  key={predefinedAmount}
                  mode="outlined"
                  selected={amount === predefinedAmount.toString()}
                  onPress={() => handleAmountSelection(predefinedAmount)}
                  style={[
                    styles.amountChip,
                    amount === predefinedAmount.toString() &&
                      styles.selectedAmountChip,
                  ]}
                  selectedColor="#0A84FF"
                >
                  ₹{predefinedAmount}
                </Chip>
              ))}
            </View>
          </View>

          {/* UPI ID Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, isDark && styles.textLight]}>
              UPI ID
            </Text>
            <TextInput
              mode="outlined"
              value={upiId}
              onChangeText={setUpiId}
              placeholder="yourname@upi"
              left={
                <TextInput.Icon
                  icon={() => <CreditCard size={20} color="#0A84FF" />}
                />
              }
              style={styles.input}
              outlineStyle={styles.inputOutline}
            />
            {upiId && !upiId.includes("@") && (
              <Text style={styles.errorText}>Invalid UPI ID format</Text>
            )}

            {/* UPI Info Section */}
            <TouchableOpacity
              style={styles.upiInfoHeader}
              onPress={() => setShowUPIInfo(!showUPIInfo)}
            >
              <Text style={styles.upiInfoTitle}>What is a UPI ID?</Text>
              {showUPIInfo ? (
                <ChevronUp size={16} color="#0A84FF" />
              ) : (
                <ChevronDown size={16} color="#0A84FF" />
              )}
            </TouchableOpacity>

            {showUPIInfo && (
              <View style={styles.upiInfoContent}>
                <Text style={styles.upiInfoText}>
                  A UPI ID is your unique identifier for UPI payments. It's
                  usually in the format yourname@bankname or yourname@upi.
                </Text>
                <Text style={styles.upiInfoText}>
                  Examples: johndoe@okicici, johndoe@ybl, johndoe@paytm
                </Text>
              </View>
            )}
          </View>

          {/* Withdrawal Time Note */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              Withdrawal typically takes 24-48 hours to reflect in your bank
              account. There are no fees for withdrawals.
            </Text>
          </View>

          {/* Withdraw Button */}
          <Button
            mode="contained"
            onPress={handleWithdraw}
            style={styles.withdrawButton}
            loading={loading}
            disabled={isWithdrawDisabled()}
          >
            Withdraw ₹{amount || "0"}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Dialog */}
      <Portal>
        <Dialog
          visible={showSuccessDialog}
          dismissable={false}
          style={styles.successDialog}
        >
          <LinearGradient
            colors={["#0A84FF", "#30D158"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.successGradient}
          >
            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Withdrawal Initiated!</Text>
            <Text style={styles.successText}>
              ₹{amount} will be transferred to {upiId} within 24-48 hours
            </Text>
          </LinearGradient>
        </Dialog>
      </Portal>
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
  headerRight: {
    width: 40,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  balanceCard: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: "#0A84FF",
  },
  cardDark: {
    backgroundColor: "#0A84FF", // Keep the same color for visibility
  },
  balanceCardContent: {
    padding: 16,
    alignItems: "center",
  },
  balanceLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceAmount: {
    fontFamily: "Inter-Bold",
    fontSize: 28,
    color: "#FFFFFF",
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
  },
  inputOutline: {
    borderRadius: 8,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#FF3B30",
    marginTop: 8,
  },
  helperText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
    marginTop: 8,
  },
  predefinedAmounts: {
    flexDirection: "row",
    marginTop: 16,
  },
  amountChip: {
    marginRight: 8,
  },
  selectedAmountChip: {
    backgroundColor: "#EBF6FF",
  },
  upiInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  upiInfoTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#0A84FF",
  },
  upiInfoContent: {
    backgroundColor: "#EBF6FF",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  upiInfoText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#0A0A0A",
    marginBottom: 8,
  },
  noteContainer: {
    backgroundColor: "#FFF2E6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  noteText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#FF9F0A",
  },
  withdrawButton: {
    borderRadius: 8,
    marginBottom: 16,
    paddingVertical: 8,
  },
  successDialog: {
    backgroundColor: "transparent",
    elevation: 0,
  },
  successGradient: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    padding: 24,
  },
  successIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successIcon: {
    fontFamily: "Inter-Bold",
    fontSize: 32,
    color: "#FFFFFF",
  },
  successTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  successText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.9,
  },
  textLight: {
    color: "#FFFFFF",
  },
});
