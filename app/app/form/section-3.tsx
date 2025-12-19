import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StepIndicator from "../../components/StepIndicator";
import { AppColors } from "@/constants/theme";

const PROVINCES = [
  "प्रदेश नं. १ / Province 1",
  "मधेश प्रदेश / Madhesh Pradesh",
  "बागमती प्रदेश / Bagmati Pradesh",
  "गण्डकी प्रदेश / Gandaki Pradesh",
  "लुम्बिनी प्रदेश / Lumbini Pradesh",
  "कर्णाली प्रदेश / Karnali Pradesh",
  "सुदूरपश्चिम प्रदेश / Sudurpashchim Pradesh",
];

export default function Section3() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [isWhatsApp, setIsWhatsApp] = useState(false);
  const [email, setEmail] = useState("");

  const handleNext = async () => {
    try {
      const section3Data = {
        address: address.trim(),
        municipality: municipality.trim(),
        district: district.trim(),
        province: province,
        phone_number: phoneNumber.trim(),
        alternate_phone: alternatePhone.trim(),
        is_whatsapp: isWhatsApp,
        email: email.trim(),
      };
      await AsyncStorage.setItem("formSection3", JSON.stringify(section3Data));
      router.push("/form/section-4");
    } catch (error) {
      console.error("Error saving section 3 data:", error);
      Alert.alert("त्रुटि", "डाटा सुरक्षित गर्न असफल भयो");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StepIndicator currentStep={3} totalSteps={7} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>सम्पर्क जानकारी</Text>
        <Text style={styles.subtitle}>Contact Information</Text>

        {/* Address */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            ठेगाना <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.labelEn}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="गाउँ/टोल, वडा नं."
            multiline
          />
        </View>

        {/* Municipality */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            नगरपालिका/गाउँपालिका <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.labelEn}>Municipality/Rural Municipality</Text>
          <TextInput
            style={styles.input}
            value={municipality}
            onChangeText={setMunicipality}
            placeholder="नगरपालिका/गाउँपालिकाको नाम"
          />
        </View>

        {/* District */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            जिल्ला <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.labelEn}>District</Text>
          <TextInput
            style={styles.input}
            value={district}
            onChangeText={setDistrict}
            placeholder="जिल्लाको नाम"
          />
        </View>

        {/* Province */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            प्रदेश <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.labelEn}>Province</Text>
          <View style={styles.provinceContainer}>
            {PROVINCES.map((prov, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.provinceButton,
                  province === prov && styles.provinceButtonActive,
                ]}
                onPress={() => setProvince(prov)}
              >
                <Text
                  style={[
                    styles.provinceText,
                    province === prov && styles.provinceTextActive,
                  ]}
                >
                  {prov}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            फोन नम्बर <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.labelEn}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="9841234567"
            keyboardType="phone-pad"
          />
        </View>

        {/* Alternate Phone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>वैकल्पिक फोन नम्बर</Text>
          <Text style={styles.labelEn}>Alternate Phone Number</Text>
          <TextInput
            style={styles.input}
            value={alternatePhone}
            onChangeText={setAlternatePhone}
            placeholder="9841234567"
            keyboardType="phone-pad"
          />
        </View>

        {/* WhatsApp */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsWhatsApp(!isWhatsApp)}
        >
          <View style={[styles.checkbox, isWhatsApp && styles.checkboxChecked]}>
            {isWhatsApp && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            यो नम्बर WhatsApp मा उपलब्ध छ / This number is available on WhatsApp
          </Text>
        </TouchableOpacity>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>इमेल (वैकल्पिक)</Text>
          <Text style={styles.labelEn}>Email (Optional)</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>पछाडि / Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>अर्को / Next</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginTop: 20,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.textLight,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  labelEn: {
    fontSize: 13,
    color: AppColors.textLight,
    marginBottom: 8,
  },
  required: {
    color: AppColors.error,
  },
  input: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  provinceContainer: {
    gap: 12,
  },
  provinceButton: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 12,
  },
  provinceButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  provinceText: {
    fontSize: 14,
    color: AppColors.textLight,
  },
  provinceTextActive: {
    color: AppColors.white,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: AppColors.border,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  checkmark: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 14,
    color: AppColors.textPrimary,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: AppColors.white,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  backButtonText: {
    color: AppColors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    flex: 1,
    backgroundColor: AppColors.secondary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  nextButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
