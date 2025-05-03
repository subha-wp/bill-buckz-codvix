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
  Target,
  Plus,
  DollarSign,
  Calendar,
  Trash2,
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import {
  TextInput,
  Button,
  Card,
  Portal,
  Dialog,
  ProgressBar,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/constants/theme";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export default function MyGoalsScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
  });

  const handleAddGoal = () => {
    if (
      !newGoal.name ||
      !newGoal.targetAmount ||
      !newGoal.deadline ||
      isNaN(parseFloat(newGoal.targetAmount))
    )
      return;

    const goal: Goal = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      deadline: newGoal.deadline,
    };

    setGoals([...goals, goal]);
    setShowAddGoal(false);
    setNewGoal({ name: "", targetAmount: "", deadline: "" });
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(current / target, 1);
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
          Financial Goals
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddGoal(true)}
        >
          <Plus size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Target size={48} color={theme.colors.primary} />
            <Text style={[styles.emptyStateText, isDark && styles.textLight]}>
              No financial goals yet
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Start by adding your first goal
            </Text>
            <Button
              mode="contained"
              onPress={() => setShowAddGoal(true)}
              style={styles.addFirstButton}
            >
              Add Goal
            </Button>
          </View>
        ) : (
          goals.map((goal) => (
            <Card
              key={goal.id}
              style={[styles.goalCard, isDark && styles.cardDark]}
            >
              <LinearGradient
                colors={[theme.colors.primaryContainer, "#FFF8DC"]}
                style={styles.goalContent}
              >
                <View style={styles.goalHeader}>
                  <Text style={[styles.goalName, isDark && styles.textLight]}>
                    {goal.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteGoal(goal.id)}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>

                <View style={styles.goalDetails}>
                  <View style={styles.goalAmount}>
                    <Text style={styles.goalLabel}>Target Amount</Text>
                    <Text
                      style={[styles.goalValue, isDark && styles.textLight]}
                    >
                      ₹{goal.targetAmount.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.goalAmount}>
                    <Text style={styles.goalLabel}>Current Progress</Text>
                    <Text
                      style={[styles.goalValue, isDark && styles.textLight]}
                    >
                      ₹{goal.currentAmount.toLocaleString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <ProgressBar
                    progress={calculateProgress(
                      goal.currentAmount,
                      goal.targetAmount
                    )}
                    color={theme.colors.primary}
                    style={styles.progressBar}
                  />
                  <Text style={styles.deadline}>Due by {goal.deadline}</Text>
                </View>
              </LinearGradient>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Add Goal Dialog */}
      <Portal>
        <Dialog
          visible={showAddGoal}
          onDismiss={() => setShowAddGoal(false)}
          style={[styles.dialog, isDark && styles.dialogDark]}
        >
          <Dialog.Title
            style={[styles.dialogTitle, isDark && styles.textLight]}
          >
            Add New Goal
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="Goal Name"
              value={newGoal.name}
              onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label="Target Amount"
              value={newGoal.targetAmount}
              onChangeText={(text) =>
                setNewGoal({ ...newGoal, targetAmount: text })
              }
              keyboardType="numeric"
              left={
                <TextInput.Icon
                  icon={() => (
                    <DollarSign size={20} color={theme.colors.primary} />
                  )}
                />
              }
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label="Target Date"
              value={newGoal.deadline}
              onChangeText={(text) =>
                setNewGoal({ ...newGoal, deadline: text })
              }
              left={
                <TextInput.Icon
                  icon={() => (
                    <Calendar size={20} color={theme.colors.primary} />
                  )}
                />
              }
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddGoal(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleAddGoal}>
              Add Goal
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyStateText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
    marginBottom: 24,
  },
  addFirstButton: {
    borderRadius: 8,
  },
  goalCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardDark: {
    backgroundColor: "#1E1E1E",
  },
  goalContent: {
    padding: 16,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  goalName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#0A0A0A",
  },
  deleteButton: {
    padding: 4,
  },
  goalDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  goalAmount: {
    flex: 1,
  },
  goalLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
    marginBottom: 4,
  },
  goalValue: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#0A0A0A",
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  deadline: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "right",
  },
  dialog: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  dialogDark: {
    backgroundColor: "#1E1E1E",
  },
  dialogTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 20,
    color: "#0A0A0A",
  },
  input: {
    marginBottom: 16,
  },
  textLight: {
    color: "#FFFFFF",
  },
});
