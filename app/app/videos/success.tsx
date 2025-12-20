import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AppColors } from "@/constants/theme";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface AssessmentStatus {
  status: string;
  parent_confirmed: boolean;
  assigned_doctor: string | null;
  created_at: string;
}

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.childId as string;

  const [status, setStatus] = useState<AssessmentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      const response = await axios.get(
        `${BASE_URL}/api/children/${childId}/assessment/status/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatus(response.data);
    } catch (error) {
      console.error("Error loading status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    router.replace("/(tabs)");
  };

  const handleStartTasks = () => {
    router.push({
      pathname: "/therapy/today",
      params: { childId },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Success Animation */}
      <View style={styles.successContainer}>
        <View style={styles.successCircle}>
          <Text style={styles.successIcon}>✓</Text>
        </View>
        <Text style={styles.successTitle}>Ready!</Text>
        <Text style={styles.successSubtitle}>
          You can now start your child's 15-day assessment program
        </Text>
      </View>

      {/* What's Next Card */}
      <View style={styles.nextStepsCard}>
        <Text style={styles.nextStepsTitle}>🎯 What's Next?</Text>

        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepText}>
            Complete 5 simple tasks every day
          </Text>
        </View>

        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepText}>
            Record how the child performed
          </Text>
        </View>

        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>
            After 15 days, a doctor will review the results
          </Text>
        </View>
      </View>

      {/* Task Categories Info */}
      <View style={styles.categoriesCard}>
        <Text style={styles.categoriesTitle}>📚 Daily Task Categories</Text>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryIcon}>👋</Text>
          <Text style={styles.categoryText}>Social Engagement</Text>
        </View>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryIcon}>👀</Text>
          <Text style={styles.categoryText}>Joint Attention</Text>
        </View>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryIcon}>🗣️</Text>
          <Text style={styles.categoryText}>Communication</Text>
        </View>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryIcon}>🎮</Text>
          <Text style={styles.categoryText}>Play Skills</Text>
        </View>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryIcon}>🧠</Text>
          <Text style={styles.categoryText}>Cognitive/Self-Help</Text>
        </View>
      </View>

      {/* Info Note */}
      <View style={styles.infoNote}>
        <Text style={styles.infoIcon}>💡</Text>
        <Text style={styles.infoText}>
          Each task takes only 2-5 minutes. You can do them while playing with your child!
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartTasks}>
          <Text style={styles.startButtonText}>🚀 Start Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>🏠 Go to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  successContainer: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 30,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successIcon: {
    fontSize: 48,
    color: AppColors.white,
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: AppColors.textLight,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  nextStepsCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberText: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: AppColors.textPrimary,
    lineHeight: 22,
  },
  categoriesCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F57C00",
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    color: "#E65100",
  },
  infoNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#2E7D32",
    lineHeight: 20,
  },
  footer: {
    gap: 12,
  },
  startButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  homeButton: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  homeButtonText: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});
