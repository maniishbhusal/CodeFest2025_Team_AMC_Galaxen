import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AppColors } from "@/constants/theme";

export default function MChatInstructionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.childId as string;

  const handleStart = () => {
    router.push({
      pathname: "/mchat/questions",
      params: { childId },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>M-CHAT-R/F</Text>
        <Text style={styles.headerSubtitle}>
          Modified Checklist for Autism in Toddlers
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>
            अभिभावकहरूका लागि निर्देशन
          </Text>
          <Text style={styles.cardTitleEn}>
            Instructions for Parents
          </Text>

          <View style={styles.divider} />

          <Text style={styles.instructionText}>
            कृपया यी प्रश्नहरू तपाईंको बच्चाको बारेमा जवाफ दिनुहोस्। तपाईंको बच्चा
            <Text style={styles.bold}> सामान्यतया </Text>
            कस्तो व्यवहार गर्छ भन्ने कुरा ध्यानमा राख्नुहोस्।
          </Text>

          {/* <Text style={styles.instructionTextEn}>
            Please answer these questions about your child. Keep in mind how your child
            <Text style={styles.bold}> usually </Text>
            behaves.
          </Text> */}
        </View>

        {/* Important Notes */}
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>📋 महत्त्वपूर्ण जानकारी</Text>

          <View style={styles.noteItem}>
            <Text style={styles.noteIcon}>👶</Text>
            <View style={styles.noteContent}>
              <Text style={styles.noteText}>
                यो प्रश्नावली 16-30 महिनाका बच्चाहरूका लागि हो।
              </Text>
              {/* <Text style={styles.noteTextEn}>
                This questionnaire is for children aged 16-30 months.
              </Text> */}
            </View>
          </View>

          <View style={styles.noteItem}>
            <Text style={styles.noteIcon}>✅</Text>
            <View style={styles.noteContent}>
              <Text style={styles.noteText}>
                प्रत्येक प्रश्नको हो वा होइन छान्नुहोस्।
              </Text>
              {/* <Text style={styles.noteTextEn}>
                Select YES or NO for each question.
              </Text> */}
            </View>
          </View>

          <View style={styles.noteItem}>
            <Text style={styles.noteIcon}>🔄</Text>
            <View style={styles.noteContent}>
              <Text style={styles.noteText}>
                यदि बच्चाले कहिलेकाहीं मात्र त्यो व्यवहार गर्छ भने, होइन छान्नुहोस्।
              </Text>
              {/* <Text style={styles.noteTextEn}>
                If your child does it only sometimes, answer NO.
              </Text> */}
            </View>
          </View>

          <View style={styles.noteItem}>
            <Text style={styles.noteIcon}>⏱️</Text>
            <View style={styles.noteContent}>
              <Text style={styles.noteText}>
                लगभग 5-10 मिनेट लाग्नेछ।
              </Text>
              {/* <Text style={styles.noteTextEn}>
                This will take about 5-10 minutes.
              </Text> */}
            </View>
          </View>
        </View>

        {/* Scoring Info */}
        <View style={styles.scoringCard}>
          <Text style={styles.scoringTitle}>📊 स्कोरिङ जानकारी</Text>

          <View style={styles.scoreRow}>
            <View style={[styles.scoreBadge, styles.lowRisk]}>
              <Text style={styles.scoreText}>0-2</Text>
            </View>
            <Text style={styles.scoreLabel}>कम जोखिम</Text>
          </View>

          <View style={styles.scoreRow}>
            <View style={[styles.scoreBadge, styles.mediumRisk]}>
              <Text style={styles.scoreText}>3-7</Text>
            </View>
            <Text style={styles.scoreLabel}>मध्यम जोखिम</Text>
          </View>

          <View style={styles.scoreRow}>
            <View style={[styles.scoreBadge, styles.highRisk]}>
              <Text style={styles.scoreText}>8-20</Text>
            </View>
            <Text style={styles.scoreLabel}>उच्च जोखिम</Text>
          </View>

          <Text style={styles.scoringNote}>
            नोट: यो स्क्रीनिंग उपकरण हो, निदान होइन। डाक्टरले समीक्षा गर्नेछन्।
          </Text>
        </View>

        {/* Privacy Note */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <Text style={styles.privacyText}>
            तपाईंको सबै जानकारी पूर्णतया गोप्य राखिनेछ र केवल तपाईंको बच्चाको
            हेरचाहका लागि प्रयोग गरिनेछ।
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
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>सुरु गर्नुहोस्</Text>
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
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: AppColors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: AppColors.white,
    opacity: 0.9,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  cardTitleEn: {
    fontSize: 14,
    color: AppColors.textLight,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.border,
    marginVertical: 16,
  },
  instructionText: {
    fontSize: 15,
    color: AppColors.textPrimary,
    lineHeight: 24,
    marginBottom: 12,
  },
  instructionTextEn: {
    fontSize: 14,
    color: AppColors.textLight,
    lineHeight: 22,
  },
  bold: {
    fontWeight: "bold",
    color: AppColors.primary,
  },
  noteCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 16,
  },
  noteItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  noteIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 28,
  },
  noteContent: {
    flex: 1,
  },
  noteText: {
    fontSize: 14,
    color: AppColors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  noteTextEn: {
    fontSize: 13,
    color: AppColors.textLight,
    lineHeight: 18,
  },
  scoringCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  scoringTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  scoreBadge: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  lowRisk: {
    backgroundColor: "#4CAF50",
  },
  mediumRisk: {
    backgroundColor: "#FF9800",
  },
  highRisk: {
    backgroundColor: "#F44336",
  },
  scoreText: {
    color: AppColors.white,
    fontSize: 13,
    fontWeight: "bold",
  },
  scoreLabel: {
    fontSize: 14,
    color: AppColors.textPrimary,
  },
  scoringNote: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginTop: 8,
    fontStyle: "italic",
  },
  privacyCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  privacyIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    color: "#2E7D32",
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
  startButton: {
    flex: 1,
    backgroundColor: AppColors.secondary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  startButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
