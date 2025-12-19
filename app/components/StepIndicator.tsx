import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { AppColors } from "@/constants/theme";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  const { t } = useTranslation();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <View key={step} style={styles.stepWrapper}>
            <View
              style={[
                styles.stepCircle,
                step <= currentStep && styles.stepCircleActive,
              ]}
            >
              <Text
                style={[
                  styles.stepText,
                  step <= currentStep && styles.stepTextActive,
                ]}
              >
                {step}
              </Text>
            </View>
            {step < totalSteps && (
              <View
                style={[
                  styles.stepLine,
                  step < currentStep && styles.stepLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <Text style={styles.progressText}>
        {t("form.step")} {currentStep} {t("form.of")} {totalSteps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: AppColors.white,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  stepWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.border,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: AppColors.border,
  },
  stepCircleActive: {
    backgroundColor: AppColors.secondary,
    borderColor: AppColors.secondary,
  },
  stepText: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textSecondary,
  },
  stepTextActive: {
    color: AppColors.white,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: AppColors.border,
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: AppColors.secondary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: AppColors.border,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: AppColors.secondary,
    borderRadius: 4,
  },
  progressText: {
    textAlign: "center",
    fontSize: 14,
    color: AppColors.textLight,
    fontWeight: "500",
  },
});
