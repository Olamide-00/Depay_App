import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import React, { useState, useRef } from "react";
import { styles } from "../style";
import Stepper from "./stepper";
import Btn from "../../../../components/common/btn";
import { COLORS } from "../../../../constants/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SignUpOTP = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    // Verify OTP
    navigation.navigate("SignUpPassword");
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
          <Image
            source={require("../../../../../assets/images/logo2.png")}
            resizeMode="contain"
            style={styles.image}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          Enter the verification code sent to your email address{" "}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Resend Code */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't get the code? </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>Resend It</Text>
          </TouchableOpacity>
          <Text style={styles.resendText}> or </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>Go</Text>
          </TouchableOpacity>
        </View>

        {/* Verify Button */}
        <Btn
          title="Verify"
          style={styles.verifyButton}
          textStyle={{ color: COLORS.white }}
          onPress={handleVerify}
        />
      </View>
    </View>
  );
};

export default SignUpOTP;
