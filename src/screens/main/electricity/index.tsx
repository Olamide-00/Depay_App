import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";
import BottomSheetSelector from "../../../components/common/bottomsheet";
import { ContactsProvider } from "../../../utils/contactProvider";
import { useNavigation } from "@react-navigation/native";
import { useGetAllServices } from "../../../api/hooks/useBills";
import useVerify from "../../../api/hooks/useVerify";

const Electricity = () => {
  const navigation = useNavigation<any>();

  // const userData = useAuthStore((state: any) => state.userData);
  const phoneNumber = "09036018013";

  // Fetch disco providers from API
  const { data: servicesData, isLoading: servicesLoading } =
    useGetAllServices("electricity-bill");

  const [paymentType, setPaymentType] = useState<"prepaid" | "postpaid">(
    "prepaid",
  );
  const [serviceProvider, setServiceProvider] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [providers, setProviders] = useState([]);

  const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

  // Build provider options from API
  useEffect(() => {
    if (servicesData?.data?.content) {
      const mapped = servicesData.data.content.map((item: any) => ({
        label: item.name,
        value: item.serviceID,
        image: item.image,
      }));
      setProviders(mapped);
    }
  }, [servicesData]);

  // Meter verification
  const { mutate: verify, isPending: isVerifying } = useVerify();

  useEffect(() => {
    const meterLen = meterNumber.length;
    if (serviceProvider && (meterLen === 12 || meterLen === 13)) {
      setCustomerName("");
      verify(
        { serviceID: serviceProvider, billersCode: meterNumber },
        {
          onSuccess: (data: any) => {
            setCustomerName(data?.data?.content?.Customer_Name || "");
          },
          onError: () => {
            setCustomerName("");
          },
        },
      );
    } else {
      setCustomerName("");
    }
  }, [serviceProvider, meterNumber]);

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleContinue = () => {
    navigation.navigate("Confirmation", {
      serviceID: serviceProvider,
      billersCode: meterNumber,
      variation_code: paymentType,
      amount,
      phoneNumber,
      type: "electricity",
    });
  };

  const meterLen = meterNumber.length;
  const meterValid = meterLen === 12 || meterLen === 13;
  const isFormValid =
    serviceProvider && meterValid && customerName && amount && !isVerifying;

  return (
    <ContactsProvider>
      <View style={styles.root}>
        <CommonHeader title="Electricity" back />

        {/* Prepaid / Postpaid Tabs */}
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
              icon="flash"
              options={providers}
              selectedValue={serviceProvider}
              onSelect={(value) => {
                setServiceProvider(value);
                setCustomerName("");
              }}
              placeholder={
                servicesLoading
                  ? "Loading providers..."
                  : "Change Service Provider"
              }
              sheetTitle="Select Service Provider"
            />
          </View>

          {/* Meter Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Meter Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter meter number (12 or 13 digits)"
              placeholderTextColor="#999"
              value={meterNumber}
              onChangeText={(text) => {
                setMeterNumber(text);
                setCustomerName("");
              }}
              keyboardType="numeric"
              maxLength={13}
            />
            {/* Verification feedback */}
            <View
              style={{ marginTop: 4, minHeight: 20, alignItems: "flex-end" }}
            >
              {isVerifying ? (
                <ActivityIndicator size="small" color="#6C2BD9" />
              ) : customerName ? (
                <Text style={{ color: "#22c55e", fontSize: 13 }}>
                  ✓ {customerName}
                </Text>
              ) : meterValid && !isVerifying ? (
                <Text style={{ color: "#ef4444", fontSize: 13 }}>
                  Could not verify meter number
                </Text>
              ) : null}
            </View>
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
            style={[
              styles.continueButton,
              !isFormValid && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!isFormValid}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ContactsProvider>
  );
};

export default Electricity;
