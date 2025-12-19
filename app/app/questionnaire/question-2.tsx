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

export default function Question2Screen() {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const options = [
    { id: "stress", label: "Stress or Anxiety" },
    { id: "depression", label: "Depression or Sadness" },
    { id: "sleep", label: "Sleep Issues" },
    { id: "relationships", label: "Relationship Problems" },
    { id: "work", label: "Work-related Issues" },
    { id: "trauma", label: "Trauma or PTSD" },
    { id: "other", label: "Other" },
  ];

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleNext = () => {
    // Navigate to main app after questionnaire
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "40%" }]} />
        </View>
        <Text style={styles.progressText}>Question 2 of 5</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.question}>
          What areas would you like support with?
        </Text>
        <Text style={styles.subtitle}>Select all that apply</Text>

        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedOptions.includes(option.id) &&
                  styles.optionButtonSelected,
              ]}
              onPress={() => toggleOption(option.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedOptions.includes(option.id) &&
                    styles.checkboxSelected,
                ]}
              >
                {selectedOptions.includes(option.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  selectedOptions.includes(option.id) &&
                    styles.optionTextSelected,
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
          style={[
            styles.button,
            selectedOptions.length === 0 && styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={selectedOptions.length === 0}
        >
          <Text style={styles.buttonText}>Complete & Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
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
    marginBottom: 8,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
  },
  optionButtonSelected: {
    backgroundColor: "#eff6ff",
    borderColor: "#1e40af",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#1e40af",
    borderColor: "#1e40af",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
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
