// Script to add AsyncStorage data saving to all form sections
const fs = require("fs");
const path = require("path");

const updates = {
  "section-2.tsx": {
    import: `import AsyncStorage from "@react-native-async-storage/async-storage";`,
    handleNext: `  const handleNext = async () => {
    if (!primaryCaregiver) {
      Alert.alert("त्रुटि", "कृपया प्राथमिक हेरचाहकर्ता छान्नुहोस्");
      return;
    }

    try {
      const section2Data = {
        mother_name: motherName.trim(),
        mother_age: parseInt(motherAge) || null,
        mother_occupation: motherOccupation.trim(),
        father_name: fatherName.trim(),
        father_age: parseInt(fatherAge) || null,
        father_occupation: fatherOccupation.trim(),
        primary_caregiver: primaryCaregiver,
      };
      await AsyncStorage.setItem('formSection2', JSON.stringify(section2Data));
      router.push("/form/section-3");
    } catch (error) {
      console.error('Error saving section 2 data:', error);
      Alert.alert("त्रुटि", "डाटा सुरक्षित गर्न असफल भयो");
    }
  };`,
  },
  "section-3.tsx": {
    import: `import AsyncStorage from "@react-native-async-storage/async-storage";`,
    handleNext: `  const handleNext = async () => {
    if (!address.trim() || !municipality.trim() || !district.trim() || !province) {
      Alert.alert("त्रुटि", "कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्");
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert("त्रुटि", "कृपया फोन नम्बर प्रविष्ट गर्नुहोस्");
      return;
    }

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
      await AsyncStorage.setItem('formSection3', JSON.stringify(section3Data));
      router.push("/form/section-4");
    } catch (error) {
      console.error('Error saving section 3 data:', error);
      Alert.alert("त्रुटि", "डाटा सुरक्षित गर्न असफल भयो");
    }
  };`,
  },
  "section-4.tsx": {
    import: `import AsyncStorage from "@react-native-async-storage/async-storage";`,
    handleNext: `  const handleNext = async () => {
    try {
      const section4Data = {
        household_members: selectedMembers,
        siblings_count: parseInt(siblingsCount) || 0,
      };
      await AsyncStorage.setItem('formSection4', JSON.stringify(section4Data));
      router.push("/form/section-5");
    } catch (error) {
      console.error('Error saving section 4 data:', error);
      Alert.alert("त्रुटि", "डाटा सुरक्षित गर्न असफल भयो");
    }
  };`,
  },
  "section-5.tsx": {
    import: `import AsyncStorage from "@react-native-async-storage/async-storage";`,
    handleNext: `  const handleNext = async () => {
    if (goesToSchool === null) {
      Alert.alert("त्रुटि", "कृपया बच्चा विद्यालय जान्छ कि जाँदैन छान्नुहोस्");
      return;
    }

    if (goesToSchool && !schoolName.trim()) {
      Alert.alert("त्रुटि", "कृपया विद्यालयको नाम प्रविष्ट गर्नुहोस्");
      return;
    }

    try {
      const formatTime24 = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return \`\${hours}:\${minutes}\`;
      };

      const section5Data = {
        goes_to_school: goesToSchool,
        school_name: schoolName.trim(),
        grade_class: grade.trim(),
        school_type: schoolType,
        wake_up_time: formatTime24(wakeUpTime),
        sleep_time: formatTime24(sleepTime),
      };
      await AsyncStorage.setItem('formSection5', JSON.stringify(section5Data));
      router.push("/form/section-6");
    } catch (error) {
      console.error('Error saving section 5 data:', error);
      Alert.alert("त्रुटि", "डाटा सुरक्षित गर्न असफल भयो");
    }
  };`,
  },
  "section-6.tsx": {
    import: `import AsyncStorage from "@react-native-async-storage/async-storage";`,
    handleNext: `  const handleNext = async () => {
    if (!vaccinationStatus) {
      Alert.alert("त्रुटि", "कृपया खोप स्थिति छान्नुहोस्");
      return;
    }

    if (selectedProfessionals.length === 0) {
      Alert.alert("त्रुटि", "कृपया कम्तीमा एक पेशेवर छान्नुहोस्");
      return;
    }

    try {
      const section6Data = {
        height_cm: height.trim() ? parseFloat(height) : null,
        weight_kg: weight.trim() ? parseFloat(weight) : null,
        has_vaccinations: vaccinationStatus,
        medical_conditions: medicalConditions.trim(),
        takes_medication: currentMedication === "yes",
        medication_list: medicationDetails.trim(),
        seen_pediatrician: selectedProfessionals.includes("pediatrician"),
        seen_psychiatrist: selectedProfessionals.includes("psychiatrist"),
        seen_speech_therapist: selectedProfessionals.includes("speech_therapist"),
        seen_occupational_therapist: selectedProfessionals.includes("occupational_therapist"),
        seen_psychologist: selectedProfessionals.includes("psychologist"),
        seen_special_educator: selectedProfessionals.includes("special_educator"),
        seen_neurologist: selectedProfessionals.includes("neurologist"),
        seen_traditional_healer: selectedProfessionals.includes("traditional_healer"),
        seen_none: selectedProfessionals.includes("none"),
      };
      await AsyncStorage.setItem('formSection6', JSON.stringify(section6Data));
      router.push("/form/section-7");
    } catch (error) {
      console.error('Error saving section 6 data:', error);
      Alert.alert("त्रुटि", "डाटा सुरक्षित गर्न असफल भयो");
    }
  };`,
  },
};

console.log(
  "Form section AsyncStorage save functions ready for implementation"
);
console.log("These need to be manually integrated into each section file");
