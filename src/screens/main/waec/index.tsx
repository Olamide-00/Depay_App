import {
  View,
  TextInput,
  TouchableOpacity,
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
import Text from "../../../components/common/txt";

const BRAND = "#1B3710";
const LIGHT_GREEN = "#EAF3E9";
const INK = "#141613";
const MUTED = "#6B7268";
const BORDER = "#E5E8E3";
const FIELD_BG = "#FAFBF9";
const ERROR_RED = "#D92D20";

const Waec = () => {
  const navigation = useNavigation<any>();
  const { data, isLoading } = useGetServicePLan("waec");

  const variations = data?.data?.content?.variations || [];
  const serviceID = data?.data?.content?.serviceID;

  const examTypeOptions = variations.map((item: any) => ({
    label: item.name,
    value: item.variation_code,
  }));

  const [selectedExamType, setSelectedExamType] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [quantityError, setQuantityError] = useState("");

  // Update total amount when exam type or quantity changes
  useEffect(() => {
    const selected = variations.find(
      (item: any) => item.variation_code === selectedExamType
    );
    const unitAmount = parseFloat(selected?.variation_amount || "0");
    const qty = Math.max(parseInt(quantity || "0"), 0);
    setAmount(unitAmount * qty);
  }, [selectedExamType, quantity, variations]);

  // Quantity validation
  useEffect(() => {
    if (parseInt(quantity || "0") < 1) {
      setQuantityError("Quantity cannot be less than 1");
    } else {
      setQuantityError("");
    }
  }, [quantity]);

  const adjustQuantity = (delta: number) => {
    const current = Math.max(parseInt(quantity || "0"), 0);
    const next = Math.max(current + delta, 1);
    setQuantity(String(next));
  };

  const handleContinue = () => {
    navigation.navigate("Confirmation", {
      serviceID,
      variation_code: selectedExamType,
      amount: amount.toString(),
      phoneNumber,
      type: "education",
    });
  };

  const isQuantityValid = parseInt(quantity || "0") >= 1;
  const isFormValid =
    selectedExamType && isQuantityValid && phoneNumber.length >= 10;

  const unitPrice =
    selectedExamType && parseInt(quantity) > 0
      ? amount / parseInt(quantity)
      : 0;

  return (
    <ContactsProvider>
      <View style={styles.root}>
        <CommonHeader title="WAEC" back />
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

          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <PhoneInputWithContact
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter phone number"
            />
          </View>

          {/* Quantity — stepper */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Quantity</Text>
            <View
              style={[
                styles.stepperWrapper,
                quantityError && styles.fieldWrapperError,
              ]}
            >
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => adjustQuantity(-1)}
                disabled={parseInt(quantity || "0") <= 1}
              >
                <MaterialCommunityIcons
                  name="minus"
                  size={18}
                  color={parseInt(quantity || "0") <= 1 ? "#C2C9BE" : BRAND}
                />
              </TouchableOpacity>

              <TextInput
                style={styles.stepperInput}
                value={quantity}
                onChangeText={(text) =>
                  setQuantity(text.replace(/[^0-9]/g, ""))
                }
                keyboardType="numeric"
                textAlign="center"
              />

              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => adjustQuantity(1)}
              >
                <MaterialCommunityIcons name="plus" size={18} color={BRAND} />
              </TouchableOpacity>
            </View>
            {quantityError ? (
              <Text style={styles.errorText}>{quantityError}</Text>
            ) : (
              <Text style={styles.helperText}>Number of pins to purchase</Text>
            )}
          </View>

          {/* Amount — auto-calculated, locked */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Total Amount</Text>
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
            {selectedExamType && parseInt(quantity) > 1 ? (
              <Text style={styles.helperText}>
                {parseInt(quantity)} × ₦{unitPrice.toLocaleString("en-NG")} per
                pin
              </Text>
            ) : (
              <Text style={styles.helperText}>
                Set automatically by exam type and quantity
              </Text>
            )}
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
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ContactsProvider>
  );
};

export default Waec;

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

  fieldWrapperError: {
    borderColor: ERROR_RED,
  },
  helperText: {
    fontSize: 12.5,
    fontFamily: "Poppins-Regular",
    color: MUTED,
    marginTop: 2,
  },
  errorText: {
    fontSize: 12.5,
    fontFamily: "Poppins-Regular",
    color: ERROR_RED,
    marginTop: 2,
  },

  stepperWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: FIELD_BG,
    overflow: "hidden",
  },
  stepperButton: {
    width: 52,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  stepperInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: INK,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: BORDER,
    height: "100%",
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
