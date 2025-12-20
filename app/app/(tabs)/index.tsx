import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function HomeScreen() {
  const router = useRouter();
  const [children, setChildren] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [mchatResults, setMchatResults] = useState<{ [key: number]: any }>({});
  const [therapyData, setTherapyData] = useState<{ [key: number]: any }>({});
  const [doctorFeedback, setDoctorFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const loadDashboardData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      // Real User Profile Fetching
      try {
        const userRes = await axios.get(`${BASE_URL}/api/auth/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(userRes.data);
      } catch (e) {}

      // Children Fetching
      const response = await axios.get(`${BASE_URL}/api/children/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const childrenData = response.data || [];
      setChildren(childrenData);

      const results: { [key: number]: any } = {};
      const therapy: { [key: number]: any } = {};

      for (const child of childrenData) {
        // M-CHAT logic
        try {
          const mchatRes = await axios.get(
            `${BASE_URL}/api/children/${child.id}/mchat/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (mchatRes.data?.total_score !== undefined)
            results[child.id] = mchatRes.data;
        } catch (err) {}

        // Therapy logic - get active curriculum with today's tasks
        try {
          const therapyRes = await axios.get(
            `${BASE_URL}/api/therapy/child/${child.id}/curriculum/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const active = (therapyRes.data?.curricula || []).find(
            (c: any) => c.status === "active"
          );
          if (active) {
            // Get today's tasks for this curriculum
            let todayTasks: any[] = [];
            try {
              const todayRes = await axios.get(
                `${BASE_URL}/api/therapy/child/${child.id}/today/`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              todayTasks = todayRes.data?.tasks || [];
            } catch {}

            therapy[child.id] = {
              name: active.curriculum_title,
              current_day: active.current_day,
              total_days: active.curriculum_duration,
              tasks: todayTasks,
              curriculum_id: active.id,
            };
          }
        } catch (err) {}

        // Fetch doctor feedback for first child
        if (childrenData.indexOf(child) === 0) {
          try {
            const feedbackRes = await axios.get(
              `${BASE_URL}/api/therapy/child/${child.id}/feedback/`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (feedbackRes.data?.has_feedback) {
              setDoctorFeedback(feedbackRes.data.latest_review);
            }
          } catch (err) {}
        }
      }
      setMchatResults(results);
      setTherapyData(therapy);
    } catch (error) {
      console.log("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMChatPress = (child: any) => {
    const result = mchatResults[child.id];
    if (result) {
      router.push({
        pathname: "/mchat/results",
        params: {
          childId: child.id.toString(),
          score: result.total_score.toString(),
          riskLevel: result.risk_level,
        },
      });
    } else {
      router.push({
        pathname: "/mchat/medical-history",
        params: { childId: child.id.toString() },
      });
    }
  };

  // Get first name from full_name
  const getFirstName = (fullName: string) => {
    if (!fullName) return "Parent";
    return fullName.split(" ")[0];
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "P";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const displayName = getFirstName(userData?.full_name);
  const childName = children[0]?.full_name?.split(" ")[0] || "Child";
  const userInitials = getInitials(userData?.full_name || "");

  // Check if first child has active therapy
  const firstChild = children[0];
  const hasActiveCurriculum = firstChild && therapyData[firstChild?.id];
  const activeCurriculum = hasActiveCurriculum ? therapyData[firstChild.id] : null;
  const todayTasks = activeCurriculum?.tasks || [];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* 1. Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.profilePic}>
            <Text style={styles.profileInitials}>{userInitials}</Text>
          </View>
          <View>
            <Text style={styles.welcomeText}>{getGreeting()}, {displayName}</Text>
            <Text style={styles.subWelcomeText}>
              Here is {childName}'s progress today
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications" size={20} color="#333" />
          <View style={styles.redDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#F97316"]} />
        }
      >
        {/* Progress & Streak Bar */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Daily Progress</Text>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, {
                width: `${todayTasks.length > 0
                  ? (todayTasks.filter((t: any) => t.status !== "not_done").length / todayTasks.length) * 100
                  : 0}%`
              }]} />
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Day</Text>
            <Text style={styles.streakVal}>
              📅 {activeCurriculum ? `${activeCurriculum.current_day}/${activeCurriculum.total_days}` : "0"}
            </Text>
          </View>
        </View>

        {/* Show Therapy Progress Card if active curriculum exists */}
        {hasActiveCurriculum && activeCurriculum && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Today&apos;s Therapy</Text>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>
                  Day {activeCurriculum.current_day}/{activeCurriculum.total_days}
                </Text>
              </View>
            </View>

            <Text style={styles.cardSub}>{activeCurriculum.name}</Text>

            <View style={styles.insightBox}>
              <MaterialCommunityIcons
                name="clipboard-check-outline"
                size={20}
                color="#10B981"
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.insightTitle}>
                  {todayTasks.length} Tasks Today
                </Text>
                <Text style={styles.insightSub}>
                  Complete tasks to track progress
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.pinkBtn}
              onPress={() => router.push("/therapy/today")}
            >
              <Text style={styles.pinkBtnText}>View Today&apos;s Tasks</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Show M-CHAT Card if no active curriculum */}
        {!hasActiveCurriculum && children.length > 0 &&
          (() => {
            const child = children[0];
            const result = mchatResults[child.id];
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>M-CHAT Assessment</Text>
                  {result && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="#4CAF50"
                    />
                  )}
                </View>

                <Text style={styles.cardSub}>
                  {result
                    ? `Completed - Score: ${result.total_score}/20`
                    : `Assessment for ${child.full_name}`}
                </Text>

                <View style={styles.insightBox}>
                  <MaterialCommunityIcons
                    name="chart-timeline-variant"
                    size={20}
                    color="#03A9F4"
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.insightTitle}>
                      {result ? "Results Available" : "Start Screening"}
                    </Text>
                    <Text style={styles.insightSub}>
                      {result
                        ? "View your child's assessment results"
                        : "Complete the M-CHAT screening"}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.pinkBtn}
                  onPress={() => handleMChatPress(child)}
                >
                  <Text style={styles.pinkBtnText}>
                    {result ? "View Full Report" : "Start Screening"}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            );
          })()}
        {/* 3. Feedback Section */}
        <View style={styles.secHeader}>
          <Text style={styles.secTitle}>Doctor&apos;s Feedback</Text>
          {doctorFeedback && (
            <TouchableOpacity>
              <Text style={styles.viewHist}>View History</Text>
            </TouchableOpacity>
          )}
        </View>

        {doctorFeedback ? (
          <View style={styles.docCard}>
            <View style={styles.docAvatar}>
              <Ionicons name="person" size={20} color="#FFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.docName}>{doctorFeedback.doctor_name || "Doctor"}</Text>
                <Text style={styles.timeAgo}>Day {doctorFeedback.review_period}</Text>
              </View>
              <View style={styles.bubble}>
                <Text style={styles.bubbleText}>
                  {doctorFeedback.observations}
                </Text>
              </View>
              {doctorFeedback.recommendations && (
                <View style={[styles.bubble, { backgroundColor: "#E8F5E9", marginTop: 8 }]}>
                  <Text style={[styles.bubbleText, { color: "#2E7D32" }]}>
                    <Text style={{ fontWeight: "700" }}>Recommendation: </Text>
                    {doctorFeedback.recommendations}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.noFeedbackCard}>
            <Ionicons name="chatbubble-ellipses-outline" size={32} color="#9CA3AF" />
            <Text style={styles.noFeedbackTitle}>No feedback yet</Text>
            <Text style={styles.noFeedbackSub}>
              Doctor feedback will appear here after reviews
            </Text>
          </View>
        )}

        {/* 4. Focus Section - Show real tasks if curriculum active */}
        <View style={styles.secHeader}>
          <Text style={styles.secTitle}>Today&apos;s Focus</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {hasActiveCurriculum ? `${todayTasks.length} Tasks` : "Get Started"}
            </Text>
          </View>
        </View>

        {/* Show real therapy tasks if curriculum is active */}
        {hasActiveCurriculum && todayTasks.length > 0 ? (
          <>
            {todayTasks.slice(0, 3).map((task: any, index: number) => (
              <TouchableOpacity
                key={task.id || index}
                style={styles.taskItem}
                onPress={() =>
                  router.push({
                    pathname: "/therapy/task-detail",
                    params: {
                      childId: firstChild?.id?.toString(),
                      taskId: task.id?.toString(),
                    },
                  })
                }
              >
                <View
                  style={[
                    styles.taskIcon,
                    {
                      backgroundColor: task.status === "done_without_help"
                        ? "#E8F5E9"
                        : task.status === "done_with_help"
                        ? "#FFF3E0"
                        : "#F3E5F5",
                    },
                  ]}
                >
                  {task.status === "done_without_help" ? (
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  ) : task.status === "done_with_help" ? (
                    <Ionicons name="checkmark" size={20} color="#FF9800" />
                  ) : (
                    <Ionicons name="play" size={20} color="#9C27B0" />
                  )}
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={styles.tTitle}>{task.title}</Text>
                  <Text style={styles.tSub}>
                    Task {index + 1} • {task.status === "not_done" ? "Pending" : "Completed"}
                  </Text>
                </View>
                <Ionicons
                  name={task.status !== "not_done" ? "checkmark-circle" : "chevron-forward"}
                  size={22}
                  color={task.status !== "not_done" ? "#4CAF50" : "#D1D5DB"}
                />
              </TouchableOpacity>
            ))}
            {todayTasks.length > 3 && (
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => router.push("/therapy/today")}
              >
                <Text style={styles.viewAllText}>
                  View all {todayTasks.length} tasks
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#F97316" />
              </TouchableOpacity>
            )}
          </>
        ) : hasActiveCurriculum ? (
          <View style={styles.emptyTaskCard}>
            <Ionicons name="checkmark-done-circle" size={48} color="#4CAF50" />
            <Text style={styles.emptyTaskTitle}>All caught up!</Text>
            <Text style={styles.emptyTaskSub}>
              No pending tasks for today. Great job!
            </Text>
          </View>
        ) : (
          <>
            {/* Show placeholder for new users */}
            <TouchableOpacity
              style={styles.taskItem}
              onPress={() =>
                router.push({
                  pathname: "/mchat/medical-history",
                  params: { childId: children[0]?.id?.toString() },
                })
              }
            >
              <View style={[styles.taskIcon, { backgroundColor: "#E3F2FD" }]}>
                <Ionicons name="clipboard" size={20} color="#2196F3" />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.tTitle}>Complete M-CHAT Screening</Text>
                <Text style={styles.tSub}>5 mins • Required</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#D1D5DB" />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F97316",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitials: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  welcomeText: { fontSize: 18, fontWeight: "700", marginLeft: 12 },
  subWelcomeText: { fontSize: 13, color: "#6B7280", marginLeft: 12 },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  redDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    borderWidth: 1.5,
    borderColor: "#FFF",
  },

  // FIXED PADDING FOR TAB BAR (position absolute)
  scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "#F0F9FF",
    borderRadius: 16,
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
  },
  statBox: { flex: 1, alignItems: "center" },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  progressBg: {
    width: "80%",
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
  },
  progressFill: { height: "100%", backgroundColor: "#00C2FF", borderRadius: 3 },
  statDivider: { width: 1, height: "60%", backgroundColor: "#CBD5E1" },
  streakVal: { fontSize: 14, fontWeight: "700" },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    elevation: 3,
    shadowOpacity: 0.05,
    marginVertical: 10,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  cardSub: { fontSize: 13, color: "#9CA3AF", marginTop: 4 },
  insightBox: {
    flexDirection: "row",
    backgroundColor: "#F0F9FF",
    padding: 12,
    borderRadius: 16,
    marginTop: 15,
    alignItems: "center",
  },
  insightTitle: { fontSize: 14, fontWeight: "700" },
  insightSub: { fontSize: 12, color: "#6B7280" },
  pinkBtn: {
    backgroundColor: "#F97316",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 18,
  },
  pinkBtnText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
    marginRight: 8,
  },

  secHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
  },
  secTitle: { fontSize: 18, fontWeight: "700" },
  viewHist: { fontSize: 13, color: "#F97316", fontWeight: "600" },

  docCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    marginBottom: 20,
    flexDirection: "row",
  },
  docAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  docName: { fontSize: 15, fontWeight: "700" },
  timeAgo: { fontSize: 11, color: "#9CA3AF" },
  bubble: {
    backgroundColor: "#FFF7ED",
    padding: 12,
    borderRadius: 15,
    borderTopLeftRadius: 0,
    marginTop: 8,
  },
  bubbleText: { fontSize: 13, color: "#4B5563" },
  replyRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  replyLabel: {
    fontSize: 13,
    color: "#F97316",
    fontWeight: "700",
    marginLeft: 6,
  },

  badge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 12, color: "#0369A1", fontWeight: "700" },

  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 20,
    marginBottom: 12,
    elevation: 2,
  },
  taskIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  tTitle: { fontSize: 15, fontWeight: "700" },
  tSub: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },

  // New styles for therapy tasks
  dayBadge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dayBadgeText: { fontSize: 12, color: "#0369A1", fontWeight: "700" },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginBottom: 10,
  },
  viewAllText: {
    fontSize: 14,
    color: "#F97316",
    fontWeight: "600",
    marginRight: 4,
  },
  emptyTaskCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTaskTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#166534",
    marginTop: 12,
  },
  emptyTaskSub: {
    fontSize: 14,
    color: "#15803D",
    marginTop: 4,
    textAlign: "center",
  },
  noFeedbackCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  noFeedbackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 12,
  },
  noFeedbackSub: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
    textAlign: "center",
  },
});
