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
  walking: { label: "Walking", emoji: "🚶" },
  eating: { label: "Eating", emoji: "🍽️" },
  speaking: { label: "Speaking", emoji: "🗣️" },
  behavior: { label: "Behavior", emoji: "🧠" },
  playing: { label: "Playing", emoji: "🎮" },
  other: { label: "Other", emoji: "📹" },
};

interface VideoItem {
  id: number;
  video_type: string;
  video_url: string;
  description: string;
  uploaded_at: string;
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
      Alert.alert("Error", "Could not load videos.");
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
      "Delete?",
      "Are you sure you want to delete this video?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
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
              Alert.alert("Success", "Video deleted.");
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "Could not delete video.");
            } finally {
              setDeleting(null);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Today";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Today";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Today";
    }
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
        <Text style={styles.loadingText}>Loading...</Text>
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
          <Text style={styles.headerTitle}>Video List</Text>
          <Text style={styles.headerSubtitle}>
            {videos.length} videos uploaded
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
            <Text style={styles.emptyTitle}>No Videos</Text>
            <Text style={styles.emptySubtitle}>
              Press the button below to upload video
            </Text>
            <TouchableOpacity
              style={styles.addButtonEmpty}
              onPress={handleAddVideo}
            >
              <Text style={styles.addButtonEmptyText}>+ Add Video</Text>
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
                        <Text style={styles.tapToPlay}>Play</Text>
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
                      📅 {formatDate(video.uploaded_at)}
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
              <Text style={styles.addMoreText}>Add More Videos</Text>
            </TouchableOpacity>

            {/* Minimum Videos Info */}
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text style={styles.infoText}>
                Upload at least 2 videos (of different types)
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
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "700",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFF",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 80,
    backgroundColor: "#FFF",
    borderRadius: 24,
    marginTop: 20,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  addButtonEmpty: {
    backgroundColor: "#F97316",
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 20,
    minHeight: 64,
    justifyContent: "center",
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonEmptyText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  videoCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
  },
  videoThumbnail: {
    height: 200,
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
    fontSize: 56,
    marginBottom: 8,
  },
  tapToPlay: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  videoInfo: {
    padding: 20,
  },
  videoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#FDBA74",
  },
  typeEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  typeText: {
    fontSize: 16,
    color: "#EA580C",
    fontWeight: "700",
  },
  deleteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: {
    fontSize: 24,
  },
  description: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  addMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#F97316",
    borderStyle: "dashed",
    minHeight: 72,
  },
  addMoreIcon: {
    fontSize: 28,
    color: "#F97316",
    marginRight: 12,
  },
  addMoreText: {
    fontSize: 18,
    color: "#F97316",
    fontWeight: "700",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: "#0369A1",
    lineHeight: 22,
    fontWeight: "500",
  },
  footer: {
    padding: 20,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  continueButton: {
    backgroundColor: "#F97316",
    borderRadius: 20,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
