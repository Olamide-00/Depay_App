import { View, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import Text from "../../../components/common/txt";
import CommonHeader from "../../../components/ui/commonHeader";
import useAuthStore from "../../../store/userStore";
import { Ionicons } from "@expo/vector-icons";
import { useCreateWallet } from "../../../api/hooks/useWallet";

const Wallet = () => {
  const [selectedType, setSelectedType] = useState("NIN");
  const [idNumber, setIdNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const userData = useAuthStore((state) => state.userData);
  const name = userData?.name;
  const email = userData?.email;

  const { mutate: createWallet, isPending } = useCreateWallet();

  const handleGenerateWallet = () => {
    if (!idNumber || idNumber.length < 11) {
      Alert.alert("Validation Error", `Please enter a valid ${selectedType} (11 digits)`);
      return;
    }

    if (!agreedToTerms) {
      Alert.alert("Terms Required", "Please agree to the terms and conditions");
      return;
    }

    const requestData: any = { email, customerName: name };

    if (selectedType === "BVN") {
      requestData.bvn = idNumber;
    } else {
      requestData.nin = idNumber;
    }

    createWallet(requestData, {
      onSuccess: (response) => {
        // ✅ Update store with Monnify account details
        const accounts = response.data?.accounts || [];
        if (accounts.length > 0) {
          useAuthStore.getState().setAccountDetails(
            accounts.map((acc: any) => ({
              accountName: acc.accountName || name || "",
              accountNumber: acc.accountNumber || "",
              bankCode: acc.bankCode || "",
              bankName: acc.bankName || "",
            }))
          );
        }
        useAuthStore.getState().setIsWalletCreated(true);

        Alert.alert("Success", "Bank account created successfully!");

        setIdNumber("");
        setAgreedToTerms(false);
      },
      onError: (error: any) => {
        console.log("Full error object:", error);

        if (error.response?.data) {
          const errorData = error.response.data;

          if (errorData.errors && Array.isArray(errorData.errors)) {
            Alert.alert("Validation Error", errorData.errors.join("\n"));
          } else if (errorData.message) {
            Alert.alert(
              errorData.message.includes("failed") ? "Error" : "Validation Error",
              errorData.message
            );
          } else {
            Alert.alert("Error", error.message || "Failed to create bank account. Please try again.");
          }
        } else {
          Alert.alert("Error", error.message || "Failed to create bank account. Please try again.");
        }
      },
    });
  };

  return (
    <View style={styles.root}>
      <CommonHeader title="Generate Bank Account" back />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Toggle Buttons */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, selectedType === "NIN" && styles.toggleButtonActive]}
              onPress={() => { setSelectedType("NIN"); setIdNumber(""); }}
            >
              <Text style={[styles.toggleText, selectedType === "NIN" && styles.toggleTextActive]}>
                NIN
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleButton, selectedType === "BVN" && styles.toggleButtonActive]}
              onPress={() => { setSelectedType("BVN"); setIdNumber(""); }}
            >
              <Text style={[styles.toggleText, selectedType === "BVN" && styles.toggleTextActive]}>
                BVN
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Kindly provide your ID</Text>
            <Text style={styles.sectionSubtitle}>
              Please enter your own {selectedType} to Generate Bank Account.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {selectedType === "NIN" ? "National Identification Number*" : "Bank Verification Number*"}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={selectedType === "NIN" ? "Enter 11-digit NIN" : "Enter 11-digit BVN"}
                placeholderTextColor="#D1D5DB"
                value={idNumber}
                onChangeText={setIdNumber}
                keyboardType="numeric"
                maxLength={11}
                editable={!isPending}
              />
              <Text style={styles.charCount}>{idNumber.length}/11 digits</Text>
            </View>
          </View>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text style={styles.warningText}>Forget your {selectedType}?</Text>
            <TouchableOpacity
              style={styles.clickButton}
              onPress={() =>
                Alert.alert(
                  "Need Help?",
                  `Please contact support if you've forgotten your ${selectedType} or visit the nearest NIMC/BVN enrollment center.`
                )
              }
            >
              <Text style={styles.clickButtonText}>Click here</Text>
            </TouchableOpacity>
          </View>

          {/* Terms Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => !isPending && setAgreedToTerms(!agreedToTerms)}
            disabled={isPending}
          >
            <View style={[styles.checkbox, isPending && styles.checkboxDisabled]}>
              {agreedToTerms && <Ionicons name="checkmark" size={16} color="#7C3AED" />}
            </View>
            <Text style={[styles.checkboxText, isPending && styles.textDisabled]}>
              In line with the latest regulatory requirement from the CBN, we will collect your
              face, name, phone number, home address, and birthday or BVN and NIN to verify your
              account. JAAN will not share or sell your personal information securely.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Generate Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.generateButton,
            (!agreedToTerms || !idNumber || idNumber.length < 11 || isPending) &&
              styles.buttonDisabled,
          ]}
          onPress={handleGenerateWallet}
          disabled={!agreedToTerms || !idNumber || idNumber.length < 11 || isPending}
        >
          <Text style={styles.generateButtonText}>
            {isPending ? "Creating..." : "Generate"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Wallet;