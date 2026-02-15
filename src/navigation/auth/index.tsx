import SignUp from "../../screens/auth/signUp";
import Login from "../../screens/auth/login";
import Onboarding from "../../screens/auth/onboarding";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SignUpOTP from "../../screens/auth/signUp/component/otpStep";
import SignUpPassword from "../../screens/auth/signUp/component/passwordStep";
import SignUpDetails from "../../screens/auth/signUp/component/detailsStep";
import SignUpTransactionPin from "../../screens/auth/signUp/component/PIN";

// Define your auth stack param list for TypeScript
export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  OTP: any;
  SignUpPassword: any;
  SignUpDetails: any;
  SignUpTransactionPin: any;
};

// Create the navigator instance
const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="OTP" component={SignUpOTP} />
      <Stack.Screen name="SignUpPassword" component={SignUpPassword} />
      <Stack.Screen name="SignUpDetails" component={SignUpDetails} />
      <Stack.Screen
        name="SignUpTransactionPin"
        component={SignUpTransactionPin}
      />
    </Stack.Navigator>
  );
}
