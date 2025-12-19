import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        headerStyle: {
          backgroundColor: "#1e40af",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },

        tabBarButton: HapticTab,

        // ✅ UI सुधारिएको TAB BAR STYLE
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#1e293b" : "#ffffff",
          borderTopWidth: 1,
          borderTopColor: colorScheme === "dark" ? "#334155" : "#e2e8f0",

          // उचाइलाई अलि बढाउँदा कन्टेन्ट अट्छ (Height adjusted)
          height: Platform.OS === "ios" ? 10 + insets.bottom : 80,

          // प्याडिङ मिलाइएको (Padding adjusted to fix cut-off)
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 12,
          paddingTop: 10,

          // ट्याब बारको ओभरफ्लो रोक्न
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8, // एन्ड्रोइडको लागि स्याडो
        },

        // आइकन र टेक्स्टको स्थान मिलाउन
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },

        tabBarIconStyle: {
          marginBottom: 0,
        },

        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "NeuroCare",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Resources",
          headerTitle: "Mental Health Resources",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="book.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          headerTitle: "My Journal",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="pencil" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerTitle: "Support Chat",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="message.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: "My Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
