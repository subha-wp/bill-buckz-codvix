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
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronRight,
  Receipt,
  CircleCheck as CheckCircle,
  CircleAlert as AlertCircle,
  Clock,
  Store,
  FileText,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/context/ThemeContext";
import { Button, Chip, Divider, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { theme } from "@/constants/theme";

export default function InvoicesScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("merchant");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [invoiceData, setInvoiceData] = useState({
    totalInvoices: 0,
    pendingInvoices: 0,
    approvedInvoices: 0,
    rejectedInvoices: 0,
    merchantInvoices: [],
    nonMerchantInvoices: [],
  });

  const { user } = useAuth();

  // Replace with actual user ID from your authentication system
  const userId = user.id;

  useEffect(() => {
    fetchInvoiceData(1, true);
  }, []);

  // Reset pagination when tab changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    if (
      invoiceData.merchantInvoices.length === 0 &&
      invoiceData.nonMerchantInvoices.length === 0
    ) {
      fetchInvoiceData(1, true);
    }
  }, [activeTab]);

  const fetchInvoiceData = async (pageNum = 1, refresh = false) => {
    if (refresh) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_REST_API}/api/expo/invoices?userId=${userId}&page=${pageNum}&limit=10`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (refresh) {
        // Replace data on refresh
        setInvoiceData(data);
      } else {
        // Append new invoices to existing list
        setInvoiceData((prev) => ({
          ...data,
          merchantInvoices: [
            ...prev.merchantInvoices,
            ...data.merchantInvoices,
          ],
          nonMerchantInvoices: [
            ...prev.nonMerchantInvoices,
            ...data.nonMerchantInvoices,
          ],
        }));
      }

      setHasMore(data.pagination.hasMore);
      setError(null);
    } catch (err) {
      console.error("Error fetching invoice data:", err);
      setError("Failed to load invoice data. Please try again.");
      Alert.alert("Error", "Failed to load invoice data. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchInvoiceData(nextPage, false);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchInvoiceData(1, true);
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "#30D158";
      case "PENDING":
        return "#FF9F0A";
      case "REJECTED":
        return "#FF3B30";
      default:
        return "#6B6B6B";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle size={20} color="#30D158" />;
      case "PENDING":
        return <Clock size={20} color="#FF9F0A" />;
      case "REJECTED":
        return <AlertCircle size={20} color="#FF3B30" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading && !loadingMore}
            onRefresh={handleRefresh}
          />
        }
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, isDark && styles.textLight]}>
            Invoices
          </Text>
        </View>

        {/* Summary Card */}
        <LinearGradient
          colors={["#e8cc6d", "#D4AF37"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryLabel}>Total Invoices</Text>
            <Chip
              style={styles.summaryBadge}
              textStyle={styles.summaryBadgeText}
            >
              {invoiceData.totalInvoices}
            </Chip>
          </View>
          <Text style={styles.summaryAmount}>{invoiceData.totalInvoices}</Text>
          <View style={styles.summaryInfo}>
            <View style={styles.summaryInfoItem}>
              <Text style={styles.summaryInfoLabel}>Pending</Text>
              <Text style={styles.summaryInfoValue}>
                {invoiceData.pendingInvoices}
              </Text>
            </View>
            <View style={styles.summaryInfoDivider} />
            <View style={styles.summaryInfoItem}>
              <Text style={styles.summaryInfoLabel}>Approved</Text>
              <Text style={styles.summaryInfoValue}>
                {invoiceData.approvedInvoices}
              </Text>
            </View>
            <View style={styles.summaryInfoDivider} />
            <View style={styles.summaryInfoItem}>
              <Text style={styles.summaryInfoLabel}>Rejected</Text>
              <Text style={styles.summaryInfoValue}>
                {invoiceData.rejectedInvoices}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            icon={() => <Receipt size={16} color={theme.colors.secondary} />}
            style={styles.uploadButton}
            onPress={() => router.push("/upload-invoice")}
          >
            Upload Invoice
          </Button>
          <Button
            mode="outlined"
            icon={() => <FileText size={16} color={theme.colors.primary} />}
            style={styles.historyButton}
            onPress={() => router.push("/cashbacks")}
          >
            Cashbacks
          </Button>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "merchant" && styles.activeTab]}
            onPress={() => setActiveTab("merchant")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "merchant" && styles.activeTabText,
              ]}
            >
              Merchant
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "nonMerchant" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("nonMerchant")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "nonMerchant" && styles.activeTabText,
              ]}
            >
              Non-Merchant
            </Text>
          </TouchableOpacity>
        </View>

        <Divider style={styles.divider} />

        {/* Merchant Invoices List */}
        {activeTab === "merchant" && (
          <View style={styles.invoicesContainer}>
            {loading && !loadingMore ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0A84FF" />
              </View>
            ) : invoiceData.merchantInvoices.length > 0 ? (
              <View style={styles.invoicesList}>
                {invoiceData.merchantInvoices.map((invoice) => (
                  <Card
                    key={invoice.id}
                    style={[styles.invoiceCard, isDark && styles.cardDark]}
                    onPress={() => router.push(`/invoices/${invoice.id}`)}
                  >
                    <View style={styles.invoiceCardContent}>
                      <View style={styles.invoiceIconContainer}>
                        <Store size={24} color="#0A84FF" />
                      </View>
                      <View style={styles.invoiceDetails}>
                        <View style={styles.invoiceHeaderRow}>
                          <Text
                            style={[
                              styles.invoiceTitle,
                              isDark && styles.textLight,
                            ]}
                          >
                            {invoice.merchant?.name || "Merchant Invoice"}
                          </Text>
                          {getStatusIcon(invoice.status)}
                        </View>
                        <Text style={styles.invoiceDate}>
                          {formatDate(invoice.createdAt)} •{" "}
                          {formatTime(invoice.createdAt)}
                        </Text>
                        <View style={styles.invoiceStatus}>
                          <Text
                            style={[
                              styles.invoiceStatusText,
                              { color: getStatusColor(invoice.status) },
                            ]}
                          >
                            {invoice.status}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.invoiceAmount}>
                        <Text
                          style={[
                            styles.invoiceAmountText,
                            isDark && styles.textLight,
                          ]}
                        >
                          ₹{invoice.amount}
                        </Text>
                        <ChevronRight size={16} color="#AFAFAF" />
                      </View>
                    </View>
                  </Card>
                ))}
                {loadingMore && (
                  <View style={styles.loadMoreContainer}>
                    <ActivityIndicator size="small" color="#0A84FF" />
                  </View>
                )}
                {!hasMore && invoiceData.merchantInvoices.length > 0 && (
                  <Text style={styles.endOfListText}>
                    No more invoices to load
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Receipt size={48} color="#AFAFAF" />
                <Text style={styles.emptyStateText}>
                  No merchant invoices yet
                </Text>
                <Button
                  mode="contained"
                  onPress={() => router.push("/upload-invoice")}
                  style={styles.emptyStateButton}
                >
                  Upload Invoice
                </Button>
              </View>
            )}
          </View>
        )}

        {/* Non-Merchant Invoices List */}
        {activeTab === "nonMerchant" && (
          <View style={styles.invoicesContainer}>
            {loading && !loadingMore ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0A84FF" />
              </View>
            ) : invoiceData.nonMerchantInvoices.length > 0 ? (
              <View style={styles.invoicesList}>
                {invoiceData.nonMerchantInvoices.map((invoice) => (
                  <Card
                    key={invoice.id}
                    style={[styles.invoiceCard, isDark && styles.cardDark]}
                    onPress={() => router.push(`/invoices/${invoice.id}`)}
                  >
                    <View style={styles.invoiceCardContent}>
                      <View style={styles.invoiceIconContainer}>
                        <FileText size={24} color="#0A84FF" />
                      </View>
                      <View style={styles.invoiceDetails}>
                        <View style={styles.invoiceHeaderRow}>
                          <Text
                            style={[
                              styles.invoiceTitle,
                              isDark && styles.textLight,
                            ]}
                          >
                            Non-Merchant Invoice
                          </Text>
                          {getStatusIcon(invoice.status)}
                        </View>
                        <Text style={styles.invoiceDate}>
                          {formatDate(invoice.createdAt)} •{" "}
                          {formatTime(invoice.createdAt)}
                        </Text>
                        <View style={styles.invoiceStatus}>
                          <Text
                            style={[
                              styles.invoiceStatusText,
                              { color: getStatusColor(invoice.status) },
                            ]}
                          >
                            {invoice.status}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.invoiceAmount}>
                        <Text
                          style={[
                            styles.invoiceAmountText,
                            isDark && styles.textLight,
                          ]}
                        >
                          ₹{invoice.amount}
                        </Text>
                        <ChevronRight size={16} color="#AFAFAF" />
                      </View>
                    </View>
                  </Card>
                ))}
                {loadingMore && (
                  <View style={styles.loadMoreContainer}>
                    <ActivityIndicator size="small" color="#0A84FF" />
                  </View>
                )}
                {!hasMore && invoiceData.nonMerchantInvoices.length > 0 && (
                  <Text style={styles.endOfListText}>
                    No more invoices to load
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <FileText size={48} color="#AFAFAF" />
                <Text style={styles.emptyStateText}>
                  No non-merchant invoices yet
                </Text>
                <Button
                  mode="contained"
                  onPress={() => router.push("/upload-invoice")}
                  style={styles.emptyStateButton}
                >
                  Upload Invoice
                </Button>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
  summaryCard: {
    backgroundColor: "#D4AF37",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#fff",
  },
  summaryBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  summaryBadgeText: {
    color: "#fff",
    fontSize: 12,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  summaryInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryInfoItem: {
    flex: 1,
  },
  summaryInfoLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  summaryInfoValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  summaryInfoDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  uploadButton: {
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
  invoicesContainer: {
    flex: 1,
  },
  invoicesList: {
    flex: 1,
  },
  invoiceCard: {
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  cardDark: {
    backgroundColor: "#2C2C2E",
  },
  invoiceCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  invoiceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(10, 132, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  invoiceDetails: {
    flex: 1,
  },
  invoiceHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  invoiceDate: {
    fontSize: 12,
    color: "#6B6B6B",
  },
  invoiceStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  invoiceStatusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  invoiceAmount: {
    alignItems: "flex-end",
  },
  invoiceAmountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadMoreContainer: {
    padding: 10,
    alignItems: "center",
  },
  endOfListText: {
    textAlign: "center",
    color: "#AFAFAF",
    padding: 10,
    fontSize: 12,
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
