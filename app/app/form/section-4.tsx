import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StepIndicator from "../../components/StepIndicator";
import { AppColors } from "@/constants/theme";

const HOUSEHOLD_MEMBERS = [
  { id: "grandparents", label: "Grandparents" },
  { id: "siblings", label: "Siblings" },
  { id: "uncle_aunt", label: "Uncle/Aunt" },
  { id: "cousins", label: "Cousins" },
  { id: "domestic_help", label: "Domestic Help" },
  { id: "other_relatives", label: "Other Relatives" },
];

export default function Section4() {
  const router = useRouter();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [siblingsCount, setSiblingsCount] = useState("");

  const toggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleNext = async () => {
    try {
      const section4Data = {
        household_members: selectedMembers,
        siblings_count: parseInt(siblingsCount) || 0,
      };
      await AsyncStorage.setItem("formSection4", JSON.stringify(section4Data));
      router.push("/form/section-5");
    } catch (error) {
      console.error("Error saving section 4 data:", error);
      Alert.alert("Error", "Failed to save data");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StepIndicator currentStep={4} totalSteps={7} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Household Information</Text>
        <Text style={styles.subtitle}>Please provide details about your household</Text>

        {/* Household Members */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Other Household Members
          </Text>
          <Text style={styles.sectionSubtitle}>
            (Multiple selection allowed)
          </Text>

          {HOUSEHOLD_MEMBERS.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={styles.checkboxContainer}
              onPress={() => toggleMember(member.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedMembers.includes(member.id) && styles.checkboxChecked,
                ]}
              >
                {selectedMembers.includes(member.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.checkboxLabel}>{member.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Siblings Count */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Siblings</Text>
          <TextInput
            style={styles.input}
            value={siblingsCount}
            onChangeText={setSiblingsCount}
            placeholder="Enter number"
            keyboardType="numeric"
          />
          <Text style={styles.helperText}>
            Do not include the child
          </Text>
        </View>

        {/* Additional Notes */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ℹ️ This information helps understand the child's social environment
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginTop: 20,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.textLight,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: AppColors.textLight,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: AppColors.border,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  checkmark: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 14,
    color: AppColors.textPrimary,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  labelEn: {
    fontSize: 13,
    color: AppColors.textLight,
    marginBottom: 8,
  },
  input: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    color: AppColors.textLight,
    marginTop: 4,
    fontStyle: "italic",
  },
  infoBox: {
    backgroundColor: AppColors.background,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  infoTextEn: {
    fontSize: 12,
    color: AppColors.textLight,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: AppColors.white,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  backButtonText: {
    color: AppColors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    flex: 1,
    backgroundColor: AppColors.secondary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  nextButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
