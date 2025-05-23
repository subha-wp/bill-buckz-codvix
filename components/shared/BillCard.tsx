// @ts-nocheck
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { Receipt } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { theme } from "@/constants/theme";

interface BillCardProps {
  id: string;
  merchant: string;
  date: string;
  amount: string;
  cashbackAmount: string;
  cashbackStatus: string;
}

export function BillCard({
  id,
  merchantName,
  date,
  amount,
  cashbackAmount,
  cashbackStatus,
}: BillCardProps) {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  return (
    <Card key={id} style={[styles.billCard, isDark && styles.cardDark]}>
      <View style={styles.billCardContent}>
        <View style={styles.billIconContainer}>
          <Receipt size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.billDetails}>
          <Text style={[styles.billMerchant, isDark && styles.textLight]}>
            {merchantName}
          </Text>
          <Text style={styles.billDate}>{date}</Text>
        </View>
        <View style={styles.billAmount}>
          <Text style={[styles.billAmountText, isDark && styles.textLight]}>
            ₹{amount}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: theme.colors.primaryContainer,
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
  textLight: {
    color: "#FFFFFF",
  },
});
