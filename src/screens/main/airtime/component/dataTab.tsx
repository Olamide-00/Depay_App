import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { styles } from "../style";
import BottomSheetSelector from "../../../../components/common/bottomsheet";
import PhoneInputWithContact from "../../../../components/common/numberSelector";
import { useNavigation } from "@react-navigation/native";
import {
  useGetAllServices,
  useGetServicePLan,
} from "../../../../api/hooks/useBills";
import Text from "../../../../components/common/txt";

interface DataTabProps {
  /** Network hint from the Services screen, e.g. "mtn" */
  preselectedNetwork?: string;
}

const DataTab = ({ preselectedNetwork }: DataTabProps) => {
  const navigation = useNavigation<any>();
  const { data, isLoading } = useGetAllServices("data");

  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedDataPlan, setSelectedDataPlan] = useState("");
  const [networks, setNetworks] = useState<any[]>([]);
  const [dataPlans, setDataPlans] = useState<any[]>([]);
  const [errors, setErrors] = useState({
    phoneNumber: "",
    selectedNetwork: "",
    selectedDataPlan: "",
  });

  // Build network options from API
  useEffect(() => {
    if (data?.data?.content) {
      const mapped = data.data.content.map((item: any) => ({
        label: item.name ? item.name.split(" ")[0] : "Unknown",
        value: item.serviceID,
        image: item.image,
      }));

      // Deduplicate by label
      const unique = mapped.filter(
        (provider: any, index: number, self: any[]) =>
          index === self.findIndex((p) => p.label === provider.label)
      );

      setNetworks(unique);

      // Auto-select from the Services screen hint (only if nothing chosen yet)
      if (preselectedNetwork && !selectedNetwork) {
        const hint = preselectedNetwork.toLowerCase();
        const match = unique.find(
          (n: any) =>
            n.label.toLowerCase().includes(hint) ||
            String(n.value).toLowerCase().includes(hint)
        );
        if (match) setSelectedNetwork(match.value);
      }
    }
  }, [data, preselectedNetwork]);

  // Fetch data plans for the selected network
  const { data: dataPackage, isLoading: dataPackageLoading } =
    useGetServicePLan(selectedNetwork);

  // Build data plan options from API
  useEffect(() => {
    if (dataPackage?.data?.content?.variations) {
      const plans = dataPackage.data.content.variations.map((plan: any) => ({
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
    (plan: any) => plan.variation_code === selectedDataPlan
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
          onSelect={(value: string) => {
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
          onChangeText={(text: string) => {
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
          onSelect={(value: string) => {
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
