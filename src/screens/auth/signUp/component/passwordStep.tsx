import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import { styles } from "../style";
import Stepper from "./stepper";
import Input from "../../../../components/common/input";
import Btn from "../../../../components/common/btn";
import { COLORS } from "../../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SignUpPassword = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const passwordRequirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "At least 1 uppercase letter", met: /[A-Z]/.test(password) },
    { text: "At least 1 lowercase letter", met: /[a-z]/.test(password) },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);

  const handleContinue = () => {
    setError("");

    // Validate password requirements
    if (!allRequirementsMet) {
      setError("Please meet all password requirements");
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    // Navigate to next step
    navigation.navigate("SignUpDetails");
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
      <Stepper currentStep={2} totalSteps={4} />

      <ScrollView showsVerticalScrollIndicator={false}>
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
          <Text style={styles.title}>Create Password</Text>
          <Text style={styles.subtitle}>
            Create a strong password to secure your account
          </Text>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={16}
                color="#FF6B6B"
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password*</Text>
            <Input
              placeholder="Enter Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError("");
              }}
              width="100%"
              secureTextEntry={!showPassword}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              }
            />

            {/* Password Requirements */}
            <View style={styles.requirementsContainer}>
              {passwordRequirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <MaterialCommunityIcons
                    name={req.met ? "check-circle" : "circle-outline"}
                    size={16}
                    color={req.met ? COLORS.brand : "#999"}
                  />
                  <Text
                    style={[
                      styles.requirementText,
                      req.met && styles.requirementMet,
                    ]}
                  >
                    {req.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password*</Text>
            <Input
              placeholder="Re-Enter Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setError("");
              }}
              width="100%"
              secureTextEntry={!showConfirmPassword}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <MaterialCommunityIcons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              }
            />
          </View>

          {/* Create Password Button */}
          <Btn
            title="Create Password"
            style={[
              styles.continueButton,
              (!allRequirementsMet || !confirmPassword) &&
                styles.disabledButton,
            ]}
            textStyle={{ color: COLORS.white }}
            onPress={handleContinue}
            disabled={!allRequirementsMet || !confirmPassword}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUpPassword;
