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

const PROFESSIONALS = [
  { id: "pediatrician", label: "बाल रोग विशेषज्ञ / Pediatrician" },
  { id: "psychologist", label: "मनोवैज्ञानिक / Psychologist" },
  { id: "psychiatrist", label: "मनोचिकित्सक / Psychiatrist" },
  { id: "therapist", label: "थेरापिस्ट / Therapist" },
  { id: "speech_therapist", label: "बोली थेरापिस्ट / Speech Therapist" },
  {
    id: "occupational_therapist",
    label: "व्यावसायिक थेरापिस्ट / Occupational Therapist",
  },
  { id: "special_educator", label: "विशेष शिक्षक / Special Educator" },
  { id: "neurologist", label: "न्यूरोलोजिस्ट / Neurologist" },
];

export default function Section6() {
  const router = useRouter();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [vaccinationStatus, setVaccinationStatus] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [currentMedication, setCurrentMedication] = useState("");
  const [medicationDetails, setMedicationDetails] = useState("");
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>(
    []
  );

  const toggleProfessional = (professionalId: string) => {
    if (selectedProfessionals.includes(professionalId)) {
      setSelectedProfessionals(
        selectedProfessionals.filter((id) => id !== professionalId)
      );
    } else {
      setSelectedProfessionals([...selectedProfessionals, professionalId]);
    }
  };

  const handleNext = async () => {
    try {
      const section6Data = {
        height_cm: height.trim() ? parseFloat(height) : null,
        weight_kg: weight.trim() ? parseFloat(weight) : null,
        has_vaccinations: vaccinationStatus || "unknown",
        medical_conditions: medicalConditions.trim(),
        takes_medication: currentMedication === "yes",
        medication_list: medicationDetails.trim(),
        seen_pediatrician: selectedProfessionals.includes("pediatrician"),
        seen_psychiatrist: selectedProfessionals.includes("psychiatrist"),
        seen_speech_therapist:
          selectedProfessionals.includes("speech_therapist"),
        seen_occupational_therapist: selectedProfessionals.includes(
          "occupational_therapist"
        ),
        seen_psychologist: selectedProfessionals.includes("psychologist"),
        seen_special_educator:
          selectedProfessionals.includes("special_educator"),
        seen_neurologist: selectedProfessionals.includes("neurologist"),
        seen_traditional_healer:
          selectedProfessionals.includes("traditional_healer"),
        seen_none: selectedProfessionals.includes("none"),
      };
      await AsyncStorage.setItem("formSection6", JSON.stringify(section6Data));
      router.push("/form/section-7");
    } catch (error) {
      console.error("Error saving section 6 data:", error);
      Alert.alert("त्रुटि", "डाटा सुरक्षित गर्न असफल भयो");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StepIndicator currentStep={6} totalSteps={7} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>स्वास्थ्य जानकारी</Text>
        <Text style={styles.subtitle}>Health Information</Text>

        {/* Height & Weight */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>उचाइ (cm)</Text>
            <Text style={styles.labelEn}>Height</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="cm मा"
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>तौल (kg)</Text>
            <Text style={styles.labelEn}>Weight</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="kg मा"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Vaccination Status */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>खोप स्थिति</Text>
          <Text style={styles.labelEn}>Vaccination Status</Text>
          <View style={styles.vaccinationContainer}>
            <TouchableOpacity
              style={[
                styles.vaccinationButton,
                vaccinationStatus === "complete" &&
                  styles.vaccinationButtonActive,
              ]}
              onPress={() => setVaccinationStatus("complete")}
            >
              <Text
                style={[
                  styles.vaccinationText,
                  vaccinationStatus === "complete" &&
                    styles.vaccinationTextActive,
                ]}
              >
                पूर्ण / Complete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.vaccinationButton,
                vaccinationStatus === "incomplete" &&
                  styles.vaccinationButtonActive,
              ]}
              onPress={() => setVaccinationStatus("incomplete")}
            >
              <Text
                style={[
                  styles.vaccinationText,
                  vaccinationStatus === "incomplete" &&
                    styles.vaccinationTextActive,
                ]}
              >
                अपूर्ण / Incomplete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.vaccinationButton,
                vaccinationStatus === "unknown" &&
                  styles.vaccinationButtonActive,
              ]}
              onPress={() => setVaccinationStatus("unknown")}
            >
              <Text
                style={[
                  styles.vaccinationText,
                  vaccinationStatus === "unknown" &&
                    styles.vaccinationTextActive,
                ]}
              >
                थाहा छैन / Unknown
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Medical Conditions */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>स्वास्थ्य समस्याहरू</Text>
          <Text style={styles.labelEn}>Medical Conditions (if any)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={medicalConditions}
            onChangeText={setMedicalConditions}
            placeholder="कुनै पनि दीर्घकालीन वा वर्तमान स्वास्थ्य समस्याहरू"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Current Medication */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>हाल लिइरहेको औषधि</Text>
          <Text style={styles.labelEn}>Current Medication</Text>
          <View style={styles.medicationContainer}>
            <TouchableOpacity
              style={[
                styles.medicationButton,
                currentMedication === "yes" && styles.medicationButtonActive,
              ]}
              onPress={() => setCurrentMedication("yes")}
            >
              <Text
                style={[
                  styles.medicationText,
                  currentMedication === "yes" && styles.medicationTextActive,
                ]}
              >
                छ / Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.medicationButton,
                currentMedication === "no" && styles.medicationButtonActive,
              ]}
              onPress={() => setCurrentMedication("no")}
            >
              <Text
                style={[
                  styles.medicationText,
                  currentMedication === "no" && styles.medicationTextActive,
                ]}
              >
                छैन / No
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Medication Details (if yes) */}
        {currentMedication === "yes" && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>औषधिको विवरण</Text>
            <Text style={styles.labelEn}>Medication Details</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={medicationDetails}
              onChangeText={setMedicationDetails}
              placeholder="औषधिको नाम, मात्रा, र कारण"
              multiline
              numberOfLines={3}
            />
          </View>
        )}

        {/* Professionals Consulted */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            परामर्श लिएका स्वास्थ्यकर्मी / Professionals Consulted
          </Text>
          <Text style={styles.sectionSubtitle}>
            (बहुवैकल्पिक / Multiple selection allowed)
          </Text>

          {PROFESSIONALS.map((professional) => (
            <TouchableOpacity
              key={professional.id}
              style={styles.checkboxContainer}
              onPress={() => toggleProfessional(professional.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedProfessionals.includes(professional.id) &&
                    styles.checkboxChecked,
                ]}
              >
                {selectedProfessionals.includes(professional.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.checkboxLabel}>{professional.label}</Text>
            </TouchableOpacity>
          ))}
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
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
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
  inputGroup: {
    marginBottom: 20,
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
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  vaccinationContainer: {
    flexDirection: "row",
    gap: 12,
  },
  vaccinationButton: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  vaccinationButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  vaccinationText: {
    fontSize: 13,
    color: AppColors.textLight,
    fontWeight: "500",
  },
  vaccinationTextActive: {
    color: AppColors.white,
  },
  medicationContainer: {
    flexDirection: "row",
    gap: 12,
  },
  medicationButton: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  medicationButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  medicationText: {
    fontSize: 14,
    color: AppColors.textLight,
    fontWeight: "500",
  },
  medicationTextActive: {
    color: AppColors.white,
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
