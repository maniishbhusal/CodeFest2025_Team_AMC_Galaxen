import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AppColors } from "@/constants/theme";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface ChildCurriculumData {
  id: number;
  curriculum_title: string;
  curriculum_duration: number;
  start_date: string;
  end_date: string;
  current_day: number;
  status: string;
}

export default function CurriculumScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.childId as string;

  const [curriculumData, setCurriculumData] = useState<ChildCurriculumData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCurriculum();
  }, []);

  const loadCurriculum = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/therapy/child/${childId}/curriculum/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // API returns { curricula: [...] } - get the active one
      const curricula = response.data?.curricula || [];
      const activeCurriculum = curricula.find((c: any) => c.status === "active");

      if (activeCurriculum) {
        setCurriculumData(activeCurriculum);
      } else {
        setError("पाठ्यक्रम अझै तोकिएको छैन");
      }
    } catch (err: any) {
      console.error("Error loading curriculum:", err);
      if (err.response?.status === 404) {
        setError("पाठ्यक्रम अझै तोकिएको छैन");
      } else {
        setError("पाठ्यक्रम लोड गर्न सकिएन");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleViewToday = () => {
    router.push({
      pathname: "/therapy/today",
      params: { childId },
    });
  };

  const handleViewHistory = () => {
    router.push({
      pathname: "/therapy/history",
      params: { childId },
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "सक्रिय";
      case "paused":
        return "रोकिएको";
      case "completed":
        return "पूरा भयो";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#4CAF50";
      case "paused":
        return "#FF9800";
      case "completed":
        return "#2196F3";
      default:
        return AppColors.textLight;
    }
  };

  const getProgressPercentage = () => {
    if (!curriculumData) return 0;
    return Math.round(
      (curriculumData.current_day / curriculumData.curriculum_duration) * 100
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ne-NP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={styles.loadingText}>पाठ्यक्रम लोड हुँदैछ...</Text>
      </View>
    );
  }

  if (error || !curriculumData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>थेरापी पाठ्यक्रम</Text>
        </View>

        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>📚</Text>
          <Text style={styles.errorTitle}>{error || "पाठ्यक्रम उपलब्ध छैन"}</Text>
          <Text style={styles.errorSubtitle}>
            डाक्टरले तपाईंको बच्चालाई पाठ्यक्रम तोक्नुपर्छ
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={loadCurriculum}>
            <Text style={styles.refreshButtonText}>पुनः प्रयास गर्नुहोस्</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>थेरापी पाठ्यक्रम</Text>
          <Text style={styles.headerSubtitle}>
            {curriculumData.curriculum_title}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>प्रगति</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(curriculumData.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(curriculumData.status)}
              </Text>
            </View>
          </View>

          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{curriculumData.current_day}</Text>
              <Text style={styles.statLabel}>हालको दिन</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {curriculumData.curriculum_duration}
              </Text>
              <Text style={styles.statLabel}>कुल दिन</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getProgressPercentage()}%</Text>
              <Text style={styles.statLabel}>पूरा</Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${getProgressPercentage()}%` },
              ]}
            />
          </View>
        </View>

        {/* Curriculum Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>पाठ्यक्रम विवरण</Text>
          <Text style={styles.infoDescription}>
            {curriculumData.curriculum_title}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>अवधि:</Text>
            <Text style={styles.infoValue}>
              {curriculumData.curriculum_duration} दिन
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>सुरु मिति:</Text>
            <Text style={styles.infoValue}>
              {formatDate(curriculumData.start_date)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>अन्त्य मिति:</Text>
            <Text style={styles.infoValue}>
              {formatDate(curriculumData.end_date)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleViewToday}
          >
            <Text style={styles.primaryButtonEmoji}>📋</Text>
            <View style={styles.buttonContent}>
              <Text style={styles.primaryButtonText}>आजका कार्यहरू</Text>
              <Text style={styles.primaryButtonSubtext}>
                दिन {curriculumData.current_day} का कार्यहरू हेर्नुहोस्
              </Text>
            </View>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleViewHistory}
          >
            <Text style={styles.secondaryButtonEmoji}>📊</Text>
            <View style={styles.buttonContent}>
              <Text style={styles.secondaryButtonText}>प्रगति इतिहास</Text>
              <Text style={styles.secondaryButtonSubtext}>
                पूरा भएका कार्यहरू हेर्नुहोस्
              </Text>
            </View>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsIcon}>💡</Text>
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>सुझाव</Text>
            <Text style={styles.tipsText}>
              • हरेक दिन नियमित रूपमा कार्यहरू गर्नुहोस्{"\n"}
              • बच्चासँग खेल्दै सिकाउनुहोस्{"\n"}
              • प्रगति भिडियो रेकर्ड गर्न नबिर्सनुहोस्
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: AppColors.textLight,
  },
  header: {
    backgroundColor: AppColors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: AppColors.white,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: AppColors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  errorSubtitle: {
    fontSize: 14,
    color: AppColors.textLight,
    textAlign: "center",
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  progressCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: AppColors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: AppColors.textLight,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: AppColors.border,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: AppColors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: AppColors.primary,
    borderRadius: 4,
  },
  infoCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 14,
    color: AppColors.textLight,
    lineHeight: 22,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: AppColors.textLight,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
  actionsContainer: {
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  buttonContent: {
    flex: 1,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.white,
  },
  primaryButtonSubtext: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  buttonArrow: {
    fontSize: 20,
    color: AppColors.white,
  },
  secondaryButton: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: AppColors.primary,
  },
  secondaryButtonEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.textPrimary,
  },
  secondaryButtonSubtext: {
    fontSize: 13,
    color: AppColors.textLight,
    marginTop: 2,
  },
  tipsCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  tipsIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F57C00",
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    color: "#E65100",
    lineHeight: 20,
  },
});
