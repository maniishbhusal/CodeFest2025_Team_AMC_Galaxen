import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AppColors } from "@/constants/theme";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const VIDEO_TYPE_LABELS: { [key: string]: { label: string; emoji: string } } = {
  walking: { label: "हिँड्ने", emoji: "🚶" },
  eating: { label: "खाने", emoji: "🍽️" },
  speaking: { label: "बोल्ने", emoji: "🗣️" },
  behavior: { label: "व्यवहार", emoji: "🧠" },
  playing: { label: "खेल्ने", emoji: "🎮" },
  other: { label: "अन्य", emoji: "📹" },
};

interface VideoItem {
  id: number;
  video_type: string;
  video_url: string;
  description: string;
  created_at: string;
}

export default function VideoListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.childId as string;

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/children/${childId}/videos/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVideos(response.data || []);
    } catch (error: any) {
      console.error("Error loading videos:", error);
      Alert.alert("त्रुटि", "भिडियोहरू लोड गर्न सकिएन।");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadVideos();
  };

  const handleDelete = async (videoId: number) => {
    Alert.alert(
      "मेटाउने?",
      "के तपाईं यो भिडियो मेटाउन चाहनुहुन्छ?",
      [
        { text: "रद्द", style: "cancel" },
        {
          text: "मेटाउनुहोस्",
          style: "destructive",
          onPress: async () => {
            setDeleting(videoId);
            try {
              const token = await AsyncStorage.getItem("authToken");
              await axios.delete(
                `${BASE_URL}/api/children/${childId}/videos/${videoId}/`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              setVideos(videos.filter((v) => v.id !== videoId));
              Alert.alert("सफलता", "भिडियो मेटाइयो।");
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("त्रुटि", "भिडियो मेटाउन सकिएन।");
            } finally {
              setDeleting(null);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ne-NP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddVideo = () => {
    router.push({
      pathname: "/videos/upload",
      params: { childId },
    });
  };

  const handleContinue = () => {
    router.push({
      pathname: "/videos/confirmation",
      params: { childId },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={styles.loadingText}>लोड हुँदैछ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>भिडियो सूची</Text>
          <Text style={styles.headerSubtitle}>
            {videos.length} भिडियो अपलोड गरिएको
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {videos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📹</Text>
            <Text style={styles.emptyTitle}>कुनै भिडियो छैन</Text>
            <Text style={styles.emptySubtitle}>
              बच्चाको भिडियो अपलोड गर्न तलको बटन थिच्नुहोस्
            </Text>
            <TouchableOpacity
              style={styles.addButtonEmpty}
              onPress={handleAddVideo}
            >
              <Text style={styles.addButtonEmptyText}>+ भिडियो थप्नुहोस्</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {videos.map((video) => {
              const typeInfo = VIDEO_TYPE_LABELS[video.video_type] || {
                label: video.video_type,
                emoji: "📹",
              };
              const isPlaying = playingVideoId === video.id;

              return (
                <View key={video.id} style={styles.videoCard}>
                  {/* Video Player */}
                  <TouchableOpacity
                    style={styles.videoThumbnail}
                    onPress={() =>
                      setPlayingVideoId(isPlaying ? null : video.id)
                    }
                  >
                    {isPlaying ? (
                      <Video
                        source={{ uri: video.video_url }}
                        style={styles.videoPlayer}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay
                      />
                    ) : (
                      <View style={styles.thumbnailPlaceholder}>
                        <Text style={styles.playIcon}>▶️</Text>
                        <Text style={styles.tapToPlay}>प्ले गर्नुहोस्</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Video Info */}
                  <View style={styles.videoInfo}>
                    <View style={styles.videoHeader}>
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeEmoji}>{typeInfo.emoji}</Text>
                        <Text style={styles.typeText}>{typeInfo.label}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(video.id)}
                        disabled={deleting === video.id}
                      >
                        {deleting === video.id ? (
                          <ActivityIndicator
                            size="small"
                            color={AppColors.error}
                          />
                        ) : (
                          <Text style={styles.deleteIcon}>🗑️</Text>
                        )}
                      </TouchableOpacity>
                    </View>

                    {video.description ? (
                      <Text style={styles.description} numberOfLines={2}>
                        {video.description}
                      </Text>
                    ) : null}

                    <Text style={styles.dateText}>
                      📅 {formatDate(video.created_at)}
                    </Text>
                  </View>
                </View>
              );
            })}

            {/* Add More Button */}
            <TouchableOpacity
              style={styles.addMoreButton}
              onPress={handleAddVideo}
            >
              <Text style={styles.addMoreIcon}>+</Text>
              <Text style={styles.addMoreText}>थप भिडियो थप्नुहोस्</Text>
            </TouchableOpacity>

            {/* Minimum Videos Info */}
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text style={styles.infoText}>
                कम्तिमा २ भिडियो अपलोड गर्नुहोस् (विभिन्न प्रकारका)
              </Text>
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer - Show only if videos exist */}
      {videos.length >= 2 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>अगाडि बढ्नुहोस्</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: AppColors.textLight,
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
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: AppColors.textLight,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  addButtonEmpty: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  addButtonEmptyText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  videoCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  videoThumbnail: {
    height: 180,
    backgroundColor: "#000",
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
  },
  thumbnailPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  playIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  tapToPlay: {
    color: "#fff",
    fontSize: 14,
  },
  videoInfo: {
    padding: 16,
  },
  videoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  typeText: {
    fontSize: 13,
    color: AppColors.primaryDark,
    fontWeight: "500",
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 20,
  },
  description: {
    fontSize: 14,
    color: AppColors.textPrimary,
    lineHeight: 20,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: AppColors.textLight,
  },
  addMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: AppColors.primary,
    borderStyle: "dashed",
  },
  addMoreIcon: {
    fontSize: 24,
    color: AppColors.primary,
    marginRight: 8,
  },
  addMoreText: {
    fontSize: 16,
    color: AppColors.primary,
    fontWeight: "500",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#1565C0",
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: AppColors.white,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  continueButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  continueButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
