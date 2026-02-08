import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Airtime from "../../screens/main/airtime";

export default function StackNavigation() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Airtime" component={Airtime} />
    </Stack.Navigator>
  );
}
