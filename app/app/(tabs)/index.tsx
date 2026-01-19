import { useState, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// Types for assessment state
type AssessmentState =
  | 'no_mchat'              // M-CHAT not completed
  | 'waiting_for_doctor'    // Assessment submitted, pending doctor review
  | 'assessment_active'     // Assessment curriculum in progress
  | 'assessment_complete'   // Assessment done, waiting for personalized
  | 'personalized_active'   // Personalized curriculum in progress
  | 'personalized_complete' // Personalized curriculum done - therapy journey complete!
  | 'loading';

export default function HomeScreen() {
  const router = useRouter();
  const [children, setChildren] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [mchatResults, setMchatResults] = useState<{ [key: number]: any }>({});
  const [therapyData, setTherapyData] = useState<{ [key: number]: any }>({});
  const [assessmentData, setAssessmentData] = useState<{ [key: number]: any }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Refresh data when screen comes into focus (after navigating back)
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

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
        const assessments: { [key: number]: any } = {};
        try {
          const therapyRes = await axios.get(
            `${BASE_URL}/api/therapy/child/${child.id}/curriculum/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // Store assessment status for state detection
          assessments[child.id] = {
            assessment_status: therapyRes.data?.assessment_status,
            assessment_submitted_at: therapyRes.data?.assessment_submitted_at,
            curricula: therapyRes.data?.curricula || [],
          };

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
              curriculum_type: active.curriculum_type,
            };
          }
        } catch (err) {}
        setAssessmentData(prev => ({ ...prev, ...assessments }));
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

  // Determine the current assessment state
  const getAssessmentState = (): AssessmentState => {
    if (loading || !firstChild) return 'loading';

    const childAssessment = assessmentData[firstChild.id];
    const childMchat = mchatResults[firstChild.id];
    const childTherapy = therapyData[firstChild.id];

    // No M-CHAT completed yet
    if (!childMchat) {
      return 'no_mchat';
    }

    // PRIORITY: Check assessment status FIRST before checking curriculum
    // If doctor hasn't accepted yet, show waiting state regardless of any stale data
    if (childAssessment) {
      const status = childAssessment.assessment_status;

      // Pending doctor review - ALWAYS show waiting state
      if (status === 'pending' || status === 'in_review') {
        return 'waiting_for_doctor';
      }

      // Only if doctor has accepted, check for active curriculum
      if (status === 'accepted' || status === 'completed') {
        // Has active curriculum - check type
        if (childTherapy) {
          if (childTherapy.curriculum_type === 'personalized') {
            return 'personalized_active';
          }
          // Assessment curriculum is active
          return 'assessment_active';
        }

        // No active curriculum - check for completed ones
        const completedPersonalized = childAssessment.curricula?.find(
          (c: any) => c.curriculum_type === 'personalized' && c.status === 'completed'
        );
        if (completedPersonalized) {
          return 'personalized_complete';
        }

        // Check for completed assessment curriculum (no active curriculum)
        const completedAssessment = childAssessment.curricula?.find(
          (c: any) => c.curriculum_type === 'assessment' && c.status === 'completed'
        );
        if (completedAssessment) {
          return 'assessment_complete';
        }

        // Doctor accepted but no curriculum yet (shouldn't happen with auto-assign)
        return 'waiting_for_doctor';
      }
    }

    // M-CHAT done but no assessment record or unknown status - waiting for doctor
    return 'waiting_for_doctor';
  };

  const assessmentState = getAssessmentState();

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
          <Ionicons name="notifications" size={28} color="#333" />
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
        {/* Simple Progress - Only show when therapy active */}
        {(assessmentState === 'assessment_active' || assessmentState === 'personalized_active') && activeCurriculum && (
          <View style={styles.simpleProgress}>
            <Text style={styles.simpleProgressText}>
              Day {activeCurriculum.current_day} of {activeCurriculum.total_days}
            </Text>
            <View style={styles.progressBarLarge}>
              <View style={[styles.progressFillLarge, {
                width: `${(activeCurriculum.current_day / activeCurriculum.total_days) * 100}%`
              }]} />
            </View>
          </View>
        )}

        {/* State 1: No M-CHAT - Show M-CHAT Card */}
        {assessmentState === 'no_mchat' && children.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>M-CHAT Assessment</Text>
            </View>
            <Text style={styles.cardSub}>
              Assessment for {children[0]?.full_name}
            </Text>
            <View style={styles.insightBox}>
              <MaterialCommunityIcons
                name="chart-timeline-variant"
                size={32}
                color="#03A9F4"
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.insightTitle}>Start Screening</Text>
                <Text style={styles.insightSub}>
                  Complete the M-CHAT screening
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.pinkBtn}
              onPress={() => handleMChatPress(children[0])}
            >
              <Text style={styles.pinkBtnText}>Start Screening</Text>
              <Ionicons name="arrow-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* State 2: Waiting for Doctor Review */}
        {assessmentState === 'waiting_for_doctor' && (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Assessment Under Review</Text>
                <View style={styles.pendingBadge}>
                  <Ionicons name="time-outline" size={14} color="#F59E0B" />
                </View>
              </View>
              <Text style={styles.cardSub}>
                Your assessment has been submitted
              </Text>
              <View style={[styles.insightBox, { backgroundColor: "#FFFBEB" }]}>
                <Ionicons name="hourglass-outline" size={32} color="#F59E0B" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.insightTitle}>Pending Review</Text>
                  <Text style={styles.insightSub}>
                    A doctor will review your submission shortly
                  </Text>
                </View>
              </View>
            </View>

            {/* What Happens Next Section */}
            <View style={styles.secHeader}>
              <Text style={styles.secTitle}>What Happens Next</Text>
            </View>

            <View style={styles.timelineContainer}>
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.timelineDotActive]} />
                <View style={styles.timelineLine} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>You submitted</Text>
                  <Text style={styles.timelineSub}>M-CHAT screening & videos</Text>
                </View>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </View>

              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.timelineDotCurrent]} />
                <View style={styles.timelineLine} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Doctor reviews</Text>
                  <Text style={styles.timelineSub}>Usually within 24-48 hours</Text>
                </View>
                <Ionicons name="time-outline" size={24} color="#F59E0B" />
              </View>

              <View style={[styles.timelineItem, { marginBottom: 0 }]}>
                <View style={[styles.timelineDot, styles.timelineDotPending]} />
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineTitle, { color: "#9CA3AF" }]}>3-Day assessment starts</Text>
                  <Text style={styles.timelineSub}>Observation tasks for your child</Text>
                </View>
                <Ionicons name="clipboard-outline" size={24} color="#D1D5DB" />
              </View>
            </View>

            {/* Tip Card */}
            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Ionicons name="bulb" size={28} color="#F59E0B" />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.tipTitle}>While you wait</Text>
                <Text style={styles.tipText}>
                  Spend quality time with your child. Play, talk, and observe their daily activities.
                </Text>
              </View>
            </View>
          </>
        )}

        {/* State 3: Assessment Curriculum In Progress */}
        {assessmentState === 'assessment_active' && activeCurriculum && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>3-Day Assessment</Text>
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
                size={32}
                color="#10B981"
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.insightTitle}>
                  {todayTasks.length} Tasks Today
                </Text>
                <Text style={styles.insightSub}>
                  Complete tasks to help us understand your child
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.pinkBtn}
              onPress={() => router.push("/therapy/today")}
            >
              <Text style={styles.pinkBtnText}>View Today&apos;s Tasks</Text>
              <Ionicons name="arrow-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* State 4: Assessment Complete - Waiting for Personalized Curriculum */}
        {assessmentState === 'assessment_complete' && (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Assessment Complete!</Text>
                <Ionicons name="checkmark-circle" size={22} color="#10B981" />
              </View>
              <Text style={styles.cardSub}>
                Great job completing the assessment
              </Text>
              <View style={[styles.insightBox, { backgroundColor: "#ECFDF5" }]}>
                <Ionicons name="document-text-outline" size={32} color="#10B981" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.insightTitle}>Results Under Review</Text>
                  <Text style={styles.insightSub}>
                    Your doctor is reviewing the results
                  </Text>
                </View>
              </View>
            </View>

            {/* What You Completed Section */}
            <View style={styles.secHeader}>
              <Text style={styles.secTitle}>What You Completed</Text>
            </View>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconBg, { backgroundColor: "#E0F2FE" }]}>
                  <Ionicons name="clipboard-outline" size={28} color="#0369A1" />
                </View>
                <Text style={styles.summaryLabel}>M-CHAT</Text>
                <Text style={styles.summaryValue}>Completed</Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconBg, { backgroundColor: "#F0FDF4" }]}>
                  <Ionicons name="calendar-outline" size={28} color="#15803D" />
                </View>
                <Text style={styles.summaryLabel}>Assessment</Text>
                <Text style={styles.summaryValue}>3 Days</Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconBg, { backgroundColor: "#FEF3C7" }]}>
                  <Ionicons name="videocam-outline" size={28} color="#D97706" />
                </View>
                <Text style={styles.summaryLabel}>Videos</Text>
                <Text style={styles.summaryValue}>Uploaded</Text>
              </View>
            </View>

            {/* What's Next Timeline */}
            <View style={styles.secHeader}>
              <Text style={styles.secTitle}>What&apos;s Next</Text>
            </View>

            <View style={styles.timelineContainer}>
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.timelineDotActive]} />
                <View style={styles.timelineLine} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Assessment complete</Text>
                  <Text style={styles.timelineSub}>Great job!</Text>
                </View>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </View>

              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.timelineDotCurrent]} />
                <View style={styles.timelineLine} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Doctor creates plan</Text>
                  <Text style={styles.timelineSub}>Personalized for your child</Text>
                </View>
                <Ionicons name="time-outline" size={24} color="#F59E0B" />
              </View>

              <View style={[styles.timelineItem, { marginBottom: 0 }]}>
                <View style={[styles.timelineDot, styles.timelineDotPending]} />
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineTitle, { color: "#9CA3AF" }]}>Personalized therapy begins</Text>
                  <Text style={styles.timelineSub}>15-45 days of activities</Text>
                </View>
                <Ionicons name="star-outline" size={24} color="#D1D5DB" />
              </View>
            </View>
          </>
        )}

        {/* State 5: Personalized Curriculum Active */}
        {assessmentState === 'personalized_active' && activeCurriculum && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Personalized Therapy</Text>
              <View style={[styles.dayBadge, { backgroundColor: "#F3E8FF" }]}>
                <Text style={[styles.dayBadgeText, { color: "#7C3AED" }]}>
                  Day {activeCurriculum.current_day}/{activeCurriculum.total_days}
                </Text>
              </View>
            </View>
            <Text style={styles.cardSub}>{activeCurriculum.name}</Text>
            <View style={[styles.insightBox, { backgroundColor: "#F3E8FF" }]}>
              <Ionicons name="star" size={32} color="#7C3AED" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.insightTitle}>
                  {todayTasks.length} Tasks Today
                </Text>
                <Text style={styles.insightSub}>
                  Custom activities for your child
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.pinkBtn, { backgroundColor: "#7C3AED" }]}
              onPress={() => router.push("/therapy/today")}
            >
              <Text style={styles.pinkBtnText}>View Today&apos;s Tasks</Text>
              <Ionicons name="arrow-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* State 6: Personalized Curriculum Complete - Therapy Journey Done! */}
        {assessmentState === 'personalized_complete' && (
          <>
            <View style={[styles.card, { backgroundColor: "#ECFDF5", borderWidth: 2, borderColor: "#10B981" }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Therapy Complete!</Text>
                <Ionicons name="trophy" size={24} color="#10B981" />
              </View>
              <Text style={styles.cardSub}>
                Congratulations on completing the therapy program
              </Text>
              <View style={[styles.insightBox, { backgroundColor: "#D1FAE5" }]}>
                <Ionicons name="ribbon" size={32} color="#059669" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.insightTitle}>Amazing Progress!</Text>
                  <Text style={styles.insightSub}>
                    Your child has completed all therapy tasks
                  </Text>
                </View>
              </View>
            </View>

            {/* Your Journey Section */}
            <View style={styles.secHeader}>
              <Text style={styles.secTitle}>Your Journey</Text>
            </View>

            <View style={styles.journeySummary}>
              <View style={styles.journeyItem}>
                <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                <Text style={styles.journeyLabel}>M-CHAT{"\n"}Screening</Text>
              </View>
              <View style={styles.journeyLine} />
              <View style={styles.journeyItem}>
                <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                <Text style={styles.journeyLabel}>3-Day{"\n"}Assessment</Text>
              </View>
              <View style={styles.journeyLine} />
              <View style={styles.journeyItem}>
                <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                <Text style={styles.journeyLabel}>Personalized{"\n"}Therapy</Text>
              </View>
            </View>

            {/* Achievement Card */}
            <View style={styles.achievementCard}>
              <View style={styles.achievementIconBg}>
                <Ionicons name="trophy" size={40} color="#F59E0B" />
              </View>
              <Text style={styles.achievementTitle}>Congratulations!</Text>
              <Text style={styles.achievementText}>
                You&apos;ve completed the therapy program. Your dedication will make a real difference in your child&apos;s development.
              </Text>
            </View>

            {/* Next Steps Card */}
            <View style={[styles.tipCard, { borderColor: "#E9D5FF", backgroundColor: "#F5F3FF" }]}>
              <View style={[styles.tipIconContainer, { backgroundColor: "#E9D5FF" }]}>
                <Ionicons name="calendar" size={28} color="#7C3AED" />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={[styles.tipTitle, { color: "#5B21B6" }]}>What&apos;s Next</Text>
                <Text style={[styles.tipText, { color: "#6B21A8" }]}>
                  Your doctor will schedule a follow-up to discuss your child&apos;s progress and next steps.
                </Text>
              </View>
            </View>
          </>
        )}

        {/* 3. Focus Section - Show based on assessment state */}
        {(assessmentState === 'assessment_active' || assessmentState === 'personalized_active') && (
          <>
            <View style={styles.secHeader}>
              <Text style={styles.secTitle}>Today&apos;s Focus</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{todayTasks.length} Tasks</Text>
              </View>
            </View>

            {todayTasks.length > 0 ? (
              <>
                {todayTasks.slice(0, 2).map((taskItem: any, index: number) => {
                  // Handle nested task structure from API
                  const taskData = taskItem.task || taskItem;
                  const isCompleted = taskItem.is_completed || taskItem.progress?.status === "done_without_help" || taskItem.progress?.status === "done_with_help";
                  const isDoneWithHelp = taskItem.progress?.status === "done_with_help";
                  const isDoneWithoutHelp = taskItem.progress?.status === "done_without_help";

                  return (
                    <TouchableOpacity
                      key={taskData.id || index}
                      style={styles.taskItem}
                      onPress={() =>
                        router.push({
                          pathname: "/therapy/task-detail",
                          params: {
                            childId: firstChild?.id?.toString(),
                            taskId: taskData.id?.toString(),
                          },
                        })
                      }
                    >
                      <View
                        style={[
                          styles.taskIcon,
                          {
                            backgroundColor: isDoneWithoutHelp
                              ? "#E8F5E9"
                              : isDoneWithHelp
                              ? "#FFF3E0"
                              : "#F3E5F5",
                          },
                        ]}
                      >
                        {isDoneWithoutHelp ? (
                          <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
                        ) : isDoneWithHelp ? (
                          <Ionicons name="checkmark" size={28} color="#FF9800" />
                        ) : (
                          <Ionicons name="play" size={28} color="#9C27B0" />
                        )}
                      </View>
                      <View style={{ flex: 1, marginLeft: 16 }}>
                        <Text style={styles.tTitle}>{taskData.title}</Text>
                        <Text style={styles.tSub}>
                          Task {index + 1} • {isCompleted ? "Completed" : "Pending"}
                        </Text>
                      </View>
                      <Ionicons
                        name={isCompleted ? "checkmark-circle" : "chevron-forward"}
                        size={28}
                        color={isCompleted ? "#4CAF50" : "#D1D5DB"}
                      />
                    </TouchableOpacity>
                  );
                })}
                {todayTasks.length > 2 && (
                  <TouchableOpacity
                    style={styles.viewAllBtn}
                    onPress={() => router.push("/therapy/today")}
                  >
                    <Text style={styles.viewAllText}>
                      View all {todayTasks.length} tasks
                    </Text>
                    <Ionicons name="arrow-forward" size={22} color="#F97316" />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <View style={styles.emptyTaskCard}>
                <Ionicons name="checkmark-done-circle" size={48} color="#4CAF50" />
                <Text style={styles.emptyTaskTitle}>All caught up!</Text>
                <Text style={styles.emptyTaskSub}>
                  No pending tasks for today. Great job!
                </Text>
              </View>
            )}
          </>
        )}

        {/* Show get started section for no_mchat state */}
        {assessmentState === 'no_mchat' && children.length > 0 && (
          <>
            <View style={styles.secHeader}>
              <Text style={styles.secTitle}>Today&apos;s Focus</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Get Started</Text>
              </View>
            </View>
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
                <Ionicons name="clipboard" size={28} color="#2196F3" />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.tTitle}>Complete M-CHAT Screening</Text>
                <Text style={styles.tSub}>5 mins • Required</Text>
              </View>
              <Ionicons name="chevron-forward" size={28} color="#D1D5DB" />
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
  subWelcomeText: { fontSize: 16, color: "#4B5563", marginLeft: 12, lineHeight: 22 },
  notificationBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  redDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF3B30",
    borderWidth: 1.5,
    borderColor: "#FFF",
  },

  // FIXED PADDING FOR TAB BAR (position absolute)
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 8 },

  // Simple progress (replaces complex stats row)
  simpleProgress: {
    backgroundColor: "#F0F9FF",
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
  },
  simpleProgressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0369A1",
    marginBottom: 10,
  },
  progressBarLarge: {
    width: "100%",
    height: 12,
    backgroundColor: "#E2E8F0",
    borderRadius: 6,
  },
  progressFillLarge: {
    height: "100%",
    backgroundColor: "#F97316",
    borderRadius: 6,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowOpacity: 0.08,
    marginVertical: 12,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  cardSub: { fontSize: 15, color: "#6B7280", marginTop: 6, lineHeight: 22 },
  insightBox: {
    flexDirection: "row",
    backgroundColor: "#F0F9FF",
    padding: 12,
    borderRadius: 16,
    marginTop: 15,
    alignItems: "center",
  },
  insightTitle: { fontSize: 16, fontWeight: "700", color: "#1F2937" },
  insightSub: { fontSize: 14, color: "#4B5563", lineHeight: 20, marginTop: 2 },
  pinkBtn: {
    backgroundColor: "#F97316",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 64,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pinkBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 10,
    letterSpacing: 0.5,
  },

  secHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 20,
  },
  secTitle: { fontSize: 20, fontWeight: "700", color: "#1F2937" },
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  badgeText: { fontSize: 14, color: "#0369A1", fontWeight: "700" },

  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 18,
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 3,
  },
  taskIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  tTitle: { fontSize: 17, fontWeight: "700", color: "#1F2937" },
  tSub: { fontSize: 14, color: "#6B7280", marginTop: 4 },

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
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
    marginTop: 8,
    backgroundColor: "#FFF7ED",
    borderRadius: 16,
    minHeight: 56,
  },
  viewAllText: {
    fontSize: 16,
    color: "#F97316",
    fontWeight: "700",
    marginRight: 8,
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
  pendingBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  waitingInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 4,
  },
  waitingInfoText: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 8,
    flex: 1,
  },

  // Timeline Styles
  timelineContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 16,
  },
  timelineDotActive: {
    backgroundColor: "#10B981",
  },
  timelineDotCurrent: {
    backgroundColor: "#F59E0B",
    borderWidth: 3,
    borderColor: "#FEF3C7",
  },
  timelineDotPending: {
    backgroundColor: "#E5E7EB",
  },
  timelineLine: {
    position: "absolute",
    left: 7,
    top: 20,
    width: 2,
    height: 40,
    backgroundColor: "#E5E7EB",
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  timelineSub: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },

  // Summary Grid Styles
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
    elevation: 2,
  },
  summaryIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 2,
  },

  // Tip Card Styles
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#FFFBEB",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  tipIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
  },
  tipText: {
    fontSize: 14,
    color: "#78350F",
    marginTop: 4,
    lineHeight: 20,
  },

  // Journey Summary (for personalized_complete)
  journeySummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    marginBottom: 16,
  },
  journeyItem: {
    alignItems: "center",
    flex: 1,
  },
  journeyLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  journeyLine: {
    width: 24,
    height: 2,
    backgroundColor: "#10B981",
  },

  // Achievement Card (for personalized_complete)
  achievementCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#FDE68A",
  },
  achievementIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  achievementTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 15,
    color: "#78350F",
    textAlign: "center",
    lineHeight: 22,
  },
});
