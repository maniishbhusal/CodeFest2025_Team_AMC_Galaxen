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
      Alert.alert("त्रुटि", "जानकारी लोड गर्न सकिएन।");
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelText = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "कम जोखिम";
      case "medium":
        return "मध्यम जोखिम";
      case "high":
        return "उच्च जोखिम";
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
        return "छोरा";
      case "female":
        return "छोरी";
      default:
        return gender;
    }
  };

  const handleSubmit = async () => {
    if (!confirmed) {
      Alert.alert("पुष्टि आवश्यक", "कृपया घोषणा बक्समा चिन्ह लगाउनुहोस्।");
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
        "त्रुटि",
        error.response?.data?.message || "पेश गर्न सकिएन।"
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
        <Text style={styles.loadingText}>लोड हुँदैछ...</Text>
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
          <Text style={styles.headerTitle}>पुष्टि गर्नुहोस्</Text>
          <Text style={styles.headerSubtitle}>मूल्यांकन पेश गर्नुहोस्</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📋 सारांश</Text>
          <Text style={styles.summarySubtitle}>
            कृपया जानकारी समीक्षा गर्नुहोस्
          </Text>
        </View>

        {/* Child Info */}
        {child && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>👶</Text>
              <Text style={styles.cardTitle}>बच्चाको जानकारी</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>नाम:</Text>
              <Text style={styles.infoValue}>{child.full_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>उमेर:</Text>
              <Text style={styles.infoValue}>
                {child.age_years} वर्ष {child.age_months} महिना
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>लिङ्ग:</Text>
              <Text style={styles.infoValue}>{getGenderText(child.gender)}</Text>
            </View>
          </View>
        )}

        {/* M-CHAT Results */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📊</Text>
            <Text style={styles.cardTitle}>M-CHAT नतिजा</Text>
          </View>
          {mchatResult ? (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>स्कोर:</Text>
                <Text style={styles.infoValue}>
                  {mchatResult.total_score}/20
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>जोखिम स्तर:</Text>
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
            <Text style={styles.notCompleted}>M-CHAT पूरा भएको छैन</Text>
          )}
        </View>

        {/* Videos */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📹</Text>
            <Text style={styles.cardTitle}>अपलोड गरिएका भिडियो</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>भिडियो संख्या:</Text>
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
              म पुष्टि गर्छु कि यो जानकारी सही छ र मैले यो मूल्यांकन आफ्नो
              बच्चाको लागि भरेको हो।
            </Text>
          </TouchableOpacity>
        </View>

        {/* Important Note */}
        <View style={styles.noteCard}>
          <Text style={styles.noteIcon}>⚠️</Text>
          <View style={styles.noteContent}>
            <Text style={styles.noteTitle}>महत्त्वपूर्ण</Text>
            <Text style={styles.noteText}>
              पेश गरेपछि, एक डाक्टरले तपाईंको बच्चाको मूल्यांकन समीक्षा गर्नेछ।
              तपाईंलाई सूचना प्राप्त हुनेछ।
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
            <Text style={styles.submitButtonText}>मूल्यांकन पेश गर्नुहोस्</Text>
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
