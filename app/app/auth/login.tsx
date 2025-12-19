import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { AppColors } from "@/constants/theme";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t("error"), t("auth.fillAllFields"));
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login/`, {
        email: email.toLowerCase().trim(),
        password: password,
      });

      const data = response.data;
      console.log("Login successful. Response:", data);

      // FIX: Extract token from data.tokens.access
      const accessToken = data.tokens?.access;

      if (accessToken) {
        await AsyncStorage.setItem("authToken", accessToken);
        console.log("Access Token saved successfully");
      } else {
        console.error("Access token missing in response structure");
        Alert.alert("Error", "Login succeeded but token was not received.");
        setLoading(false);
        return;
      }

      if (data.user) {
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));
      }

      router.replace("/form/section-1");
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.detail || "Invalid email or password";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>🧠</Text>
          <Text style={styles.title}>{t("appName")}</Text>
          <Text style={styles.subtitle}>{t("auth.loginTitle")}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("email")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("password")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("auth.passwordPlaceholder")}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={AppColors.white} />
            ) : (
              <Text style={styles.buttonText}>{t("auth.loginButton")}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t("dontHaveAccount")}</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.footerLink}>{t("signup")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.white },
  scrollContent: { flexGrow: 1, padding: 24 },
  header: { alignItems: "center", marginTop: 40, marginBottom: 40 },
  logo: { fontSize: 60, marginBottom: 16 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: AppColors.primary,
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: AppColors.textLight },
  form: { flex: 1 },
  inputContainer: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: AppColors.background,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: { backgroundColor: AppColors.disabled },
  buttonText: { color: AppColors.white, fontSize: 16, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: { color: AppColors.textLight, fontSize: 14 },
  footerLink: {
    color: AppColors.secondary,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
});
