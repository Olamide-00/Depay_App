import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import Stepper from "./component/stepper";
import Input from "../../../components/common/input";
import Btn from "../../../components/common/btn";
import { COLORS } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Spacer from "../../../components/common/spacer";
import { useSendRegistrationOTP } from "../../../api/hooks/useAuth";

const SignUp = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");

  const { mutate: sendOTP, isPending } = useSendRegistrationOTP();

  const handleContinue = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    sendOTP(
      { email: email.trim().toLowerCase() },
      {
        onSuccess: () => {
          navigation.navigate("SignUpOTP", {
            email: email.trim().toLowerCase(),
          });
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message ||
            "Failed to send OTP. Please try again.";
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
      <Stepper currentStep={0} totalSteps={4} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Content */}
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../../assets/images/logo2.png")}
              resizeMode="contain"
              style={styles.image}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Unlock Seamless Digital Living</Text>
          <Text style={styles.subtitle}>
            With JAAN it just 1 tap to access your digital needs
          </Text>
          <Spacer size={1.5} />

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
          <Spacer size={4} />

          {/* Privacy Policy */}
          <Text style={styles.privacyText}>
            By tapping continue, you agree to our{" "}
            <Text style={styles.privacyLink}>privacy policy</Text> and{" "}
            <Text style={styles.privacyLink}>terms of use</Text>
          </Text>

          {/* Continue Button */}
          <Btn
            title={isPending ? "Sending..." : "Continue"}
            style={[styles.continueButton, isPending && { opacity: 0.7 }]}
            textStyle={{ color: COLORS.white }}
            onPress={handleContinue}
            disabled={isPending}
          />

          {/* Sign In Link */}
          <Text style={styles.signInText}>
            Already have an account?{" "}
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={styles.signInLink}>Log In</Text>
            </Pressable>
          </Text>

          {/* Divider */}
          {/* <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View> */}

          {/* Social Login */}
          {/* <View style={styles.socialContainer}>
            <Text style={styles.socialTitle}>Log in with</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <MaterialCommunityIcons name="apple" size={28} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <MaterialCommunityIcons
                  name="google"
                  size={28}
                  color="#DB4437"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <MaterialCommunityIcons
                  name="facebook"
                  size={28}
                  color="#1877F2"
                />
              </TouchableOpacity>
            </View>
          </View> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;
