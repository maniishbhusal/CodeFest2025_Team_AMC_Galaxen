import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import StepIndicator from "../../components/StepIndicator";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppColors } from "@/constants/theme";

export default function Section1() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [ageYears, setAgeYears] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [gender, setGender] = useState("");

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      calculateAge(selectedDate);
    }
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();

    setAgeYears(years.toString());
    setAgeMonths(months < 0 ? (12 + months).toString() : months.toString());
  };

  const handleNext = async () => {
    try {
      // Save data to AsyncStorage
      const section1Data = {
        full_name: fullName.trim() || "Not Provided",
        date_of_birth: dateOfBirth.toISOString().split("T")[0],
        age_years: parseInt(ageYears) || 0,
        age_months: parseInt(ageMonths) || 0,
        gender: gender || "other",
      };
      await AsyncStorage.setItem("formSection1", JSON.stringify(section1Data));
      router.push("/form/section-2");
    } catch (error) {
      console.error("Error saving section 1 data:", error);
      Alert.alert("त्रुटि", "डाटा सुरक्षित गर्न असफल भयो");
    }
  };

  return (
    <View style={styles.container}>
      <StepIndicator currentStep={1} totalSteps={7} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>बच्चाको आधारभूत जानकारी</Text>
        <Text style={styles.subtitle}>Child Basic Information</Text>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            बच्चाको पूरा नाम <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.labelEn}>Child's Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="पूरा नाम प्रविष्ट गर्नुहोस्"
          />
        </View>

        {/* Date of Birth */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            जन्म मिति <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.labelEn}>Date of Birth</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {dateOfBirth.toLocaleDateString("ne-NP")}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Age */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>उमेर</Text>
          <Text style={styles.labelEn}>Age</Text>
          <View style={styles.ageContainer}>
            <View style={styles.ageInput}>
              <TextInput
                style={styles.input}
                value={ageYears}
                onChangeText={setAgeYears}
                placeholder="वर्ष"
                keyboardType="numeric"
              />
              <Text style={styles.ageUnit}>वर्ष (Years)</Text>
            </View>
            <View style={styles.ageInput}>
              <TextInput
                style={styles.input}
                value={ageMonths}
                onChangeText={setAgeMonths}
                placeholder="महिना"
                keyboardType="numeric"
              />
              <Text style={styles.ageUnit}>महिना (Months)</Text>
            </View>
          </View>
        </View>

        {/* Gender */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            लिङ्ग <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.labelEn}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "male" && styles.genderButtonActive,
              ]}
              onPress={() => setGender("male")}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "male" && styles.genderTextActive,
                ]}
              >
                पुरुष / Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "female" && styles.genderButtonActive,
              ]}
              onPress={() => setGender("female")}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "female" && styles.genderTextActive,
                ]}
              >
                महिला / Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "other" && styles.genderButtonActive,
              ]}
              onPress={() => setGender("other")}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "other" && styles.genderTextActive,
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
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 4,
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
  dateButton: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: AppColors.textPrimary,
  },
  ageContainer: {
    flexDirection: "row",
    gap: 12,
  },
  ageInput: {
    flex: 1,
  },
  ageUnit: {
    fontSize: 12,
    color: AppColors.textLight,
    marginTop: 4,
    textAlign: "center",
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  genderButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  genderText: {
    fontSize: 14,
    color: AppColors.textLight,
    fontWeight: "500",
  },
  genderTextActive: {
    color: AppColors.white,
  },
  footer: {
    padding: 20,
    backgroundColor: AppColors.white,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  nextButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  nextButtonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: "600",
  },
});
