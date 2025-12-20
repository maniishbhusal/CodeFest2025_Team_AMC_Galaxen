import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function TasksTab() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to therapy today page (tasks)
    // Using push instead of replace so back navigation works
    router.push("/therapy/today");
  }, []);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBFC",
  },
});
