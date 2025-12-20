import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AppColors } from "@/constants/theme";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface ChildData {
  id: number;
  full_name: string;
  age_years: number;
  age_months: number;
  gender: string;
}

interface MChatResult {
  total_score: number;
  risk_level: string;
}

interface VideoData {
  id: number;
  video_type: string;
}

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.childId as string;

  const [child, setChild] = useState<ChildData | null>(null);
  const [mchatResult, setMchatResult] = useState<MChatResult | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Load child info, M-CHAT results, and videos in parallel
      const [childRes, mchatRes, videosRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/children/${childId}/`, { headers }),
        axios.get(`${BASE_URL}/api/children/${childId}/mchat/`, { headers }).catch(() => null),
        axios.get(`${BASE_URL}/api/children/${childId}/videos/`, { headers }),
      ]);

      setChild(childRes.data);
      if (mchatRes?.data?.total_score !== undefined) {
        setMchatResult(mchatRes.data);
      }
      setVideos(videosRes.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("Error", "Could not load information.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelText = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "Low Risk";
      case "medium":
        return "Medium Risk";
      case "high":
        return "High Risk";
      default:
        return riskLevel;
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "#4CAF50";
      case "medium":
        return "#FF9800";
      case "high":
        return "#F44336";
      default:
        return "#1565C0";
    }
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case "male":
        return "Boy";
      case "female":
        return "Girl";
      default:
        return gender;
    }
  };

  const handleSubmit = async () => {
    if (!confirmed) {
      Alert.alert("Confirmation Required", "Please check the declaration box.");
      return;
    }

    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      await axios.post(
        `${BASE_URL}/api/children/${childId}/assessment/submit/`,
        { parent_confirmed: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      router.push({
        pathname: "/videos/success",
        params: { childId },
      });
    } catch (error: any) {
      console.error("Submit error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Could not submit."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
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
          <Text style={styles.headerTitle}>Confirm</Text>
          <Text style={styles.headerSubtitle}>Submit Assessment</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📋 Summary</Text>
          <Text style={styles.summarySubtitle}>
            Please review the information
          </Text>
        </View>

        {/* Child Info */}
        {child && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>👶</Text>
              <Text style={styles.cardTitle}>Child Information</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{child.full_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age:</Text>
              <Text style={styles.infoValue}>
                {child.age_years} years {child.age_months} months
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender:</Text>
              <Text style={styles.infoValue}>{getGenderText(child.gender)}</Text>
            </View>
          </View>
        )}

        {/* M-CHAT Results */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📊</Text>
            <Text style={styles.cardTitle}>M-CHAT Result</Text>
          </View>
          {mchatResult ? (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Score:</Text>
                <Text style={styles.infoValue}>
                  {mchatResult.total_score}/20
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Risk Level:</Text>
                <Text
                  style={[
                    styles.riskBadge,
                    { backgroundColor: getRiskLevelColor(mchatResult.risk_level) },
                  ]}
                >
                  {getRiskLevelText(mchatResult.risk_level)}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.notCompleted}>M-CHAT not completed</Text>
          )}
        </View>

        {/* Videos */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📹</Text>
            <Text style={styles.cardTitle}>Uploaded Videos</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Number of Videos:</Text>
            <Text style={styles.infoValue}>{videos.length}</Text>
          </View>
          {videos.length > 0 && (
            <View style={styles.videoTypes}>
              {videos.map((video) => (
                <View key={video.id} style={styles.videoTypeBadge}>
                  <Text style={styles.videoTypeText}>{video.video_type}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Declaration */}
        <View style={styles.declarationCard}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setConfirmed(!confirmed)}
          >
            <View
              style={[
                styles.checkbox,
                confirmed && styles.checkboxChecked,
              ]}
            >
              {confirmed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.declarationText}>
              I confirm that this information is correct and I have completed
              this assessment for my child.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Important Note */}
        <View style={styles.noteCard}>
          <Text style={styles.noteIcon}>⚠️</Text>
          <View style={styles.noteContent}>
            <Text style={styles.noteTitle}>Important</Text>
            <Text style={styles.noteText}>
              After submission, a doctor will review your child's assessment.
              You will receive a notification.
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!confirmed || submitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!confirmed || submitting}
        >
          {submitting ? (
            <ActivityIndicator color={AppColors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Submit Assessment</Text>
          )}
        </TouchableOpacity>
      </View>
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
    marginTop: 12,
    fontSize: 14,
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
  summaryCard: {
    backgroundColor: AppColors.primaryLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: AppColors.primaryDark,
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
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
  riskBadge: {
    color: AppColors.white,
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  notCompleted: {
    fontSize: 14,
    color: AppColors.error,
    fontStyle: "italic",
  },
  videoTypes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  videoTypeBadge: {
    backgroundColor: AppColors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  videoTypeText: {
    fontSize: 12,
    color: AppColors.primaryDark,
    fontWeight: "500",
  },
  declarationCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: AppColors.primary,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: AppColors.primary,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: AppColors.primary,
  },
  checkmark: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  declarationText: {
    flex: 1,
    fontSize: 14,
    color: AppColors.textPrimary,
    lineHeight: 22,
  },
  noteCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  noteIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F57C00",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 13,
    color: "#E65100",
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: AppColors.white,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  submitButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: AppColors.disabled,
  },
  submitButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
