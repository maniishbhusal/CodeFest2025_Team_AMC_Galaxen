import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
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

  const getStatusText = (statusValue: string) => {
    switch (statusValue) {
      case "pending":
        return "समीक्षाको प्रतीक्षामा";
      case "in_review":
        return "समीक्षा हुँदैछ";
      case "accepted":
        return "स्वीकृत भयो";
      case "completed":
        return "पूरा भयो";
      default:
        return statusValue;
    }
  };

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case "pending":
        return "#FF9800";
      case "in_review":
        return "#2196F3";
      case "accepted":
        return "#4CAF50";
      case "completed":
        return "#4CAF50";
      default:
        return AppColors.primary;
    }
  };

  const handleGoHome = () => {
    router.replace("/(tabs)");
  };

  const handleViewStatus = () => {
    loadStatus();
  };

  return (
    <View style={styles.container}>
      {/* Success Animation */}
      <View style={styles.successContainer}>
        <View style={styles.successCircle}>
          <Text style={styles.successIcon}>✓</Text>
        </View>
        <Text style={styles.successTitle}>सफलतापूर्वक पेश भयो!</Text>
        <Text style={styles.successSubtitle}>
          तपाईंको बच्चाको मूल्यांकन पेश गरियो
        </Text>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusCardTitle}>📋 मूल्यांकन स्थिति</Text>

        {loading ? (
          <ActivityIndicator
            size="small"
            color={AppColors.primary}
            style={{ marginVertical: 20 }}
          />
        ) : status ? (
          <View style={styles.statusContent}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>स्थिति:</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(status.status) },
                ]}
              >
                <Text style={styles.statusBadgeText}>
                  {getStatusText(status.status)}
                </Text>
              </View>
            </View>

            {status.assigned_doctor && (
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>तोकिएका डाक्टर:</Text>
                <Text style={styles.statusValue}>{status.assigned_doctor}</Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.noStatus}>स्थिति उपलब्ध छैन</Text>
        )}

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleViewStatus}
        >
          <Text style={styles.refreshButtonText}>🔄 स्थिति जाँच गर्नुहोस्</Text>
        </TouchableOpacity>
      </View>

      {/* Next Steps */}
      <View style={styles.nextStepsCard}>
        <Text style={styles.nextStepsTitle}>📌 अर्को के हुन्छ?</Text>

        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepText}>
            डाक्टरले तपाईंको बच्चाको मूल्यांकन समीक्षा गर्नेछन्
          </Text>
        </View>

        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepText}>
            तपाईंलाई अपडेट सूचना प्राप्त हुनेछ
          </Text>
        </View>

        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>
            स्वीकृत भएपछि थेरापी पाठ्यक्रम तोकिनेछ
          </Text>
        </View>
      </View>

      {/* Info Note */}
      <View style={styles.infoNote}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          सामान्यतया समीक्षामा २४-४८ घण्टा लाग्न सक्छ
        </Text>
      </View>

      {/* Home Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>🏠 गृहपृष्ठमा जानुहोस्</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    padding: 16,
  },
  successContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
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
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: AppColors.textLight,
    textAlign: "center",
  },
  statusCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  statusCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 16,
  },
  statusContent: {
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: AppColors.textLight,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    color: AppColors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  noStatus: {
    fontSize: 14,
    color: AppColors.textLight,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 16,
  },
  refreshButton: {
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  refreshButtonText: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: "500",
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
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
    fontSize: 14,
    color: AppColors.textPrimary,
    lineHeight: 20,
  },
  infoNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#1565C0",
    lineHeight: 20,
  },
  footer: {
    marginTop: "auto",
    paddingBottom: 20,
  },
  homeButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  homeButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
