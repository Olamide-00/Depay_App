import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CommonHeader from "../../../components/ui/commonHeader";
import BottomSheetSelector from "../../../components/common/bottomsheet";
import { ContactsProvider } from "../../../utils/contactProvider";
import { useNavigation } from "@react-navigation/native";
import { useGetAllServices } from "../../../api/hooks/useBills";
import useVerify from "../../../api/hooks/useVerify";
import Text from "../../../components/common/txt";
// import useAuthStore from "../../../store/userStore";

const BRAND = "#1B3710";
const LIGHT_GREEN = "#EAF3E9";
const ACCENT_GREEN = "#A9D99B";
const INK = "#141613";
const MUTED = "#6B7268";
const BORDER = "#E5E8E3";
const FIELD_BG = "#FAFBF9";
const SUCCESS_GREEN = "#1E9E4B";
const ERROR_RED = "#D92D20";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

const Electricity = () => {
  const navigation = useNavigation<any>();

  const phoneNumber = "";

  const { data: servicesData, isLoading: servicesLoading } =
    useGetAllServices("electricity-bill");

  const [paymentType, setPaymentType] = useState<"prepaid" | "postpaid">(
    "prepaid"
  );
  const [serviceProvider, setServiceProvider] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [providers, setProviders] = useState<any[]>([]);

  // Animated tab indicator
  const [tabWidth, setTabWidth] = useState(0);
  const indicatorX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(indicatorX, {
      toValue: paymentType === "postpaid" ? 1 : 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 4,
    }).start();
  }, [paymentType]);

  const translateX = indicatorX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });

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
        }
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
        <View
          style={styles.tabContainer}
          onLayout={(e) => setTabWidth((e.nativeEvent.layout.width - 8) / 2)}
        >
          {tabWidth > 0 && (
            <Animated.View
              style={[
                styles.indicator,
                { width: tabWidth, transform: [{ translateX }] },
              ]}
            />
          )}

          <TouchableOpacity
            style={styles.tab}
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
            style={styles.tab}
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
        <ScrollView
          contentContainerStyle={styles.tabContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Service Provider Selector */}
          <View style={styles.selectorContainer}>
            <Text style={styles.label}>Service Provider</Text>
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
                  : "Select Service Provider"
              }
              sheetTitle="Select Service Provider"
              variant="field"
            />
          </View>

          {/* Meter Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Meter Number</Text>
            <View
              style={[
                styles.fieldWrapper,
                customerName && styles.fieldWrapperSuccess,
                meterValid &&
                  !customerName &&
                  !isVerifying &&
                  styles.fieldWrapperError,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Enter meter number (12 or 13 digits)"
                placeholderTextColor="#A8AFA5"
                value={meterNumber}
                onChangeText={(text) => {
                  setMeterNumber(text.replace(/[^0-9]/g, ""));
                  setCustomerName("");
                }}
                keyboardType="numeric"
                maxLength={13}
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

            {/* Verification feedback */}
            {isVerifying ? (
              <Text style={styles.helperText}>Verifying meter...</Text>
            ) : customerName ? (
              <Text style={styles.successText}>{customerName}</Text>
            ) : meterValid ? (
              <Text style={styles.errorText}>
                Could not verify this meter number
              </Text>
            ) : null}
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
                onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Quick Amount Buttons */}
          <View style={styles.quickAmountContainer}>
            {QUICK_AMOUNTS.map((value) => {
              const isActive = amount === value.toString();
              return (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.quickAmountButton,
                    isActive && styles.quickAmountButtonActive,
                  ]}
                  onPress={() => handleQuickAmount(value)}
                >
                  <Text
                    style={[
                      styles.quickAmountText,
                      isActive && styles.quickAmountTextActive,
                    ]}
                  >
                    ₦{value.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
        </ScrollView>
      </View>
    </ContactsProvider>
  );
};

export default Electricity;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },

  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: LIGHT_GREEN,
    borderRadius: 14,
    padding: 4,
  },
  indicator: {
    position: "absolute",
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: MUTED,
  },
  activeTabText: {
    color: BRAND,
    fontFamily: "Poppins-SemiBold",
  },

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
    backgroundColor: LIGHT_GREEN,
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

  quickAmountContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  quickAmountButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: LIGHT_GREEN,
  },
  quickAmountButtonActive: {
    backgroundColor: BRAND,
  },
  quickAmountText: {
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    color: BRAND,
  },
  quickAmountTextActive: {
    color: "#FFFFFF",
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
