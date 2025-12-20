import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AppColors } from "@/constants/theme";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface Task {
  id: number;
  day_number: number;
  title: string;
  why_description: string;
  instructions: string;
  demo_video_url: string;
  order_index: number;
}

interface TaskItem {
  task: Task;
  progress: any | null;
  is_completed: boolean;
}

interface TodayData {
  curriculum_title: string;
  current_day: number;
  total_days: number;
  date: string;
  tasks: TaskItem[];
}

export default function TodayTasksScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const paramChildId = params.childId as string;

  const [childId, setChildId] = useState<string | null>(paramChildId || null);
  const [todayData, setTodayData] = useState<TodayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancingDay, setAdvancingDay] = useState(false);

  useEffect(() => {
    initializeAndLoad();
  }, []);

  const initializeAndLoad = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      // If no childId from params, fetch children list first
      let activeChildId = paramChildId;
      if (!activeChildId) {
        const childrenRes = await axios.get(`${BASE_URL}/api/children/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const children = childrenRes.data || [];
        if (children.length > 0) {
          activeChildId = children[0].id.toString();
          setChildId(activeChildId);
        } else {
          setLoading(false);
          return;
        }
      }

      await loadTodayTasks(activeChildId, token);
    } catch (error: any) {
      console.error("Error initializing:", error);
      setLoading(false);
    }
  };

  const loadTodayTasks = async (cid?: string, existingToken?: string) => {
    try {
      const token = existingToken || await AsyncStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const targetChildId = cid || childId;
      if (!targetChildId) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/therapy/child/${targetChildId}/today/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTodayData(response.data);
    } catch (error: any) {
      console.error("Error loading today's tasks:", error);
      // Don't show alert for 404 - just means no active curriculum
      if (error.response?.status !== 404) {
        Alert.alert("त्रुटि", "कार्यहरू लोड गर्न सकिएन");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleTaskPress = (taskItem: TaskItem) => {
    const task = taskItem.task;
    router.push({
      pathname: "/therapy/task-detail",
      params: {
        childId,
        taskId: task.id.toString(),
        taskTitle: task.title,
        taskWhy: task.why_description,
        taskInstructions: task.instructions,
        taskVideoUrl: task.demo_video_url || "",
      },
    });
  };

  const handleAdvanceDay = async () => {
    if (!todayData) return;

    const uncompletedTasks = todayData.tasks.filter(
      (item) => !item.is_completed
    );

    if (uncompletedTasks.length > 0) {
      Alert.alert(
        "कार्यहरू बाँकी छ",
        `${uncompletedTasks.length} कार्यहरू अझै पूरा भएको छैन। के तपाईं अर्को दिनमा जान चाहनुहुन्छ?`,
        [
          { text: "रद्द गर्नुहोस्", style: "cancel" },
          { text: "अगाडि बढ्नुहोस्", onPress: confirmAdvanceDay },
        ]
      );
    } else {
      confirmAdvanceDay();
    }
  };

  const confirmAdvanceDay = async () => {
    setAdvancingDay(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.post(
        `${BASE_URL}/api/therapy/child/${childId}/advance/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("सफलता", "अर्को दिनमा सरियो!", [
        { text: "ठीक छ", onPress: loadTodayTasks },
      ]);
    } catch (error: any) {
      console.error("Error advancing day:", error);
      Alert.alert(
        "त्रुटि",
        error.response?.data?.message || "अर्को दिनमा सार्न सकिएन"
      );
    } finally {
      setAdvancingDay(false);
    }
  };

  const getCompletedCount = () => {
    if (!todayData) return 0;
    return todayData.tasks.filter((item) => item.is_completed).length;
  };

  const getCompletionPercentage = () => {
    if (!todayData || todayData.tasks.length === 0) return 0;
    return Math.round(
      (getCompletedCount() / todayData.tasks.length) * 100
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={styles.loadingText}>कार्यहरू लोड हुँदैछ...</Text>
      </View>
    );
  }

  if (!todayData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>आजका कार्यहरू</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>📋</Text>
          <Text style={styles.errorTitle}>कार्यहरू उपलब्ध छैन</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={loadTodayTasks}>
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
          <Text style={styles.headerTitle}>आजका कार्यहरू</Text>
          <Text style={styles.headerSubtitle}>
            दिन {todayData.current_day}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryTitle}>प्रगति</Text>
            <Text style={styles.summaryStats}>
              {getCompletedCount()}/{todayData.tasks.length} कार्य पूरा
            </Text>
          </View>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercent}>{getCompletionPercentage()}%</Text>
          </View>
        </View>

        {/* Tasks List */}
        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>कार्य सूची</Text>

          {todayData.tasks.length === 0 ? (
            <View style={styles.noTasksCard}>
              <Text style={styles.noTasksEmoji}>🎉</Text>
              <Text style={styles.noTasksTitle}>आज कुनै कार्य छैन</Text>
              <Text style={styles.noTasksSubtitle}>
                आज विश्राम गर्नुहोस्!
              </Text>
            </View>
          ) : (
            todayData.tasks.map((taskItem, index) => {
              const completed = taskItem.is_completed;
              const task = taskItem.task;
              return (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.taskCard,
                    completed && styles.taskCardCompleted,
                  ]}
                  onPress={() => handleTaskPress(taskItem)}
                >
                  <View
                    style={[
                      styles.taskNumber,
                      completed && styles.taskNumberCompleted,
                    ]}
                  >
                    {completed ? (
                      <Text style={styles.taskCheckmark}>✓</Text>
                    ) : (
                      <Text style={styles.taskNumberText}>{index + 1}</Text>
                    )}
                  </View>
                  <View style={styles.taskContent}>
                    <Text
                      style={[
                        styles.taskTitle,
                        completed && styles.taskTitleCompleted,
                      ]}
                    >
                      {task.title}
                    </Text>
                    <Text style={styles.taskWhy} numberOfLines={2}>
                      {task.why_description}
                    </Text>
                    {completed ? (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedBadgeText}>पूरा भयो</Text>
                      </View>
                    ) : (
                      <Text style={styles.taskAction}>विवरण हेर्नुहोस् →</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Advance Day Button */}
        {todayData.tasks.length > 0 && (
          <TouchableOpacity
            style={[
              styles.advanceButton,
              getCompletionPercentage() < 100 && styles.advanceButtonWarning,
            ]}
            onPress={handleAdvanceDay}
            disabled={advancingDay}
          >
            {advancingDay ? (
              <ActivityIndicator color={AppColors.white} />
            ) : (
              <>
                <Text style={styles.advanceButtonText}>
                  {getCompletionPercentage() === 100
                    ? "अर्को दिनमा जानुहोस्"
                    : "कार्यहरू छोड्नुहोस् र अगाडि बढ्नुहोस्"}
                </Text>
                <Text style={styles.advanceButtonArrow}>→</Text>
              </>
            )}
          </TouchableOpacity>
        )}

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
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 16,
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
  summaryCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  summaryLeft: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 14,
    color: AppColors.textLight,
    marginBottom: 4,
  },
  summaryStats: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.textPrimary,
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppColors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: AppColors.primary,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.primaryDark,
  },
  tasksSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 12,
  },
  noTasksCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  noTasksEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  noTasksTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  noTasksSubtitle: {
    fontSize: 14,
    color: AppColors.textLight,
  },
  taskCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  taskCardCompleted: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
  },
  taskNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  taskNumberCompleted: {
    backgroundColor: "#4CAF50",
  },
  taskNumberText: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.primaryDark,
  },
  taskCheckmark: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.white,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: AppColors.textLight,
  },
  taskWhy: {
    fontSize: 13,
    color: AppColors.textLight,
    lineHeight: 18,
    marginBottom: 8,
  },
  taskAction: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: "500",
  },
  completedBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  completedBadgeText: {
    fontSize: 12,
    color: AppColors.white,
    fontWeight: "600",
  },
  advanceButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 12,
    padding: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  advanceButtonWarning: {
    backgroundColor: "#FF9800",
  },
  advanceButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.white,
    marginRight: 8,
  },
  advanceButtonArrow: {
    fontSize: 18,
    color: AppColors.white,
  },
});
