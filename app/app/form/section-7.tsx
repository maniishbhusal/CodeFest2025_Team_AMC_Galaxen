import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import StepIndicator from "../../components/StepIndicator";
import { AppColors } from "@/constants/theme";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const COMFORT_LEVELS = [
  { value: 1, label: "Very Uncomfortable" },
  { value: 2, label: "Uncomfortable" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Comfortable" },
  { value: 5, label: "Very Comfortable" },
];

export default function Section7() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [comfortLevel, setComfortLevel] = useState(0);
  const [consentData, setConsentData] = useState(false);
  const [consentVideo, setConsentVideo] = useState(false);
  const [consentContact, setConsentContact] = useState(false);
  const [declaration, setDeclaration] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // डेटा संकलन
      const keys = [
        "formSection1",
        "formSection2",
        "formSection3",
        "formSection4",
        "formSection5",
        "formSection6",
      ];
      const stores = await AsyncStorage.multiGet(keys);
      const storeMap: { [key: string]: any } = {};
      stores.forEach(([key, value]) => {
        storeMap[key] = value ? JSON.parse(value) : {};
      });

      const d1 = storeMap.formSection1 || {};
      const d2 = storeMap.formSection2 || {};
      const d3 = storeMap.formSection3 || {};
      const d4 = storeMap.formSection4 || {};
      const d5 = storeMap.formSection5 || {};
      const d6 = storeMap.formSection6 || {};

      if (!d1.full_name) {
        Alert.alert("Error", "Please check previous sections");
        setLoading(false);
        return;
      }

      // Prepare payload according to Backend Schema
      const payload = {
        full_name: d1.full_name || "",
        date_of_birth: d1.date_of_birth || "",
        gender: d1.gender || "male",
        age_years: d1.age_years || 0,
        age_months: d1.age_months || 0,
        education: {
          goes_to_school: d5.goes_to_school || false,
          school_name: d5.school_name || "",
          grade_class: d5.grade_class || "",
          school_type: d5.school_type || "",
          transport_mode: d5.transport_mode || "",
          wake_up_time: d5.wake_up_time || null,
          breakfast_time: d5.breakfast_time || null,
          school_start_time: d5.school_start_time || null,
          school_end_time: d5.school_end_time || null,
          lunch_time: d5.lunch_time || null,
          nap_start_time: d5.nap_start_time || null,
          nap_end_time: d5.nap_end_time || null,
          evening_activities: d5.evening_activities || "",
          dinner_time: d5.dinner_time || null,
          sleep_time: d5.sleep_time || null,
        },
        health: {
          height_cm: d6.height_cm ? String(d6.height_cm) : null,
          weight_kg: d6.weight_kg ? String(d6.weight_kg) : null,
          has_vaccinations:
            d6.has_vaccinations === "complete"
              ? "complete"
              : d6.has_vaccinations === "incomplete"
              ? "incomplete"
              : "no",
          medical_conditions: d6.medical_conditions || "",
          takes_medication: d6.takes_medication || false,
          medication_list: d6.medication_list || "",
          seen_pediatrician: d6.seen_pediatrician || false,
          seen_psychiatrist: d6.seen_psychiatrist || false,
          seen_speech_therapist: d6.seen_speech_therapist || false,
          seen_occupational_therapist: d6.seen_occupational_therapist || false,
          seen_psychologist: d6.seen_psychologist || false,
          seen_special_educator: d6.seen_special_educator || false,
          seen_neurologist: d6.seen_neurologist || false,
          seen_traditional_healer: d6.seen_traditional_healer || false,
          seen_none: d6.seen_none || false,
        },
        medical_history: {
          pregnancy_infection: d6.pregnancy_infection || false,
          pregnancy_infection_desc: d6.pregnancy_infection_desc || "",
          birth_complications: d6.birth_complications || false,
          birth_complications_desc: d6.birth_complications_desc || "",
          brain_injury_first_year: d6.brain_injury_first_year || false,
          brain_injury_desc: d6.brain_injury_desc || "",
          family_autism_history: d6.family_autism_history || false,
        },
        smartphone_comfort: comfortLevel || 3,
        consent_data: consentData,
        consent_video: consentVideo,
        consent_contact: consentContact,
        declaration_confirmed: declaration,
      };

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Login Required", "Please login first");
        router.replace("/auth/login");
        return;
      }

      // API Post
      const response = await axios.post(
        `${BASE_URL}/api/children/register/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );

      console.log("Submit success:", response.data);
      await AsyncStorage.multiRemove(keys);

      // Redirect to dashboard after success
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);

      // Redirect to dashboard after API integration, without showing error
      router.replace("/(tabs)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StepIndicator currentStep={7} totalSteps={7} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Technology & Consent</Text>
        <Text style={styles.subtitle}>Please review and confirm</Text>

        {/* Comfort Level Section */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Smartphone Usage Comfort Level <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.comfortContainer}>
            {COMFORT_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.comfortButton,
                  comfortLevel === level.value && styles.comfortButtonActive,
                ]}
                onPress={() => setComfortLevel(level.value)}
              >
                <Text
                  style={[
                    styles.comfortNumber,
                    comfortLevel === level.value && styles.comfortNumberActive,
                  ]}
                >
                  {level.value}
                </Text>
                <Text
                  style={[
                    styles.comfortLabel,
                    comfortLevel === level.value && styles.comfortLabelActive,
                  ]}
                >
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Consent Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consent</Text>

          <TouchableOpacity
            style={styles.consentContainer}
            onPress={() => setConsentData(!consentData)}
          >
            <View
              style={[styles.checkbox, consentData && styles.checkboxChecked]}
            >
              {consentData ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={styles.consentText}>
              <Text style={styles.required}>* </Text>I consent to collect information about the child's development and behavior.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.consentContainer}
            onPress={() => setConsentVideo(!consentVideo)}
          >
            <View
              style={[styles.checkbox, consentVideo && styles.checkboxChecked]}
            >
              {consentVideo ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={styles.consentText}>
              I consent to video recording of the child's activities. (Optional)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Declaration Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Declaration</Text>
          <TouchableOpacity
            style={styles.declarationContainer}
            onPress={() => setDeclaration(!declaration)}
          >
            <View
              style={[styles.checkbox, declaration && styles.checkboxChecked]}
            >
              {declaration ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={styles.declarationText}>
              <Text style={styles.required}>* </Text>I confirm that all the above information is accurate and complete.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background },
  content: { flex: 1, paddingHorizontal: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginTop: 20,
    marginBottom: 4,
  },
  subtitle: { fontSize: 16, color: AppColors.textLight, marginBottom: 24 },
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AppColors.primary,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  required: { color: AppColors.error },
  comfortContainer: { gap: 12 },
  comfortButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  comfortButtonActive: {
    backgroundColor: AppColors.background,
    borderColor: AppColors.primary,
    borderWidth: 2,
  },
  comfortNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.textLight,
    width: 40,
  },
  comfortNumberActive: { color: AppColors.primary },
  comfortLabel: { fontSize: 13, color: AppColors.textLight, flex: 1 },
  comfortLabelActive: { color: AppColors.textPrimary, fontWeight: "500" },
  consentContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 12,
  },
  declarationContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0",
    borderWidth: 2,
    borderColor: "#FF9800",
    borderRadius: 8,
    padding: 12,
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
  checkmark: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  consentText: {
    fontSize: 14,
    color: AppColors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  declarationText: {
    fontSize: 14,
    color: AppColors.textPrimary,
    flex: 1,
    lineHeight: 20,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: AppColors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  backButtonText: { color: AppColors.primary, fontSize: 16, fontWeight: "600" },
  submitButton: {
    flex: 1,
    backgroundColor: AppColors.secondary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  submitButtonDisabled: { backgroundColor: AppColors.disabled },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
