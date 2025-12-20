import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function TasksTab() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to video upload page
    router.replace("/videos/upload");
  }, []);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBFC",
  },
});
