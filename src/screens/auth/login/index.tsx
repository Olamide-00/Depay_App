// src/screens/auth/Login/Login.tsx
import {
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { useGoogleSignIn } from "../../../hooks/useGoogleSignIn";
import Text from "../../../components/common/txt";

const BASE_URL = "https://jaa.up.railway.app/api/v1";

export default function Login() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [googleLoading, setGoogleLoading] = useState(false);

  const { setIsAuthenticated, setAccountDetails } = useAuthStore();
  const { mutate: login, isPending } = useLogin();
  const { configureGoogleSignIn, signIn } = useGoogleSignIn(); // Using the new hook

  // Configure Google Sign-In on component mount
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  // ─── Google login handler ─────────────────────────────────

  // ─── Handle Google Sign-In button press ───────────────────
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      console.log("Starting Google Sign-In...");

      const result = await signIn();

      if (result.type === "success" && result.user?.data?.user) {
        const { idToken } = result.user.data;
        const googleUser = result.user.data.user;

        console.log("Google user:", googleUser.email);
        await processGoogleLogin(idToken, googleUser);
      } else {
        console.error("Sign-in failed or invalid data:", result);
        setGoogleLoading(false);
        Alert.alert(
          "Sign-In Failed",
          result.type === "error"
            ? "Google Sign-In failed. Please try again."
            : "Invalid response from Google",
        );
      }
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      setGoogleLoading(false);
      Alert.alert("Error", "Failed to sign in with Google. Please try again.");
    }
  };

  // ─── Process Google login with your backend ───────────────
  const processGoogleLogin = async (idToken: string, googleUser: any) => {
    try {
      console.log("Sending to backend:", {
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.id,
        profilePicture: googleUser.photo,
      });

      const { data } = await axios.post(`${BASE_URL}/user/auth/google-login`, {
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.id,
        profilePicture: googleUser.photo,
      });

      console.log("Backend response received");

      // Store token and user data
      const now = new Date().toISOString();
      await SecureStore.setItemAsync("token", data.token);
      await SecureStore.setItemAsync("loginDate", now);
      await SecureStore.setItemAsync("isFreshLogin", "true");

      // Update auth store
      useAuthStore.getState().login(data.token, {
        email: data.user.email,
        name: data.user.name,
        phoneNumber: data.user.phoneNumber,
        isWalletCreated: data.user.isWalletCreated,
        balance: data.user.balance,
        profilePicture: data.user.profilePicture,
        tag: data.user.tag,
        dateOfBirth: data.user.dateOfBirth,
        gender: data.user.gender,
      });

      setAccountDetails(data.user.accountDetails || []);
      setIsAuthenticated(true);
      Alert.alert("Success", "Logged in successfully with Google!");
    } catch (err: any) {
      console.error("Google login error:", err?.response?.data || err);

      // Handle specific error cases
      if (err?.response?.status === 404) {
        Alert.alert(
          "No Account Found",
          "No Jaan account found with this Google email. Please sign up first.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Up", onPress: () => navigation.navigate("SignUp") },
          ],
        );
      } else if (err?.response?.status === 403) {
        Alert.alert(
          "Account Not Verified",
          "Please verify your email before logging in.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Verify Now",
              onPress: () =>
                navigation.navigate("SignUpOTP", {
                  email: googleUser?.email,
                }),
            },
          ],
        );
      } else {
        Alert.alert(
          "Login Failed",
          err?.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // ─── Email/password validation ────────────────────────────
  const validate = () => {
    const newErrors = { email: "", password: "" };
    if (!email || !email.includes("@")) newErrors.email = "Enter a valid email";
    if (!password || password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e !== "");
  };

  // ─── Email/password login ─────────────────────────────────
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

          useAuthStore.getState().login(data.token, {
            email: data.user.email,
            name: data.user.name,
            phoneNumber: data.user.phoneNumber,
            isWalletCreated: data.user.isWalletCreated,
            balance: data.user.balance,
            profilePicture: data.user.profilePicture,
            tag: data.user.tag,
            dateOfBirth: data.user.dateOfBirth,
            gender: data.user.gender,
          });

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

  const isFormDisabled = !email || !password || isPending;
  const isLoading = isPending || googleLoading;

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../../assets/images/logo2.png")}
              resizeMode="contain"
              style={styles.image}
            />
          </View>

          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Log in to access your JAAN Account
          </Text>

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
                editable={!isLoading}
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
                editable={!isLoading}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
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
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <Spacer size={5} />

          <Btn
            title={isPending ? "Logging in..." : "Log In"}
            style={[styles.loginButton, isFormDisabled && { opacity: 0.7 }]}
            textStyle={{ color: COLORS.white }}
            onPress={handleLogin}
            disabled={isFormDisabled || isLoading}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          {/* Social login buttons */}
          <View style={styles.socialContainer}>
            <Text style={styles.socialTitle}>Continue with</Text>

            {isLoading ? (
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={{ marginVertical: 20 }}
              />
            ) : (
              <View style={styles.socialButtons}>
                {/* Apple */}
                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.7}
                  onPress={() =>
                    Alert.alert("Coming Soon", "Apple login coming soon.")
                  }
                  disabled={isLoading}
                >
                  <MaterialCommunityIcons name="apple" size={28} color="#000" />
                </TouchableOpacity>

                {/* Google */}
                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    googleLoading && { opacity: 0.5 },
                  ]}
                  activeOpacity={0.7}
                  onPress={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  {googleLoading ? (
                    <ActivityIndicator size="small" color="#DB4437" />
                  ) : (
                    <MaterialCommunityIcons
                      name="google"
                      size={28}
                      color="#DB4437"
                    />
                  )}
                </TouchableOpacity>

                {/* Facebook */}
                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.7}
                  onPress={() =>
                    Alert.alert("Coming Soon", "Facebook login coming soon.")
                  }
                  disabled={isLoading}
                >
                  <MaterialCommunityIcons
                    name="facebook"
                    size={28}
                    color="#1877F2"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.signUpText}>
              Don't have an account?{" "}
              <Pressable
                onPress={() => navigation.navigate("SignUp")}
                disabled={isLoading}
              >
                <Text style={styles.signUpLink}>Sign up for free</Text>
              </Pressable>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
