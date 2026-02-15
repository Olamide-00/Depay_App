import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { styles } from "../style";
import Stepper from "./stepper";
import Input from "../../../../components/common/input";
import Btn from "../../../../components/common/btn";
import { COLORS } from "../../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SignUpEmail = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const handleContinue = () => {
    // Validate email and proceed
    navigation.navigate("SignUpOTP", { email });
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
      <Stepper currentStep={0} totalSteps={4} />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          {/* <Text style={styles.emoji}>👋</Text>
          <Text style={styles.logoText}>JAAN</Text> */}
        </View>

        {/* Title */}
        <Text style={styles.title}>Unlock Seamless Digital Living</Text>
        <Text style={styles.subtitle}>
          With JAAN it just 1 tap to access your digital needs
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address*</Text>
          <Input
            placeholder="Enter Your Email"
            value={email}
            onChangeText={setEmail}
            width="100%"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.hint}>
            We'll send you a code. It helps to keep your account secure.
          </Text>
        </View>

        {/* Privacy Policy */}
        <Text style={styles.privacyText}>
          By tapping continue, you agree to our{" "}
          <Text style={styles.privacyLink}>privacy policy</Text> and{" "}
          <Text style={styles.privacyLink}>terms of use</Text>
        </Text>

        {/* Continue Button */}
        <Btn
          title="Continue"
          style={styles.continueButton}
          textStyle={{ color: COLORS.white }}
          onPress={handleContinue}
        />

        {/* Sign In Link */}
        <Text style={styles.signInText}>
          Already have an account?{" "}
          <Text
            style={styles.signInLink}
            onPress={() => navigation.navigate("Login")}
          >
            Log In
          </Text>
        </Text>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* Social Login */}
        <View style={styles.socialContainer}>
          <Text style={styles.socialTitle}>Log in with</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <MaterialCommunityIcons name="apple" size={28} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <MaterialCommunityIcons name="google" size={28} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <MaterialCommunityIcons
                name="facebook"
                size={28}
                color="#1877F2"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignUpEmail;
