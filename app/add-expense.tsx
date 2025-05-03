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
  Tag,
  CalendarDays,
  FileText,
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { TextInput, Button, SegmentedButtons, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { theme } from "@/constants/theme";

export default function AddExpenseScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("needs");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount || !description || !date) return;

    setLoading(true);
    try {
      // Here you would typically make an API call to save the expense
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.back();
    } catch (error) {
      console.error("Error saving expense:", error);
    } finally {
      setLoading(false);
    }
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
          Add Expense
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Card style={[styles.formCard, isDark && styles.cardDark]}>
          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, isDark && styles.textLight]}>
              Amount
            </Text>
            <TextInput
              mode="outlined"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              left={
                <TextInput.Icon
                  icon={() => (
                    <DollarSign size={20} color={theme.colors.primary} />
                  )}
                />
              }
              style={styles.input}
              placeholder="Enter amount"
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, isDark && styles.textLight]}>
              Description
            </Text>
            <TextInput
              mode="outlined"
              value={description}
              onChangeText={setDescription}
              left={
                <TextInput.Icon
                  icon={() => (
                    <FileText size={20} color={theme.colors.primary} />
                  )}
                />
              }
              style={styles.input}
              placeholder="What's this expense for?"
            />
          </View>

          {/* Date Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, isDark && styles.textLight]}>
              Date
            </Text>
            <TextInput
              mode="outlined"
              value={date}
              onChangeText={setDate}
              left={
                <TextInput.Icon
                  icon={() => (
                    <CalendarDays size={20} color={theme.colors.primary} />
                  )}
                />
              }
              style={styles.input}
              placeholder="DD/MM/YYYY"
            />
          </View>

          {/* Category Selection */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, isDark && styles.textLight]}>
              Category
            </Text>
            <SegmentedButtons
              value={category}
              onValueChange={setCategory}
              buttons={[
                {
                  value: "needs",
                  label: "Needs",
                  icon: Tag,
                },
                {
                  value: "wants",
                  label: "Wants",
                  icon: Tag,
                },
                {
                  value: "savings",
                  label: "Savings",
                  icon: Tag,
                },
              ]}
              style={styles.categoryButtons}
            />
          </View>
        </Card>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          loading={loading}
          disabled={!amount || !description || !date || loading}
        >
          Add Expense
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
  formCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#0A0A0A",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
  },
  categoryButtons: {
    backgroundColor: "#F0F0F0",
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 8,
  },
  textLight: {
    color: "#FFFFFF",
  },
});
