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

export default function Section2() {
  const router = useRouter();

  // Mother Info
  const [motherName, setMotherName] = useState("");
  const [motherAge, setMotherAge] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");

  // Father Info
  const [fatherName, setFatherName] = useState("");
  const [fatherAge, setFatherAge] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");

  // Primary Caregiver
  const [primaryCaregiver, setPrimaryCaregiver] = useState("");

  const handleNext = async () => {
    try {
      const section2Data = {
        mother_name: motherName.trim(),
        mother_age: parseInt(motherAge) || null,
        mother_occupation: motherOccupation.trim(),
        father_name: fatherName.trim(),
        father_age: parseInt(fatherAge) || null,
        father_occupation: fatherOccupation.trim(),
        primary_caregiver: primaryCaregiver || "mother",
      };
      await AsyncStorage.setItem("formSection2", JSON.stringify(section2Data));
      router.push("/form/section-3");
    } catch (error) {
      console.error("Error saving section 2 data:", error);
      Alert.alert("त्रुटि", "डाटा सुरक्षित गर्न असफल भयो");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StepIndicator currentStep={2} totalSteps={7} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>अभिभावकको जानकारी</Text>
        <Text style={styles.subtitle}>Parent Information</Text>

        {/* Mother Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>आमाको जानकारी / Mother's Info</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>नाम / Name</Text>
            <TextInput
              style={styles.input}
              value={motherName}
              onChangeText={setMotherName}
              placeholder="आमाको पूरा नाम"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>उमेर / Age</Text>
            <TextInput
              style={styles.input}
              value={motherAge}
              onChangeText={setMotherAge}
              placeholder="उमेर"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>पेशा / Occupation</Text>
            <TextInput
              style={styles.input}
              value={motherOccupation}
              onChangeText={setMotherOccupation}
              placeholder="पेशा"
            />
          </View>
        </View>

        {/* Father Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            बुबाको जानकारी / Father's Info
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>नाम / Name</Text>
            <TextInput
              style={styles.input}
              value={fatherName}
              onChangeText={setFatherName}
              placeholder="बुबाको पूरा नाम"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>उमेर / Age</Text>
            <TextInput
              style={styles.input}
              value={fatherAge}
              onChangeText={setFatherAge}
              placeholder="उमेर"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>पेशा / Occupation</Text>
            <TextInput
              style={styles.input}
              value={fatherOccupation}
              onChangeText={setFatherOccupation}
              placeholder="पेशा"
            />
          </View>
        </View>

        {/* Primary Caregiver */}
        <View style={styles.section}>
          <Text style={styles.label}>
            प्राथमिक हेरचाहकर्ता <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.labelEn}>Primary Caregiver</Text>
          <View style={styles.caregiverContainer}>
            <TouchableOpacity
              style={[
                styles.caregiverButton,
                primaryCaregiver === "mother" && styles.caregiverButtonActive,
              ]}
              onPress={() => setPrimaryCaregiver("mother")}
            >
              <Text
                style={[
                  styles.caregiverText,
                  primaryCaregiver === "mother" && styles.caregiverTextActive,
                ]}
              >
                आमा / Mother
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.caregiverButton,
                primaryCaregiver === "father" && styles.caregiverButtonActive,
              ]}
              onPress={() => setPrimaryCaregiver("father")}
            >
              <Text
                style={[
                  styles.caregiverText,
                  primaryCaregiver === "father" && styles.caregiverTextActive,
                ]}
              >
                बुबा / Father
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.caregiverButton,
                primaryCaregiver === "both" && styles.caregiverButtonActive,
              ]}
              onPress={() => setPrimaryCaregiver("both")}
            >
              <Text
                style={[
                  styles.caregiverText,
                  primaryCaregiver === "both" && styles.caregiverTextActive,
                ]}
              >
                दुवै / Both
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.caregiverButton,
                primaryCaregiver === "other" && styles.caregiverButtonActive,
              ]}
              onPress={() => setPrimaryCaregiver("other")}
            >
              <Text
                style={[
                  styles.caregiverText,
                  primaryCaregiver === "other" && styles.caregiverTextActive,
                ]}
              >
                अन्य / Other
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>पछाडि / Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>अर्को / Next</Text>
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
    fontSize: 18,
    fontWeight: "600",
    color: AppColors.primary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  labelEn: {
    fontSize: 14,
    color: AppColors.textLight,
    marginBottom: 8,
  },
  required: {
    color: AppColors.error,
  },
  input: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  caregiverContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  caregiverButton: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 12,
    minWidth: "47%",
    alignItems: "center",
  },
  caregiverButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  caregiverText: {
    fontSize: 14,
    color: AppColors.textLight,
    fontWeight: "500",
  },
  caregiverTextActive: {
    color: AppColors.white,
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
