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
import { StatusBar } from "expo-status-bar";
import {
  CreditCard,
  Clock,
  IndianRupee,
  ChevronRight,
  CircleAlert as AlertCircle,
  CircleCheck as CheckCircle,
  CircleDollarSign,
  Receipt,
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Card, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { theme } from "@/constants/theme";

export default function PayLaterScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [eligibilityData, setEligibilityData] = useState({
    isEligible: false,
    totalInvoices: 0,
    totalAmount: 0,
    daysRegistered: 0,
    creditLimit: 0,
    availableCredit: 0,
  });

  useEffect(() => {
    checkEligibility();
  }, []);

  const checkEligibility = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_REST_API}/api/expo/paylater/eligibility?userId=${user.id}`
      );
      const data = await response.json();
      setEligibilityData(data);
    } catch (error) {
      console.error("Error checking eligibility:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (value: number, threshold: number) => {
    return value >= threshold ? "#30D158" : "#FF3B30";
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, isDark && styles.textLight]}>
            Pay Later
          </Text>
        </View>

        {/* Credit Card */}
        <LinearGradient
          colors={[theme.colors.firstGradient, theme.colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.creditCard}
        >
          <View style={styles.creditCardHeader}>
            <CreditCard size={24} color="#FFFFFF" />
            <Text style={styles.creditCardType}>BillBuckz Pay Later</Text>
          </View>
          <View style={styles.creditCardBody}>
            <Text style={styles.creditLimit}>
              ₹{eligibilityData.creditLimit.toLocaleString()}
            </Text>
            <Text style={styles.creditLimitLabel}>Credit Limit</Text>
          </View>
          <View style={styles.creditCardFooter}>
            <View style={styles.creditCardInfo}>
              <Text style={styles.creditCardInfoLabel}>Available Credit</Text>
              <Text style={styles.creditCardInfoValue}>
                ₹{eligibilityData.availableCredit.toLocaleString()}
              </Text>
            </View>
            <View style={styles.creditCardChip}>
              <Image
                source={require("@/assets/images/adaptive-icon.png")}
                style={styles.chipImage}
              />
            </View>
          </View>
        </LinearGradient>

        {/* Eligibility Status */}
        <Card style={[styles.eligibilityCard, isDark && styles.cardDark]}>
          <View style={styles.eligibilityHeader}>
            {eligibilityData.isEligible ? (
              <CheckCircle size={24} color="#30D158" />
            ) : (
              <AlertCircle size={24} color="#FF3B30" />
            )}
            <Text style={[styles.eligibilityTitle, isDark && styles.textLight]}>
              {eligibilityData.isEligible
                ? "You're Eligible!"
                : "Complete Requirements"}
            </Text>
          </View>

          <View style={styles.eligibilityCriteria}>
            {/* Total Invoices */}
            <View style={styles.criteriaItem}>
              <View style={styles.criteriaHeader}>
                <Receipt size={20} color={theme.colors.primary} />
                <Text
                  style={[styles.criteriaTitle, isDark && styles.textLight]}
                >
                  Total Invoices
                </Text>
              </View>
              <View style={styles.criteriaStatus}>
                <Text
                  style={[
                    styles.criteriaValue,
                    {
                      color: getStatusColor(eligibilityData.totalInvoices, 30),
                    },
                  ]}
                >
                  {eligibilityData.totalInvoices}/30
                </Text>
                <Text style={styles.criteriaLabel}>Minimum Required</Text>
              </View>
            </View>

            {/* Total Amount */}
            <View style={styles.criteriaItem}>
              <View style={styles.criteriaHeader}>
                <CircleDollarSign size={20} color={theme.colors.primary} />
                <Text
                  style={[styles.criteriaTitle, isDark && styles.textLight]}
                >
                  Total Amount
                </Text>
              </View>
              <View style={styles.criteriaStatus}>
                <Text
                  style={[
                    styles.criteriaValue,
                    {
                      color: getStatusColor(eligibilityData.totalAmount, 30000),
                    },
                  ]}
                >
                  ₹{eligibilityData.totalAmount.toLocaleString()}/30,000
                </Text>
                <Text style={styles.criteriaLabel}>Minimum Required</Text>
              </View>
            </View>

            {/* Days Registered */}
            <View style={styles.criteriaItem}>
              <View style={styles.criteriaHeader}>
                <Clock size={20} color={theme.colors.primary} />
                <Text
                  style={[styles.criteriaTitle, isDark && styles.textLight]}
                >
                  Days Registered
                </Text>
              </View>
              <View style={styles.criteriaStatus}>
                <Text
                  style={[
                    styles.criteriaValue,
                    {
                      color: getStatusColor(eligibilityData.daysRegistered, 45),
                    },
                  ]}
                >
                  {eligibilityData.daysRegistered}/45
                </Text>
                <Text style={styles.criteriaLabel}>Minimum Required</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
            Features & Benefits
          </Text>
          <View style={styles.featuresList}>
            <Card style={[styles.featureCard, isDark && styles.cardDark]}>
              <View style={styles.featureContent}>
                <IndianRupee size={24} color={theme.colors.primary} />
                <Text style={[styles.featureTitle, isDark && styles.textLight]}>
                  Interest-Free Period
                </Text>
                <Text style={styles.featureDescription}>
                  Up to 45 days interest-free period on all your purchases
                </Text>
              </View>
            </Card>

            <Card style={[styles.featureCard, isDark && styles.cardDark]}>
              <View style={styles.featureContent}>
                <Clock size={24} color={theme.colors.primary} />
                <Text style={[styles.featureTitle, isDark && styles.textLight]}>
                  Flexible Repayment
                </Text>
                <Text style={styles.featureDescription}>
                  Choose to pay in full or convert to EMI
                </Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Action Button */}
        <Button
          mode="contained"
          onPress={() => {}}
          style={styles.activateButton}
          disabled={!eligibilityData.isEligible}
        >
          {eligibilityData.isEligible
            ? "Activate Pay Later"
            : "Complete Requirements"}
        </Button>
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
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#0A0A0A",
  },
  creditCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  creditCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  creditCardType: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#FFFFFF",
    marginLeft: 12,
  },
  creditCardBody: {
    marginBottom: 24,
  },
  creditLimit: {
    fontFamily: "Inter-Bold",
    fontSize: 32,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  creditLimitLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  creditCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  creditCardInfo: {},
  creditCardInfoLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.8,
    marginBottom: 4,
  },
  creditCardInfoValue: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  creditCardChip: {
    width: 40,
    height: 30,
    backgroundColor: "#FFD700",
    borderRadius: 4,
  },
  chipImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  eligibilityCard: {
    padding: 16,
    marginBottom: 24,
    borderRadius: 12,
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  eligibilityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  eligibilityTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
    marginLeft: 12,
  },
  eligibilityCriteria: {
    gap: 16,
  },
  criteriaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  criteriaHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  criteriaTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#0A0A0A",
    marginLeft: 12,
  },
  criteriaStatus: {
    alignItems: "flex-end",
  },
  criteriaValue: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    marginBottom: 4,
  },
  criteriaLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#6B6B6B",
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureCard: {
    borderRadius: 12,
    padding: 16,
  },
  featureContent: {
    alignItems: "center",
    gap: 8,
  },
  featureTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
  },
  featureDescription: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
  },
  activateButton: {
    marginBottom: 24,
    borderRadius: 8,
    paddingVertical: 8,
  },
  textLight: {
    color: "#FFFFFF",
  },
});
