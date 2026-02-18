import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import CommonHeader from "../../../components/ui/commonHeader";
import BottomSheetSelector from "../../../components/common/bottomsheet";
import PhoneInputWithContact from "../../../components/common/numberSelector";
import { ContactsProvider } from "../../../utils/contactProvider";
import { useNavigation } from "@react-navigation/native";
import { useGetServicePLan } from "../../../api/hooks/useBills";
import useVerify from "../../../api/hooks/useVerify";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
      (item: any) => item.variation_code === selectedExamType,
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
              data?.data?.content?.Customer_Name || "Invalid Profile",
            );
          },
          onError: () => setCustomerName(""),
        },
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
            <TextInput
              style={[styles.input, profileError ? styles.inputError : null]}
              placeholder="Enter 10-digit profile code"
              placeholderTextColor="#999"
              value={profileCode}
              onChangeText={(text) => {
                setProfileCode(text);
                setCustomerName("");
              }}
              keyboardType="numeric"
              maxLength={10}
            />
            {profileError ? (
              <Text style={styles.errorText}>{profileError}</Text>
            ) : null}
            {/* Verification feedback */}
            <View style={styles.verifyFeedback}>
              {isVerifying ? (
                <ActivityIndicator size="small" color="#6C2BD9" />
              ) : customerName ? (
                <Text style={styles.successText}>✓ {customerName}</Text>
              ) : profileCode.length === 10 && !isVerifying ? (
                <Text style={styles.errorText}>
                  Could not verify profile code
                </Text>
              ) : null}
            </View>
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

          {/* Amount — auto-filled, read only */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountWrapper}>
              <View style={styles.currencyBox}>
                <Text style={styles.currencySymbol}>₦</Text>
              </View>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="#999"
                value={amount > 0 ? amount.toLocaleString("en-NG") : ""}
                editable={false}
              />
            </View>
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
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(3),
    paddingBottom: hp(6),
    gap: hp(2),
  },
  inputContainer: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  verifyFeedback: {
    alignItems: "flex-end",
    minHeight: 20,
    marginTop: 4,
  },
  successText: {
    color: "#22c55e",
    fontSize: 13,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 2,
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    height: 50,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    overflow: "hidden",
  },
  currencyBox: {
    paddingHorizontal: 14,
    height: "100%",
    justifyContent: "center",
    backgroundColor: "#EFEFEF",
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  currencySymbol: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
  },
  amountInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111",
  },
  continueButton: {
    backgroundColor: "#6C2BD9",
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(2),
  },
  disabledButton: {
    backgroundColor: "#C4B5F7",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
