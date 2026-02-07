import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Btn from "./src/components/common/btn";
import Input from "./src/components/common/input";
import Onboarding from "./src/screens/auth/onboarding";
import SignUp from "./src/screens/auth/signUp";
import Login from "./src/screens/auth/login";
import Home from "./src/screens/main/home";
import RootNavigation from "./src/navigation/root";

export default function App() {
  return <RootNavigation />;
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
