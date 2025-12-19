import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function HomeScreen() {
  const router = useRouter();
  const [children, setChildren] = useState<any[]>([]);
  const [mchatResults, setMchatResults] = useState<{ [key: number]: any }>({});
  const [therapyData, setTherapyData] = useState<{ [key: number]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      const response = await axios.get(`${BASE_URL}/api/children/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const childrenData = response.data || [];
      setChildren(childrenData);

      // Fetch M-CHAT results for each child
      const results: { [key: number]: any } = {};
      for (const child of childrenData) {
        try {
          const mchatResponse = await axios.get(
            `${BASE_URL}/api/children/${child.id}/mchat/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (mchatResponse.data && mchatResponse.data.total_score !== undefined) {
            results[child.id] = mchatResponse.data;
          }
        } catch (err) {
          // No M-CHAT results yet for this child
        }
      }
      setMchatResults(results);

      // Fetch therapy curriculum data for each child
      const therapy: { [key: number]: any } = {};
      for (const child of childrenData) {
        try {
          const therapyResponse = await axios.get(
            `${BASE_URL}/api/therapy/child/${child.id}/curriculum/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // API returns { curricula: [...] } - get the active one
          const curricula = therapyResponse.data?.curricula || [];
          const activeCurriculum = curricula.find((c: any) => c.status === "active");
          if (activeCurriculum) {
            therapy[child.id] = {
              curriculum: {
                name: activeCurriculum.curriculum_title,
                id: activeCurriculum.curriculum,
              },
              current_day: activeCurriculum.current_day,
              total_days: activeCurriculum.curriculum_duration,
              status: activeCurriculum.status,
            };
          }
        } catch (err) {
          // No therapy curriculum assigned yet for this child
        }
      }
      setTherapyData(therapy);
    } catch (error) {
      console.log("Error loading children:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMChatPress = (child: any) => {
    const result = mchatResults[child.id];
    if (result) {
      // M-CHAT already completed - show results
      router.push({
        pathname: "/mchat/results",
        params: {
          childId: child.id.toString(),
          score: result.total_score.toString(),
          riskLevel: result.risk_level,
        },
      });
    } else {
      // Start new M-CHAT screening
      router.push({
        pathname: "/mchat/medical-history",
        params: { childId: child.id.toString() },
      });
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

  const handleTherapyPress = (child: any) => {
    router.push({
      pathname: "/therapy/curriculum",
      params: { childId: child.id.toString() },
    });
  };

  const handleTodayTasksPress = (child: any) => {
    router.push({
      pathname: "/therapy/today",
      params: { childId: child.id.toString() },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.greeting}>Welcome back! 👋</Text>
          <Text style={styles.question}>How are you feeling today?</Text>
        </View>

        {/* Mood Tracker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Mood Check</Text>
          <View style={styles.moodContainer}>
            <TouchableOpacity style={styles.moodButton}>
              <Text style={styles.moodEmoji}>😊</Text>
              <Text style={styles.moodLabel}>Great</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.moodButton}>
              <Text style={styles.moodEmoji}>🙂</Text>
              <Text style={styles.moodLabel}>Good</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.moodButton}>
              <Text style={styles.moodEmoji}>😐</Text>
              <Text style={styles.moodLabel}>Okay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.moodButton}>
              <Text style={styles.moodEmoji}>😔</Text>
              <Text style={styles.moodLabel}>Low</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionEmoji}>🧘</Text>
              <Text style={styles.actionTitle}>Meditation</Text>
              <Text style={styles.actionSubtitle}>5 min</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionEmoji}>📝</Text>
              <Text style={styles.actionTitle}>Journal</Text>
              <Text style={styles.actionSubtitle}>Write</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionEmoji}>💬</Text>
              <Text style={styles.actionTitle}>Talk</Text>
              <Text style={styles.actionSubtitle}>Chat now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionEmoji}>📊</Text>
              <Text style={styles.actionTitle}>Progress</Text>
              <Text style={styles.actionSubtitle}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* M-CHAT Screening Section */}
        {children.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>M-CHAT स्क्रीनिङ</Text>
            <Text style={styles.sectionSubtitle}>
              तपाईंको बच्चाको लागि अटिज्म स्क्रीनिङ
            </Text>
            {children.map((child) => {
              const result = mchatResults[child.id];
              const isCompleted = !!result;
              return (
                <TouchableOpacity
                  key={child.id}
                  style={[
                    styles.mchatCard,
                    isCompleted && {
                      backgroundColor: "#E8F5E9",
                      borderColor: getRiskLevelColor(result?.risk_level),
                    },
                  ]}
                  onPress={() => handleMChatPress(child)}
                >
                  <View
                    style={[
                      styles.mchatIcon,
                      isCompleted && {
                        backgroundColor: getRiskLevelColor(result?.risk_level) + "30",
                      },
                    ]}
                  >
                    <Text style={styles.mchatEmoji}>
                      {isCompleted ? "✅" : "📋"}
                    </Text>
                  </View>
                  <View style={styles.mchatContent}>
                    <Text style={styles.mchatName}>{child.full_name}</Text>
                    <Text style={styles.mchatAge}>
                      {child.age_years} वर्ष {child.age_months} महिना
                    </Text>
                    {isCompleted ? (
                      <View style={styles.resultRow}>
                        <Text
                          style={[
                            styles.mchatResult,
                            { color: getRiskLevelColor(result.risk_level) },
                          ]}
                        >
                          स्कोर: {result.total_score}/20 • {getRiskLevelText(result.risk_level)}
                        </Text>
                        <Text style={styles.viewResultText}>नतिजा हेर्नुहोस् →</Text>
                      </View>
                    ) : (
                      <Text style={styles.mchatStatus}>स्क्रीनिङ सुरु गर्नुहोस् →</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Therapy Section - Show only for children with assigned curriculum */}
        {children.filter((child) => therapyData[child.id]).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>थेरापी पाठ्यक्रम</Text>
            <Text style={styles.sectionSubtitle}>
              तपाईंको बच्चाको दैनिक थेरापी कार्यहरू
            </Text>
            {children
              .filter((child) => therapyData[child.id])
              .map((child) => {
                const therapy = therapyData[child.id];
                const progressPercent = therapy.total_days > 0
                  ? Math.round((therapy.current_day / therapy.total_days) * 100)
                  : 0;
                return (
                  <View key={child.id} style={styles.therapyCard}>
                    <View style={styles.therapyHeader}>
                      <View style={styles.therapyIcon}>
                        <Text style={styles.therapyEmoji}>📚</Text>
                      </View>
                      <View style={styles.therapyInfo}>
                        <Text style={styles.therapyChildName}>{child.full_name}</Text>
                        <Text style={styles.therapyCurriculumName}>
                          {therapy.curriculum?.name || "थेरापी पाठ्यक्रम"}
                        </Text>
                        <Text style={styles.therapyProgress}>
                          दिन {therapy.current_day}/{therapy.total_days} • {progressPercent}% पूरा
                        </Text>
                      </View>
                    </View>
                    <View style={styles.therapyActions}>
                      <TouchableOpacity
                        style={styles.therapyActionButton}
                        onPress={() => handleTodayTasksPress(child)}
                      >
                        <Text style={styles.therapyActionEmoji}>📋</Text>
                        <Text style={styles.therapyActionText}>आजका कार्य</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.therapyActionButton, styles.therapyActionSecondary]}
                        onPress={() => handleTherapyPress(child)}
                      >
                        <Text style={styles.therapyActionEmoji}>📊</Text>
                        <Text style={styles.therapyActionText}>विवरण</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
          </View>
        )}

        {/* Daily Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Tip</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>💡</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Practice Gratitude</Text>
              <Text style={styles.tipText}>
                Take a moment to think of three things you're grateful for
                today.
              </Text>
            </View>
          </View>
        </View>

        {/* Emergency Support */}
        <TouchableOpacity style={styles.emergencyButton}>
          <Text style={styles.emergencyEmoji}>🆘</Text>
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>Need Immediate Help?</Text>
            <Text style={styles.emergencyText}>
              24/7 Crisis Support Available
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: "#1e40af",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  question: {
    fontSize: 16,
    color: "#dbeafe",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
  },
  moodButton: {
    alignItems: "center",
    flex: 1,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "48%",
    alignItems: "center",
  },
  actionEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#64748b",
  },
  tipCard: {
    backgroundColor: "#fef3c7",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tipEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: "#78350f",
    lineHeight: 20,
  },
  emergencyButton: {
    backgroundColor: "#ef4444",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  emergencyEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  emergencyText: {
    fontSize: 14,
    color: "#fecaca",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 12,
  },
  mchatCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#90CAF9",
  },
  mchatIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#BBDEFB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  mchatEmoji: {
    fontSize: 24,
  },
  mchatContent: {
    flex: 1,
  },
  mchatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  mchatAge: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 4,
  },
  mchatStatus: {
    fontSize: 14,
    color: "#1565C0",
    fontWeight: "500",
  },
  resultRow: {
    flexDirection: "column",
  },
  mchatResult: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  viewResultText: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
  },
  therapyCard: {
    backgroundColor: "#F3E5F5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#CE93D8",
  },
  therapyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  therapyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E1BEE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  therapyEmoji: {
    fontSize: 24,
  },
  therapyInfo: {
    flex: 1,
  },
  therapyChildName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  therapyCurriculumName: {
    fontSize: 14,
    color: "#7B1FA2",
    marginBottom: 2,
  },
  therapyProgress: {
    fontSize: 13,
    color: "#64748b",
  },
  therapyActions: {
    flexDirection: "row",
    gap: 12,
  },
  therapyActionButton: {
    flex: 1,
    backgroundColor: "#7B1FA2",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  therapyActionSecondary: {
    backgroundColor: "#9C27B0",
  },
  therapyActionEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  therapyActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
});
