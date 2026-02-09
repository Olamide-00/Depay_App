import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "../style";
import BottomSheetSelector from "../../../../components/common/bottomsheet";
import PhoneInputWithContact from "../../../../components/common/numberSelector";

const networkOptions = [
  { label: "MTN", value: "mtn", icon: "call" as const },
  { label: "Glo", value: "glo", icon: "call" as const },
  { label: "Airtel", value: "airtel", icon: "call" as const },
  { label: "9mobile", value: "9mobile", icon: "call" as const },
];

const dataPlanOptions = [
  { label: "1GB - ₦500 (30 days)", value: "1gb_500" },
  { label: "2GB - ₦1,000 (30 days)", value: "2gb_1000" },
  { label: "5GB - ₦2,000 (30 days)", value: "5gb_2000" },
  { label: "10GB - ₦3,500 (30 days)", value: "10gb_3500" },
  { label: "20GB - ₦6,000 (30 days)", value: "20gb_6000" },
];

const DataTab = () => {
  const [selectedNetwork, setSelectedNetwork] = useState("9mobile");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedDataPlan, setSelectedDataPlan] = useState("");

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
          placeholder={selectedNetwork}
        />
      </View>

      {/* Data Plan Selector */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Data Plan</Text>
        <BottomSheetSelector
          options={dataPlanOptions}
          selectedValue={selectedDataPlan}
          onSelect={setSelectedDataPlan}
          placeholder="Select Data Plan"
          sheetTitle="Select Data Plan"
          variant="field"
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DataTab;
