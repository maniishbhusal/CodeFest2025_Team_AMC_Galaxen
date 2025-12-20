import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { AppColors } from "@/constants/theme";

export default function LanguageSelectScreen() {
  const router = useRouter();
  const { i18n } = useTranslation();

  const selectLanguage = async (language: string) => {
    try {
      await AsyncStorage.setItem("appLanguage", language);
      await i18n.changeLanguage(language);
      router.replace("/auth/register");
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🧩</Text>
        </View>
        <Text style={styles.title}>AutiSahara</Text>
        <Text style={styles.subtitle}>
          Choose your preferred language{"\n"}
          आफ्नो भाषा छान्नुहोस्
        </Text>

        <View style={styles.languageContainer}>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => selectLanguage("en")}
            activeOpacity={0.8}
          >
            <Text style={styles.flag}>🇬🇧</Text>
            <Text style={styles.languageText}>English</Text>
            <Text style={styles.languageSubtext}>Continue in English</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => selectLanguage("ne")}
            activeOpacity={0.8}
          >
            <Text style={styles.flag}>🇳🇵</Text>
            <Text style={styles.languageText}>नेपाली</Text>
            <Text style={styles.languageSubtext}>नेपालीमा जारी राख्नुहोस्</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.note}>
          You can change language later in settings{"\n"}
          तपाईं पछि सेटिङमा भाषा परिवर्तन गर्न सक्नुहुन्छ
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: AppColors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    fontSize: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: AppColors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.textLight,
    textAlign: "center",
    marginBottom: 50,
    lineHeight: 24,
  },
  languageContainer: {
    width: "100%",
    gap: 20,
  },
  languageButton: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  flag: {
    fontSize: 48,
    marginBottom: 12,
  },
  languageText: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  languageSubtext: {
    fontSize: 14,
    color: AppColors.textLight,
  },
  note: {
    fontSize: 12,
    color: AppColors.textSecondary,
    textAlign: "center",
    marginTop: 40,
    lineHeight: 18,
  },
});
