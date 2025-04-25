// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Receipt } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/context/ThemeContext";
import { Button, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { theme } from "@/constants/theme";
import { HomeHeader } from "@/components/home/HomeHeader";
import { BalanceCard } from "@/components/shared/BalanceCard";
import { BillCard } from "@/components/shared/BillCard";
import { useAuth } from "@/context/AuthContext";
import { LeaderboardPreview } from "@/components/home/LeaderboardPreview";

export default function HomeScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentCashbacks, setRecentCashbacks] = useState([]);
  const [walletData, setWalletData] = useState({
    totalEarned: "0.00",
    availableBalance: "0.00",
    pendingAmount: "0.00",
    withdrawnAmount: "0.00",
  });

  const { user } = useAuth();
  const userId = user.id;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch wallet data
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_REST_API}/api/wallet/?userId=${userId}`
      );

      const data = await response.json();
      setWalletData(data.wallet);
      setRecentInvoices(data.recentInvoices);
      setRecentCashbacks(data.cashbacks);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }
      >
        <HomeHeader />
        <BalanceCard
          balance={walletData.availableBalance}
          label="Available Cashback"
        />
        <LeaderboardPreview />
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
              <ActivityIndicator size="small" color={theme.colors.pri} />
            </View>
          ) : recentInvoices.length > 0 ? (
            <View style={styles.billsList}>
              {recentInvoices.map((invoice) => (
                <BillCard key={invoice.id} {...invoice} />
              ))}

              <TouchableOpacity
                style={[styles.addBillCard, isDark && styles.addBillCardDark]}
                onPress={() => router.push("/upload-invoice")}
              >
                <Plus size={24} color={theme.colors.primary} />
                <Text style={styles.addBillText}>Add New Bill</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Receipt size={48} color="#AFAFAF" />
              <Text style={styles.emptyStateText}>No bills yet</Text>
              <Button
                mode="contained"
                onPress={() => router.push("/upload-invoice")}
                style={styles.emptyStateButton}
              >
                Add Your First Bill
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
            <TouchableOpacity onPress={() => router.push("/(tabs)/wallet")}>
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : recentCashbacks.length > 0 ? (
            <View style={styles.cashbacksList}>
              {recentCashbacks.map((cashback) => (
                <BillCard key={cashback.id} {...cashback} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Receipt size={48} color="#AFAFAF" />
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
    color: theme.colors.primary,
  },
  billsList: {
    marginHorizontal: -4,
  },
  addBillCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 12,
    marginHorizontal: 4,
    marginTop: 8,
  },
  addBillCardDark: {
    backgroundColor: theme.colors.primaryContainer,
  },
  addBillText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: theme.colors.primary,
    marginLeft: 8,
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
