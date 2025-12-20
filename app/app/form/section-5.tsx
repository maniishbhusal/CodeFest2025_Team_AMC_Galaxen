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
import AsyncStorage from "@react-native-async-storage/async-storage";
import StepIndicator from "../../components/StepIndicator";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AppColors } from "@/constants/theme";

export default function Section5() {
  const router = useRouter();
  const [goesToSchool, setGoesToSchool] = useState<boolean | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [grade, setGrade] = useState("");
  const [schoolType, setSchoolType] = useState("");

  // Routine times
  const [wakeUpTime, setWakeUpTime] = useState(new Date());
  const [sleepTime, setSleepTime] = useState(new Date());
  const [showWakeUpPicker, setShowWakeUpPicker] = useState(false);
  const [showSleepPicker, setShowSleepPicker] = useState(false);

  const handleTimeChange = (
    event: any,
    selectedTime: Date | undefined,
    type: "wakeUp" | "sleep"
  ) => {
    if (Platform.OS === "android") {
      setShowWakeUpPicker(false);
      setShowSleepPicker(false);
    }

    if (selectedTime) {
      if (type === "wakeUp") {
        setWakeUpTime(selectedTime);
      } else {
        setSleepTime(selectedTime);
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleNext = async () => {
    try {
      const formatTime24 = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
      };

      const section5Data = {
        goes_to_school: goesToSchool !== null ? goesToSchool : false,
        school_name: schoolName.trim(),
        grade_class: grade.trim(),
        school_type: schoolType,
        wake_up_time: formatTime24(wakeUpTime),
        sleep_time: formatTime24(sleepTime),
      };
      await AsyncStorage.setItem("formSection5", JSON.stringify(section5Data));
      router.push("/form/section-6");
    } catch (error) {
      console.error("Error saving section 5 data:", error);
      Alert.alert("Error", "Failed to save data");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StepIndicator currentStep={5} totalSteps={7} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Education & Daily Routine</Text>
        <Text style={styles.subtitle}>Please provide education and schedule details</Text>

        {/* Goes to School */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Does the child go to school? <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                goesToSchool === true && styles.toggleButtonActive,
              ]}
              onPress={() => setGoesToSchool(true)}
            >
              <Text
                style={[
                  styles.toggleText,
                  goesToSchool === true && styles.toggleTextActive,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                goesToSchool === false && styles.toggleButtonActive,
              ]}
              onPress={() => setGoesToSchool(false)}
            >
              <Text
                style={[
                  styles.toggleText,
                  goesToSchool === false && styles.toggleTextActive,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Conditional School Fields */}
        {goesToSchool === true && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                School Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={schoolName}
                onChangeText={setSchoolName}
                placeholder="Enter school name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Grade/Class</Text>
              <TextInput
                style={styles.input}
                value={grade}
                onChangeText={setGrade}
                placeholder="e.g., Class 1, Nursery, KG"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>School Type</Text>
              <View style={styles.schoolTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.schoolTypeButton,
                    schoolType === "public" && styles.schoolTypeButtonActive,
                  ]}
                  onPress={() => setSchoolType("public")}
                >
                  <Text
                    style={[
                      styles.schoolTypeText,
                      schoolType === "public" && styles.schoolTypeTextActive,
                    ]}
                  >
                    Public
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.schoolTypeButton,
                    schoolType === "private" && styles.schoolTypeButtonActive,
                  ]}
                  onPress={() => setSchoolType("private")}
                >
                  <Text
                    style={[
                      styles.schoolTypeText,
                      schoolType === "private" && styles.schoolTypeTextActive,
                    ]}
                  >
                    Private
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.schoolTypeButton,
                    schoolType === "special" && styles.schoolTypeButtonActive,
                  ]}
                  onPress={() => setSchoolType("special")}
                >
                  <Text
                    style={[
                      styles.schoolTypeText,
                      schoolType === "special" && styles.schoolTypeTextActive,
                    ]}
                  >
                    Special
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Daily Routine */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Daily Routine
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Wake Up Time</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowWakeUpPicker(true)}
            >
              <Text style={styles.timeText}>{formatTime(wakeUpTime)}</Text>
            </TouchableOpacity>
            {showWakeUpPicker && (
              <DateTimePicker
                value={wakeUpTime}
                mode="time"
                display="default"
                onChange={(e, time) => handleTimeChange(e, time, "wakeUp")}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sleep Time</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowSleepPicker(true)}
            >
              <Text style={styles.timeText}>{formatTime(sleepTime)}</Text>
            </TouchableOpacity>
            {showSleepPicker && (
              <DateTimePicker
                value={sleepTime}
                mode="time"
                display="default"
                onChange={(e, time) => handleTimeChange(e, time, "sleep")}
              />
            )}
          </View>
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AppColors.primary,
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
  toggleContainer: {
    flexDirection: "row",
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  toggleText: {
    fontSize: 16,
    color: AppColors.textLight,
    fontWeight: "500",
  },
  toggleTextActive: {
    color: AppColors.white,
  },
  schoolTypeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  schoolTypeButton: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  schoolTypeButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  schoolTypeText: {
    fontSize: 13,
    color: AppColors.textLight,
    fontWeight: "500",
  },
  schoolTypeTextActive: {
    color: AppColors.white,
  },
  timeButton: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 12,
  },
  timeText: {
    fontSize: 16,
    color: AppColors.textPrimary,
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
