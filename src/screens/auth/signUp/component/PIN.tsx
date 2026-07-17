import { View, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import React, { useState, useRef } from "react";
import { styles } from "../style";
import Stepper from "./stepper";
import Btn from "../../../../components/common/btn";
import { COLORS } from "../../../../constants/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCompleteRegistration } from "../../../../api/hooks/useAuth";
import Text from "../../../../components/common/txt";

const SignUpTransactionPin = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { email, password, fullName, phoneNumber, gender, dateOfBirth } =
    route.params;

  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [isPinSet, setIsPinSet] = useState(false);
  const pinInputRefs = useRef<any[]>([]);
  const confirmPinInputRefs = useRef<any[]>([]);

  const { mutate: completeRegistration, isPending } = useCompleteRegistration();

  const handlePinChange = (value: string, index: number, isConfirm = false) => {
    const currentPin = isConfirm ? [...confirmPin] : [...pin];
    currentPin[index] = value;

    if (isConfirm) {
      setConfirmPin(currentPin);
      if (value && index < 3) {
        confirmPinInputRefs.current[index + 1]?.focus();
      }
    } else {
      setPin(currentPin);
      if (value && index < 3) {
        pinInputRefs.current[index + 1]?.focus();
      } else if (value && index === 3) {
        setIsPinSet(true);
        confirmPinInputRefs.current[0]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number, isConfirm = false) => {
    const currentPin = isConfirm ? confirmPin : pin;
    const refs = isConfirm ? confirmPinInputRefs : pinInputRefs;
    if (e.nativeEvent.key === "Backspace" && !currentPin[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleComplete = () => {
    const pinCode = pin.join("");
    const confirmPinCode = confirmPin.join("");

    if (pinCode.length < 4) {
      Alert.alert("Error", "Please enter a 4-digit PIN");
      return;
    }

    if (pinCode !== confirmPinCode) {
      Alert.alert("Error", "PINs do not match");
      setConfirmPin(["", "", "", ""]);
      confirmPinInputRefs.current[0]?.focus();
      return;
    }

    completeRegistration(
      {
        email,
        password,
        fullName,
        gender,
        dateOfBirth,
        phoneNumber,
        transactionPIN: pinCode,
      },
      {
        onSuccess: () => {
          navigation.navigate("Login");
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message ||
            "Registration failed. Please try again.";
          Alert.alert("Error", message);
        },
      }
    );
  };

  return (
    <View style={styles.root}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="chevron-left" size={28} color="#333" />
      </TouchableOpacity>

      {/* Stepper */}
      <Stepper currentStep={4} totalSteps={4} />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../../assets/images/logo2.png")}
            resizeMode="contain"
            style={styles.image}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Create Transaction PIN</Text>
        <Text style={styles.subtitle}>
          Set up a 4-digit PIN to secure your transactions
        </Text>

        {/* PIN Input */}
        <View style={styles.pinSection}>
          <Text style={styles.pinLabel}>Enter PIN*</Text>
          <View style={styles.pinContainer}>
            {pin.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (pinInputRefs.current[index] = ref)}
                style={styles.pinInput}
                value={digit}
                onChangeText={(value) => handlePinChange(value, index, false)}
                onKeyPress={(e) => handleKeyPress(e, index, false)}
                keyboardType="number-pad"
                maxLength={1}
                secureTextEntry
                selectTextOnFocus
              />
            ))}
          </View>
        </View>

        {/* Confirm PIN Input */}
        {isPinSet && (
          <View style={styles.pinSection}>
            <Text style={styles.pinLabel}>Confirm PIN*</Text>
            <View style={styles.pinContainer}>
              {confirmPin.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (confirmPinInputRefs.current[index] = ref)}
                  style={styles.pinInput}
                  value={digit}
                  onChangeText={(value) => handlePinChange(value, index, true)}
                  onKeyPress={(e) => handleKeyPress(e, index, true)}
                  keyboardType="number-pad"
                  maxLength={1}
                  secureTextEntry
                  selectTextOnFocus
                />
              ))}
            </View>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoCard}>
          <MaterialCommunityIcons
            name="information-outline"
            size={20}
            color={COLORS.brand}
          />
          <Text style={styles.infoText}>
            You'll use this PIN to authorize all transactions on your account
          </Text>
        </View>

        {/* Complete Button */}
        <Btn
          title={isPending ? "Creating Account..." : "Complete Registration"}
          style={[styles.continueButton, isPending && { opacity: 0.7 }]}
          textStyle={{ color: COLORS.white }}
          onPress={handleComplete}
          disabled={isPending}
        />
      </View>
    </View>
  );
};

export default SignUpTransactionPin;
