import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export default function JournalScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Journal</Text>
          <Text style={styles.subtitle}>Track your thoughts and feelings</Text>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ New Entry</Text>
        </TouchableOpacity>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderEmoji}>📝</Text>
          <Text style={styles.placeholderText}>
            Start journaling to track your mental health journey
          </Text>
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
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  addButton: {
    backgroundColor: "#1e40af",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  placeholder: {
    alignItems: "center",
    paddingVertical: 60,
  },
  placeholderEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
  },
});
