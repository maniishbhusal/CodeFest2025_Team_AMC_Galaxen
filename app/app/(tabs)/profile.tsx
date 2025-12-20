import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface UserData {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  created_at: string;
}

interface ChildData {
  id: number;
  full_name: string;
  date_of_birth: string;
  age_years: number;
  age_months: number;
  gender: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [children, setChildren] = useState<ChildData[]>([]);

  useEffect(() => {
    loadProfileData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
  };

  const loadProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      // Fetch user profile
      try {
        const userRes = await axios.get(`${BASE_URL}/api/auth/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(userRes.data);
      } catch (err) {
        console.log("Error fetching profile:", err);
      }

      // Fetch children
      try {
        const childrenRes = await axios.get(`${BASE_URL}/api/children/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChildren(childrenRes.data || []);
      } catch (err) {
        console.log("Error fetching children:", err);
      }
    } catch (error) {
      console.log("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove([
              "authToken",
              "userData",
              "formSection1",
              "formSection2",
              "formSection3",
              "formSection4",
              "formSection5",
              "formSection6",
            ]);
            router.replace("/auth/login");
          } catch (error) {
            console.log("Error logging out:", error);
          }
        },
      },
    ]);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF007F" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF007F"]} />
        }
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(userData?.full_name || "User")}
            </Text>
          </View>
          <Text style={styles.name}>{userData?.full_name || "User"}</Text>
          <Text style={styles.email}>{userData?.email || ""}</Text>
          {userData?.phone && (
            <View style={styles.phoneRow}>
              <Ionicons name="call-outline" size={14} color="#6B7280" />
              <Text style={styles.phone}>{userData.phone}</Text>
            </View>
          )}
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {userData?.role === "parent" ? "Parent Account" : userData?.role || "User"}
            </Text>
          </View>
        </View>

        {/* Children Section */}
        {children.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Children</Text>

            {children.map((child) => (
              <View key={child.id} style={styles.childCard}>
                <View style={styles.childAvatar}>
                  <Text style={styles.childAvatarText}>
                    {getInitials(child.full_name)}
                  </Text>
                </View>
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{child.full_name}</Text>
                  <Text style={styles.childAge}>
                    {child.age_years} years {child.age_months} months
                  </Text>
                  <Text style={styles.childDob}>
                    Born: {formatDate(child.date_of_birth)}
                  </Text>
                </View>
                <View style={styles.genderBadge}>
                  <Ionicons
                    name={child.gender === "male" ? "male" : "female"}
                    size={16}
                    color={child.gender === "male" ? "#3B82F6" : "#EC4899"}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: "#EDE9FE" }]}>
              <Ionicons name="person-outline" size={20} color="#7C3AED" />
            </View>
            <Text style={styles.menuText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: "#FEE2E2" }]}>
              <Ionicons name="lock-closed-outline" size={20} color="#EF4444" />
            </View>
            <Text style={styles.menuText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: "#DBEAFE" }]}>
              <Ionicons name="notifications-outline" size={20} color="#3B82F6" />
            </View>
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: "#D1FAE5" }]}>
              <Ionicons name="help-circle-outline" size={20} color="#10B981" />
            </View>
            <Text style={styles.menuText}>Help Center</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="mail-outline" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.menuText}>Contact Us</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: "#E0E7FF" }]}>
              <Ionicons name="document-text-outline" size={20} color="#6366F1" />
            </View>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>AutiSahara v1.0.0</Text>

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
  content: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF007F",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFF",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  phone: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 6,
  },
  roleBadge: {
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7C3AED",
    textTransform: "capitalize",
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  childCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  childAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },
  childAvatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3B82F6",
  },
  childInfo: {
    flex: 1,
    marginLeft: 12,
  },
  childName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  childAge: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  childDob: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  genderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 24,
  },
});
