import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { styles } from "../style";
import BottomSheetSelector from "../../../../components/common/bottomsheet";
import PhoneInputWithContact from "../../../../components/common/numberSelector";
import { useNavigation } from "@react-navigation/native";
import { useGetAllServices } from "../../../../api/hooks/useBills";
import Text from "../../../../components/common/txt";

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
        <View style={styles.phoneInputWrapper}>
          <View style={styles.phoneIconContainer}>
            <Text style={styles.currencySymbol}>₦</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter amount"
            placeholderTextColor="#999"
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
