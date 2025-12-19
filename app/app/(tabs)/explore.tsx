import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export default function ResourcesScreen() {
  const resources = [
    {
      id: 1,
      emoji: "📚",
      title: "Understanding Anxiety",
      category: "Articles",
      duration: "5 min read",
    },
    {
      id: 2,
      emoji: "🎧",
      title: "Guided Meditation for Stress",
      category: "Audio",
      duration: "10 min",
    },
    {
      id: 3,
      emoji: "🎥",
      title: "Breathing Exercises",
      category: "Video",
      duration: "8 min",
    },
    {
      id: 4,
      emoji: "📖",
      title: "Coping with Depression",
      category: "Articles",
      duration: "7 min read",
    },
    {
      id: 5,
      emoji: "🧘",
      title: "Mindfulness Basics",
      category: "Course",
      duration: "15 min",
    },
    {
      id: 6,
      emoji: "💪",
      title: "Building Resilience",
      category: "Workshop",
      duration: "20 min",
    },
  ];

  const categories = [
    { id: "all", label: "All", emoji: "📋" },
    { id: "articles", label: "Articles", emoji: "📚" },
    { id: "audio", label: "Audio", emoji: "🎧" },
    { id: "video", label: "Video", emoji: "🎥" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryChip}>
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text style={styles.categoryText}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Resources List */}
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>

          {resources.map((resource) => (
            <TouchableOpacity key={resource.id} style={styles.resourceCard}>
              <View style={styles.resourceIcon}>
                <Text style={styles.resourceEmoji}>{resource.emoji}</Text>
              </View>
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <View style={styles.resourceMeta}>
                  <Text style={styles.resourceCategory}>
                    {resource.category}
                  </Text>
                  <Text style={styles.resourceDot}>•</Text>
                  <Text style={styles.resourceDuration}>
                    {resource.duration}
                  </Text>
                </View>
              </View>
              <Text style={styles.resourceArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.emergencySection}>
          <Text style={styles.emergencyTitle}>🆘 Crisis Resources</Text>
          <Text style={styles.emergencyText}>
            If you're in crisis, please reach out for immediate help.
          </Text>
          <TouchableOpacity style={styles.emergencyButton}>
            <Text style={styles.emergencyButtonText}>View Hotlines</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  categoriesScroll: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  categoriesContent: {
    padding: 16,
    gap: 12,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  resourceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  resourceEmoji: {
    fontSize: 24,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  resourceMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  resourceCategory: {
    fontSize: 14,
    color: "#1e40af",
    fontWeight: "500",
  },
  resourceDot: {
    marginHorizontal: 6,
    color: "#94a3b8",
  },
  resourceDuration: {
    fontSize: 14,
    color: "#64748b",
  },
  resourceArrow: {
    fontSize: 24,
    color: "#cbd5e1",
  },
  emergencySection: {
    margin: 20,
    backgroundColor: "#fef2f2",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#991b1b",
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: "#7f1d1d",
    marginBottom: 16,
    lineHeight: 20,
  },
  emergencyButton: {
    backgroundColor: "#dc2626",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  emergencyButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
