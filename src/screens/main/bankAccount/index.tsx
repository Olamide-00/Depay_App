import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Clipboard,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import Text from "../../../components/common/txt";
import CommonHeader from "../../../components/ui/commonHeader";
import useAuthStore from "../../../store/userStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCreateWallet } from "../../../api/hooks/useWallet";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../constants/Colors";

const Wallet = () => {
  const navigation = useNavigation();
  const [idNumber, setIdNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // ─── Same pattern as TopUpModal ───────────────────────────────────────────
  const userData = useAuthStore((state) => state.userData);
  const accountDetails = useAuthStore((state) => state.accountDetails);
  const account = accountDetails?.[0];

  const accountName = account?.accountName || userData?.name || "—";
  const bankName = account?.bankName || "—";
  const accountNumber = account?.accountNumber || "—";
  const hasAccount = !!(account?.accountNumber && account?.bankName);

  const email = userData?.email;
  const fullName = userData?.name || "";

  const splitFullName = (name) => {
    if (!name) return { first_name: "", last_name: "" };
    const nameParts = name.trim().split(" ");
    return {
      first_name: nameParts[0] || "jaan",
      last_name: nameParts.slice(1).join(" ") || "jaan",
    };
  };

  const { first_name, last_name } = splitFullName(fullName);
  const { mutate: createWallet, isPending } = useCreateWallet();

  const handleCopy = (value: string, label: string) => {
    Clipboard.setString(value);
    Alert.alert("Copied", `${label} copied to clipboard`);
  };

  const handleGenerateWallet = () => {
    if (!idNumber || idNumber.length < 11) {
      Alert.alert("Validation Error", "Please enter a valid BVN (11 digits)");
      return;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert("Validation Error", "Please enter a valid phone number");
      return;
    }
    if (!agreedToTerms) {
      Alert.alert("Terms Required", "Please agree to the terms and conditions");
      return;
    }
    if (!first_name || !last_name) {
      Alert.alert(
        "Validation Error",
        "Full name is required to create an account",
      );
      return;
    }

    createWallet(
      { email, first_name, last_name, phone: phoneNumber, bvn: idNumber },
      {
        onSuccess: (response) => {
          if (response.data) {
            useAuthStore.getState().setAccountDetails([
              {
                accountName:
                  response.data.accountName || `${first_name} ${last_name}`,
                accountNumber: response.data.accountNumber || "",
                bankName: response.data.bankName || "",
              },
            ]);
          }
          useAuthStore.getState().setIsWalletCreated(true);
          Alert.alert("Success", "Bank account created successfully!");
          setIdNumber("");
          setPhoneNumber("");
          setAgreedToTerms(false);
        },
        onError: (error) => {
          if (error.response?.data) {
            const errorData = error.response.data;
            if (errorData.errors && Array.isArray(errorData.errors)) {
              Alert.alert("Validation Error", errorData.errors.join("\n"));
            } else if (errorData.message) {
              Alert.alert(
                errorData.message.includes("failed")
                  ? "Error"
                  : "Validation Error",
                errorData.message,
              );
            } else {
              Alert.alert(
                "Error",
                error.message || "Failed to create bank account.",
              );
            }
          } else {
            Alert.alert(
              "Error",
              error.message || "Failed to create bank account.",
            );
          }
        },
      },
    );
  };

  // ─── Wallet already exists — show account details ─────────────────────────
  if (hasAccount) {
    return (
      <View style={styles.root}>
        <CommonHeader title="Bank Account" back />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Success Banner */}
            <View style={accountStyles.successBanner}>
              <Ionicons name="checkmark-circle" size={44} color="#22c55e" />
              <Text style={accountStyles.successTitle}>Account Active</Text>
              <Text style={accountStyles.successSubtitle}>
                Your dedicated bank account is ready to receive payments
              </Text>
            </View>

            {/* Account Details Card */}
            <View style={accountStyles.card}>
              <Text style={accountStyles.cardLabel}>Account Details</Text>

              {/* Account Name */}
              <View style={accountStyles.row}>
                <View style={accountStyles.rowLeft}>
                  <View style={accountStyles.iconWrapper}>
                    <MaterialCommunityIcons
                      name="account"
                      size={22}
                      color={COLORS.brand}
                    />
                  </View>
                  <View style={accountStyles.textContainer}>
                    <Text style={accountStyles.rowLabel}>Account Name</Text>
                    <Text style={accountStyles.rowValue}>{accountName}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={accountStyles.copyButton}
                  onPress={() => handleCopy(accountName, "Account name")}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="content-copy"
                    size={20}
                    color={COLORS.brand}
                  />
                </TouchableOpacity>
              </View>

              <View style={accountStyles.divider} />

              {/* Bank Name */}
              <View style={accountStyles.row}>
                <View style={accountStyles.rowLeft}>
                  <View style={accountStyles.iconWrapper}>
                    <MaterialCommunityIcons
                      name="bank"
                      size={22}
                      color={COLORS.brand}
                    />
                  </View>
                  <View style={accountStyles.textContainer}>
                    <Text style={accountStyles.rowLabel}>Bank Name</Text>
                    <Text style={accountStyles.rowValue}>{bankName}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={accountStyles.copyButton}
                  onPress={() => handleCopy(bankName, "Bank name")}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="content-copy"
                    size={20}
                    color={COLORS.brand}
                  />
                </TouchableOpacity>
              </View>

              <View style={accountStyles.divider} />

              {/* Account Number */}
              <View style={accountStyles.row}>
                <View style={accountStyles.rowLeft}>
                  <View style={accountStyles.iconWrapper}>
                    <MaterialCommunityIcons
                      name="credit-card-outline"
                      size={22}
                      color={COLORS.brand}
                    />
                  </View>
                  <View style={accountStyles.textContainer}>
                    <Text style={accountStyles.rowLabel}>Account Number</Text>
                    <Text style={accountStyles.rowValue}>{accountNumber}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={accountStyles.copyButton}
                  onPress={() => handleCopy(accountNumber, "Account number")}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="content-copy"
                    size={20}
                    color={COLORS.brand}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Info note */}
            <View style={accountStyles.infoCard}>
              <MaterialCommunityIcons
                name="information"
                size={20}
                color={COLORS.brand}
              />
              <Text style={accountStyles.infoText}>
                Payments sent to this account will reflect in your Jaan wallet
                balance automatically.
              </Text>
            </View>

            {/* Additional accounts */}
            {accountDetails.length > 1 && (
              <View style={accountStyles.card}>
                <Text style={accountStyles.cardLabel}>Other Accounts</Text>
                {accountDetails.slice(1).map((acc, index) => (
                  <View key={index}>
                    <View style={accountStyles.row}>
                      <View style={accountStyles.rowLeft}>
                        <View style={accountStyles.iconWrapper}>
                          <MaterialCommunityIcons
                            name="bank"
                            size={22}
                            color={COLORS.brand}
                          />
                        </View>
                        <View style={accountStyles.textContainer}>
                          <Text style={accountStyles.rowLabel}>
                            {acc.bankName}
                          </Text>
                          <Text style={accountStyles.rowValue}>
                            {acc.accountNumber}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={accountStyles.copyButton}
                        onPress={() =>
                          handleCopy(acc.accountNumber || "", "Account number")
                        }
                        activeOpacity={0.7}
                      >
                        <MaterialCommunityIcons
                          name="content-copy"
                          size={20}
                          color={COLORS.brand}
                        />
                      </TouchableOpacity>
                    </View>
                    {index < accountDetails.length - 2 && (
                      <View style={accountStyles.divider} />
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  // ─── No wallet yet — show creation form ──────────────────────────────────
  return (
    <View style={styles.root}>
      <CommonHeader title="Generate Bank Account" back />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, styles.toggleButtonActive]}
              disabled={true}
            >
              <Text style={[styles.toggleText, styles.toggleTextActive]}>
                BVN
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Kindly provide your details</Text>
            <Text style={styles.sectionSubtitle}>
              Please enter your BVN and phone number to generate a bank account.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bank Verification Number (BVN)*</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 11-digit BVN"
                placeholderTextColor="#D1D5DB"
                value={idNumber}
                onChangeText={setIdNumber}
                keyboardType="numeric"
                maxLength={11}
                editable={!isPending}
              />
              <Text style={styles.charCount}>{idNumber.length}/11 digits</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number*</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number (e.g., 09036018013)"
                placeholderTextColor="#D1D5DB"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={11}
                editable={!isPending}
              />
              <Text style={styles.charCount}>
                {phoneNumber.length}/11 digits
              </Text>
            </View>
          </View>

          <View style={styles.warningBox}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text style={styles.warningText}>Forgot your BVN?</Text>
            <TouchableOpacity
              style={styles.clickButton}
              onPress={() =>
                Alert.alert(
                  "Need Help?",
                  "Please contact your bank or visit the nearest BVN enrollment center for assistance.",
                )
              }
            >
              <Text style={styles.clickButtonText}>Click here</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => !isPending && setAgreedToTerms(!agreedToTerms)}
            disabled={isPending}
          >
            <View
              style={[styles.checkbox, isPending && styles.checkboxDisabled]}
            >
              {agreedToTerms && (
                <Ionicons name="checkmark" size={16} color="#7C3AED" />
              )}
            </View>
            <Text
              style={[styles.checkboxText, isPending && styles.textDisabled]}
            >
              In line with the latest regulatory requirement from the CBN, we
              will collect your face, name, phone number, home address, and
              birthday or BVN to verify your account. JAAN will not share or
              sell your personal information securely.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.generateButton,
            (!agreedToTerms ||
              !idNumber ||
              idNumber.length < 11 ||
              !phoneNumber ||
              phoneNumber.length < 10 ||
              isPending) &&
              styles.buttonDisabled,
          ]}
          onPress={handleGenerateWallet}
          disabled={
            !agreedToTerms ||
            !idNumber ||
            idNumber.length < 11 ||
            !phoneNumber ||
            phoneNumber.length < 10 ||
            isPending
          }
        >
          <Text style={styles.generateButtonText}>
            {isPending ? "Creating..." : "Generate Bank Account"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const accountStyles = StyleSheet.create({
  successBanner: {
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#dcfce7",
    gap: 8,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#15803d",
  },
  successSubtitle: {
    fontSize: 13,
    color: "#4b5563",
    textAlign: "center",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F0E6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 4,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F0E6FF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 12,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFF9E6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#8B7500",
    lineHeight: 18,
  },
});

export default Wallet;
