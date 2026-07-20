import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CommonHeader from "../../../components/ui/commonHeader";
import BottomSheetSelector from "../../../components/common/bottomsheet";
import PhoneInputWithContact from "../../../components/common/numberSelector";
import { ContactsProvider } from "../../../utils/contactProvider";
import { useNavigation } from "@react-navigation/native";
import { useGetServicePLan } from "../../../api/hooks/useBills";
import useVerify from "../../../api/hooks/useVerify";
import Text from "../../../components/common/txt";

const BRAND = "#1B3710";
const LIGHT_GREEN = "#EAF3E9";
const INK = "#141613";
const MUTED = "#6B7268";
const BORDER = "#E5E8E3";
const FIELD_BG = "#FAFBF9";
const SUCCESS_GREEN = "#1E9E4B";
const ERROR_RED = "#D92D20";

const Jamb = () => {
  const navigation = useNavigation<any>();
  const { data, isLoading } = useGetServicePLan("jamb");

  const variations = data?.data?.content?.variations || [];
  const serviceID = data?.data?.content?.serviceID;

  const examTypeOptions = variations.map((item: any) => ({
    label: item.name,
    value: item.variation_code,
  }));

  const [selectedExamType, setSelectedExamType] = useState("");
  const [profileCode, setProfileCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [profileError, setProfileError] = useState("");

  // Update amount when exam type changes
  useEffect(() => {
    const selected = variations.find(
      (item: any) => item.variation_code === selectedExamType
    );
    setAmount(parseFloat(selected?.variation_amount || "0"));
  }, [selectedExamType, variations]);

  // Profile code length validation
  useEffect(() => {
    if (profileCode && profileCode.length !== 10) {
      setProfileError("Profile code must be 10 digits");
    } else {
      setProfileError("");
    }
  }, [profileCode]);

  // Verify profile when 10 digits entered
  const { mutate: verify, isPending: isVerifying } = useVerify();

  useEffect(() => {
    if (serviceID && profileCode.length === 10) {
      setCustomerName("");
      verify(
        { serviceID, billersCode: profileCode },
        {
          onSuccess: (data: any) => {
            setCustomerName(
              data?.data?.content?.Customer_Name || "Invalid Profile"
            );
          },
          onError: () => setCustomerName(""),
        }
      );
    } else {
      setCustomerName("");
    }
  }, [serviceID, profileCode]);

  const handleContinue = () => {
    navigation.navigate("Confirmation", {
      serviceID,
      variation_code: selectedExamType,
      amount: amount.toString(),
      phoneNumber,
      billersCode: profileCode,
      type: "education",
    });
  };

  const isFormValid =
    selectedExamType &&
    profileCode.length === 10 &&
    customerName &&
    phoneNumber.length >= 10 &&
    !isVerifying;

  return (
    <ContactsProvider>
      <View style={styles.root}>
        <CommonHeader title="JAMB" back />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Exam Type */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Exam Type</Text>
            <BottomSheetSelector
              options={examTypeOptions}
              selectedValue={selectedExamType}
              onSelect={setSelectedExamType}
              placeholder={
                isLoading ? "Loading exam types..." : "Select exam type"
              }
              sheetTitle="Select Exam Type"
              variant="field"
            />
          </View>

          {/* Profile Code */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Profile Code</Text>
            <View
              style={[
                styles.fieldWrapper,
                profileError && styles.fieldWrapperError,
                customerName && styles.fieldWrapperSuccess,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit profile code"
                placeholderTextColor="#A8AFA5"
                value={profileCode}
                onChangeText={(text) => {
                  setProfileCode(text.replace(/[^0-9]/g, ""));
                  setCustomerName("");
                }}
                keyboardType="numeric"
                maxLength={10}
              />
              {isVerifying && <ActivityIndicator size="small" color={BRAND} />}
              {!isVerifying && customerName ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={SUCCESS_GREEN}
                />
              ) : null}
            </View>

            {profileError ? (
              <Text style={styles.errorText}>{profileError}</Text>
            ) : isVerifying ? (
              <Text style={styles.helperText}>Verifying profile...</Text>
            ) : customerName ? (
              <Text style={styles.successText}>{customerName}</Text>
            ) : profileCode.length === 10 ? (
              <Text style={styles.errorText}>
                Could not verify this profile code
              </Text>
            ) : null}
          </View>

          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <PhoneInputWithContact
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter phone number"
            />
          </View>

          {/* Amount — auto-filled, locked */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountWrapperLocked}>
              <View style={styles.currencyBoxLocked}>
                <Text style={styles.currencySymbolLocked}>₦</Text>
              </View>
              <Text style={styles.amountLockedText}>
                {amount > 0 ? amount.toLocaleString("en-NG") : "—"}
              </Text>
              <MaterialCommunityIcons
                name="lock-outline"
                size={16}
                color="#A8AFA5"
              />
            </View>
            <Text style={styles.helperText}>
              Set automatically by the exam type you select
            </Text>
          </View>

          {/* Continue */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              !isFormValid && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!isFormValid}
          >
            <Text style={styles.continueButtonText}>
              {isVerifying ? "Verifying..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ContactsProvider>
  );
};

export default Jamb;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: INK,
  },

  fieldWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: FIELD_BG,
    paddingHorizontal: 14,
  },
  fieldWrapperError: {
    borderColor: ERROR_RED,
  },
  fieldWrapperSuccess: {
    borderColor: SUCCESS_GREEN,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: INK,
    height: "100%",
  },
  helperText: {
    fontSize: 12.5,
    fontFamily: "Poppins-Regular",
    color: MUTED,
    marginTop: 2,
  },
  successText: {
    fontSize: 12.5,
    fontFamily: "Poppins-Medium",
    color: SUCCESS_GREEN,
    marginTop: 2,
  },
  errorText: {
    fontSize: 12.5,
    fontFamily: "Poppins-Regular",
    color: ERROR_RED,
    marginTop: 2,
  },

  amountWrapperLocked: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: "#F2F4F0",
    paddingHorizontal: 14,
    gap: 10,
  },
  currencyBoxLocked: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#E4E9E1",
    alignItems: "center",
    justifyContent: "center",
  },
  currencySymbolLocked: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: MUTED,
  },
  amountLockedText: {
    flex: 1,
    fontSize: 15.5,
    fontFamily: "Poppins-SemiBold",
    color: INK,
  },

  continueButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.35,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 15.5,
    fontFamily: "Poppins-SemiBold",
  },
});
