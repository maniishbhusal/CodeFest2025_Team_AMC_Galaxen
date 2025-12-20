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
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AppColors } from "@/constants/theme";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// M-CHAT Questions - all 20 questions
const MCHAT_QUESTIONS = [
  {
    id: 1,
    nepali:
      "यदि तपाईंले कोठामा केहि तिर औंल्याउनुभयो भने, के तपाईंको बच्चाले त्यो हेर्छ?",
    english:
      "If you point at something across the room, does your child look at it?",
    example:
      "(उदाहरण: तपाईंले खेलौना वा जनावर तिर औंल्याउनुभयो भने, के बच्चाले त्यो हेर्छ?)",
    reverse: false,
  },
  {
    id: 2,
    nepali: "के तपाईंले कहिल्यै सोच्नुभएको छ कि तपाईंको बच्चा बहिरो हुन सक्छ?",
    english: "Have you ever wondered if your child might be deaf?",
    example: "",
    reverse: true, // YES = concerning
  },
  {
    id: 3,
    nepali: "के तपाईंको बच्चाले नाटक खेल्छ वा ढोंग गर्छ?",
    english: "Does your child play pretend or make-believe?",
    example: "(उदाहरण: खाली कपबाट पिउने ढोंग, फोनमा कुरा गर्ने ढोंग)",
    reverse: false,
  },
  {
    id: 4,
    nepali: "के तपाईंको बच्चालाई चीजहरूमा चढ्न मन पर्छ?",
    english: "Does your child like climbing on things?",
    example: "(उदाहरण: फर्निचर, खेल मैदान उपकरण, वा सिंढी)",
    reverse: false,
  },
  {
    id: 5,
    nepali: "के तपाईंको बच्चाले आफ्नो आँखाको नजिक असामान्य औंला चालहरू गर्छ?",
    english:
      "Does your child make unusual finger movements near his or her eyes?",
    example: "(उदाहरण: आँखाको नजिक औंलाहरू हल्लाउने)",
    reverse: true, // YES = concerning
  },
  {
    id: 6,
    nepali: "के तपाईंको बच्चाले केहि माग्न वा मद्दत लिन एउटा औंलाले औंल्याउँछ?",
    english:
      "Does your child point with one finger to ask for something or to get help?",
    example: "(उदाहरण: पुग्न नसक्ने खाजा वा खेलौनातिर औंल्याउने)",
    reverse: false,
  },
  {
    id: 7,
    nepali:
      "के तपाईंको बच्चाले तपाईंलाई केहि रोचक कुरा देखाउन एउटा औंलाले औंल्याउँछ?",
    english:
      "Does your child point with one finger to show you something interesting?",
    example: "(उदाहरण: आकाशमा हवाईजहाज वा बाटोमा ठूलो ट्रक देखाउने)",
    reverse: false,
  },
  {
    id: 8,
    nepali: "के तपाईंको बच्चालाई अन्य बच्चाहरूमा चासो छ?",
    english: "Is your child interested in other children?",
    example:
      "(उदाहरण: अन्य बच्चाहरूलाई हेर्छ, मुस्कुराउँछ, वा तिनीहरूकहाँ जान्छ?)",
    reverse: false,
  },
  {
    id: 9,
    nepali: "के तपाईंको बच्चाले तपाईंलाई चीजहरू ल्याएर वा देखाउँछ?",
    english:
      "Does your child show you things by bringing them to you or holding them up for you to see?",
    example: "(उदाहरण: फूल, खेलौना देखाउने - मद्दतका लागि होइन, साझा गर्न)",
    reverse: false,
  },
  {
    id: 10,
    nepali: "के तपाईंको बच्चाले आफ्नो नाम बोलाउँदा प्रतिक्रिया दिन्छ?",
    english: "Does your child respond when you call his or her name?",
    example: "(उदाहरण: हेर्छ, बोल्छ वा बडबडाउँछ, वा गरिरहेको काम रोक्छ)",
    reverse: false,
  },
  {
    id: 11,
    nepali:
      "जब तपाईं आफ्नो बच्चालाई मुस्कुराउनुहुन्छ, के उसले तपाईंलाई फिर्ता मुस्कुराउँछ?",
    english: "When you smile at your child, does he or she smile back at you?",
    example: "",
    reverse: false,
  },
  {
    id: 12,
    nepali: "के तपाईंको बच्चा दैनिक आवाजहरूबाट विचलित हुन्छ?",
    english: "Does your child get upset by everyday noises?",
    example: "(उदाहरण: भ्याकुम क्लिनर वा उच्च संगीतमा चिच्याउँछ वा रुन्छ?)",
    reverse: true, // YES = concerning
  },
  {
    id: 13,
    nepali: "के तपाईंको बच्चा हिंड्छ?",
    english: "Does your child walk?",
    example: "",
    reverse: false,
  },
  {
    id: 14,
    nepali:
      "जब तपाईं बच्चासँग कुरा गर्दै हुनुहुन्छ, खेल्दै हुनुहुन्छ, वा लुगा लगाउँदै हुनुहुन्छ, के उसले तपाईंको आँखामा हेर्छ?",
    english:
      "Does your child look you in the eye when you are talking to him or her, playing with him or her, or dressing him or her?",
    example: "",
    reverse: false,
  },
  {
    id: 15,
    nepali: "के तपाईंको बच्चाले तपाईंले गरेको कुरा नक्कल गर्न खोज्छ?",
    english: "Does your child try to copy what you do?",
    example: "(उदाहरण: बाइ बाइ हात हल्लाउने, ताली बजाउने)",
    reverse: false,
  },
  {
    id: 16,
    nepali:
      "यदि तपाईंले टाउको घुमाएर केहि हेर्नुभयो भने, के तपाईंको बच्चाले तपाईं के हेर्दै हुनुहुन्छ भनेर हेर्छ?",
    english:
      "If you turn your head to look at something, does your child look around to see what you are looking at?",
    example: "",
    reverse: false,
  },
  {
    id: 17,
    nepali: "के तपाईंको बच्चाले तपाईंलाई आफूलाई हेर्न लगाउन खोज्छ?",
    english: "Does your child try to get you to watch him or her?",
    example: "(उदाहरण: प्रशंसाका लागि हेर्छ, वा 'हेर' वा 'मलाई हेर' भन्छ?)",
    reverse: false,
  },
  {
    id: 18,
    nepali: "जब तपाईंले बच्चालाई केहि गर्न भन्नुहुन्छ, के उसले बुझ्छ?",
    english:
      "Does your child understand when you tell him or her to do something?",
    example:
      "(उदाहरण: औंल्याउने बिना 'किताब कुर्सीमा राख' वा 'कम्बल ल्याइदे' बुझ्छ?)",
    reverse: false,
  },
  {
    id: 19,
    nepali:
      "यदि केहि नयाँ कुरा हुन्छ भने, के तपाईंको बच्चाले तपाईंको अनुहार हेर्छ कि तपाईंलाई त्यसको बारेमा कस्तो लाग्छ?",
    english:
      "If something new happens, does your child look at your face to see how you feel about it?",
    example:
      "(उदाहरण: अनौठो आवाज सुन्दा वा नयाँ खेलौना देख्दा तपाईंको अनुहार हेर्छ?)",
    reverse: false,
  },
  {
    id: 20,
    nepali: "के तपाईंको बच्चालाई हल्लाउने गतिविधिहरू मन पर्छ?",
    english: "Does your child like movement activities?",
    example: "(उदाहरण: झुलाउने वा घुँडामा उफ्राउने)",
    reverse: false,
  },
];

export default function MChatQuestionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.childId as string;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: boolean | null }>({});
  const [loading, setLoading] = useState(false);

  const question = MCHAT_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / MCHAT_QUESTIONS.length) * 100;

  const handleAnswer = (value: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [`q${question.id}`]: value,
    }));

    // Auto-advance to next question or submit
    if (currentQuestion < MCHAT_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < MCHAT_QUESTIONS.length) {
      Alert.alert(
        "अपूर्ण",
        `कृपया सबै प्रश्नहरूको जवाफ दिनुहोस्। (${answeredCount}/${MCHAT_QUESTIONS.length})`
      );
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("त्रुटि", "कृपया पहिले लगइन गर्नुहोस्");
        router.replace("/auth/login");
        return;
      }

      // Submit M-CHAT to API
      const response = await axios.post(
        `${BASE_URL}/api/children/${childId}/mchat/`,
        answers,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );

      console.log("M-CHAT submitted:", response.data);

      // Save results and navigate
      await AsyncStorage.setItem("mchatResults", JSON.stringify(response.data));

      router.push({
        pathname: "/mchat/results",
        params: {
          childId,
          score: response.data.total_score,
          riskLevel: response.data.risk_level,
        },
      });
    } catch (error: any) {
      console.error("Error submitting M-CHAT:", error);
      console.log("API Error Response:", error.response?.data);
      console.log("API Error Status:", error.response?.status);

      // Calculate score locally if API fails
      const { score, riskLevel } = calculateScoreLocally(answers);

      Alert.alert(
        "नोट",
        "M-CHAT परिणाम स्थानीय रूपमा गणना गरियो। तपाईंको जवाफ सुरक्षित छन्।",
        [
          {
            text: "ठिक छ",
            onPress: () => {
              router.push({
                pathname: "/mchat/results",
                params: {
                  childId,
                  score: score.toString(),
                  riskLevel,
                },
              });
            },
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateScoreLocally = (responses: {
    [key: string]: boolean | null;
  }) => {
    const REVERSE_QUESTIONS = [2, 5, 12];
    let score = 0;

    for (let i = 1; i <= 20; i++) {
      const answer = responses[`q${i}`];
      if (answer === null) continue;

      if (REVERSE_QUESTIONS.includes(i)) {
        // YES = 1 point (concerning)
        if (answer === true) score += 1;
      } else {
        // NO = 1 point (concerning)
        if (answer === false) score += 1;
      }
    }

    let riskLevel: string;
    if (score <= 2) {
      riskLevel = "low";
    } else if (score <= 7) {
      riskLevel = "medium";
    } else {
      riskLevel = "high";
    }

    return { score, riskLevel };
  };

  const currentAnswer = answers[`q${question.id}`];
  const isLastQuestion = currentQuestion === MCHAT_QUESTIONS.length - 1;

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.header}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            प्रश्न {currentQuestion + 1} / {MCHAT_QUESTIONS.length}
          </Text>
          <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Question Card */}
        <View style={styles.questionCard}>
          <View style={styles.questionNumber}>
            <Text style={styles.questionNumberText}>Q{question.id}</Text>
          </View>

          <Text style={styles.questionNepali}>{question.nepali}</Text>
          {/* <Text style={styles.questionEnglish}>{question.english}</Text> */}

          {question.example && (
            <Text style={styles.questionExample}>{question.example}</Text>
          )}

          {/* Answer Buttons */}
          <View style={styles.answerContainer}>
            <TouchableOpacity
              style={[
                styles.answerButton,
                styles.yesButton,
                currentAnswer === true && styles.yesButtonActive,
              ]}
              onPress={() => handleAnswer(true)}
            >
              <Text
                style={[
                  styles.answerEmoji,
                  currentAnswer === true && styles.answerEmojiActive,
                ]}
              >
                ✓
              </Text>
              <Text
                style={[
                  styles.answerText,
                  currentAnswer === true && styles.answerTextActive,
                ]}
              >
                हो
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.answerButton,
                styles.noButton,
                currentAnswer === false && styles.noButtonActive,
              ]}
              onPress={() => handleAnswer(false)}
            >
              <Text
                style={[
                  styles.answerEmoji,
                  currentAnswer === false && styles.answerEmojiActive,
                ]}
              >
                ✗
              </Text>
              <Text
                style={[
                  styles.answerText,
                  currentAnswer === false && styles.answerTextActive,
                ]}
              >
                होइन
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Dots */}
        <View style={styles.dotsContainer}>
          {MCHAT_QUESTIONS.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                index === currentQuestion && styles.dotActive,
                answers[`q${index + 1}`] !== undefined && styles.dotAnswered,
              ]}
              onPress={() => setCurrentQuestion(index)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentQuestion === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <Text
            style={[
              styles.navButtonText,
              currentQuestion === 0 && styles.navButtonTextDisabled,
            ]}
          >
            ← अघिल्लो
          </Text>
        </TouchableOpacity>

        {isLastQuestion && currentAnswer !== null ? (
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>पेश गर्नुहोस् ✓</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.nextButton,
              currentAnswer === null && styles.navButtonDisabled,
            ]}
            onPress={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={currentAnswer === null || isLastQuestion}
          >
            <Text
              style={[
                styles.navButtonText,
                styles.nextButtonText,
                currentAnswer === null && styles.navButtonTextDisabled,
              ]}
            >
              अर्को →
            </Text>
          </TouchableOpacity>
        )}
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
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: AppColors.white,
    fontWeight: "600",
  },
  progressPercent: {
    fontSize: 14,
    color: AppColors.white,
    fontWeight: "bold",
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: AppColors.white,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  questionCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionNumber: {
    backgroundColor: AppColors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  questionNumberText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  questionNepali: {
    fontSize: 17,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 12,
    lineHeight: 26,
  },
  questionEnglish: {
    fontSize: 15,
    color: AppColors.textLight,
    marginBottom: 12,
    lineHeight: 22,
  },
  questionExample: {
    fontSize: 13,
    color: AppColors.textSecondary,
    fontStyle: "italic",
    marginBottom: 20,
    lineHeight: 20,
  },
  answerContainer: {
    flexDirection: "row",
    gap: 16,
  },
  answerButton: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderWidth: 2,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  yesButton: {
    borderColor: "#E8E8E8",
  },
  yesButtonActive: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
  },
  noButton: {
    borderColor: "#E8E8E8",
  },
  noButtonActive: {
    backgroundColor: "#FFEBEE",
    borderColor: "#F44336",
  },
  answerEmoji: {
    fontSize: 28,
    marginBottom: 8,
    color: AppColors.textLight,
  },
  answerEmojiActive: {
    color: AppColors.textPrimary,
  },
  answerText: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textLight,
  },
  answerTextActive: {
    color: AppColors.textPrimary,
  },
  dotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E0E0E0",
  },
  dotActive: {
    backgroundColor: AppColors.primary,
    transform: [{ scale: 1.3 }],
  },
  dotAnswered: {
    backgroundColor: "#A5D6A7",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: AppColors.white,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    gap: 12,
  },
  navButton: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  navButtonDisabled: {
    borderColor: AppColors.border,
    backgroundColor: "#F5F5F5",
  },
  navButtonText: {
    color: AppColors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  navButtonTextDisabled: {
    color: AppColors.textLight,
  },
  nextButton: {
    backgroundColor: AppColors.primary,
  },
  nextButtonText: {
    color: AppColors.white,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: AppColors.disabled,
  },
  submitButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
