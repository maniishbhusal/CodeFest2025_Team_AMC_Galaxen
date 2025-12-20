import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface MChatResult {
  total_score: number;
  risk_level: string;
  created_at: string;
}

interface TherapyProgress {
  curriculum_title: string;
  current_day: number;
  total_days: number;
  status: string;
  progress_percentage: number;
}

interface DiagnosisReport {
  id: number;
  has_autism: boolean;
  spectrum_type: string;
  spectrum_type_display: string;
  detailed_report: string;
  next_steps: string;
  doctor_name: string;
  created_at: string;
}

export default function ReportScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const [mchatResults, setMchatResults] = useState<{ [key: number]: MChatResult }>({});
  const [therapyProgress, setTherapyProgress] = useState<{ [key: number]: TherapyProgress }>({});
  const [diagnosisReports, setDiagnosisReports] = useState<{ [key: number]: DiagnosisReport[] }>({});

  useEffect(() => {
    loadReportData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReportData();
    setRefreshing(false);
  };

  const loadReportData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      // Get children list
      const childrenRes = await axios.get(`${BASE_URL}/api/children/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const childrenData = childrenRes.data || [];
      setChildren(childrenData);

      const mchat: { [key: number]: MChatResult } = {};
      const therapy: { [key: number]: TherapyProgress } = {};
      const diagnosis: { [key: number]: DiagnosisReport[] } = {};

      for (const child of childrenData) {
        // Fetch M-CHAT results
        try {
          const mchatRes = await axios.get(
            `${BASE_URL}/api/children/${child.id}/mchat/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (mchatRes.data?.total_score !== undefined) {
            mchat[child.id] = mchatRes.data;
          }
        } catch {}

        // Fetch therapy curriculum status
        try {
          const therapyRes = await axios.get(
            `${BASE_URL}/api/therapy/child/${child.id}/curriculum/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const active = (therapyRes.data?.curricula || []).find(
            (c: any) => c.status === "active"
          );
          if (active) {
            therapy[child.id] = {
              curriculum_title: active.curriculum_title,
              current_day: active.current_day,
              total_days: active.curriculum_duration,
              status: active.status,
              progress_percentage: active.progress_percentage || 0,
            };
          }
        } catch {}

        // Fetch diagnosis reports
        try {
          const diagnosisRes = await axios.get(
            `${BASE_URL}/api/therapy/child/${child.id}/reports/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (diagnosisRes.data?.reports?.length > 0) {
            diagnosis[child.id] = diagnosisRes.data.reports;
          }
        } catch {}
      }

      setMchatResults(mchat);
      setTherapyProgress(therapy);
      setDiagnosisReports(diagnosis);
    } catch (error) {
      console.log("Error loading report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case "low":
        return "#10B981";
      case "medium":
        return "#F59E0B";
      case "high":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getSpectrumColor = (spectrum: string) => {
    switch (spectrum?.toLowerCase()) {
      case "none":
        return "#10B981";
      case "mild":
        return "#60A5FA";
      case "moderate":
        return "#F59E0B";
      case "severe":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F97316" />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  const firstChild = children[0];
  const childMchat = firstChild ? mchatResults[firstChild.id] : null;
  const childTherapy = firstChild ? therapyProgress[firstChild.id] : null;
  const childDiagnosis = firstChild ? diagnosisReports[firstChild.id] : null;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
        <Text style={styles.headerSubtitle}>
          {firstChild?.full_name || "Child"}&apos;s Assessment & Progress
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#F97316"]} />
        }
      >
        {/* M-CHAT Results Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="clipboard-outline" size={24} color="#7C3AED" />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>M-CHAT Screening</Text>
              <Text style={styles.cardSubtitle}>Initial Assessment Result</Text>
            </View>
          </View>

          {childMchat ? (
            <View style={styles.mchatContent}>
              <View style={styles.scoreRow}>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreLabel}>Score</Text>
                  <Text style={styles.scoreValue}>{childMchat.total_score}/20</Text>
                </View>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreLabel}>Risk Level</Text>
                  <View style={[styles.riskBadge, { backgroundColor: getRiskColor(childMchat.risk_level) }]}>
                    <Text style={styles.riskBadgeText}>{childMchat.risk_level}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.viewDetailsBtn}
                onPress={() =>
                  router.push({
                    pathname: "/mchat/results",
                    params: {
                      childId: firstChild?.id?.toString(),
                      score: childMchat.total_score.toString(),
                      riskLevel: childMchat.risk_level,
                    },
                  })
                }
              >
                <Text style={styles.viewDetailsBtnText}>View Full Report</Text>
                <Ionicons name="arrow-forward" size={16} color="#F97316" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No M-CHAT assessment completed yet</Text>
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() =>
                  router.push({
                    pathname: "/mchat/medical-history",
                    params: { childId: firstChild?.id?.toString() },
                  })
                }
              >
                <Text style={styles.startBtnText}>Start Assessment</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Therapy Progress Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconContainer, { backgroundColor: "#DCFCE7" }]}>
              <Ionicons name="fitness-outline" size={24} color="#16A34A" />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Therapy Progress</Text>
              <Text style={styles.cardSubtitle}>Current Curriculum Status</Text>
            </View>
          </View>

          {childTherapy ? (
            <View style={styles.therapyContent}>
              <Text style={styles.curriculumName}>{childTherapy.curriculum_title}</Text>

              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>
                  Day {childTherapy.current_day} of {childTherapy.total_days}
                </Text>
                <Text style={styles.progressPercent}>
                  {Math.round((childTherapy.current_day / childTherapy.total_days) * 100)}%
                </Text>
              </View>

              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${(childTherapy.current_day / childTherapy.total_days) * 100}%` },
                  ]}
                />
              </View>

              <TouchableOpacity
                style={styles.viewDetailsBtn}
                onPress={() => router.push("/therapy/today")}
              >
                <Text style={styles.viewDetailsBtnText}>View Today&apos;s Tasks</Text>
                <Ionicons name="arrow-forward" size={16} color="#F97316" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No active therapy curriculum</Text>
              <Text style={styles.emptyStateHint}>
                Complete the M-CHAT assessment to get started
              </Text>
            </View>
          )}
        </View>

        {/* Diagnosis Reports Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconContainer, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="document-text-outline" size={24} color="#D97706" />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Diagnosis Reports</Text>
              <Text style={styles.cardSubtitle}>Doctor&apos;s Assessment</Text>
            </View>
          </View>

          {childDiagnosis && childDiagnosis.length > 0 ? (
            <View style={styles.diagnosisContent}>
              {childDiagnosis.map((report, index) => (
                <View key={report.id || index} style={styles.diagnosisItem}>
                  <View style={styles.diagnosisHeader}>
                    <View
                      style={[
                        styles.spectrumBadge,
                        { backgroundColor: getSpectrumColor(report.spectrum_type) },
                      ]}
                    >
                      <Text style={styles.spectrumBadgeText}>
                        {report.spectrum_type_display || report.spectrum_type}
                      </Text>
                    </View>
                    <Text style={styles.diagnosisDate}>
                      {new Date(report.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.doctorName}>By {report.doctor_name || "Doctor"}</Text>
                  <Text style={styles.diagnosisReport} numberOfLines={3}>
                    {report.detailed_report}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No diagnosis reports yet</Text>
              <Text style={styles.emptyStateHint}>
                Reports will appear after doctor review
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  header: {
    backgroundColor: "#FFF",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  mchatContent: {},
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  scoreBox: {
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  riskBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  riskBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    textTransform: "capitalize",
  },
  viewDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 8,
  },
  viewDetailsBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F97316",
    marginRight: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  emptyStateHint: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
  startBtn: {
    backgroundColor: "#F97316",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  startBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  therapyContent: {},
  curriculumName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "600",
    color: "#16A34A",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 16,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#16A34A",
    borderRadius: 4,
  },
  diagnosisContent: {},
  diagnosisItem: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
    marginTop: 12,
  },
  diagnosisHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  spectrumBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  spectrumBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFF",
  },
  diagnosisDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  doctorName: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  diagnosisReport: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
});
