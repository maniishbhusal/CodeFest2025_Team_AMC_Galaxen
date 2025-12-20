import { View, Text, StyleSheet } from "react-native";
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
} from "react-native-reanimated";
import { AppColors } from "@/constants/theme";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function Index() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // Animate logo
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withSpring(1);

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
    }, 2000); // Reduced to 2 seconds for better UX

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        {/* Replace with your logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🧠</Text>
        </View>
        <Text style={styles.title}>AutiSahara</Text>
        <Text style={styles.subtitle}>Mental Health Support Platform</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    fontSize: 80,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: AppColors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.secondaryLight,
    textAlign: "center",
  },
});
