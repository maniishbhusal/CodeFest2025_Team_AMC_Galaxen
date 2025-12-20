import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

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

        // Therapy logic
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
            therapy[child.id] = {
              name: active.curriculum_title,
              current_day: active.current_day,
              total_days: active.curriculum_duration,
            };
          }
        } catch (err) {}
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

  const displayName = userData?.first_name || "Parent";
  const childName = children[0]?.full_name?.split(" ")[0] || "Leo";

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* 1. Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?u=parent" }}
            style={styles.profilePic}
          />
          <View>
            <Text style={styles.welcomeText}>Good Morning, {displayName}</Text>
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
        contentContainerStyle={styles.scrollContent} // Padding for TabBar overlap fixed here
      >
        {/* Progress & Streak Bar */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Daily Progress</Text>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: "45%" }]} />
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.streakVal}>🔥 5 Days</Text>
          </View>
        </View>

        {/* 2. M-CHAT Assessment Card - First Child Only */}
        {children.length > 0 &&
          (() => {
            const child = children[0]; // पहिलो child मात्र
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
                    ? `Completed on Oct 24`
                    : `Assessment for ${child.full_name}`}
                </Text>

                <View style={styles.insightBox}>
                  <MaterialCommunityIcons
                    name="chart-timeline-variant"
                    size={20}
                    color="#03A9F4"
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.insightTitle}>Insights Available</Text>
                    <Text style={styles.insightSub}>
                      We've analyzed the responses.
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
          <Text style={styles.secTitle}>Doctor's Feedback</Text>
          <TouchableOpacity>
            <Text style={styles.viewHist}>View History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.docCard}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?u=doc" }}
            style={styles.docPic}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={styles.rowBetween}>
              <Text style={styles.docName}>Dr. Emily</Text>
              <Text style={styles.timeAgo}>2h ago</Text>
            </View>
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>
                Great job! I noticed {childName} responding well. Let's focus on
                vowel sounds.
              </Text>
            </View>
            <TouchableOpacity style={styles.replyRow}>
              <Ionicons name="arrow-undo" size={14} color="#FF007F" />
              <Text style={styles.replyLabel}>Reply to Doctor</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. Focus Section */}
        <View style={styles.secHeader}>
          <Text style={styles.secTitle}>Today's Focus</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3 Tasks</Text>
          </View>
        </View>

        {/* Task Placeholder Items */}
        <TouchableOpacity
          style={styles.taskItem}
          onPress={() =>
            router.push({
              pathname: "/videos/upload",
              params: { childId: children[0]?.id.toString() },
            })
          }
        >
          <View style={[styles.taskIcon, { backgroundColor: "#FFF3E0" }]}>
            <Ionicons name="videocam" size={20} color="#FF9800" />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.tTitle}>Record "Ba-Ba"</Text>
            <Text style={styles.tSub}>2 mins • Verbal</Text>
          </View>
          <Ionicons name="play-circle" size={26} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.taskItem}
          onPress={() =>
            router.push({
              pathname: "/videos/upload",
              params: { childId: children[0]?.id.toString() },
            })
          }
        >
          <View style={[styles.taskIcon, { backgroundColor: "#F3E5F5" }]}>
            <Ionicons name="car" size={20} color="#9C27B0" />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.tTitle}>Sensory Play</Text>
            <Text style={styles.tSub}>15 mins • Tactile</Text>
          </View>
          <Ionicons name="play-circle" size={26} color="#D1D5DB" />
        </TouchableOpacity>
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
  profilePic: { width: 44, height: 44, borderRadius: 22 },
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
    backgroundColor: "#FF007F",
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
  viewHist: { fontSize: 13, color: "#FF007F", fontWeight: "600" },

  docCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    marginBottom: 20,
  },
  docPic: { width: 42, height: 42, borderRadius: 21 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  docName: { fontSize: 15, fontWeight: "700" },
  timeAgo: { fontSize: 11, color: "#9CA3AF" },
  bubble: {
    backgroundColor: "#FFF0F6",
    padding: 12,
    borderRadius: 15,
    borderTopLeftRadius: 0,
    marginTop: 8,
  },
  bubbleText: { fontSize: 13, color: "#4B5563" },
  replyRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  replyLabel: {
    fontSize: 13,
    color: "#FF007F",
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
});
