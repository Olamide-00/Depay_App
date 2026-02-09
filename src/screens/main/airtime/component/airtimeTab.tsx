import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { styles } from "../style";
import BottomSheetSelector from "../../../../components/common/bottomsheet";
import PhoneInputWithContact from "../../../../components/common/numberSelector";

const networkOptions = [
  { label: "MTN", value: "mtn", icon: "call" as const },
  { label: "Glo", value: "glo", icon: "call" as const },
  { label: "Airtel", value: "airtel", icon: "call" as const },
  { label: "9mobile", value: "9mobile", icon: "call" as const },
];

const AirtimeTab = () => {
  const [selectedNetwork, setSelectedNetwork] = useState("9mobile");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <View style={styles.tabContent}>
      {/* Change Network Selector */}
      <View style={styles.selectorContainer}>
        <BottomSheetSelector
          icon="wifi"
          options={networkOptions}
          selectedValue={selectedNetwork}
          onSelect={setSelectedNetwork}
          placeholder="Change Network"
          sheetTitle="Select Network"
        />
      </View>

      {/* Phone Number Input with Contact Picker */}
      <View style={styles.inputContainer}>
        <PhoneInputWithContact
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
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
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AirtimeTab;
