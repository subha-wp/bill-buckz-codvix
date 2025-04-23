import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Store,
  CalendarDays,
  ReceiptText,
  Banknote,
  CircleCheck as CheckCircle,
  X,
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Card, Divider, Portal, Dialog } from "react-native-paper";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

export default function BillDetailsScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [showCashbackDialog, setShowCashbackDialog] = useState(false);

  const handleConfirm = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setShowCashbackDialog(true);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setShowCashbackDialog(false);
      router.replace("/(tabs)");
    }, 3000);
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
          Bill Details
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bill Preview */}
        <Card style={[styles.billPreviewCard, isDark && styles.cardDark]}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/4127636/pexels-photo-4127636.jpeg",
            }}
            style={styles.billImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.fullscreenButton}>
            <Text style={styles.fullscreenButtonText}>View Fullscreen</Text>
          </TouchableOpacity>
        </Card>

        {/* Bill Information */}
        <Card style={[styles.billInfoCard, isDark && styles.cardDark]}>
          <View style={styles.billInfoHeader}>
            <Text style={[styles.billInfoTitle, isDark && styles.textLight]}>
              Bill Information
            </Text>
          </View>

          <View style={styles.billInfoItem}>
            <View style={styles.billInfoItemHeader}>
              <Store size={20} color="#0A84FF" />
              <Text
                style={[styles.billInfoItemLabel, isDark && styles.textLight]}
              >
                Merchant
              </Text>
            </View>
            <Text
              style={[styles.billInfoItemValue, isDark && styles.textLight]}
            >
              SuperMart Grocery Store
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.billInfoItem}>
            <View style={styles.billInfoItemHeader}>
              <CalendarDays size={20} color="#0A84FF" />
              <Text
                style={[styles.billInfoItemLabel, isDark && styles.textLight]}
              >
                Date & Time
              </Text>
            </View>
            <Text
              style={[styles.billInfoItemValue, isDark && styles.textLight]}
            >
              April 15, 2025 • 2:30 PM
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.billInfoItem}>
            <View style={styles.billInfoItemHeader}>
              <ReceiptText size={20} color="#0A84FF" />
              <Text
                style={[styles.billInfoItemLabel, isDark && styles.textLight]}
              >
                Bill Number
              </Text>
            </View>
            <Text
              style={[styles.billInfoItemValue, isDark && styles.textLight]}
            >
              INV-12345
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.billInfoItem}>
            <View style={styles.billInfoItemHeader}>
              <Banknote size={20} color="#0A84FF" />
              <Text
                style={[styles.billInfoItemLabel, isDark && styles.textLight]}
              >
                Total Amount
              </Text>
            </View>
            <Text
              style={[
                styles.billInfoItemValue,
                styles.amountText,
                isDark && styles.textLight,
              ]}
            >
              ₹1,250.00
            </Text>
          </View>
        </Card>

        {/* Cashback Information */}
        <Card style={[styles.cashbackCard, isDark && styles.cardDark]}>
          <View style={styles.cashbackHeader}>
            <Text style={[styles.cashbackTitle, isDark && styles.textLight]}>
              Cashback Details
            </Text>
          </View>

          <LinearGradient
            colors={["rgba(10, 132, 255, 0.1)", "rgba(48, 209, 88, 0.1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cashbackInfo}
          >
            <View style={styles.cashbackAmount}>
              <Text style={styles.cashbackAmountLabel}>Eligible Cashback</Text>
              <Text style={styles.cashbackAmountValue}>₹62.50</Text>
            </View>
            <Text style={styles.cashbackRate}>5% of bill value</Text>
          </LinearGradient>

          <View style={styles.cashbackNote}>
            <Text style={styles.cashbackNoteText}>
              Cashback will be credited to your wallet within 24 hours after
              confirming this bill.
            </Text>
          </View>
        </Card>

        {/* Confirm Button */}
        <Button
          mode="contained"
          onPress={handleConfirm}
          style={styles.confirmButton}
          icon={() => <CheckCircle size={20} color="#FFFFFF" />}
        >
          Confirm Bill Details
        </Button>

        {/* Cancel Button */}
        <Button
          mode="outlined"
          onPress={() => router.replace("/(tabs)")}
          style={styles.cancelButton}
          icon={() => <X size={20} color="#FF3B30" />}
        >
          Cancel
        </Button>
      </ScrollView>

      {/* Cashback Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={showCashbackDialog}
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
            <Text style={styles.successTitle}>Bill Confirmed!</Text>
            <Text style={styles.successText}>
              ₹62.50 cashback will be credited to your wallet soon
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  billPreviewCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  billImage: {
    width: "100%",
    height: 300,
  },
  fullscreenButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  fullscreenButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#FFFFFF",
  },
  billInfoCard: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  billInfoHeader: {
    marginBottom: 16,
  },
  billInfoTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
  },
  billInfoItem: {
    marginVertical: 12,
  },
  billInfoItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  billInfoItemLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#0A0A0A",
    marginLeft: 12,
  },
  billInfoItemValue: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#0A0A0A",
    marginLeft: 32,
  },
  amountText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
  },
  divider: {
    marginVertical: 8,
  },
  cashbackCard: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
  },
  cashbackHeader: {
    marginBottom: 16,
  },
  cashbackTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
  },
  cashbackInfo: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cashbackAmount: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cashbackAmountLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#0A0A0A",
  },
  cashbackAmountValue: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#30D158",
  },
  cashbackRate: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
  },
  cashbackNote: {
    padding: 12,
    backgroundColor: "#EBF6FF",
    borderRadius: 8,
  },
  cashbackNoteText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#0A84FF",
  },
  confirmButton: {
    borderRadius: 8,
    marginBottom: 12,
    paddingVertical: 8,
  },
  cancelButton: {
    borderRadius: 8,
    marginBottom: 16,
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
