import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";
import BottomSheetSelector from "../../../components/common/bottomsheet";
import { ContactsProvider } from "../../../utils/contactProvider";
import { useNavigation } from "@react-navigation/native";
import {
  useGetAllServices,
  useGetServicePLan,
} from "../../../api/hooks/useBills";
import useVerify from "../../../api/hooks/useVerify";
import Text from "../../../components/common/txt";

const TV = () => {
  const navigation = useNavigation<any>();

  // Fetch all TV providers from API
  const { data: servicesData, isLoading: servicesLoading } =
    useGetAllServices("tv-subscription");

  const [serviceProvider, setServiceProvider] = useState("");
  const [smartCardNumber, setSmartCardNumber] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [amount, setAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [providers, setProviders] = useState([]);
  const [packages, setPackages] = useState([]);

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

  // Fetch packages when provider is selected
  const { data: packagesData, isLoading: packagesLoading } =
    useGetServicePLan(serviceProvider);

  useEffect(() => {
    if (packagesData?.data?.content?.variations) {
      const mapped = packagesData.data.content.variations.map((pkg: any) => ({
        label: `${pkg.name} — ₦${parseFloat(pkg.variation_amount).toLocaleString()}`,
        value: pkg.variation_code,
        amount: pkg.variation_amount,
      }));
      setPackages(mapped);
    } else {
      setPackages([]);
    }
  }, [packagesData]);

  // Smartcard verification
  const { mutate: verify, isPending: isVerifying } = useVerify();

  useEffect(() => {
    if (serviceProvider && smartCardNumber.length === 10) {
      setCustomerName("");
      verify(
        { serviceID: serviceProvider, billersCode: smartCardNumber },
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
  }, [serviceProvider, smartCardNumber]);

  const handlePackageSelect = (value: string) => {
    setSelectedPackage(value);
    const selected = packages.find((p: any) => p.value === value) as any;
    setAmount(selected?.amount || "");
  };

  const handleContinue = () => {
    navigation.navigate("Confirmation", {
      serviceID: serviceProvider,
      billersCode: smartCardNumber,
      variation_code: selectedPackage,
      amount,
      phoneNumber: null,
      type: "tv",
    });
  };

  const disable =
    !serviceProvider ||
    !smartCardNumber ||
    !selectedPackage ||
    !customerName ||
    isVerifying ||
    packages.length === 0;

  return (
    <ContactsProvider>
      <View style={styles.root}>
        <CommonHeader title="TV" back />

        <View style={styles.tabContent}>
          {/* Service Provider Selector */}
          <View style={styles.selectorContainer}>
            <BottomSheetSelector
              icon="tv"
              options={providers}
              selectedValue={serviceProvider}
              onSelect={(value) => {
                setServiceProvider(value);
                setSelectedPackage("");
                setAmount("");
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

          {/* Smart Card Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Smart Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter smart card number"
              placeholderTextColor="#999"
              value={smartCardNumber}
              onChangeText={(text) => {
                setSmartCardNumber(text);
                setCustomerName("");
              }}
              keyboardType="numeric"
              maxLength={10}
            />
            {/* Customer name verification feedback */}
            <View
              style={{ marginTop: 4, minHeight: 20, alignItems: "flex-end" }}
            >
              {isVerifying ? (
                <ActivityIndicator size="small" color="#6C2BD9" />
              ) : customerName ? (
                <Text style={{ color: "#22c55e", fontSize: 13 }}>
                  ✓ {customerName}
                </Text>
              ) : smartCardNumber.length === 10 && !isVerifying ? (
                <Text style={{ color: "#ef4444", fontSize: 13 }}>
                  Could not verify smartcard
                </Text>
              ) : null}
            </View>
          </View>

          {/* Package Selector */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Service Package</Text>
            <BottomSheetSelector
              options={packages}
              selectedValue={selectedPackage}
              onSelect={handlePackageSelect}
              placeholder={
                !serviceProvider
                  ? "Select a provider first"
                  : packagesLoading
                    ? "Loading packages..."
                    : packages.length === 0
                      ? "No packages available"
                      : "Select package"
              }
              sheetTitle="Select Package"
              variant="field"
            />
          </View>

          {/* Amount — auto-filled from selected package */}
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
                value={amount ? parseFloat(amount).toLocaleString("en-NG") : ""}
                editable={false}
              />
            </View>
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
      </View>
    </ContactsProvider>
  );
};

export default TV;
