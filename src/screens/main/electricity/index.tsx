import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";
import BottomSheetSelector from "../../../components/common/bottomsheet";
import { ContactsProvider } from "../../../utils/contactProvider";
import { useNavigation } from "@react-navigation/native";

const paymentTypeOptions = [
  { label: "Prepaid", value: "prepaid", icon: "zap" as const },
  { label: "Postpaid", value: "postpaid", icon: "zap" as const },
];

const serviceProviderOptions = [
  {
    label: "AEDC - Abuja Electricity Distribution Company",
    value: "aedc",
    icon: "zap" as const,
  },
  { label: "IKEDC - Ikeja Electric", value: "ikedc", icon: "zap" as const },
  { label: "EKEDC - Eko Electricity", value: "ekedc", icon: "zap" as const },
  {
    label: "PHED - Port Harcourt Electricity",
    value: "phed",
    icon: "zap" as const,
  },
];

const Electricity = () => {
  const navigation = useNavigation();
  const [paymentType, setPaymentType] = useState("prepaid");
  const [serviceProvider, setServiceProvider] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  return (
    <ContactsProvider>
      <View style={styles.root}>
        <CommonHeader title="Electricity" back />

        {/* Tabs - Now acts as selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, paymentType === "prepaid" && styles.activeTab]}
            onPress={() => setPaymentType("prepaid")}
          >
            <Text
              style={[
                styles.tabText,
                paymentType === "prepaid" && styles.activeTabText,
              ]}
            >
              Prepaid
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, paymentType === "postpaid" && styles.activeTab]}
            onPress={() => setPaymentType("postpaid")}
          >
            <Text
              style={[
                styles.tabText,
                paymentType === "postpaid" && styles.activeTabText,
              ]}
            >
              Postpaid
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Content */}
        <View style={styles.tabContent}>
          {/* Service Provider Selector */}
          <View style={styles.selectorContainer}>
            <BottomSheetSelector
              icon="zap"
              options={serviceProviderOptions}
              selectedValue={serviceProvider}
              onSelect={setServiceProvider}
              placeholder="Change Service Provider"
              sheetTitle="Select Service Provider"
            />
          </View>

          {/* Meter Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Meter Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter meter number"
              placeholderTextColor="#999"
              value={meterNumber}
              onChangeText={setMeterNumber}
              keyboardType="numeric"
            />
          </View>

          {/* Customer Phone Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Customer Phone Number</Text>
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
                placeholder="Enter amount"
                placeholderTextColor="#999"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Quick Amount Buttons */}
          <View style={styles.quickAmountContainer}>
            {quickAmounts.map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.quickAmountButton,
                  amount === value.toString() && styles.quickAmountButtonActive,
                ]}
                onPress={() => handleQuickAmount(value)}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    amount === value.toString() && styles.quickAmountTextActive,
                  ]}
                >
                  ₦{value.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
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

export default Electricity;
