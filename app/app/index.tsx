import { View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function Index() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // Animate logo
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withSpring(1);

    // Navigate to login after 3 seconds
    const timer = setTimeout(() => {
      router.replace("/auth/login");
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
    backgroundColor: "#1e40af",
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
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#dbeafe",
    textAlign: "center",
  },
});
