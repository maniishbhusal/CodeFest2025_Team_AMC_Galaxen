import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen
          name="questionnaire/welcome"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="questionnaire/question-1"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="questionnaire/question-2"
          options={{ headerShown: false }}
        />
        {/* M-CHAT Screening Screens */}
        <Stack.Screen
          name="mchat/medical-history"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="mchat/instructions"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="mchat/questions"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="mchat/results"
          options={{ headerShown: false }}
        />
        {/* Video Upload & Assessment Screens */}
        <Stack.Screen
          name="videos/upload"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="videos/list"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="videos/confirmation"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="videos/success"
          options={{ headerShown: false }}
        />
        {/* Therapy & Curriculum Screens */}
        <Stack.Screen
          name="therapy/curriculum"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="therapy/today"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="therapy/task-detail"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="therapy/submit-progress"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="therapy/history"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
