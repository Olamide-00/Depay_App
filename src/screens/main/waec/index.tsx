import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
      (item: any) => item.variation_code === selectedExamType,
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

          {/* Quantity */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={[styles.input, quantityError ? styles.inputError : null]}
              placeholder="Enter quantity"
              placeholderTextColor="#999"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
            {quantityError ? (
              <Text style={styles.errorText}>{quantityError}</Text>
            ) : null}
          </View>

          {/* Amount — auto-calculated, read only */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Total Amount</Text>
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
            {selectedExamType && quantity && parseInt(quantity) > 1 && (
              <Text style={styles.quantityNote}>
                {parseInt(quantity)} × ₦
                {(amount / parseInt(quantity)).toLocaleString("en-NG")} per pin
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
  quantityNote: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
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
