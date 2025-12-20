import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import { AppColors } from "@/constants/theme";

const { width } = Dimensions.get("window");

export default function TaskDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.childId as string;
  const taskId = params.taskId as string;
  const taskTitle = params.taskTitle as string;
  const taskWhy = params.taskWhy as string;
  const taskInstructions = params.taskInstructions as string;
  const taskVideoUrl = params.taskVideoUrl as string;

  const videoRef = useRef<Video>(null);
  const [videoStatus, setVideoStatus] = useState<any>({});

  const handleBack = () => {
    router.back();
  };

  const handleSubmitProgress = () => {
    router.push({
      pathname: "/therapy/submit-progress",
      params: {
        childId,
        taskId,
        taskTitle,
      },
    });
  };

  const parseInstructions = (instructions: string) => {
    if (!instructions) return [];
    return instructions.split("\n").filter((line) => line.trim().length > 0);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {taskTitle}
          </Text>
          <Text style={styles.headerSubtitle}>Task Details</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Demo Video */}
        {taskVideoUrl && taskVideoUrl.length > 0 && (
          <View style={styles.videoSection}>
            <Text style={styles.sectionTitle}>Demo Video</Text>
            <View style={styles.videoContainer}>
              <Video
                ref={videoRef}
                source={{ uri: taskVideoUrl }}
                style={styles.video}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping={false}
                onPlaybackStatusUpdate={(status) => setVideoStatus(status)}
              />
            </View>
          </View>
        )}

        {/* Why Section - Highlighted */}
        <View style={styles.whySection}>
          <View style={styles.whyHeader}>
            <Text style={styles.whyIcon}>💡</Text>
            <Text style={styles.whyTitle}>Why is this important?</Text>
          </View>
          <Text style={styles.whyText}>{taskWhy}</Text>
        </View>

        {/* Instructions Section */}
        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.instructionsCard}>
            {parseInstructions(taskInstructions).map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}

            {parseInstructions(taskInstructions).length === 0 && (
              <Text style={styles.noInstructions}>
                {taskInstructions || "No specific instructions"}
              </Text>
            )}
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsIcon}>📝</Text>
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>Tips</Text>
            <Text style={styles.tipsText}>
              • Work patiently with your child{"\n"}
              • Give positive encouragement{"\n"}
              • Take a break if the child is tired
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Submit Progress Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitProgress}
        >
          <Text style={styles.submitButtonText}>Submit Progress</Text>
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: AppColors.white,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: AppColors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  videoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 12,
  },
  videoContainer: {
    backgroundColor: "#000",
    borderRadius: 16,
    overflow: "hidden",
  },
  video: {
    width: width - 32,
    height: 220,
  },
  whySection: {
    backgroundColor: "#E3F2FD",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#90CAF9",
  },
  whyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  whyIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  whyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1565C0",
  },
  whyText: {
    fontSize: 15,
    color: "#1565C0",
    lineHeight: 24,
  },
  instructionsSection: {
    marginBottom: 20,
  },
  instructionsCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: AppColors.white,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: AppColors.textPrimary,
    lineHeight: 22,
  },
  noInstructions: {
    fontSize: 14,
    color: AppColors.textLight,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 16,
  },
  tipsCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  tipsIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F57C00",
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    color: "#E65100",
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: AppColors.white,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  submitButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.white,
  },
});
