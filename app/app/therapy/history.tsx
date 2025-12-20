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

interface ProgressEntry {
  id: number;
  task_id: number;
  task_title: string;
  day_number: number;
  date: string;
  status: string;
  video_url: string;
  parent_notes: string;
  submitted_at: string;
}

interface HistoryData {
  total_days: number;
  completed_days: number;
  progress: ProgressEntry[];
}

export default function HistoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.childId as string;

  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/therapy/child/${childId}/history/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistoryData(response.data);
    } catch (error: any) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done_without_help":
        return "🌟";
      case "done_with_help":
        return "🤝";
      case "not_done":
        return "😔";
      default:
        return "⏳";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "done_without_help":
        return "Did it alone";
      case "done_with_help":
        return "With help";
      case "not_done":
        return "Couldn't do";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done_without_help":
        return "#4CAF50";
      case "done_with_help":
        return "#2196F3";
      case "not_done":
        return "#FF9800";
      default:
        return AppColors.textLight;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDayProgress = (dayNumber: number) => {
    if (!historyData) return [];
    return historyData.progress.filter((p) => p.day_number === dayNumber);
  };

  const getDayStatus = (dayNumber: number) => {
    const dayProgress = getDayProgress(dayNumber);
    if (dayProgress.length === 0) return "pending";
    const allDone = dayProgress.every(
      (p) => p.status === "done_without_help" || p.status === "done_with_help"
    );
    const anyDone = dayProgress.some(
      (p) => p.status === "done_without_help" || p.status === "done_with_help"
    );
    if (allDone) return "completed";
    if (anyDone) return "partial";
    return "incomplete";
  };

  const getDayColor = (dayNumber: number) => {
    const status = getDayStatus(dayNumber);
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "partial":
        return "#FF9800";
      case "incomplete":
        return "#F44336";
      default:
        return AppColors.border;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={styles.loadingText}>Loading history...</Text>
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
          <Text style={styles.headerTitle}>Progress History</Text>
          <Text style={styles.headerSubtitle}>
            {historyData?.completed_days || 0}/{historyData?.total_days || 0} days completed
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{historyData?.total_days || 0}</Text>
            <Text style={styles.statLabel}>Total Days</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#4CAF50" }]}>
              {historyData?.completed_days || 0}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: AppColors.secondary }]}>
              {historyData?.progress.length || 0}
            </Text>
            <Text style={styles.statLabel}>Submitted</Text>
          </View>
        </View>

        {/* Calendar View */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Progress by Day</Text>
          <View style={styles.calendarGrid}>
            {Array.from({ length: historyData?.total_days || 15 }, (_, i) => i + 1).map(
              (day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCell,
                    selectedDay === day && styles.dayCellSelected,
                    { backgroundColor: getDayColor(day) + "30" },
                  ]}
                  onPress={() =>
                    setSelectedDay(selectedDay === day ? null : day)
                  }
                >
                  <Text
                    style={[
                      styles.dayNumber,
                      { color: getDayColor(day) },
                    ]}
                  >
                    {day}
                  </Text>
                  <View
                    style={[
                      styles.dayIndicator,
                      { backgroundColor: getDayColor(day) },
                    ]}
                  />
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {/* Selected Day Details */}
        {selectedDay && (
          <View style={styles.dayDetailsSection}>
            <Text style={styles.sectionTitle}>Day {selectedDay} Details</Text>
            {getDayProgress(selectedDay).length === 0 ? (
              <View style={styles.noProgressCard}>
                <Text style={styles.noProgressText}>
                  No progress submitted for this day
                </Text>
              </View>
            ) : (
              getDayProgress(selectedDay).map((entry) => (
                <View key={entry.id} style={styles.progressCard}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressEmoji}>
                      {getStatusIcon(entry.status)}
                    </Text>
                    <View style={styles.progressInfo}>
                      <Text style={styles.progressTitle}>{entry.task_title}</Text>
                      <Text style={styles.progressDate}>
                        {formatDate(entry.submitted_at)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(entry.status) },
                      ]}
                    >
                      <Text style={styles.statusBadgeText}>
                        {getStatusText(entry.status)}
                      </Text>
                    </View>
                  </View>
                  {entry.parent_notes && (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Note:</Text>
                      <Text style={styles.notesText}>{entry.parent_notes}</Text>
                    </View>
                  )}
                  {entry.video_url && (
                    <View style={styles.videoIndicator}>
                      <Text style={styles.videoIndicatorText}>📹 Video attached</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {/* Legend */}
        <View style={styles.legendSection}>
          <Text style={styles.legendTitle}>Color Legend</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#4CAF50" }]} />
              <Text style={styles.legendText}>Fully Done</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#FF9800" }]} />
              <Text style={styles.legendText}>Partial</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#F44336" }]} />
              <Text style={styles.legendText}>Incomplete</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: AppColors.border }]} />
              <Text style={styles.legendText}>Pending</Text>
            </View>
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
  statsCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: AppColors.border,
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
  calendarSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 12,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  dayCell: {
    width: "13%",
    aspectRatio: 1,
    margin: "0.5%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dayCellSelected: {
    borderWidth: 2,
    borderColor: AppColors.primary,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "600",
  },
  dayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  dayDetailsSection: {
    marginBottom: 20,
  },
  noProgressCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  noProgressText: {
    fontSize: 14,
    color: AppColors.textLight,
    fontStyle: "italic",
  },
  progressCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 2,
  },
  progressDate: {
    fontSize: 12,
    color: AppColors.textLight,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    color: AppColors.white,
    fontWeight: "600",
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  notesLabel: {
    fontSize: 12,
    color: AppColors.textLight,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: AppColors.textPrimary,
    lineHeight: 20,
  },
  videoIndicator: {
    marginTop: 8,
    backgroundColor: AppColors.primaryLight,
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  videoIndicatorText: {
    fontSize: 12,
    color: AppColors.primaryDark,
    fontWeight: "500",
  },
  legendSection: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: AppColors.textLight,
  },
});
