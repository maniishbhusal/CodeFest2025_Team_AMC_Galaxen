import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AppColors } from "@/constants/theme";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

type ProgressStatus = "not_done" | "done_with_help" | "done_without_help";

interface StatusOption {
  value: ProgressStatus;
  label: string;
  emoji: string;
  description: string;
  color: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "done_without_help",
    label: "सहायता बिना गर्यो",
    emoji: "🌟",
    description: "बच्चाले आफैं गर्न सक्यो",
    color: "#4CAF50",
  },
  {
    value: "done_with_help",
    label: "सहायतासँग गर्यो",
    emoji: "🤝",
    description: "बच्चालाई केही सहयोग चाहियो",
    color: "#2196F3",
  },
  {
    value: "not_done",
    label: "गर्न सकेन",
    emoji: "😔",
    description: "आज गर्न सकिएन",
    color: "#FF9800",
  },
];

export default function SubmitProgressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.childId as string;
  const taskId = params.taskId as string;
  const taskTitle = params.taskTitle as string;

  const [selectedStatus, setSelectedStatus] = useState<ProgressStatus | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const pickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "अनुमति आवश्यक",
        "भिडियो छान्नको लागि ग्यालेरी पहुँच आवश्यक छ।"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
      videoMaxDuration: 60,
    });

    if (!result.canceled && result.assets[0]) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const recordVideo = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "अनुमति आवश्यक",
        "भिडियो खिच्नको लागि क्यामेरा पहुँच आवश्यक छ।"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
      videoMaxDuration: 60,
    });

    if (!result.canceled && result.assets[0]) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!selectedStatus) {
      Alert.alert("त्रुटि", "कृपया कार्यको स्थिति छान्नुहोस्।");
      return;
    }

    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      await axios.post(
        `${BASE_URL}/api/therapy/child/${childId}/submit/`,
        {
          task_id: parseInt(taskId),
          status: selectedStatus,
          video_url: videoUri || "",
          notes: notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert(
        "सफलता",
        "प्रगति सफलतापूर्वक पेश भयो!",
        [
          {
            text: "ठीक छ",
            onPress: () => router.replace({
              pathname: "/therapy/today",
              params: { childId },
            }),
          },
        ]
      );
    } catch (error: any) {
      console.error("Error submitting progress:", error);
      Alert.alert(
        "त्रुटि",
        error.response?.data?.message || "प्रगति पेश गर्न सकिएन"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>प्रगति पेश गर्नुहोस्</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {taskTitle}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>कार्य कसरी गयो?</Text>
          <Text style={styles.sectionSubtitle}>
            तपाईंको बच्चाले कार्य कसरी पूरा गर्यो छान्नुहोस्
          </Text>

          {STATUS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.statusCard,
                selectedStatus === option.value && {
                  borderColor: option.color,
                  backgroundColor: option.color + "15",
                },
              ]}
              onPress={() => setSelectedStatus(option.value)}
            >
              <View
                style={[
                  styles.statusIcon,
                  selectedStatus === option.value && {
                    backgroundColor: option.color,
                  },
                ]}
              >
                <Text style={styles.statusEmoji}>{option.emoji}</Text>
              </View>
              <View style={styles.statusContent}>
                <Text
                  style={[
                    styles.statusLabel,
                    selectedStatus === option.value && { color: option.color },
                  ]}
                >
                  {option.label}
                </Text>
                <Text style={styles.statusDescription}>{option.description}</Text>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  selectedStatus === option.value && {
                    borderColor: option.color,
                  },
                ]}
              >
                {selectedStatus === option.value && (
                  <View
                    style={[styles.radioInner, { backgroundColor: option.color }]}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Video Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>भिडियो (ऐच्छिक)</Text>
          <Text style={styles.sectionSubtitle}>
            बच्चाको प्रगति देखाउने भिडियो थप्नुहोस्
          </Text>

          {videoUri ? (
            <View style={styles.videoPreviewContainer}>
              <Video
                source={{ uri: videoUri }}
                style={styles.videoPreview}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping={false}
              />
              <TouchableOpacity
                style={styles.removeVideoButton}
                onPress={() => setVideoUri(null)}
              >
                <Text style={styles.removeVideoText}>भिडियो हटाउनुहोस्</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.videoOptions}>
              <TouchableOpacity style={styles.videoButton} onPress={recordVideo}>
                <Text style={styles.videoButtonEmoji}>📹</Text>
                <Text style={styles.videoButtonText}>भिडियो खिच्नुहोस्</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.videoButton} onPress={pickVideo}>
                <Text style={styles.videoButtonEmoji}>📁</Text>
                <Text style={styles.videoButtonText}>ग्यालेरीबाट छान्नुहोस्</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>नोटहरू (ऐच्छिक)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="कुनै टिप्पणी वा अवलोकन..."
            placeholderTextColor={AppColors.textLight}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            !selectedStatus && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!selectedStatus || submitting}
        >
          {submitting ? (
            <ActivityIndicator color={AppColors.white} />
          ) : (
            <Text style={styles.submitButtonText}>प्रगति पेश गर्नुहोस्</Text>
          )}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: AppColors.textLight,
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: AppColors.border,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statusEmoji: {
    fontSize: 24,
  },
  statusContent: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 13,
    color: AppColors.textLight,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: AppColors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  videoOptions: {
    flexDirection: "row",
    gap: 12,
  },
  videoButton: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: AppColors.border,
    borderStyle: "dashed",
  },
  videoButtonEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  videoButtonText: {
    fontSize: 14,
    color: AppColors.textPrimary,
    fontWeight: "500",
    textAlign: "center",
  },
  videoPreviewContainer: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  videoPreview: {
    width: "100%",
    height: 200,
    backgroundColor: "#000",
  },
  removeVideoButton: {
    padding: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  removeVideoText: {
    fontSize: 14,
    color: AppColors.error,
    fontWeight: "500",
  },
  notesInput: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: AppColors.textPrimary,
    borderWidth: 1,
    borderColor: AppColors.border,
    minHeight: 100,
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
  submitButtonDisabled: {
    backgroundColor: AppColors.disabled,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.white,
  },
});
