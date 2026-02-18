import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "../style";
import BottomSheetSelector from "../../../../components/common/bottomsheet";
import PhoneInputWithContact from "../../../../components/common/numberSelector";
import { useNavigation } from "@react-navigation/native";
import {
  useGetAllServices,
  useGetServicePLan,
} from "../../../../api/hooks/useBills";

const DataTab = () => {
  const navigation = useNavigation();
  const { data, isLoading } = useGetAllServices("data");

  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedDataPlan, setSelectedDataPlan] = useState("");
  const [networks, setNetworks] = useState([]);
  const [dataPlans, setDataPlans] = useState([]);
  const [errors, setErrors] = useState({
    phoneNumber: "",
    selectedNetwork: "",
    selectedDataPlan: "",
  });

  // Build network options from API
  useEffect(() => {
    if (data?.data?.content) {
      const mapped = data.data.content.map((item) => ({
        label: item.name ? item.name.split(" ")[0] : "Unknown",
        value: item.serviceID,
        image: item.image,
      }));

      // Deduplicate by label
      const unique = mapped.filter(
        (provider, index, self) =>
          index === self.findIndex((p) => p.label === provider.label),
      );

      setNetworks(unique);
    }
  }, [data]);

  // Fetch data plans for the selected network
  const { data: dataPackage, isLoading: dataPackageLoading } =
    useGetServicePLan(selectedNetwork);

  // Build data plan options from API
  useEffect(() => {
    if (dataPackage?.data?.content?.variations) {
      const plans = dataPackage.data.content.variations.map((plan) => ({
        label: plan.name,
        value: plan.variation_code,
        icon: undefined,
      }));
      setDataPlans(plans);
    } else {
      setDataPlans([]);
    }
  }, [dataPackage]);

  // Find selected plan details for navigation
  const selectedPlanObject = dataPackage?.data?.content?.variations?.find(
    (plan) => plan.variation_code === selectedDataPlan,
  );

  const handleContinue = () => {
    navigation.navigate("Confirmation", {
      serviceID: selectedNetwork,
      phoneNumber,
      amount: selectedPlanObject?.variation_amount,
      variation_code: selectedPlanObject?.variation_code,
      plan: selectedPlanObject,
    });
  };

  const disable =
    !selectedNetwork ||
    !phoneNumber ||
    phoneNumber.length < 10 ||
    !selectedDataPlan;

  return (
    <View style={styles.tabContent}>
      {/* Network Selector */}
      <View style={styles.selectorContainer}>
        <BottomSheetSelector
          icon="wifi"
          options={networks}
          selectedValue={selectedNetwork}
          onSelect={(value) => {
            setSelectedNetwork(value);
            setSelectedDataPlan(""); // reset plan on network change
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
          onChangeText={(text) => {
            setPhoneNumber(text);
            setErrors((prev) => ({ ...prev, phoneNumber: "" }));
          }}
          placeholder="Enter phone number"
        />
      </View>

      {/* Data Plan Selector */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Data Plan</Text>
        <BottomSheetSelector
          options={dataPlans}
          selectedValue={selectedDataPlan}
          onSelect={(value) => {
            setSelectedDataPlan(value);
            setErrors((prev) => ({ ...prev, selectedDataPlan: "" }));
          }}
          placeholder={
            !selectedNetwork
              ? "Select a network first"
              : dataPackageLoading
                ? "Loading plans..."
                : dataPlans.length === 0
                  ? "No plans available"
                  : "Select Data Plan"
          }
          sheetTitle="Select Data Plan"
          variant="field"
        />
        {errors.selectedDataPlan ? (
          <Text style={styles.errorText}>{errors.selectedDataPlan}</Text>
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

export default DataTab;
