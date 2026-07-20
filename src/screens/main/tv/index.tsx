import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

const BRAND = "#1B3710";
const LIGHT_GREEN = "#EAF3E9";
const INK = "#141613";
const MUTED = "#6B7268";
const BORDER = "#E5E8E3";
const FIELD_BG = "#FAFBF9";
const SUCCESS_GREEN = "#1E9E4B";
const ERROR_RED = "#D92D20";

const TV = () => {
  const navigation = useNavigation<any>();

  const { data: servicesData, isLoading: servicesLoading } =
    useGetAllServices("tv-subscription");

  const [serviceProvider, setServiceProvider] = useState("");
  const [smartCardNumber, setSmartCardNumber] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [amount, setAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [providers, setProviders] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);

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
        label: `${pkg.name} — ₦${parseFloat(
          pkg.variation_amount
        ).toLocaleString()}`,
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
        }
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

        <ScrollView
          contentContainerStyle={styles.tabContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Service Provider Selector */}
          <View style={styles.selectorContainer}>
            <Text style={styles.label}>Service Provider</Text>
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
                  : "Select Service Provider"
              }
              sheetTitle="Select Service Provider"
              variant="field"
            />
          </View>

          {/* Smart Card Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Smart Card Number</Text>
            <View
              style={[
                styles.fieldWrapper,
                customerName && styles.fieldWrapperSuccess,
                smartCardNumber.length === 10 &&
                  !customerName &&
                  !isVerifying &&
                  styles.fieldWrapperError,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Enter smart card number"
                placeholderTextColor="#A8AFA5"
                value={smartCardNumber}
                onChangeText={(text) => {
                  setSmartCardNumber(text.replace(/[^0-9]/g, ""));
                  setCustomerName("");
                }}
                keyboardType="numeric"
                maxLength={10}
              />
              {isVerifying && <ActivityIndicator size="small" color={BRAND} />}
              {!isVerifying && customerName ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={SUCCESS_GREEN}
                />
              ) : null}
            </View>

            {/* Customer name verification feedback */}
            {isVerifying ? (
              <Text style={styles.helperText}>Verifying smartcard...</Text>
            ) : customerName ? (
              <Text style={styles.successText}>{customerName}</Text>
            ) : smartCardNumber.length === 10 ? (
              <Text style={styles.errorText}>
                Could not verify this smartcard
              </Text>
            ) : null}
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

          {/* Amount — auto-filled from selected package, locked */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountWrapperLocked}>
              <View style={styles.currencyBoxLocked}>
                <Text style={styles.currencySymbolLocked}>₦</Text>
              </View>
              <Text style={styles.amountLockedText}>
                {amount ? parseFloat(amount).toLocaleString("en-NG") : "—"}
              </Text>
              <MaterialCommunityIcons
                name="lock-outline"
                size={16}
                color="#A8AFA5"
                style={styles.lockIcon}
              />
            </View>
            <Text style={styles.helperText}>
              Set automatically by the package you select
            </Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.continueButton, disable && styles.disabledButton]}
            onPress={handleContinue}
            disabled={disable}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ContactsProvider>
  );
};

export default TV;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  tabContent: { padding: 16, paddingBottom: 40 },
  selectorContainer: { marginBottom: 4 },
  inputContainer: { marginTop: 20 },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: INK,
    marginBottom: 8,
  },

  fieldWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: FIELD_BG,
    paddingHorizontal: 14,
  },
  fieldWrapperSuccess: {
    borderColor: SUCCESS_GREEN,
    backgroundColor: "#FFFFFF",
  },
  fieldWrapperError: {
    borderColor: ERROR_RED,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: INK,
    height: "100%",
  },
  helperText: {
    fontSize: 12.5,
    fontFamily: "Poppins-Regular",
    color: MUTED,
    marginTop: 6,
  },
  successText: {
    fontSize: 12.5,
    fontFamily: "Poppins-Medium",
    color: SUCCESS_GREEN,
    marginTop: 6,
  },
  errorText: {
    fontSize: 12.5,
    fontFamily: "Poppins-Regular",
    color: ERROR_RED,
    marginTop: 6,
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
  lockIcon: {
    marginLeft: 4,
  },

  continueButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  disabledButton: { opacity: 0.35 },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 15.5,
    fontFamily: "Poppins-SemiBold",
  },
});
