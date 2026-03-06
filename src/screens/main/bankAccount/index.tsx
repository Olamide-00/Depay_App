import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Clipboard,
  StyleSheet,
  ActivityIndicator,
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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Wallet = () => {
  const navigation = useNavigation();
  const [bvn, setBvn] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [bvnFocused, setBvnFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  const userData = useAuthStore((state) => state.userData);
  const accountDetails = useAuthStore((state) => state.accountDetails);
  const account = accountDetails?.[0];

  const accountName = account?.accountName || userData?.name || "—";
  const bankName = account?.bankName || "—";
  const accountNumber = account?.accountNumber || "—";
  const hasAccount = !!(account?.accountNumber && account?.bankName);

  const email = userData?.email || "";
  const fullName = userData?.name || "";

  const splitFullName = (name: string) => {
    if (!name) return { first_name: "", last_name: "" };
    const parts = name.trim().split(" ");
    return {
      first_name: parts[0] || "",
      last_name: parts.slice(1).join(" ") || parts[0] || "",
    };
  };

  const { first_name, last_name } = splitFullName(fullName);
  const { mutate: createWallet, isPending } = useCreateWallet();

  const isFormValid =
    agreedToTerms &&
    bvn.length === 11 &&
    phoneNumber.length >= 10 &&
    !isPending;

  const handleCopy = (value: string, label: string) => {
    Clipboard.setString(value);
    Alert.alert("Copied", `${label} copied to clipboard`);
  };

  const handleGenerateWallet = () => {
    if (bvn.length < 11) {
      Alert.alert("Validation Error", "Please enter a valid BVN (11 digits)");
      return;
    }
    if (phoneNumber.length < 10) {
      Alert.alert("Validation Error", "Please enter a valid phone number");
      return;
    }
    if (!agreedToTerms) {
      Alert.alert("Terms Required", "Please agree to the terms and conditions");
      return;
    }

    // ✅ Correct payload — matches backend validateCreateAccountRequest exactly
    const payload = {
      email,
      first_name,
      last_name,
      phone: phoneNumber,
      bvn,
    };

    console.log("Creating wallet with:", payload);

    createWallet(payload, {
      onSuccess: (response) => {
        console.log("Wallet response:", JSON.stringify(response));

        const data = response?.data;

        if (data?.accountNumber) {
          useAuthStore.getState().setAccountDetails([
            {
              accountName: data.accountName || fullName,
              accountNumber: data.accountNumber,
              bankName: data.bankName || "",
            },
          ]);
          useAuthStore.getState().setIsWalletCreated(true);
          Alert.alert(
            "Success! 🎉",
            "Your bank account has been created successfully.",
          );
        } else {
          // 202 pending case — account creation started but not done yet
          useAuthStore.getState().setIsWalletCreated(true);
          Alert.alert(
            "Almost there!",
            "Your account is being set up. Check back in a moment — it should be ready shortly.",
          );
        }

        setBvn("");
        setPhoneNumber("");
        setAgreedToTerms(false);
      },
      onError: (error: any) => {
        console.log(
          "Wallet error:",
          JSON.stringify(error?.response?.data || error?.message),
        );
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create bank account. Please try again.";
        Alert.alert("Error", message);
      },
    });
  };

  // ─── Wallet exists — show account details ─────────────────────────────────
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
            <View style={accountStyles.successBanner}>
              <Ionicons name="checkmark-circle" size={44} color="#22c55e" />
              <Text style={accountStyles.successTitle}>Account Active</Text>
              <Text style={accountStyles.successSubtitle}>
                Your dedicated bank account is ready to receive payments
              </Text>
            </View>

            <View style={accountStyles.card}>
              <Text style={accountStyles.cardLabel}>Account Details</Text>

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
          </View>
        </ScrollView>
      </View>
    );
  }

  // ─── Loading overlay — shown while Paystack is processing (can take 30-60s) ──
  if (isPending) {
    return (
      <View style={styles.root}>
        <CommonHeader title="Generate Bank Account" back />
        <View style={formStyles.loadingContainer}>
          <View style={formStyles.loadingCard}>
            <ActivityIndicator size="large" color={COLORS.brand} />
            <Text style={formStyles.loadingTitle}>Creating Your Account</Text>
            <Text style={formStyles.loadingSubtitle}>
              We're setting up your dedicated bank account.{"\n"}
              This can take up to 30 seconds, please wait...
            </Text>
            <View style={formStyles.loadingSteps}>
              {[
                "Verifying your BVN",
                "Setting up account",
                "Linking to wallet",
              ].map((step, i) => (
                <View key={step} style={formStyles.loadingStep}>
                  <View style={formStyles.loadingDot} />
                  <Text style={formStyles.loadingStepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  }

  // ─── Creation form ─────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <CommonHeader title="Generate Bank Account" back />

      <View style={formStyles.container}>
        {/* Hero */}
        <View style={formStyles.hero}>
          <View style={formStyles.heroIconRing}>
            <View style={formStyles.heroIconInner}>
              <MaterialCommunityIcons
                name="bank-plus"
                size={28}
                color={COLORS.brand}
              />
            </View>
          </View>
          <Text style={formStyles.heroTitle}>Create Your Account</Text>
          <Text style={formStyles.heroSubtitle}>
            Get a dedicated Nigerian bank account to fund your wallet
          </Text>
        </View>

        {/* Form Card */}
        <View style={formStyles.card}>
          {/* BVN */}
          <View style={formStyles.fieldGroup}>
            <View style={formStyles.fieldLabelRow}>
              <MaterialCommunityIcons
                name="shield-account-outline"
                size={15}
                color={COLORS.brand}
              />
              <Text style={formStyles.fieldLabel}>
                Bank Verification Number (BVN)
              </Text>
            </View>
            <View
              style={[
                formStyles.inputWrapper,
                bvnFocused && formStyles.inputWrapperFocused,
                bvn.length === 11 && formStyles.inputWrapperDone,
              ]}
            >
              <TextInput
                style={formStyles.input}
                placeholder="Enter your 11-digit BVN"
                placeholderTextColor="#C4C4C4"
                value={bvn}
                onChangeText={setBvn}
                keyboardType="numeric"
                maxLength={11}
                onFocus={() => setBvnFocused(true)}
                onBlur={() => setBvnFocused(false)}
              />
              <View style={formStyles.inputRight}>
                {bvn.length === 11 ? (
                  <View style={formStyles.checkBadge}>
                    <Ionicons name="checkmark" size={13} color="#fff" />
                  </View>
                ) : (
                  <Text style={formStyles.charCount}>{bvn.length}/11</Text>
                )}
              </View>
            </View>
            <Text style={formStyles.fieldHint}>
              Dial *565*0# on your registered number to get your BVN
            </Text>
          </View>

          {/* Phone */}
          <View style={formStyles.fieldGroup}>
            <View style={formStyles.fieldLabelRow}>
              <MaterialCommunityIcons
                name="phone-outline"
                size={15}
                color={COLORS.brand}
              />
              <Text style={formStyles.fieldLabel}>Phone Number</Text>
            </View>
            <View
              style={[
                formStyles.inputWrapper,
                phoneFocused && formStyles.inputWrapperFocused,
                phoneNumber.length >= 10 && formStyles.inputWrapperDone,
              ]}
            >
              <TextInput
                style={formStyles.input}
                placeholder="e.g. 09036018013"
                placeholderTextColor="#C4C4C4"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={11}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
              />
              <View style={formStyles.inputRight}>
                {phoneNumber.length >= 10 ? (
                  <View style={formStyles.checkBadge}>
                    <Ionicons name="checkmark" size={13} color="#fff" />
                  </View>
                ) : (
                  <Text style={formStyles.charCount}>
                    {phoneNumber.length}/11
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Forgot BVN */}
          <TouchableOpacity
            style={formStyles.forgotBvn}
            onPress={() =>
              Alert.alert(
                "Need Help?",
                "Dial *565*0# on your registered number or contact your bank for assistance.",
              )
            }
          >
            <Ionicons
              name="help-circle-outline"
              size={14}
              color={COLORS.brand}
            />
            <Text style={formStyles.forgotBvnText}>Forgot your BVN?</Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <TouchableOpacity
          style={formStyles.termsRow}
          onPress={() => setAgreedToTerms(!agreedToTerms)}
          activeOpacity={0.7}
        >
          <View
            style={[
              formStyles.checkbox,
              agreedToTerms && formStyles.checkboxChecked,
            ]}
          >
            {agreedToTerms && (
              <Ionicons name="checkmark" size={13} color="#fff" />
            )}
          </View>
          <Text style={formStyles.termsText}>
            I consent to the collection of my BVN, phone number, and personal
            details in line with CBN requirements. Jaan will never share or sell
            my information.
          </Text>
        </TouchableOpacity>

        {/* Security badges */}
        <View style={formStyles.badgesRow}>
          {[
            { icon: "shield-check", label: "Encrypted" },
            { icon: "bank-outline", label: "CBN Compliant" },
            { icon: "lock", label: "Protected" },
          ].map((badge) => (
            <View key={badge.label} style={formStyles.badge}>
              <MaterialCommunityIcons
                name={badge.icon as any}
                size={13}
                color={COLORS.brand}
              />
              <Text style={formStyles.badgeText}>{badge.label}</Text>
            </View>
          ))}
        </View>

        {/* Button */}
        <View style={formStyles.buttonContainer}>
          <TouchableOpacity
            style={[
              formStyles.generateButton,
              !isFormValid && formStyles.generateButtonDisabled,
            ]}
            onPress={handleGenerateWallet}
            disabled={!isFormValid}
            activeOpacity={0.85}
          >
            <View style={formStyles.buttonContent}>
              <MaterialCommunityIcons name="bank-plus" size={20} color="#fff" />
              <Text style={formStyles.generateButtonText}>
                Generate Bank Account
              </Text>
            </View>
          </TouchableOpacity>
        </View>
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
  successTitle: { fontSize: 18, fontWeight: "700", color: "#15803d" },
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
  rowLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F0E6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  rowLabel: { fontSize: 13, color: "#999", marginBottom: 4 },
  rowValue: { fontSize: 16, fontWeight: "600", color: "#333" },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F0E6FF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 12 },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFF9E6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  infoText: { flex: 1, fontSize: 13, color: "#8B7500", lineHeight: 18 },
});

const formStyles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: wp("4%"), paddingTop: hp("1%") },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("8%"),
  },
  loadingCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    gap: 12,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a2e",
    textAlign: "center",
  },
  loadingSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
  loadingSteps: { width: "100%", gap: 10, marginTop: 8 },
  loadingStep: { flexDirection: "row", alignItems: "center", gap: 10 },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.brand,
    opacity: 0.6,
  },
  loadingStepText: { fontSize: 13, color: "#4b5563" },

  // Form
  hero: { alignItems: "center", paddingVertical: hp("2%") },
  heroIconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.brand}12`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("1.5%"),
    borderWidth: 1.5,
    borderColor: `${COLORS.brand}25`,
  },
  heroIconInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${COLORS.brand}18`,
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 6,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: wp("5%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: hp("2%"),
    gap: hp("1.5%"),
  },
  fieldGroup: { gap: 7 },
  fieldLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: "#374151" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    paddingHorizontal: 14,
    height: 52,
  },
  inputWrapperFocused: {
    borderColor: COLORS.brand,
    backgroundColor: `${COLORS.brand}05`,
  },
  inputWrapperDone: { borderColor: "#22c55e", backgroundColor: "#f0fdf4" },
  input: { flex: 1, fontSize: 15, color: "#1f2937", fontWeight: "500" },
  inputRight: { marginLeft: 8 },
  charCount: { fontSize: 12, color: "#9ca3af", fontWeight: "500" },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
  },
  fieldHint: { fontSize: 11, color: "#9ca3af", lineHeight: 16 },
  forgotBvn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
  },
  forgotBvnText: { fontSize: 13, color: COLORS.brand, fontWeight: "500" },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: hp("2%"),
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  termsText: { fontSize: 12, color: "#6b7280", lineHeight: 18, flex: 1 },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: wp("3%"),
    marginBottom: hp("2%"),
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${COLORS.brand}08`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${COLORS.brand}18`,
  },
  badgeText: { fontSize: 10, color: COLORS.brand, fontWeight: "600" },
  buttonContainer: { paddingBottom: hp("2%") },
  generateButton: {
    backgroundColor: COLORS.brand,
    borderRadius: 14,
    paddingVertical: hp("2%"),
    alignItems: "center",
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  generateButtonDisabled: {
    backgroundColor: "#d1d5db",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonContent: { flexDirection: "row", alignItems: "center", gap: 8 },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default Wallet;
