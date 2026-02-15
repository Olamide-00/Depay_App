import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";
import BottomSheetSelector from "../../../components/common/bottomsheet";
import { ContactsProvider } from "../../../utils/contactProvider";
import { useNavigation } from "@react-navigation/native";

const serviceProviderOptions = [
  { label: "DSTV", value: "dstv", icon: "tv" as const },
  { label: "GOtv", value: "gotv", icon: "tv" as const },
  { label: "Startimes", value: "startimes", icon: "tv" as const },
  { label: "Showmax", value: "showmax", icon: "tv" as const },
];

// These would typically come from an API based on selected provider
const packageOptions = [
  {
    label: "DSTV Premium - ₦24,500",
    value: "premium",
    icon: "package" as const,
  },
  {
    label: "DSTV Compact Plus - ₦16,200",
    value: "compact_plus",
    icon: "package" as const,
  },
  {
    label: "DSTV Compact - ₦10,500",
    value: "compact",
    icon: "package" as const,
  },
  { label: "DSTV Confam - ₦6,200", value: "confam", icon: "package" as const },
  { label: "DSTV Yanga - ₦3,500", value: "yanga", icon: "package" as const },
];

const TV = () => {
  const navigation = useNavigation();
  const [serviceProvider, setServiceProvider] = useState("");
  const [smartCardNumber, setSmartCardNumber] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [amount, setAmount] = useState("");

  const handlePackageSelect = (value: string) => {
    setSelectedPackage(value);
    // Set amount based on package - you'd typically get this from API
    const packagePrices: Record<string, string> = {
      premium: "24500",
      compact_plus: "16200",
      compact: "10500",
      confam: "6200",
      yanga: "3500",
    };
    setAmount(packagePrices[value] || "");
  };

  return (
    <ContactsProvider>
      <View style={styles.root}>
        <CommonHeader title="TV" back />

        {/* Form Content */}
        <View style={styles.tabContent}>
          {/* Service Provider Selector */}
          <View style={styles.selectorContainer}>
            <BottomSheetSelector
              icon="tv"
              options={serviceProviderOptions}
              selectedValue={serviceProvider}
              onSelect={setServiceProvider}
              placeholder="Change Service Provider"
              sheetTitle="Select Service Provider"
            />
          </View>

          {/* Smart Card Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Smart Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter smart card number"
              placeholderTextColor="#999"
              value={smartCardNumber}
              onChangeText={setSmartCardNumber}
              keyboardType="numeric"
            />
          </View>

          {/* Package Selector - Field Variant */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Service Package</Text>
            <BottomSheetSelector
              options={packageOptions}
              selectedValue={selectedPackage}
              onSelect={handlePackageSelect}
              placeholder="Select package"
              sheetTitle="Select Package"
              variant="field"
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

export default TV;
