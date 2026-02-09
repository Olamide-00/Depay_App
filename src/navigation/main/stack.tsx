import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Airtime from "../../screens/main/airtime";
import Confirmation from "../../screens/main/confirmation";

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
    </Stack.Navigator>
  );
}
