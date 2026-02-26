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
import Input from "../../../components/common/input";
import Btn from "../../../components/common/btn";
import { COLORS } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Spacer from "../../../components/common/spacer";
import useAuthStore from "../../../store/userStore";
import { useLogin } from "../../../api/hooks/useAuth";
import * as SecureStore from "expo-secure-store";

export default function Login() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const { setIsAuthenticated, setAccountDetails } = useAuthStore();
  const { mutate: login, isPending } = useLogin();

  const validate = () => {
    const newErrors = { email: "", password: "" };

    if (!email || !email.includes("@")) {
      newErrors.email = "Enter a valid email";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e !== "");
  };

  const handleLogin = () => {
    if (!validate()) return;

    login(
      { email: email.trim().toLowerCase(), password: password.trim() },
      {
        onSuccess: async (data) => {
          const now = new Date().toISOString();

          await SecureStore.setItemAsync("token", data.token);
          await SecureStore.setItemAsync("loginDate", now);
          await SecureStore.setItemAsync("isFreshLogin", "true");

          const userData = {
            email: data.user.email,
            name: data.user.name,
            phoneNumber: data.user.phoneNumber,
            isWalletCreated: data.user.isWalletCreated,
            balance: data.user.balance,
            profilePicture: data.user.profilePicture,
            tag: data.user.tag,
            dateOfBirth: data.user.dateOfBirth,
            gender: data.user.gender,
          };

          useAuthStore.getState().login(data.token, userData);

          // Save account details so dashboard can read bankName + accountNumber
          setAccountDetails(data.user.accountDetails || []);

          setIsAuthenticated(true);
        },
        onError: (err: any) => {
          const errorMessage =
            err?.response?.data?.message ||
            "An error occurred. Please try again.";

          Alert.alert("Login Failed", errorMessage);

          if (errorMessage.includes("Please verify your account first")) {
            setTimeout(() => {
              navigation.navigate("SignUpOTP", {
                email: email.trim().toLowerCase(),
              });
            }, 1500);
          }
        },
      },
    );
  };

  const disabled = !email || !password || isPending;

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Log in to access your JAAN Account
          </Text>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email*</Text>
              <Input
                placeholder="Olamide@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text.trim().toLowerCase());
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
                width="100%"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password*</Text>
              <Input
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prev) => ({ ...prev, password: "" }));
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
                      color="black"
                    />
                  </TouchableOpacity>
                }
              />
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <Spacer size={5} />

          <Btn
            title={isPending ? "Logging in..." : "Log In"}
            style={[styles.loginButton, disabled && { opacity: 0.7 }]}
            textStyle={{ color: COLORS.white }}
            onPress={handleLogin}
            disabled={disabled}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialContainer}>
            <Text style={styles.socialTitle}>Sign in with</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <MaterialCommunityIcons name="apple" size={28} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                {/* <
                  name="google"
                  size={28}
                  color="#DB4437"
                /> */}
                <Image
                  source={require("../../../../assets/images/google.png")}
                  style={{ width: 28, height: 28 }}
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
          </View>

          <View style={styles.footer}>
            <Text style={styles.signUpText}>
              Don't have an account?{" "}
              <Pressable onPress={() => navigation.navigate("SignUp")}>
                <Text style={styles.signUpLink}>Sign up for free</Text>
              </Pressable>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
