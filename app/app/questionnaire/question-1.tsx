import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Question1Screen() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options = [
    { id: "excellent", label: "Excellent", emoji: "😊" },
    { id: "good", label: "Good", emoji: "🙂" },
    { id: "okay", label: "Okay", emoji: "😐" },
    { id: "not-good", label: "Not Good", emoji: "😔" },
    { id: "poor", label: "Poor", emoji: "😢" },
  ];

  const handleNext = () => {
    if (selectedOption) {
      router.push("/questionnaire/question-2");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "20%" }]} />
        </View>
        <Text style={styles.progressText}>Question 1 of 5</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.question}>
          How would you rate your overall mental health today?
        </Text>

        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedOption === option.id && styles.optionButtonSelected,
              ]}
              onPress={() => setSelectedOption(option.id)}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text
                style={[
                  styles.optionText,
                  selectedOption === option.id && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !selectedOption && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!selectedOption}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/questionnaire/question-2")}
        >
          <Text style={styles.skipText}>Skip Question</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1e40af",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  content: {
    padding: 24,
    flexGrow: 1,
  },
  question: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 32,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 20,
  },
  optionButtonSelected: {
    backgroundColor: "#eff6ff",
    borderColor: "#1e40af",
  },
  optionEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  optionText: {
    fontSize: 18,
    color: "#475569",
    fontWeight: "500",
  },
  optionTextSelected: {
    color: "#1e40af",
    fontWeight: "600",
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: "#1e40af",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#cbd5e1",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  skipText: {
    color: "#64748b",
    fontSize: 16,
    textAlign: "center",
  },
});
