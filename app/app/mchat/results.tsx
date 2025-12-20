import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AppColors } from "@/constants/theme";

export default function MChatResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.childId as string;
  const score = parseInt(params.score as string) || 0;
  const riskLevel = (params.riskLevel as string) || "low";
  const [showTipsModal, setShowTipsModal] = useState(false);

  const getRiskConfig = () => {
    switch (riskLevel) {
      case "low":
        return {
          color: "#4CAF50",
          bgColor: "#E8F5E9",
          icon: "✓",
          titleNe: "कम जोखिम",
          titleEn: "Low Risk",
          descNe:
            "तपाईंको बच्चाको M-CHAT स्कोर कम जोखिम श्रेणीमा छ। यो राम्रो समाचार हो!",
          descEn:
            "Your child's M-CHAT score is in the low risk category. This is good news!",
          recommendationNe:
            "तपाईंको बच्चाको विकास सामान्य देखिन्छ। नियमित अनुगमन जारी राख्नुहोस्।",
          recommendationEn:
            "Your child's development appears typical. Continue regular monitoring.",
        };
      case "medium":
        return {
          color: "#FF9800",
          bgColor: "#FFF3E0",
          icon: "!",
          titleNe: "मध्यम जोखिम",
          titleEn: "Medium Risk",
          descNe: "तपाईंको बच्चाको M-CHAT स्कोर मध्यम जोखिम श्रेणीमा छ।",
          descEn: "Your child's M-CHAT score is in the medium risk category.",
          recommendationNe:
            "थप मूल्यांकनको लागि विशेषज्ञसँग परामर्श गर्न सिफारिस गरिएको छ।",
          recommendationEn:
            "A follow-up consultation with a specialist is recommended for further evaluation.",
        };
      case "high":
        return {
          color: "#F44336",
          bgColor: "#FFEBEE",
          icon: "!!",
          titleNe: "उच्च जोखिम",
          titleEn: "High Risk",
          descNe: "तपाईंको बच्चाको M-CHAT स्कोर उच्च जोखिम श्रेणीमा छ।",
          descEn: "Your child's M-CHAT score is in the high risk category.",
          recommendationNe:
            "कृपया चाँडो सम्भव विशेषज्ञसँग परामर्श लिनुहोस्। छिटो हस्तक्षेपले राम्रो नतिजा दिन्छ।",
          recommendationEn:
            "Please consult with a specialist as soon as possible. Early intervention leads to better outcomes.",
        };
      default:
        return {
          color: "#4CAF50",
          bgColor: "#E8F5E9",
          icon: "✓",
          titleNe: "कम जोखिम",
          titleEn: "Low Risk",
          descNe: "तपाईंको बच्चाको M-CHAT स्कोर कम जोखिम श्रेणीमा छ।",
          descEn: "Your child's M-CHAT score is in the low risk category.",
          recommendationNe: "तपाईंको बच्चाको विकास सामान्य देखिन्छ।",
          recommendationEn: "Your child's development appears typical.",
        };
    }
  };

  const config = getRiskConfig();

  const handleContinue = () => {
    // Navigate to video upload or dashboard
    router.push("/(tabs)");
  };

  const handleUploadVideos = () => {
    // Show tips modal first
    setShowTipsModal(true);
  };

  const handleProceedToUpload = () => {
    setShowTipsModal(false);
    router.push({
      pathname: "/videos/upload",
      params: { childId },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Result Card */}
        <View style={[styles.resultCard, { backgroundColor: config.bgColor }]}>
          <View style={[styles.scoreCircle, { borderColor: config.color }]}>
            <Text style={[styles.scoreNumber, { color: config.color }]}>
              {score}
            </Text>
            <Text style={styles.scoreMax}>/20</Text>
          </View>

          <View style={[styles.riskBadge, { backgroundColor: config.color }]}>
            <Text style={styles.riskIcon}>{config.icon}</Text>
            <Text style={styles.riskText}>{config.titleNe}</Text>
          </View>

          <Text style={[styles.riskTitle, { color: config.color }]}>
            {config.titleNe}
          </Text>
        </View>

        {/* Description Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 नतिजा विवरण</Text>
          <Text style={styles.descriptionNe}>{config.descNe}</Text>
          {/* <Text style={styles.descriptionEn}>{config.descEn}</Text> */}
        </View>

        {/* Recommendation Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💡 सिफारिस</Text>
          <Text style={styles.recommendationNe}>{config.recommendationNe}</Text>
          {/* <Text style={styles.recommendationEn}>{config.recommendationEn}</Text> */}
        </View>

        {/* Score Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 स्कोर विवरण</Text>

          <View style={styles.scoreBreakdown}>
            <View style={styles.scoreRow}>
              <View
                style={[styles.scoreIndicator, { backgroundColor: "#4CAF50" }]}
              />
              <Text style={styles.scoreLabel}>0-2 = कम जोखिम</Text>
            </View>
            <View style={styles.scoreRow}>
              <View
                style={[styles.scoreIndicator, { backgroundColor: "#FF9800" }]}
              />
              <Text style={styles.scoreLabel}>3-7 = मध्यम जोखिम</Text>
            </View>
            <View style={styles.scoreRow}>
              <View
                style={[styles.scoreIndicator, { backgroundColor: "#F44336" }]}
              />
              <Text style={styles.scoreLabel}>8-20 = उच्च जोखिम</Text>
            </View>
          </View>
        </View>

        {/* Important Note */}
        <View style={styles.noteCard}>
          <Text style={styles.noteIcon}>⚠️</Text>
          <View style={styles.noteContent}>
            <Text style={styles.noteTitle}>महत्त्वपूर्ण नोट</Text>
            <Text style={styles.noteText}>
              यो एक स्क्रीनिंग उपकरण हो, निदान होइन। अन्तिम निदान योग्य
              स्वास्थ्य पेशेवरद्वारा मात्र गर्न सकिन्छ।
            </Text>
            {/* <Text style={styles.noteTextEn}>
              This is a screening tool, not a diagnosis. A final diagnosis can
              only be made by a qualified healthcare professional.
            </Text> */}
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📌 अर्को कदमहरू</Text>

          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>1</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>
                डाक्टरले तपाईंको बच्चाको प्रोफाइल समीक्षा गर्नेछन्।
              </Text>
              {/* <Text style={styles.stepTextEn}>
                A doctor will review your child's profile.
              </Text> */}
            </View>
          </View>

          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>2</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>
                तपाईंलाई थप निर्देशनहरू प्राप्त हुनेछ।
              </Text>
              {/* <Text style={styles.stepTextEn}>
                You will receive further instructions.
              </Text> */}
            </View>
          </View>

          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>3</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>
                आवश्यक परे, थेरापी पाठ्यक्रम तोकिनेछ।
              </Text>
              {/* <Text style={styles.stepTextEn}>
                If needed, a therapy curriculum will be assigned.
              </Text> */}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.uploadVideosButton}
          onPress={handleUploadVideos}
          activeOpacity={0.8}
        >
          <Text style={styles.uploadVideosButtonText}>
            📹 भिडियो अपलोड गर्नुहोस्
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>डास्बोर्डमा जानुहोस्</Text>
        </TouchableOpacity>
      </View>

      {/* Video Tips Modal */}
      <Modal
        visible={showTipsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTipsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📹 भिडियो रेकर्डिङ टिप्स</Text>

            <ScrollView style={styles.tipsScroll}>
              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>💡</Text>
                <Text style={styles.tipText}>
                  राम्रो प्रकाश भएको ठाउँमा भिडियो खिच्नुहोस्
                </Text>
              </View>

              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>📱</Text>
                <Text style={styles.tipText}>
                  फोनलाई स्थिर राख्नुहोस् (तेर्सो वा ठाडो)
                </Text>
              </View>

              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>👶</Text>
                <Text style={styles.tipText}>
                  बच्चाको अनुहार र व्यवहार स्पष्ट देखिने गरी खिच्नुहोस्
                </Text>
              </View>

              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>🎯</Text>
                <Text style={styles.tipText}>
                  बच्चालाई खेलेको, बोलेको वा गतिविधि गरेको देखाउनुहोस्
                </Text>
              </View>

              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>⏱️</Text>
                <Text style={styles.tipText}>
                  कम्तिमा 30 सेकेन्ड देखि 2 मिनेटको भिडियो लिनुहोस्
                </Text>
              </View>

              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>🔇</Text>
                <Text style={styles.tipText}>
                  शान्त वातावरण छनोट गर्नुहोस् (धेरै शोर नभएको)
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowTipsModal(false)}
              >
                <Text style={styles.modalCancelText}>रद्द गर्नुहोस्</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalProceedButton}
                onPress={handleProceedToUpload}
              >
                <Text style={styles.modalProceedText}>
                  भिडियो अपलोड गर्नुहोस्
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 16,
  },
  resultCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    backgroundColor: AppColors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: "bold",
  },
  scoreMax: {
    fontSize: 16,
    color: AppColors.textLight,
    marginTop: -4,
  },
  riskBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 12,
  },
  riskIcon: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  riskText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  riskTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 16,
  },
  descriptionNe: {
    fontSize: 15,
    color: AppColors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  descriptionEn: {
    fontSize: 14,
    color: AppColors.textLight,
    lineHeight: 22,
  },
  recommendationNe: {
    fontSize: 15,
    color: AppColors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  recommendationEn: {
    fontSize: 14,
    color: AppColors.textLight,
    lineHeight: 22,
  },
  scoreBreakdown: {
    gap: 12,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  scoreLabel: {
    fontSize: 14,
    color: AppColors.textPrimary,
  },
  noteCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  noteIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F57C00",
    marginBottom: 8,
  },
  noteText: {
    fontSize: 13,
    color: "#E65100",
    lineHeight: 20,
    marginBottom: 4,
  },
  noteTextEn: {
    fontSize: 12,
    color: "#EF6C00",
    lineHeight: 18,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
    color: AppColors.white,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 28,
    marginRight: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    color: AppColors.textPrimary,
    lineHeight: 20,
  },
  stepTextEn: {
    fontSize: 13,
    color: AppColors.textLight,
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    backgroundColor: AppColors.white,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    gap: 12,
  },
  uploadVideosButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  uploadVideosButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: AppColors.border,
  },
  continueButtonText: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 20,
    textAlign: "center",
  },
  tipsScroll: {
    maxHeight: 400,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0F9FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: AppColors.textPrimary,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderWidth: 2,
    borderColor: AppColors.border,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.textPrimary,
  },
  modalProceedButton: {
    flex: 1,
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  modalProceedText: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.white,
  },
});
