import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppColors } from "@/constants/theme";

const QUESTIONS = [
  {
    id: "a1",
    nepali: "A1. तपाईंको गर्भावस्थामा, तपाईंलाई कुनै गम्भीर संक्रमण भएको थियो जसलाई अस्पताल उपचारको आवश्यकता थियो?",
    english: "During your pregnancy with this child, did you have a serious infection that required hospital treatment?",
    example: "(उदाहरण: उच्च ज्वरो, रुबेला, वा अन्य संक्रमण)",
    field: "pregnancy_infection",
    descField: "pregnancy_infection_desc",
  },
  {
    id: "a2",
    nepali: "A2. के तपाईंको बच्चाको जन्ममा कुनै जटिलता थियो वा बच्चालाई जन्मपछि विशेष हेरचाहको आवश्यकता थियो?",
    english: "Was your child's birth complicated by an emergency or did your baby need special care right after birth?",
    example: "(उदाहरण: आकस्मिक सिजेरियन, अक्सिजनको आवश्यकता, NICU मा एक हप्ता भन्दा बढी)",
    field: "birth_complications",
    descField: "birth_complications_desc",
  },
  {
    id: "a3",
    nepali: "A3. बच्चाको पहिलो वर्षमा, उनीहरूलाई कुनै गम्भीर मस्तिष्क संक्रमण वा टाउकोमा चोट लागेको थियो?",
    english: "During your child's first year, did they have a serious brain infection or significant head injury?",
    example: "(उदाहरण: मेनिन्जाइटिस, एन्सेफलाइटिस, वा टाउकोमा गम्भीर चोट)",
    field: "brain_injury_first_year",
    descField: "brain_injury_desc",
  },
  {
    id: "a4",
    nepali: "A4. के तपाईंको बच्चाको कुनै दाजुभाइ, दिदीबहिनी वा नजिकको आफन्तलाई अटिज्म वा गम्भीर विकासात्मक ढिलाइको निदान भएको छ?",
    english: "Does your child have an older brother, sister, or cousin who has been diagnosed with autism or serious developmental delay?",
    example: "",
    field: "family_autism_history",
    descField: null,
  },
];

export default function MedicalHistoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.childId as string;

  const [answers, setAnswers] = useState<{ [key: string]: boolean | null }>({
    pregnancy_infection: null,
    birth_complications: null,
    brain_injury_first_year: null,
    family_autism_history: null,
  });

  const [descriptions, setDescriptions] = useState<{ [key: string]: string }>({
    pregnancy_infection_desc: "",
    birth_complications_desc: "",
    brain_injury_desc: "",
  });

  const hasAnyYes = Object.values(answers).some((v) => v === true);

  const handleAnswer = (field: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    // Clear description if answered No
    if (!value) {
      const descField = QUESTIONS.find((q) => q.field === field)?.descField;
      if (descField) {
        setDescriptions((prev) => ({ ...prev, [descField]: "" }));
      }
    }
  };

  const handleNext = async () => {
    // Check if all questions are answered
    const unanswered = Object.values(answers).some((v) => v === null);
    if (unanswered) {
      Alert.alert("अपूर्ण", "कृपया सबै प्रश्नहरूको जवाफ दिनुहोस्।");
      return;
    }

    try {
      // Save medical history data
      const medicalHistoryData = {
        ...answers,
        ...descriptions,
        requires_specialist: hasAnyYes,
      };
      await AsyncStorage.setItem(
        "medicalHistory",
        JSON.stringify(medicalHistoryData)
      );

      // Navigate to M-CHAT instructions
      router.push({
        pathname: "/mchat/instructions",
        params: { childId },
      });
    } catch (error) {
      console.error("Error saving medical history:", error);
      Alert.alert("त्रुटि", "डाटा सुरक्षित गर्न असफल भयो");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>चिकित्सा इतिहास</Text>
        <Text style={styles.headerSubtitle}>स्वास्थ्य पृष्ठभूमि</Text>
        <Text style={styles.headerNote}>
          कृपया प्रत्येक प्रश्नको हो वा होइन छान्नुहोस्
        </Text>
      </View>

      {/* Warning Banner */}
      {hasAnyYes && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            एक वा बढी जोखिम कारकहरू पत्ता लागेका छन्। विशेषज्ञ परामर्श सिफारिस गरिएको छ।
          </Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {QUESTIONS.map((question, index) => (
          <View key={question.id} style={styles.questionCard}>
            <Text style={styles.questionNepali}>{question.nepali}</Text>
            {/* <Text style={styles.questionEnglish}>{question.english}</Text> */}
            {question.example && (
              <Text style={styles.questionExample}>{question.example}</Text>
            )}

            {/* Yes/No Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.answerButton,
                  answers[question.field] === true && styles.yesButtonActive,
                ]}
                onPress={() => handleAnswer(question.field, true)}
              >
                <Text
                  style={[
                    styles.answerButtonText,
                    answers[question.field] === true && styles.answerButtonTextActive,
                  ]}
                >
                  हो
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.answerButton,
                  answers[question.field] === false && styles.noButtonActive,
                ]}
                onPress={() => handleAnswer(question.field, false)}
              >
                <Text
                  style={[
                    styles.answerButtonText,
                    answers[question.field] === false && styles.answerButtonTextActive,
                  ]}
                >
                  होइन
                </Text>
              </TouchableOpacity>
            </View>

            {/* Description field if Yes and has description field */}
            {answers[question.field] === true && question.descField && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionLabel}>
                  कृपया विवरण दिनुहोस्:
                </Text>
                <TextInput
                  style={styles.descriptionInput}
                  value={descriptions[question.descField]}
                  onChangeText={(text) =>
                    setDescriptions((prev) => ({
                      ...prev,
                      [question.descField!]: text,
                    }))
                  }
                  placeholder="विवरण लेख्नुहोस्..."
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}
          </View>
        ))}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            यी प्रश्नहरूले डाक्टरलाई तपाईंको बच्चाको स्वास्थ्य पृष्ठभूमि बुझ्न मद्दत गर्छ।
            सबै जानकारी गोप्य राखिनेछ।
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>पछाडि</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>अर्को</Text>
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
  header: {
    backgroundColor: AppColors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: AppColors.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  headerNote: {
    fontSize: 13,
    color: AppColors.white,
    opacity: 0.8,
  },
  warningBanner: {
    backgroundColor: "#FFF3E0",
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
    padding: 12,
    margin: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: "#E65100",
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  questionCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  questionNepali: {
    fontSize: 15,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 8,
    lineHeight: 22,
  },
  questionEnglish: {
    fontSize: 14,
    color: AppColors.textLight,
    marginBottom: 8,
    lineHeight: 20,
  },
  questionExample: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontStyle: "italic",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  answerButton: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderWidth: 2,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  yesButtonActive: {
    backgroundColor: "#FFEBEE",
    borderColor: "#EF5350",
  },
  noButtonActive: {
    backgroundColor: "#E8F5E9",
    borderColor: "#66BB6A",
  },
  answerButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: AppColors.textLight,
  },
  answerButtonTextActive: {
    color: AppColors.textPrimary,
  },
  descriptionContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  descriptionLabel: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginBottom: 8,
  },
  descriptionInput: {
    backgroundColor: AppColors.background,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  infoBox: {
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#1565C0",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
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
