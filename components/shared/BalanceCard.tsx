import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowUp, Receipt } from "lucide-react-native";
import { useRouter } from "expo-router";

interface BalanceCardProps {
  balance: string;
  label: string;
  showActions?: boolean;
}

export function BalanceCard({
  balance,
  label,
  showActions = true,
}: BalanceCardProps) {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#e8cc6d", "#D4AF37"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.balanceCard}
    >
      <View style={styles.balanceHeader}>
        <Text style={styles.balanceLabel}>{label}</Text>
        <View style={styles.balanceBadge}>
          <Text style={styles.balanceBadgeText}>Withdrawable</Text>
        </View>
      </View>
      <Text style={styles.balanceAmount}>₹{balance}</Text>
      {showActions && (
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
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
});
