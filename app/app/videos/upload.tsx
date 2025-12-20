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
    title: "नाम बोलाउने र हिँड्ने खेल",
    instructions:
      "• २ मिटर टाढा बस्नुहोस्।\n• बच्चा खेलिरहेको बेला सामान्य स्वरमा नाम बोलाउनुहोस्: 'रोहन!'\n• नहेरे ठूलो स्वरमा बोलाउनुहोस्।\n• हिँडाइको चाल पनि कैद गर्नुहोस्।",
  },
  eating: {
    title: "खाजा समयको खेल",
    instructions:
      "• जार खोल्न गाह्रो हुने खाजाको बट्टा लिनुहोस्।\n• जार देखाउनुहोस्: 'म्म्म, चिप्स!'\n• बच्चाले देख्ने तर पुग्न नसक्ने गरी समात्नुहोस्।\n• १० सेकेन्ड चुपचाप पर्खनुहोस्, बच्चाले मागेको हेर्नुहोस्।",
  },
  speaking: {
    title: "बोल्ने र प्रतिक्रिया",
    instructions:
      "• बच्चासँग कुराकानी गर्ने प्रयास गर्नुहोस्।\n• उसले निकाल्ने आवाज वा शब्दहरू रेकर्ड गर्नुहोस्।\n• आँखामा आँखा जुधाएको (Eye Contact) स्पष्ट देखिनुपर्छ।",
  },
  behavior: {
    title: "व्यवहार अवलोकन",
    instructions:
      "• बच्चाले अनौठो मानेको वा दोहोर्याइरहेको व्यवहार रेकर्ड गर्नुहोस्।\n• कम्तिमा १ मिनेटको शान्त भिडियो खिच्नुहोस्।",
  },
  playing: {
    title: "पुतली वा खेलौना खेल",
    instructions:
      "• पुतलीलाई सुताएको वा पानी खुवाएको नाटक गर्नुहोस्।\n• खेलौना बच्चातिर धकेल्नुहोस्: 'अब तिम्रो पालो!'\n• बच्चाले खेलौनासँग कसरी खेल्छ, हेर्नुहोस्।",
  },
  other: {
    title: "अन्य गतिविधि",
    instructions:
      "• बच्चाको कुनै पनि महत्वपूर्ण गतिविधि खिच्नुहोस्।\n• उज्यालो ठाउँमा रेकर्ड गर्नुहोस्।",
  },
};

const VIDEO_TYPES = [
  { id: "walking", label: "हिँड्ने", emoji: "🚶" },
  { id: "eating", label: "खाने", emoji: "🍽️" },
  { id: "speaking", label: "बोल्ने", emoji: "🗣️" },
  { id: "behavior", label: "व्यवहार", emoji: "🧠" },
  { id: "playing", label: "खेल्ने", emoji: "🎮" },
  { id: "other", label: "अन्य", emoji: "📹" },
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
      Alert.alert("अनुमति आवश्यक", "ग्यालेरी पहुँच आवश्यक छ।");
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

      // Get user data for user_id
      const userDataStr = await AsyncStorage.getItem("userData");
      let userId = null;
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userId = userData.id;
      }

      setUploadProgress(30);

      // Create FormData for file upload
      const formData = new FormData();

      // Extract filename from URI
      const filename = videoUri.split("/").pop() || "video.mp4";
      const fileType = filename.split(".").pop();

      // Append video file
      formData.append("video_file", {
        uri: videoUri,
        type: `video/${fileType}`,
        name: filename,
      } as any);

      formData.append("video_type", selectedType);
      formData.append("description", description || "");

      // Add user_id if available
      if (userId) {
        formData.append("user", userId.toString());
      }

      setUploadProgress(50);

      await axios.post(
        `${BASE_URL}/api/children/${childId}/videos/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
        Alert.alert("सफलता", "भिडियो सफलतापूर्वक अपलोड भयो!", [
          {
            text: "थप भिडियो",
            onPress: () => {
              setVideoUri(null);
              setSelectedType(null);
              setDescription("");
            },
          },
          {
            text: "भिडियो सूची",
            onPress: () =>
              router.push({ pathname: "/videos/list", params: { childId } }),
          },
        ]);
      }, 500);
    } catch (error: any) {
      setUploading(false);
      console.error("Video upload error:", error);
      const errorMsg =
        error.response?.data?.message || error.message || "अपलोड असफल भयो।";
      Alert.alert("त्रुटि", errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>भिडियो अपलोड</Text>
          <Text style={styles.headerSubtitle}>चरणबद्ध गाइड</Text>
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
                {selectedType ? "✓" : "१"}
              </Text>
            </View>
            <Text style={styles.sectionTitle}>भिडियोको प्रकार छान्नुहोस्</Text>
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
                  {videoUri ? "✓" : "२"}
                </Text>
              </View>
              <Text style={styles.sectionTitle}>
                गाइड अनुसार भिडियो छान्नुहोस्
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
                    अर्को भिडियो छान्नुहोस्
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.pickButton} onPress={pickVideo}>
                <Text style={styles.pickEmoji}>📤</Text>
                <Text style={styles.pickTitle}>भिडियो अपलोड गर्नुहोस्</Text>
                <Text style={styles.pickSubtitle}>अधिकतम १ मिनेट सम्मको</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* STEP 3: DESCRIPTION */}
        {videoUri && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>३</Text>
              </View>
              <Text style={styles.sectionTitle}>थप जानकारी (ऐच्छिक)</Text>
            </View>
            <TextInput
              style={styles.descriptionInput}
              placeholder="भिडियोको बारेमा केही लेख्नुहोस्..."
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
        )}

        {uploading && (
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>
              अपलोड हुँदैछ: {uploadProgress}%
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
            <Text style={styles.uploadButtonText}>सुरक्षित गर्नुहोस्</Text>
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
