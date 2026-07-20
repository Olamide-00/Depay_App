import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import BottomSheetSelector from "../../../../components/common/bottomsheet";
import PhoneInputWithContact from "../../../../components/common/numberSelector";
import { useNavigation } from "@react-navigation/native";
import { useGetAllServices } from "../../../../api/hooks/useBills";
import Text from "../../../../components/common/txt";

const BRAND = "#1B3710";
const INK = "#141613";
const MUTED = "#6B7268";
const BORDER = "#E5E8E3";
const FIELD_BG = "#FAFBF9";
const ERROR_RED = "#D92D20";

interface AirtimeTabProps {
  /** Network hint from the Services screen, e.g. "mtn" */
  preselectedNetwork?: string;
}

const AirtimeTab = ({ preselectedNetwork }: AirtimeTabProps) => {
  const navigation = useNavigation<any>();
  const { data, isLoading } = useGetAllServices("airtime");

  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [networks, setNetworks] = useState<any[]>([]);
  const [errors, setErrors] = useState({
    phoneNumber: "",
    amount: "",
    selectedNetwork: "",
  });

  useEffect(() => {
    if (data?.data?.content) {
      const mapped = data.data.content.map((item: any) => ({
        label: item.name ? item.name.split(" ")[0] : "Unknown",
        value: item.serviceID,
        image: item.image, // use actual logo from API
      }));
      setNetworks(mapped);

      // Auto-select from the Services screen hint (only if nothing chosen yet)
      if (preselectedNetwork && !selectedNetwork) {
        const hint = preselectedNetwork.toLowerCase();
        const match = mapped.find(
          (n: any) =>
            n.label.toLowerCase().includes(hint) ||
            String(n.value).toLowerCase().includes(hint)
        );
        if (match) setSelectedNetwork(match.value);
      }
    }
  }, [data, preselectedNetwork]);

  const selectedService = data?.data?.content?.find(
    (item: any) => item.serviceID === selectedNetwork
  );

  const handleContinue = () => {
    navigation.navigate("Confirmation", {
      serviceID: selectedService?.serviceID,
      phoneNumber,
      amount,
    });
  };

  const disable =
    !selectedNetwork || !phoneNumber || phoneNumber.length < 10 || !amount;

  return (
    <View style={styles.tabContent}>
      {/* Network Selector */}
      <View style={styles.selectorContainer}>
        <BottomSheetSelector
          icon="wifi"
          options={networks}
          selectedValue={selectedNetwork}
          onSelect={(value: string) => {
            setSelectedNetwork(value);
            setErrors((prev) => ({ ...prev, selectedNetwork: "" }));
          }}
          placeholder={isLoading ? "Loading networks..." : "Change Network"}
          sheetTitle="Select Network"
        />
        {errors.selectedNetwork ? (
          <Text style={styles.errorText}>{errors.selectedNetwork}</Text>
        ) : null}
      </View>

      {/* Phone Number Input */}
      <View style={styles.inputContainer}>
        <PhoneInputWithContact
          label="Phone Number"
          value={phoneNumber}
          onChangeText={(text: string) => {
            setPhoneNumber(text);
            setErrors((prev) => ({ ...prev, phoneNumber: "" }));
          }}
          placeholder="Enter phone number"
        />
      </View>

      {/* Amount Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount</Text>
        <View style={styles.amountWrapper}>
          <View style={styles.currencyBox}>
            <Text style={styles.currencySymbol}>₦</Text>
          </View>
          <TextInput
            style={styles.amountInput}
            placeholder="Enter amount"
            placeholderTextColor="#A8AFA5"
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              setErrors((prev) => ({ ...prev, amount: "" }));
            }}
            keyboardType="numeric"
          />
        </View>
        {errors.amount ? (
          <Text style={styles.errorText}>{errors.amount}</Text>
        ) : null}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.continueButton, disable && styles.disabledButton]}
        onPress={handleContinue}
        disabled={disable}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AirtimeTab;

const styles = StyleSheet.create({
  tabContent: {
    padding: 16,
  },
  selectorContainer: {
    marginTop: 8,
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: INK,
    marginBottom: 8,
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: FIELD_BG,
    overflow: "hidden",
  },
  currencyBox: {
    width: 48,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF3E9",
  },
  currencySymbol: {
    fontSize: 17,
    fontFamily: "Poppins-SemiBold",
    color: BRAND,
  },
  amountInput: {
    flex: 1,
    fontSize: 15.5,
    fontFamily: "Poppins-Medium",
    color: INK,
    paddingHorizontal: 14,
    height: "100%",
  },
  errorText: {
    fontSize: 12.5,
    fontFamily: "Poppins-Regular",
    color: ERROR_RED,
    marginTop: 6,
  },
  continueButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
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
