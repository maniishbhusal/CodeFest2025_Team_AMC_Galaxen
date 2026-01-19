import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function Index() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);

  useEffect(() => {
    // Animate logo
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });

    // Animate tagline with delay
    taglineOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    taglineTranslateY.value = withDelay(400, withSpring(0, { damping: 15 }));

    // Check auth state and navigate accordingly
    const timer = setTimeout(async () => {
      try {
        // Load saved language
        const savedLanguage = await AsyncStorage.getItem("appLanguage");
        if (savedLanguage) {
          await i18n.changeLanguage(savedLanguage);
        }

        // Check if user is logged in
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
          // Not logged in - go to language selection / auth
          router.replace("/language-select");
          return;
        }

        // User is logged in - check if they have children registered
        try {
          const response = await axios.get(`${BASE_URL}/api/children/`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          });

          const children = response.data || [];

          if (children.length > 0) {
            // Has children - go directly to dashboard
            router.replace("/(tabs)");
          } else {
            // Logged in but no children - go to form
            router.replace("/form/section-1");
          }
        } catch (apiError: any) {
          console.log("API error:", apiError.response?.status);

          // If token is invalid (401), clear it and go to login
          if (apiError.response?.status === 401) {
            await AsyncStorage.removeItem("authToken");
            await AsyncStorage.removeItem("userData");
            router.replace("/language-select");
          } else {
            // Network error or other issue - still go to dashboard
            // (let dashboard handle the error)
            router.replace("/(tabs)");
          }
        }
      } catch (error) {
        console.error("Error during startup:", error);
        router.replace("/language-select");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Background decoration circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <Animated.View style={[styles.content, logoStyle]}>
        {/* Logo with puzzle piece theme */}
        <View style={styles.logoContainer}>
          <View style={styles.logoInner}>
            <Text style={styles.logoIcon}>🧩</Text>
          </View>
        </View>

        <Text style={styles.title}>AutiSahara</Text>
      </Animated.View>

      <Animated.View style={[styles.taglineContainer, taglineStyle]}>
        <Text style={styles.subtitle}>Early Autism Screening</Text>
        <Text style={styles.subtitleSmall}>& Therapy Support for Your Child</Text>
      </Animated.View>

      {/* Loading indicator */}
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F97316",
    justifyContent: "center",
    alignItems: "center",
  },
  bgCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -100,
    right: -80,
  },
  bgCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.06)",
    bottom: -50,
    left: -60,
  },
  bgCircle3: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: "40%",
    left: -40,
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  logoInner: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  logoIcon: {
    fontSize: 64,
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  taglineContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "rgba(255,255,255,0.95)",
    textAlign: "center",
  },
  subtitleSmall: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 4,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 80,
  },
});
