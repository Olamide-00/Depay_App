import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import Input from "../../../components/common/input";
import Btn from "../../../components/common/btn";
import { COLORS } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Spacer from "../../../components/common/spacer";

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    navigation.navigate("Main", { screen: "Home" });
  };

  return (
    <View style={styles.root}>
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
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Log in to access your JAAN Account
          </Text>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email*</Text>
              <Input
                placeholder="Olamide@email.com"
                value={email}
                onChangeText={setEmail}
                width="100%"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password*</Text>
              <Input
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
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
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <Spacer size={5} />
          {/* Login Button */}
          <Btn
            title="Log In"
            style={styles.loginButton}
            textStyle={{ color: COLORS.white }}
            onPress={handleLogin}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <Text style={styles.socialTitle}>Sign in with</Text>
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
          </View>

          {/* Sign Up Link */}
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
