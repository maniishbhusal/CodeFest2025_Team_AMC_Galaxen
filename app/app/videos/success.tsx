import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { AppColors } from "@/constants/theme";

export default function SuccessScreen() {
  const router = useRouter();

  const handleGoHome = () => {
    router.replace("/(tabs)");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Success Animation */}
      <View style={styles.successContainer}>
        <View style={styles.successCircle}>
          <Text style={styles.successIcon}>✓</Text>
        </View>
        <Text style={styles.successTitle}>Assessment Submitted!</Text>
        <Text style={styles.successSubtitle}>
          Your child's assessment has been submitted for review
        </Text>
      </View>

      {/* What's Next Card */}
      <View style={styles.nextStepsCard}>
        <Text style={styles.nextStepsTitle}>🎯 What Happens Next?</Text>

        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepText}>
            A doctor will review your child's M-CHAT results and videos
          </Text>
        </View>

        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepText}>
            Once accepted, you'll receive a therapy curriculum
          </Text>
        </View>

        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>
            You can then start completing daily therapy tasks
          </Text>
        </View>
      </View>

      {/* Waiting Info Card */}
      <View style={styles.waitingCard}>
        <View style={styles.waitingIconContainer}>
          <Text style={styles.waitingIcon}>⏳</Text>
        </View>
        <Text style={styles.waitingTitle}>Waiting for Doctor Review</Text>
        <Text style={styles.waitingText}>
          This usually takes 1-2 business days. You'll be notified once a doctor
          reviews your submission and assigns a therapy plan.
        </Text>
      </View>

      {/* Info Note */}
      <View style={styles.infoNote}>
        <Text style={styles.infoIcon}>💡</Text>
        <Text style={styles.infoText}>
          Check the home page regularly for updates on your assessment status
        </Text>
      </View>

      {/* Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>Go to Home</Text>
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
    fontSize: 26,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
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
  waitingCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
    alignItems: "center",
  },
  waitingIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  waitingIcon: {
    fontSize: 32,
  },
  waitingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B45309",
    marginBottom: 8,
    textAlign: "center",
  },
  waitingText: {
    fontSize: 14,
    color: "#92400E",
    textAlign: "center",
    lineHeight: 22,
  },
  infoNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
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
    color: "#0369A1",
    lineHeight: 20,
  },
  footer: {
    gap: 12,
  },
  homeButton: {
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
  homeButtonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
