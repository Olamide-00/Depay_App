import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";
import BottomSheetSelector from "../../../components/common/bottomsheet";
import { ContactsProvider } from "../../../utils/contactProvider";
import { useNavigation } from "@react-navigation/native";

const examBoardOptions = [
  { label: "JAMB", value: "jamb", icon: "book" as const },
  { label: "WAEC", value: "waec", icon: "book" as const },
  { label: "NECO", value: "neco", icon: "book" as const },
  { label: "NABTEB", value: "nabteb", icon: "book" as const },
];

const examTypeOptions = [
  { label: "UTME", value: "utme", icon: "file-text" as const },
  { label: "Direct Entry", value: "direct_entry", icon: "file-text" as const },
  {
    label: "Result Checker",
    value: "result_checker",
    icon: "file-text" as const,
  },
];

const Education = () => {
  const navigation = useNavigation();
  const [examBoard, setExamBoard] = useState("jamb");
  const [examType, setExamType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");

  const handleExamTypeSelect = (value: string) => {
    setExamType(value);
    // Set amount based on exam type
    const examPrices: Record<string, string> = {
      utme: "5500",
      direct_entry: "4000",
      result_checker: "1000",
    };
    setAmount(examPrices[value] || "");
  };

  return (
    <ContactsProvider>
      <View style={styles.root}>
        <CommonHeader title="Education" back />

        {/* Form Content */}
        <View style={styles.tabContent}>
          {/* Exam Board Selector */}
          <View style={styles.selectorContainer}>
            <BottomSheetSelector
              icon="book"
              options={examBoardOptions}
              selectedValue={examBoard}
              onSelect={setExamBoard}
              placeholder="Select Exam Board"
              sheetTitle="Select Exam Board"
            />
          </View>

          {/* Exam Type Selector */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Exam Type</Text>
            <BottomSheetSelector
              options={examTypeOptions}
              selectedValue={examType}
              onSelect={handleExamTypeSelect}
              placeholder="Select exam type"
              sheetTitle="Select Exam Type"
              variant="field"
            />
          </View>

          {/* Registration Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter Registration Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter registration number"
              placeholderTextColor="#999"
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
            />
          </View>

          {/* Phone Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.phoneInputWrapper}>
              <View style={styles.phoneIconContainer}>
                <Text style={styles.currencySymbol}>₦</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="Amount"
                placeholderTextColor="#999"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                editable={false}
              />
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate("Confirmation")}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ContactsProvider>
  );
};

export default Education;
