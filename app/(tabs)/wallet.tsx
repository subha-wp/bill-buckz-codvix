// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
import { mockWithdrawals } from "@/data/mockData";

export default function WalletScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("withdrawals");
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    // Simulate API call to fetch data
    setTimeout(() => {
      setWithdrawals(mockWithdrawals);
      setLoading(false);
    }, 1000);
  }, []);

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
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, isDark && styles.textLight]}>
            Wallet
          </Text>
        </View>

        {/* Balance Card */}
        <LinearGradient
          colors={["#0A84FF", "#30D158"]}
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
          <Text style={styles.balanceAmount}>₹3,280.50</Text>
          <View style={styles.balanceInfo}>
            <View style={styles.balanceInfoItem}>
              <Text style={styles.balanceInfoLabel}>Available</Text>
              <Text style={styles.balanceInfoValue}>₹1,245.85</Text>
            </View>
            <View style={styles.balanceInfoDivider} />
            <View style={styles.balanceInfoItem}>
              <Text style={styles.balanceInfoLabel}>Pending</Text>
              <Text style={styles.balanceInfoValue}>₹320.00</Text>
            </View>
            <View style={styles.balanceInfoDivider} />
            <View style={styles.balanceInfoItem}>
              <Text style={styles.balanceInfoLabel}>Withdrawn</Text>
              <Text style={styles.balanceInfoValue}>₹1,714.65</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            icon={() => <ArrowUp size={16} color="#FFFFFF" />}
            style={styles.withdrawButton}
            onPress={() => router.push("/withdraw")}
          >
            Withdraw
          </Button>
          <Button
            mode="outlined"
            icon={() => <ArrowDown size={16} color="#0A84FF" />}
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
                <Button
                  mode="contained"
                  onPress={() => router.push("/withdraw")}
                  style={styles.emptyStateButton}
                >
                  Withdraw Now
                </Button>
              </View>
            )}
          </View>
        )}

        {/* Cashbacks List - stub for the alternative tab */}
        {activeTab === "cashbacks" && (
          <View style={styles.cashbacksContainer}>
            <View style={styles.emptyStateContainer}>
              <ArrowDown size={48} color="#AFAFAF" />
              <Text style={styles.emptyStateText}>
                Switch to the cashbacks tab to view your earnings
              </Text>
              <Button
                mode="contained"
                onPress={() => router.push("/cashbacks")}
                style={styles.emptyStateButton}
              >
                View Cashbacks
              </Button>
            </View>
          </View>
        )}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#0A0A0A",
  },
  balanceCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  balanceLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  balanceBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginLeft: 8,
  },
  balanceBadgeText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#FFFFFF",
  },
  balanceAmount: {
    fontFamily: "Inter-Bold",
    fontSize: 32,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  balanceInfo: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 12,
  },
  balanceInfoItem: {
    flex: 1,
    alignItems: "center",
  },
  balanceInfoLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 4,
  },
  balanceInfoValue: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  balanceInfoDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 8,
  },
  actionButtons: {
    flexDirection: "row",
    marginBottom: 24,
  },
  withdrawButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 8,
  },
  historyButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#0A84FF",
  },
  tabText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#6B6B6B",
  },
  activeTabText: {
    color: "#0A84FF",
  },
  divider: {
    marginBottom: 16,
  },
  withdrawalsContainer: {
    marginBottom: 24,
  },
  cashbacksContainer: {
    marginBottom: 24,
  },
  withdrawalsList: {},
  withdrawalCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  withdrawalCardContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  withdrawalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EBF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  withdrawalDate: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
    marginBottom: 4,
  },
  withdrawalStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  withdrawalStatusText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
  },
  withdrawalUpi: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
  },
  withdrawalAmount: {
    alignItems: "flex-end",
  },
  withdrawalAmountText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
  },
  emptyStateText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#6B6B6B",
    marginTop: 12,
    marginBottom: 16,
    textAlign: "center",
  },
  emptyStateButton: {
    borderRadius: 20,
  },
  textLight: {
    color: "#FFFFFF",
  },
});
