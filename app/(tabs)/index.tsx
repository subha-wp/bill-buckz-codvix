// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Receipt,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/context/ThemeContext";
import { Card, Button, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { mockInvoices, mockCashbacks } from "@/data/mockData";

export default function HomeScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentCashbacks, setRecentCashbacks] = useState([]);

  useEffect(() => {
    // Simulate API call to fetch data
    setTimeout(() => {
      setRecentInvoices(mockInvoices.slice(0, 3));
      setRecentCashbacks(mockCashbacks.slice(0, 3));
      setLoading(false);
    }, 1000);
  }, []);

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
          <Text style={[styles.greeting, isDark && styles.textLight]}>
            Good morning, Alex
          </Text>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color={isDark ? "#FFFFFF" : "#0A0A0A"} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <LinearGradient
          colors={["#0A84FF", "#30D158"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Available Cashback</Text>
            <View style={styles.balanceBadge}>
              <Text style={styles.balanceBadgeText}>Withdrawable</Text>
            </View>
          </View>
          <Text style={styles.balanceAmount}>₹1,245.85</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity
              style={styles.balanceAction}
              onPress={() => router.push("/(tabs)/wallet")}
            >
              <View style={styles.balanceActionIcon}>
                <ArrowUp size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.balanceActionText}>Withdraw</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.balanceAction}
              onPress={() => router.push("/(tabs)/scan")}
            >
              <View style={styles.balanceActionIcon}>
                <Receipt size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.balanceActionText}>Scan Bill</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Recent Bills */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
              Recent Bills
            </Text>
            <TouchableOpacity onPress={() => router.push("/invoices")}>
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0A84FF" />
            </View>
          ) : recentInvoices.length > 0 ? (
            <View style={styles.billsList}>
              {recentInvoices.map((invoice, index) => (
                <Card
                  key={invoice.id}
                  style={[styles.billCard, isDark && styles.cardDark]}
                  onPress={() => router.push(`/invoices/${invoice.id}`)}
                >
                  <View style={styles.billCardContent}>
                    <View style={styles.billIconContainer}>
                      <Receipt size={24} color="#0A84FF" />
                    </View>
                    <View style={styles.billDetails}>
                      <Text
                        style={[
                          styles.billMerchant,
                          isDark && styles.textLight,
                        ]}
                      >
                        {invoice.merchant}
                      </Text>
                      <Text style={styles.billDate}>{invoice.date}</Text>
                    </View>
                    <View style={styles.billAmount}>
                      <Text
                        style={[
                          styles.billAmountText,
                          isDark && styles.textLight,
                        ]}
                      >
                        ₹{invoice.amount}
                      </Text>
                      <Text
                        style={[
                          styles.billCashback,
                          {
                            color:
                              invoice.cashbackStatus === "Credited"
                                ? "#30D158"
                                : "#FF9F0A",
                          },
                        ]}
                      >
                        ₹{invoice.cashbackAmount} {invoice.cashbackStatus}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}

              <TouchableOpacity
                style={[styles.addBillCard, isDark && styles.addBillCardDark]}
                onPress={() => router.push("/(tabs)/scan")}
              >
                <Plus size={24} color="#0A84FF" />
                <Text style={styles.addBillText}>Scan New Bill</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Receipt size={48} color="#AFAFAF" />
              <Text style={styles.emptyStateText}>No bills yet</Text>
              <Button
                mode="contained"
                onPress={() => router.push("/(tabs)/scan")}
                style={styles.emptyStateButton}
              >
                Scan Your First Bill
              </Button>
            </View>
          )}
        </View>

        {/* Cashback Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
              Cashback Activity
            </Text>
            <TouchableOpacity onPress={() => router.push("/cashbacks")}>
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0A84FF" />
            </View>
          ) : recentCashbacks.length > 0 ? (
            <View style={styles.cashbacksList}>
              {recentCashbacks.map((cashback) => (
                <Card
                  key={cashback.id}
                  style={[styles.cashbackCard, isDark && styles.cardDark]}
                  onPress={() => {}}
                >
                  <View style={styles.cashbackCardContent}>
                    <View
                      style={[
                        styles.cashbackIconContainer,
                        {
                          backgroundColor:
                            cashback.type === "credited"
                              ? "#E1F5E8"
                              : "#FFF2E6",
                        },
                      ]}
                    >
                      {cashback.type === "credited" ? (
                        <ArrowDown size={24} color="#30D158" />
                      ) : (
                        <ArrowUp size={24} color="#FF9F0A" />
                      )}
                    </View>
                    <View style={styles.cashbackDetails}>
                      <Text
                        style={[
                          styles.cashbackTitle,
                          isDark && styles.textLight,
                        ]}
                      >
                        {cashback.title}
                      </Text>
                      <Text style={styles.cashbackDate}>{cashback.date}</Text>
                    </View>
                    <Text
                      style={[
                        styles.cashbackAmount,
                        {
                          color:
                            cashback.type === "credited"
                              ? "#30D158"
                              : "#FF9F0A",
                        },
                      ]}
                    >
                      {cashback.type === "credited" ? "+" : "-"}₹
                      {cashback.amount}
                    </Text>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Wallet size={48} color="#AFAFAF" />
              <Text style={styles.emptyStateText}>
                No cashback activity yet
              </Text>
            </View>
          )}
        </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#0A0A0A",
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
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
  balanceActions: {
    flexDirection: "row",
  },
  balanceAction: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  balanceActionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  balanceActionText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
  },
  sectionLink: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#0A84FF",
  },
  billsList: {
    marginHorizontal: -4,
  },
  billCard: {
    marginBottom: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  billCardContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  billIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EBF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  billDetails: {
    flex: 1,
  },
  billMerchant: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  billDate: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
  },
  billAmount: {
    alignItems: "flex-end",
  },
  billAmountText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  billCashback: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
  },
  addBillCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    marginHorizontal: 4,
    marginTop: 8,
  },
  addBillCardDark: {
    backgroundColor: "#2A2A2A",
  },
  addBillText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#0A84FF",
    marginLeft: 8,
  },
  cashbacksList: {
    marginHorizontal: -4,
  },
  cashbackCard: {
    marginBottom: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },
  cashbackCardContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  cashbackIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cashbackDetails: {
    flex: 1,
  },
  cashbackTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 4,
  },
  cashbackDate: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
  },
  cashbackAmount: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
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
  },
  emptyStateButton: {
    borderRadius: 20,
  },
  textLight: {
    color: "#FFFFFF",
  },
});
