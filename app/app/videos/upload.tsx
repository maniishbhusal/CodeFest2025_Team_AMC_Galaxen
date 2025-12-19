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

const VIDEO_TYPES = [
  { id: "walking", label: "हिँड्ने", labelEn: "Walking", emoji: "🚶" },
  { id: "eating", label: "खाने", labelEn: "Eating", emoji: "🍽️" },
  { id: "speaking", label: "बोल्ने", labelEn: "Speaking", emoji: "🗣️" },
  { id: "behavior", label: "व्यवहार", labelEn: "Behavior", emoji: "🧠" },
  { id: "playing", label: "खेल्ने", labelEn: "Playing", emoji: "🎮" },
  { id: "other", label: "अन्य", labelEn: "Other", emoji: "📹" },
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

  const handleUpload = async () => {
    if (!selectedType) {
      Alert.alert("त्रुटि", "कृपया भिडियो प्रकार छान्नुहोस्।");
      return;
    }
    if (!videoUri) {
      Alert.alert("त्रुटि", "कृपया भिडियो छान्नुहोस्।");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("त्रुटि", "कृपया पुनः लगइन गर्नुहोस्।");
        router.replace("/auth/login");
        return;
      }

      setUploadProgress(50);

      // Submit video metadata to backend with local video URI
      await axios.post(
        `${BASE_URL}/api/children/${childId}/videos/`,
        {
          video_type: selectedType,
          video_url: videoUri,
          description: description || "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUploadProgress(100);

      setTimeout(() => {
        setUploading(false);
        Alert.alert(
          "सफलता",
          "भिडियो सफलतापूर्वक अपलोड भयो!",
          [
            {
              text: "थप भिडियो",
              onPress: () => {
                setVideoUri(null);
                setSelectedType(null);
                setDescription("");
                setUploadProgress(0);
              },
            },
            {
              text: "भिडियो सूची",
              onPress: () => router.push({
                pathname: "/videos/list",
                params: { childId },
              }),
            },
          ]
        );
      }, 500);
    } catch (error: any) {
      setUploading(false);
      console.error("Upload error:", error);
      Alert.alert(
        "त्रुटि",
        error.response?.data?.message || "भिडियो अपलोड गर्न सकिएन।"
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>भिडियो अपलोड</Text>
          <Text style={styles.headerSubtitle}>बच्चाको भिडियो थप्नुहोस्</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Video Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>भिडियो प्रकार छान्नुहोस्</Text>
          <View style={styles.typeGrid}>
            {VIDEO_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  selectedType === type.id && styles.typeCardSelected,
                ]}
                onPress={() => setSelectedType(type.id)}
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

        {/* Video Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>भिडियो छान्नुहोस्</Text>
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
                style={styles.changeVideoButton}
                onPress={pickVideo}
              >
                <Text style={styles.changeVideoText}>अर्को भिडियो छान्नुहोस्</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.pickButton} onPress={pickVideo}>
              <Text style={styles.pickEmoji}>📁</Text>
              <Text style={styles.pickTitle}>ग्यालेरीबाट छान्नुहोस्</Text>
              <Text style={styles.pickSubtitle}>
                अधिकतम ६० सेकेन्डको भिडियो
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>विवरण (ऐच्छिक)</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="भिडियोको बारेमा केही लेख्नुहोस्..."
            placeholderTextColor={AppColors.textLight}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Upload Progress */}
        {uploading && (
          <View style={styles.progressSection}>
            <Text style={styles.progressTitle}>अपलोड हुँदैछ...</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBar, { width: `${uploadProgress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{uploadProgress}%</Text>
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsIcon}>💡</Text>
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>भिडियो टिप्स</Text>
            <Text style={styles.tipsText}>
              • राम्रो प्रकाशमा भिडियो खिच्नुहोस्{"\n"}
              • बच्चाको अनुहार स्पष्ट देखिनुपर्छ{"\n"}
              • शान्त वातावरणमा खिच्नुहोस्
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.uploadButton,
            (!selectedType || !videoUri || uploading) && styles.uploadButtonDisabled,
          ]}
          onPress={handleUpload}
          disabled={!selectedType || !videoUri || uploading}
        >
          {uploading ? (
            <ActivityIndicator color={AppColors.white} />
          ) : (
            <Text style={styles.uploadButtonText}>अपलोड गर्नुहोस्</Text>
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
    fontSize: 22,
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
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  typeCard: {
    width: "31%",
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: AppColors.border,
  },
  typeCardSelected: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primaryLight,
  },
  typeEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 13,
    color: AppColors.textPrimary,
    fontWeight: "500",
  },
  typeLabelSelected: {
    color: AppColors.primaryDark,
    fontWeight: "600",
  },
  pickButton: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderWidth: 2,
    borderColor: AppColors.border,
    borderStyle: "dashed",
  },
  pickEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  pickTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  pickSubtitle: {
    fontSize: 13,
    color: AppColors.textLight,
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
    height: 220,
    backgroundColor: "#000",
  },
  changeVideoButton: {
    padding: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  changeVideoText: {
    color: AppColors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  descriptionInput: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: AppColors.textPrimary,
    borderWidth: 1,
    borderColor: AppColors.border,
    minHeight: 100,
  },
  progressSection: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  progressTitle: {
    fontSize: 14,
    color: AppColors.textPrimary,
    marginBottom: 12,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: AppColors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: AppColors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: "600",
    marginTop: 8,
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
    padding: 16,
    backgroundColor: AppColors.white,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  uploadButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  uploadButtonDisabled: {
    backgroundColor: AppColors.disabled,
  },
  uploadButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
