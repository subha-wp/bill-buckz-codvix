import React, { useState } from "react";
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
  ChevronLeft,
  DollarSign,
  ChartPie as PieChart,
  Target,
  TrendingUp,
  TriangleAlert as AlertTriangle,
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { TextInput, Button, Card, ProgressBar } from "react-native-paper";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/constants/theme";

export default function SmartBudgetScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [expenses, setExpenses] = useState({
    needs: 0,
    wants: 0,
    savings: 0,
  });

  // Calculate budget splits based on 50/30/20 rule
  const calculateBudget = (income: number) => {
    return {
      needs: income * 0.5,
      wants: income * 0.3,
      savings: income * 0.2,
    };
  };

  const income = parseFloat(monthlyIncome) || 0;
  const budget = calculateBudget(income);

  // Calculate progress for each category
  const getProgress = (category: "needs" | "wants" | "savings") => {
    if (!income) return 0;
    return Math.min(expenses[category] / budget[category], 1);
  };

  // Check if overspending in any category
  const isOverspending = (category: "needs" | "wants" | "savings") => {
    return expenses[category] > budget[category];
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
          <ChevronLeft size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.textLight]}>
          Smart Budget
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Income Input */}
        <Card style={[styles.incomeCard, isDark && styles.cardDark]}>
          <View style={styles.incomeContent}>
            <Text style={[styles.incomeLabel, isDark && styles.textLight]}>
              Monthly Income
            </Text>
            <TextInput
              mode="outlined"
              value={monthlyIncome}
              onChangeText={setMonthlyIncome}
              keyboardType="numeric"
              left={
                <TextInput.Icon
                  icon={() => (
                    <DollarSign size={20} color={theme.colors.primary} />
                  )}
                />
              }
              style={styles.input}
              placeholder="Enter your monthly income"
            />
          </View>
        </Card>

        {/* Budget Breakdown */}
        {income > 0 && (
          <View style={styles.budgetSection}>
            <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
              50/30/20 Rule Breakdown
            </Text>

            {/* Needs */}
            <Card style={[styles.categoryCard, isDark && styles.cardDark]}>
              <LinearGradient
                colors={[theme.colors.primaryContainer, "#FFF8DC"]}
                style={styles.categoryContent}
              >
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryLeft}>
                    <PieChart size={24} color={theme.colors.primary} />
                    <Text
                      style={[styles.categoryTitle, isDark && styles.textLight]}
                    >
                      Needs (50%)
                    </Text>
                  </View>
                  <Text
                    style={[styles.categoryAmount, isDark && styles.textLight]}
                  >
                    ₹{budget.needs.toFixed(2)}
                  </Text>
                </View>
                <ProgressBar
                  progress={getProgress("needs")}
                  color={
                    isOverspending("needs") ? "#FF3B30" : theme.colors.primary
                  }
                  style={styles.progressBar}
                />
                {isOverspending("needs") && (
                  <View style={styles.warningContainer}>
                    <AlertTriangle size={16} color="#FF3B30" />
                    <Text style={styles.warningText}>
                      You're overspending on needs!
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </Card>

            {/* Wants */}
            <Card style={[styles.categoryCard, isDark && styles.cardDark]}>
              <LinearGradient
                colors={[theme.colors.primaryContainer, "#FFF8DC"]}
                style={styles.categoryContent}
              >
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryLeft}>
                    <TrendingUp size={24} color={theme.colors.primary} />
                    <Text
                      style={[styles.categoryTitle, isDark && styles.textLight]}
                    >
                      Wants (30%)
                    </Text>
                  </View>
                  <Text
                    style={[styles.categoryAmount, isDark && styles.textLight]}
                  >
                    ₹{budget.wants.toFixed(2)}
                  </Text>
                </View>
                <ProgressBar
                  progress={getProgress("wants")}
                  color={
                    isOverspending("wants") ? "#FF3B30" : theme.colors.primary
                  }
                  style={styles.progressBar}
                />
                {isOverspending("wants") && (
                  <View style={styles.warningContainer}>
                    <AlertTriangle size={16} color="#FF3B30" />
                    <Text style={styles.warningText}>
                      You're overspending on wants!
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </Card>

            {/* Savings */}
            <Card style={[styles.categoryCard, isDark && styles.cardDark]}>
              <LinearGradient
                colors={[theme.colors.primaryContainer, "#FFF8DC"]}
                style={styles.categoryContent}
              >
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryLeft}>
                    <Target size={24} color={theme.colors.primary} />
                    <Text
                      style={[styles.categoryTitle, isDark && styles.textLight]}
                    >
                      Savings (20%)
                    </Text>
                  </View>
                  <Text
                    style={[styles.categoryAmount, isDark && styles.textLight]}
                  >
                    ₹{budget.savings.toFixed(2)}
                  </Text>
                </View>
                <ProgressBar
                  progress={getProgress("savings")}
                  color={
                    isOverspending("savings") ? "#FF3B30" : theme.colors.primary
                  }
                  style={styles.progressBar}
                />
                {isOverspending("savings") && (
                  <View style={styles.warningContainer}>
                    <AlertTriangle size={16} color="#FF3B30" />
                    <Text style={styles.warningText}>
                      You're not meeting your savings goal!
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </Card>
          </View>
        )}

        {/* Tips Section */}
        <Card style={[styles.tipsCard, isDark && styles.cardDark]}>
          <Text style={[styles.tipsTitle, isDark && styles.textLight]}>
            Smart Budgeting Tips
          </Text>
          <Text style={styles.tipText}>
            • Needs: Essential expenses like rent, utilities, and groceries
          </Text>
          <Text style={styles.tipText}>
            • Wants: Non-essential items like entertainment and dining out
          </Text>
          <Text style={styles.tipText}>
            • Savings: Emergency fund, investments, and future goals
          </Text>
        </Card>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer,
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
  incomeCard: {
    marginBottom: 24,
    borderRadius: 12,
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  incomeContent: {
    padding: 16,
  },
  incomeLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
  },
  budgetSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
    marginBottom: 16,
  },
  categoryCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  categoryContent: {
    padding: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0A0A0A",
    marginLeft: 8,
  },
  categoryAmount: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#0A0A0A",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  warningText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#FF3B30",
    marginLeft: 4,
  },
  tipsCard: {
    padding: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
    marginBottom: 12,
  },
  tipText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
    marginBottom: 8,
  },
  textLight: {
    color: "#FFFFFF",
  },
});
