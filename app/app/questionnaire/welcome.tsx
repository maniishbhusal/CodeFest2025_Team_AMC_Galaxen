import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <Text style={styles.emoji}></Text>
        <Text style={styles.title}>Welcome to AutiSahara</Text>
        <Text style={styles.description}>
          We'll ask you a few questions to better understand your mental health
          needs and provide personalized support.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What to expect:</Text>
          <View style={styles.infoItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.infoText}>5-10 minutes to complete</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.infoText}>Your responses are confidential</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.infoText}>
              You can skip questions if needed
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/questionnaire/question-1")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e40af",
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#dbeafe",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  infoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 24,
    width: "100%",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bullet: {
    color: "#dbeafe",
    fontSize: 16,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: "#dbeafe",
    lineHeight: 22,
  },
  footer: {
    paddingBottom: 20,
  },
  button: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#1e40af",
    fontSize: 16,
    fontWeight: "600",
  },
  skipText: {
    color: "#dbeafe",
    fontSize: 16,
    textAlign: "center",
  },
});
