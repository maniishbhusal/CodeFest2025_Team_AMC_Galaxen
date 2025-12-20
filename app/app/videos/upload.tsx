import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AppColors } from "@/constants/theme";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// Mapping instructions to IDs
const VIDEO_GUIDES: Record<string, { title: string; instructions: string }> = {
  walking: {
    title: "Name Calling & Walking",
    instructions:
      "• Stand 2 meters away.\n• Call the child's name normally while they're playing.\n• If no response, call louder.\n• Also capture their walking style.",
  },
  eating: {
    title: "Snack Time Activity",
    instructions:
      "• Get a snack jar that's hard to open.\n• Show the jar: 'Mmm, chips!'\n• Hold it where the child can see but not reach.\n• Wait silently for 10 seconds, observe if they ask.",
  },
  speaking: {
    title: "Speaking & Response",
    instructions:
      "• Try to have a conversation with the child.\n• Record the sounds or words they make.\n• Eye contact should be clearly visible.",
  },
  behavior: {
    title: "Behavior Observation",
    instructions:
      "• Record any unusual or repetitive behaviors.\n• Capture at least 1 minute of quiet observation.",
  },
  playing: {
    title: "Doll or Toy Play",
    instructions:
      "• Pretend to put a doll to sleep or feed it.\n• Push a toy towards the child: 'Your turn!'\n• Observe how the child plays with the toy.",
  },
  other: {
    title: "Other Activity",
    instructions:
      "• Record any important activity of the child.\n• Record in a well-lit area.",
  },
};

const VIDEO_TYPES = [
  { id: "walking", label: "Walking", emoji: "🚶" },
  { id: "eating", label: "Eating", emoji: "🍽️" },
  { id: "speaking", label: "Speaking", emoji: "🗣️" },
  { id: "behavior", label: "Behavior", emoji: "🧠" },
  { id: "playing", label: "Playing", emoji: "🎮" },
  { id: "other", label: "Other", emoji: "📹" },
];

export default function VideoUploadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.childId as string;

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const toggleSelection = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedType(id);
  };

  const pickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Gallery access is required.");
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

  const handleUpload = async () => {
    if (!selectedType || !videoUri) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      setUploadProgress(30);

      // Send video metadata with local URI as video_url
      // For hackathon: storing local URI; in production would upload to Cloudflare Stream first
      const videoData = {
        video_type: selectedType,
        video_url: videoUri, // Store local URI for now
        description: description || "",
      };

      setUploadProgress(50);

      await axios.post(
        `${BASE_URL}/api/children/${childId}/videos/`,
        videoData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
        Alert.alert("Success", "Video uploaded successfully!", [
          {
            text: "Add More",
            onPress: () => {
              setVideoUri(null);
              setSelectedType(null);
              setDescription("");
            },
          },
          {
            text: "Video List",
            onPress: () =>
              router.push({ pathname: "/videos/list", params: { childId } }),
          },
        ]);
      }, 500);
    } catch (error: any) {
      setUploading(false);
      console.error("Video upload error:", error.response?.data || error);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.video_url?.[0] ||
        error.message ||
        "Upload failed.";
      Alert.alert("Error", errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)")}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Video Upload</Text>
          <Text style={styles.headerSubtitle}>Step-by-Step Guide</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* STEP 1: SELECT TYPE */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View
              style={[styles.stepNumber, selectedType ? styles.stepDone : null]}
            >
              <Text style={styles.stepNumberText}>
                {selectedType ? "✓" : "1"}
              </Text>
            </View>
            <Text style={styles.sectionTitle}>Select Video Type</Text>
          </View>

          <View style={styles.typeGrid}>
            {VIDEO_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  selectedType === type.id && styles.typeCardSelected,
                ]}
                onPress={() => toggleSelection(type.id)}
              >
                <Text style={styles.typeEmoji}>{type.emoji}</Text>
                <Text
                  style={[
                    styles.typeLabel,
                    selectedType === type.id && styles.typeLabelSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* STEP 2: DYNAMIC GUIDE & PICKER */}
        {selectedType && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View
                style={[styles.stepNumber, videoUri ? styles.stepDone : null]}
              >
                <Text style={styles.stepNumberText}>
                  {videoUri ? "✓" : "2"}
                </Text>
              </View>
              <Text style={styles.sectionTitle}>
                Select Video Following Guide
              </Text>
            </View>

            <View style={styles.guideCard}>
              <Text style={styles.guideTitle}>
                💡 {VIDEO_GUIDES[selectedType].title}
              </Text>
              <Text style={styles.guideText}>
                {VIDEO_GUIDES[selectedType].instructions}
              </Text>
            </View>

            {videoUri ? (
              <View style={styles.videoPreviewContainer}>
                <Video
                  source={{ uri: videoUri }}
                  style={styles.videoPreview}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                />
                <TouchableOpacity
                  style={styles.changeVideoButton}
                  onPress={pickVideo}
                >
                  <Text style={styles.changeVideoText}>
                    Choose Different Video
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.pickButton} onPress={pickVideo}>
                <Text style={styles.pickEmoji}>📤</Text>
                <Text style={styles.pickTitle}>Upload Video</Text>
                <Text style={styles.pickSubtitle}>Maximum 1 minute</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* STEP 3: DESCRIPTION */}
        {videoUri && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.sectionTitle}>Additional Info (Optional)</Text>
            </View>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Write something about the video..."
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
        )}

        {uploading && (
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>
              Uploading: {uploadProgress}%
            </Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBar, { width: `${uploadProgress}%` }]}
              />
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.uploadButton,
            (!selectedType || !videoUri || uploading) &&
              styles.uploadButtonDisabled,
          ]}
          onPress={handleUpload}
          disabled={!selectedType || !videoUri || uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.uploadButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    backgroundColor: AppColors.primary,
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  backIcon: { fontSize: 22, color: "#FFF", fontWeight: "bold" },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#FFF" },
  headerSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.8)" },

  content: { flex: 1, padding: 20 },

  stepContainer: { marginBottom: 30 },
  stepHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepDone: { backgroundColor: "#10B981" },
  stepNumberText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1E293B" },

  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  typeCard: {
    width: "31%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
  },
  typeCardSelected: {
    borderColor: AppColors.primary,
    backgroundColor: "#EEF2FF",
    borderWidth: 2,
  },
  typeEmoji: { fontSize: 30, marginBottom: 5 },
  typeLabel: { fontSize: 13, fontWeight: "600", color: "#64748B" },
  typeLabelSelected: { color: AppColors.primary },

  guideCard: {
    backgroundColor: "#FEFCE8",
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#FACC15",
    marginBottom: 15,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#854D0E",
    marginBottom: 5,
  },
  guideText: { fontSize: 13, color: "#A16207", lineHeight: 20 },

  pickButton: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: AppColors.primary,
    borderStyle: "dashed",
  },
  pickEmoji: { fontSize: 40, marginBottom: 10 },
  pickTitle: { fontSize: 16, fontWeight: "bold", color: AppColors.primary },
  pickSubtitle: { fontSize: 12, color: "#94A3B8" },

  videoPreviewContainer: {
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  videoPreview: { width: "100%", height: 200 },
  changeVideoButton: {
    padding: 12,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  changeVideoText: { color: AppColors.primary, fontWeight: "bold" },

  descriptionInput: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    minHeight: 80,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  uploadButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 15,
    padding: 18,
    alignItems: "center",
  },
  uploadButtonDisabled: { backgroundColor: "#CBD5E1" },
  uploadButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },

  progressSection: { marginTop: 20 },
  progressText: {
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
    color: AppColors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: { height: "100%", backgroundColor: AppColors.primary },
});
