import { View, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import React, { useState, useRef } from "react";
import { styles } from "../style";
import Stepper from "../component/stepper";
import Btn from "../../../../components/common/btn";
import { COLORS } from "../../../../constants/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useVerifyOtp, useResendOtp } from "../../../../api/hooks/useAuth";
import Text from "../../../../components/common/txt";

const SignUpOTP = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { email } = route.params;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<any[]>([]);

  const { mutate: verifyOTP, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resendOTP, isPending: isResending } = useResendOtp();

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Go back to previous input on backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      Alert.alert("Error", "Please enter the complete 6-digit code");
      return;
    }

    verifyOTP(
      { email, otp: otpCode },
      {
        onSuccess: () => {
          navigation.navigate("SignUpPassword", { email });
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "Invalid OTP. Please try again.";
          Alert.alert("Error", message);
          // Clear OTP inputs on failure
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        },
      },
    );
  };

  const handleResend = () => {
    resendOTP(
      { email },
      {
        onSuccess: () => {
          Alert.alert("Success", "A new code has been sent to your email.");
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message ||
            "Failed to resend OTP. Please try again.";
          Alert.alert("Error", message);
        },
      },
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
      <Stepper currentStep={1} totalSteps={4} />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          {/* <Image
            source={require("../../../../assets/images/logo2.png")}
            resizeMode="contain"
            style={styles.image}
          /> */}
        </View>

        {/* Title */}
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          Enter the verification code sent to your email address{" "}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        {/* OTP Input — 6 digits to match backend */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Resend Code */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't get the code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={isResending}>
            <Text style={[styles.resendLink, isResending && { opacity: 0.5 }]}>
              {isResending ? "Sending..." : "Resend It"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Verify Button */}
        <Btn
          title={isVerifying ? "Verifying..." : "Verify"}
          style={[styles.verifyButton, isVerifying && { opacity: 0.7 }]}
          textStyle={{ color: COLORS.white }}
          onPress={handleVerify}
          disabled={isVerifying}
        />
      </View>
    </View>
  );
};

export default SignUpOTP;
