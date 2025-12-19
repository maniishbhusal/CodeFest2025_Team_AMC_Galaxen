import { View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AppColors } from "@/constants/theme";

export default function Index() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // Animate logo
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withSpring(1);

    // Always show language selection after splash
    const timer = setTimeout(async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("appLanguage");
        if (savedLanguage) {
          await i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error("Error loading language:", error);
      }
      router.replace("/language-select");
    }, 3000);

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
