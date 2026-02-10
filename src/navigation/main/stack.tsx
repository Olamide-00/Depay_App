import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Airtime from "../../screens/main/airtime";
import Confirmation from "../../screens/main/confirmation";
import OTP from "../../screens/main/OTP";
import Success from "../../screens/main/success";
import User from "../../screens/main/user";
import EditUser from "../../screens/main/editUser";
import Refer from "../../screens/main/refer";

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
    </Stack.Navigator>
  );
}
