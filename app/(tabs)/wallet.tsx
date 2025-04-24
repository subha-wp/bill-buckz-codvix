// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl, // Import RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Clock,
  Banknote,
  CircleCheck as CheckCircle,
  CircleAlert as AlertCircle,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/context/ThemeContext";
import {
  Button,
  Chip,
  Divider,
  ActivityIndicator,
  Card,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { theme } from "@/constants/theme";

export default function WalletScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("withdrawals");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletData, setWalletData] = useState({
    totalEarned: "0.00",
    availableBalance: "0.00",
    pendingAmount: "0.00",
    withdrawnAmount: "0.00",
  });
  const [withdrawals, setWithdrawals] = useState([]);
  const [cashbacks, setCashbacks] = useState([]);

  const { user } = useAuth();

  // Replace with actual user ID from your authentication system
  const userId = user.id;

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_REST_API}/api/wallet?userId=${userId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Properly parse JSON from fetch response

      setWalletData(data.wallet);
      setWithdrawals(data.withdrawals);
      setCashbacks(data.cashbacks);
      setError(null);
    } catch (err) {
      console.error("Error fetching wallet data:", err);
      setError("Failed to load wallet data. Please try again.");
      Alert.alert("Error", "Failed to load wallet data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#30D158";
      case "Processing":
        return "#FF9F0A";
      case "Failed":
        return "#FF3B30";
      default:
        return "#6B6B6B";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={20} color="#30D158" />;
      case "Processing":
        return <Clock size={20} color="#FF9F0A" />;
      case "Failed":
        return <AlertCircle size={20} color="#FF3B30" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchWalletData} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, isDark && styles.textLight]}>
            Wallet
          </Text>
        </View>

        {/* Balance Card */}
        <LinearGradient
          colors={["#e8cc6d", "#D4AF37"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Total Cashback Earned</Text>
            <Chip
              style={styles.balanceBadge}
              textStyle={styles.balanceBadgeText}
            >
              Available
            </Chip>
          </View>
          <Text style={styles.balanceAmount}>₹{walletData.totalEarned}</Text>
          <View style={styles.balanceInfo}>
            <View style={styles.balanceInfoItem}>
              <Text style={styles.balanceInfoLabel}>Available</Text>
              <Text style={styles.balanceInfoValue}>
                ₹{walletData.availableBalance}
              </Text>
            </View>
            <View style={styles.balanceInfoDivider} />
            <View style={styles.balanceInfoItem}>
              <Text style={styles.balanceInfoLabel}>Pending</Text>
              <Text style={styles.balanceInfoValue}>
                ₹{walletData.pendingAmount}
              </Text>
            </View>
            <View style={styles.balanceInfoDivider} />
            <View style={styles.balanceInfoItem}>
              <Text style={styles.balanceInfoLabel}>Withdrawn</Text>
              <Text style={styles.balanceInfoValue}>
                ₹{walletData.withdrawnAmount}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            icon={() => <ArrowUp size={16} color={theme.colors.secondary} />}
            style={styles.withdrawButton}
            onPress={() => router.push("/withdraw")}
          >
            Withdraw
          </Button>
          <Button
            mode="outlined"
            icon={() => <ArrowDown size={16} color={theme.colors.primary} />}
            style={styles.historyButton}
            onPress={() => router.push("/cashbacks")}
          >
            History
          </Button>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "withdrawals" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("withdrawals")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "withdrawals" && styles.activeTabText,
              ]}
            >
              Withdrawals
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "cashbacks" && styles.activeTab]}
            onPress={() => setActiveTab("cashbacks")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "cashbacks" && styles.activeTabText,
              ]}
            >
              Cashbacks
            </Text>
          </TouchableOpacity>
        </View>

        <Divider style={styles.divider} />

        {/* Withdrawals List */}
        {activeTab === "withdrawals" && (
          <View style={styles.withdrawalsContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0A84FF" />
              </View>
            ) : withdrawals.length > 0 ? (
              <View style={styles.withdrawalsList}>
                {withdrawals.map((withdrawal) => (
                  <Card
                    key={withdrawal.id}
                    style={[styles.withdrawalCard, isDark && styles.cardDark]}
                    onPress={() => router.push(`/withdrawals/${withdrawal.id}`)}
                  >
                    <View style={styles.withdrawalCardContent}>
                      <View style={styles.withdrawalIconContainer}>
                        <Banknote size={24} color="#0A84FF" />
                      </View>
                      <View style={styles.withdrawalDetails}>
                        <View style={styles.withdrawalHeaderRow}>
                          <Text
                            style={[
                              styles.withdrawalTitle,
                              isDark && styles.textLight,
                            ]}
                          >
                            Withdrawal to UPI
                          </Text>
                          {getStatusIcon(withdrawal.status)}
                        </View>
                        <Text style={styles.withdrawalDate}>
                          {withdrawal.date} • {withdrawal.time}
                        </Text>
                        <View style={styles.withdrawalStatus}>
                          <Text
                            style={[
                              styles.withdrawalStatusText,
                              { color: getStatusColor(withdrawal.status) },
                            ]}
                          >
                            {withdrawal.status}
                          </Text>
                          {withdrawal.upiId && (
                            <Text style={styles.withdrawalUpi}>
                              • {withdrawal.upiId}
                            </Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.withdrawalAmount}>
                        <Text
                          style={[
                            styles.withdrawalAmountText,
                            isDark && styles.textLight,
                          ]}
                        >
                          ₹{withdrawal.amount}
                        </Text>
                        <ChevronRight size={16} color="#AFAFAF" />
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <ArrowUp size={48} color="#AFAFAF" />
                <Text style={styles.emptyStateText}>No withdrawals yet</Text>
              </View>
            )}
          </View>
        )}

        {/* Cashbacks List */}
        {activeTab === "cashbacks" && (
          <View style={styles.cashbacksContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0A84FF" />
              </View>
            ) : cashbacks.length > 0 ? (
              <View style={styles.cashbacksList}>
                {cashbacks.map((cashback) => (
                  <Card
                    key={cashback.id}
                    style={[styles.withdrawalCard, isDark && styles.cardDark]}
                  >
                    <View style={styles.withdrawalCardContent}>
                      <View style={styles.withdrawalIconContainer}>
                        <ArrowDown size={24} color="#0A84FF" />
                      </View>
                      <View style={styles.withdrawalDetails}>
                        <View style={styles.withdrawalHeaderRow}>
                          <Text
                            style={[
                              styles.withdrawalTitle,
                              isDark && styles.textLight,
                            ]}
                          >
                            {cashback.merchantName}
                          </Text>
                        </View>
                        <Text style={styles.withdrawalDate}>
                          {cashback.date} • {cashback.time}
                        </Text>
                        <View style={styles.withdrawalStatus}>
                          <Text
                            style={[
                              styles.withdrawalStatusText,
                              { color: "#30D158" },
                            ]}
                          >
                            {cashback.type}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.withdrawalAmount}>
                        <Text
                          style={[
                            styles.withdrawalAmountText,
                            isDark && styles.textLight,
                          ]}
                        >
                          ₹{cashback.amount}
                        </Text>
                        <ChevronRight size={16} color="#AFAFAF" />
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <ArrowDown size={48} color="#AFAFAF" />
                <Text style={styles.emptyStateText}>No cashbacks yet</Text>
                <Button
                  mode="contained"
                  onPress={() => router.push("/cashbacks")}
                  style={styles.emptyStateButton}
                >
                  View Cashbacks
                </Button>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles remain the same as in your original component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  containerDark: {
    backgroundColor: "#1E1E1E",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  textLight: {
    color: "#fff",
  },
  balanceCard: {
    backgroundColor: "#D4AF37",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#fff",
  },
  balanceBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  balanceBadgeText: {
    color: "#fff",
    fontSize: 12,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  balanceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceInfoItem: {
    flex: 1,
  },
  balanceInfoLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  balanceInfoValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  balanceInfoDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  withdrawButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: theme.colors.primary,
  },
  historyButton: {
    flex: 1,
    marginLeft: 10,
    borderColor: theme.colors.primary,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "#eee",
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  divider: {
    marginBottom: 20,
  },
  withdrawalsContainer: {
    flex: 1,
  },
  withdrawalsList: {
    flex: 1,
  },
  withdrawalCard: {
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  cardDark: {
    backgroundColor: "#2C2C2E",
  },
  withdrawalCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  withdrawalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(10, 132, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  withdrawalDetails: {
    flex: 1,
  },
  withdrawalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  withdrawalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  withdrawalDate: {
    fontSize: 12,
    color: "#6B6B6B",
  },
  withdrawalStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  withdrawalStatusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  withdrawalUpi: {
    fontSize: 12,
    color: "#6B6B6B",
  },
  withdrawalAmount: {
    alignItems: "flex-end",
  },
  withdrawalAmountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cashbacksContainer: {
    flex: 1,
  },
  cashbacksList: {
    flex: 1,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyStateContainer: {
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#AFAFAF",
    marginTop: 10,
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: "#0A84FF",
  },
});
