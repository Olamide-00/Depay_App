import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { styles } from "../style";
import Stepper from "./stepper";
import Input from "../../../../components/common/input";
import Btn from "../../../../components/common/btn";
import BottomSheetSelector from "../../../../components/common/bottomsheet";
import { COLORS } from "../../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const SignUpDetails = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");

  const genderOptions = [
    { label: "Male", value: "male", icon: "gender-male" as const },
    { label: "Female", value: "female", icon: "gender-female" as const },
    { label: "Other", value: "other", icon: "gender-male-female" as const },
  ];

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDateOfBirth(selectedDate);
      setError("");
    }
  };

  const handlePhoneChange = (text: string) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/\D/g, "");

    // Limit to 10 digits
    if (cleaned.length <= 10) {
      setPhoneNumber(cleaned);
      setError("");
    }
  };

  const formatPhoneDisplay = (phone: string) => {
    // Format as: 090 3601 8013
    if (phone.length <= 3) return phone;
    if (phone.length <= 7) return `${phone.slice(0, 3)} ${phone.slice(3)}`;
    return `${phone.slice(0, 3)} ${phone.slice(3, 7)} ${phone.slice(7)}`;
  };

  const handleContinue = () => {
    setError("");

    // Validation
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!phoneNumber || phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    if (!dateOfBirth) {
      setError("Please select your date of birth");
      return;
    }

    if (!gender) {
      setError("Please select your gender");
      return;
    }

    // Check if user is at least 13 years old
    const age = new Date().getFullYear() - dateOfBirth.getFullYear();
    if (age < 13) {
      setError("You must be at least 13 years old to register");
      return;
    }

    Keyboard.dismiss();
    navigation.navigate("SignUpTransactionPin");
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.root}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color="#333"
            />
          </TouchableOpacity>

          {/* Stepper */}
          <Stepper currentStep={3} totalSteps={4} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Content */}
            <View style={styles.content}>
              {/* Logo */}
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../../../../assets/images/logo2.png")}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>

              {/* Title */}
              <Text style={styles.title}>Tell Us More About You</Text>
              <View style={styles.titleIconContainer}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={16}
                  color="#999"
                />
              </View>

              {/* Error Message */}
              {error ? (
                <View style={styles.errorContainer}>
                  <MaterialCommunityIcons
                    name="alert-circle"
                    size={16}
                    color="#FF6B6B"
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Form Inputs */}
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Full Name*</Text>
                  <Input
                    placeholder="eg Olamide Oladele"
                    value={fullName}
                    onChangeText={setFullName}
                    width="100%"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>User Name</Text>
                  <Input
                    placeholder="This Can Be A Fun Nickname"
                    value={username}
                    onChangeText={setUsername}
                    width="100%"
                    returnKeyType="next"
                  />
                </View>

                {/* Custom Phone Number Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number*</Text>
                  <View style={styles.phoneInputContainer}>
                    <View style={styles.countryCodeContainer}>
                      <Text style={styles.countryFlag}>🇳🇬</Text>
                      <Text style={styles.countryCode}>+234</Text>
                    </View>
                    <View style={styles.phoneInputDivider} />
                    <TextInput
                      style={styles.phoneInput}
                      placeholder="090 3601 8013"
                      placeholderTextColor="#999"
                      value={formatPhoneDisplay(phoneNumber)}
                      onChangeText={handlePhoneChange}
                      keyboardType="phone-pad"
                      maxLength={12} // Including spaces
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </View>
                </View>

                {/* Date of Birth Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Date of Birth*</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => {
                      Keyboard.dismiss();
                      setShowDatePicker(true);
                    }}
                  >
                    <Text
                      style={[
                        styles.dateInputText,
                        dateOfBirth && styles.dateInputTextSelected,
                      ]}
                    >
                      {dateOfBirth
                        ? formatDate(dateOfBirth)
                        : "Select Date Of Birth"}
                    </Text>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>

                {/* Date Picker */}
                {showDatePicker && (
                  <DateTimePicker
                    value={dateOfBirth || new Date(2000, 0, 1)}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    minimumDate={new Date(1924, 0, 1)}
                  />
                )}

                {/* iOS Date Picker Done Button */}
                {showDatePicker && Platform.OS === "ios" && (
                  <TouchableOpacity
                    style={styles.datePickerDoneButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.datePickerDoneText}>Done</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Gender*</Text>
                  <BottomSheetSelector
                    options={genderOptions}
                    selectedValue={gender}
                    onSelect={(value) => {
                      setGender(value);
                      setError("");
                    }}
                    placeholder="Select Preferred Gender"
                    sheetTitle="Select Gender"
                    variant="field"
                  />
                </View>
              </View>

              {/* Continue Button */}
              <Btn
                title="Continue"
                style={styles.continueButton2}
                textStyle={{ color: COLORS.white }}
                onPress={handleContinue}
              />
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUpDetails;
