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

  // Theme Colors - Dashboard sanga match huna ko lagi
  const activeColor = "#F97316"; // Orange 500
  const inactiveColor = "#94A3B8"; // Slate Gray

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false, // Dashboard ma aafnai Header vayeko le yaha hide gareko

        tabBarButton: HapticTab,

        // ✅ MODERN TAB BAR STYLE
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#1e293b" : "#ffffff",
          borderTopWidth: 1,
          borderTopColor: colorScheme === "dark" ? "#334155" : "#f1f5f9",

          // Height and Shadow
          height: Platform.OS === "ios" ? 85 : 70,
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 12,
          paddingTop: 10,

          // Smooth Floating Look (Optional: position absolute rakhauda index.tsx ko paddingBottom check garnu hola)
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 20,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          marginTop: -7,
        },

        tabBarIconStyle: {
          marginBottom: 0,
        },

        tabBarHideOnKeyboard: true,
      }}
    >
      {/* 1. HOME SCREEN */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="house.fill" color={color} />
          ),
        }}
      />

      {/* 2. TASKS SCREEN (Changed from Explore) */}
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="checklist" color={color} />
          ),
        }}
      />

      {/* 3. REPORT SCREEN (Purano Journal/Chat screen lai map garna sakinnxa) */}
      <Tabs.Screen
        name="journal" // Route name 'report' xaina vane purano journal route nai use garnu hola
        options={{
          title: "Report",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="chart.bar.fill" color={color} />
          ),
        }}
      />

      {/* 4. PROFILE SCREEN */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="person.fill" color={color} />
          ),
        }}
      />

      {/* Hiding Unwanted Tabs */}
      <Tabs.Screen name="chat" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
