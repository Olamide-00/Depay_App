import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import Text from "../../../components/common/txt";
import CommonHeader from "../../../components/ui/commonHeader";
import { Ionicons } from "@expo/vector-icons";

const Wallet = () => {
  const [selectedType, setSelectedType] = useState("NIN"); // NIN or BVN
  const [idNumber, setIdNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
              style={[
                styles.toggleButton,
                selectedType === "NIN" && styles.toggleButtonActive,
              ]}
              onPress={() => setSelectedType("NIN")}
            >
              <Text
                style={[
                  styles.toggleText,
                  selectedType === "NIN" && styles.toggleTextActive,
                ]}
              >
                NIN
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedType === "BVN" && styles.toggleButtonActive,
              ]}
              onPress={() => setSelectedType("BVN")}
            >
              <Text
                style={[
                  styles.toggleText,
                  selectedType === "BVN" && styles.toggleTextActive,
                ]}
              >
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

            {/* ID Number Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {selectedType === "NIN"
                  ? "National Identification Number*"
                  : "Bank Verification Number*"}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="32445724458788098"
                placeholderTextColor="#D1D5DB"
                value={idNumber}
                onChangeText={setIdNumber}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text style={styles.warningText}>Forget your {selectedType}?</Text>
            <TouchableOpacity style={styles.clickButton}>
              <Text style={styles.clickButtonText}>Click here</Text>
            </TouchableOpacity>
          </View>

          {/* Terms Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={styles.checkbox}>
              {agreedToTerms && (
                <Ionicons name="checkmark" size={16} color="#7C3AED" />
              )}
            </View>
            <Text style={styles.checkboxText}>
              In line with the latest regulatory requirement from the CBN, we
              will collect your face, name, phone number, home address, and
              birthday or BVN and NIN to verify your account. JARA will not
              share or sell your personal information securely.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Generate Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.generateButton,
            !agreedToTerms && styles.buttonDisabled,
          ]}
          disabled={!agreedToTerms}
        >
          <Text style={styles.generateButtonText}>Generate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Wallet;
