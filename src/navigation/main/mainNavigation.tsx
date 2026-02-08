import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StackNavigation from "./stack";
import TabNavigation from ".";

export default function MainNavigation() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="StackNav"
    >
      <Stack.Screen name="TabNav" component={TabNavigation} />
      <Stack.Screen name="StackNav" component={StackNavigation} />
    </Stack.Navigator>
  );
}
