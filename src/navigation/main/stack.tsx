import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Airtime from "../../screens/main/airtime";
import Confirmation from "../../screens/main/confirmation";
import OTP from "../../screens/main/OTP";
import Success from "../../screens/main/success";
import User from "../../screens/main/user";
import EditUser from "../../screens/main/editUser";
import Refer from "../../screens/main/refer";
import Security from "../../screens/main/security";
import ChangePIN1 from "../../screens/main/changePIN1";
import ChangePassword from "../../screens/main/changePassword";
import OTPVerify from "../../screens/main/otpVerify";
import PasswordOTP from "../../screens/main/PasswordOTP";
import ResetPassword from "../../screens/main/resetPassword";
import Wallet from "../../screens/main/bankAccount";
import Legal from "../../screens/main/legal";
import Support from "../../screens/main/support";
import Notification from "../../screens/main/notification";
import Electricity from "../../screens/main/electricity";
import Receipt from "../../screens/main/receipt";
import TV from "../../screens/main/tv";
import Education from "../../screens/main/education";
import ComingSoon from "../../screens/main/comingSoon";
import Jamb from "../../screens/main/jamb";
import Waec from "../../screens/main/waec";

export default function StackNavigation() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="Airtime" component={Airtime} />
      <Stack.Screen
        name="Confirmation"
        component={Confirmation}
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="OTP" component={OTP} />
      <Stack.Screen name="Success" component={Success} />
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="EditUser" component={EditUser} />
      <Stack.Screen name="Refer" component={Refer} />
      <Stack.Screen name="Security" component={Security} />
      <Stack.Screen name="ChangePIN1" component={ChangePIN1} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="OTPVerify" component={OTPVerify} />
      <Stack.Screen name="PasswordOTP" component={PasswordOTP} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Wallet" component={Wallet} />
      <Stack.Screen name="Legal" component={Legal} />
      <Stack.Screen name="Support" component={Support} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Electricity" component={Electricity} />
      <Stack.Screen name="Receipt" component={Receipt} />
      <Stack.Screen name="TV" component={TV} />
      <Stack.Screen name="Education" component={Education} />
      <Stack.Screen name="ComingSoon" component={ComingSoon} />
      <Stack.Screen name="Jamb" component={Jamb} />
      <Stack.Screen name="Waec" component={Waec} />
    </Stack.Navigator>
  );
}
