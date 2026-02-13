import { View, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useRef } from "react";
import { styles } from "./style";
import Text from "../../../components/common/txt";
import CommonHeader from "../../../components/ui/commonHeader";
import { useNavigation } from "@react-navigation/native";

const PasswordOTP = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.root}>
      <CommonHeader title="Verify Phone Number" back />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text size="xl" style={styles.title}>
            Enter OTP Below
          </Text>
          <Text style={styles.subtitle}>
            OTP has been sent to your phone number{"\n"}(+234)8********60)
          </Text>
        </View>

        {/* OTP Input Boxes */}
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

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't get the code? </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>Resend It</Text>
          </TouchableOpacity>
        </View>

        {/* Get OTP via Other Methods */}
        <TouchableOpacity>
          <Text style={styles.otherMethodsLink}>Get OTP via Other Methods</Text>
        </TouchableOpacity>

        {/* Verify Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={() =>
              navigation.navigate("StackNav", { screen: "ResetPassword" })
            }
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>

          {/* Switch Verification Method */}
          <TouchableOpacity style={styles.switchButton}>
            <Text style={styles.switchButtonText}>
              Switch Verification Method
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PasswordOTP;
