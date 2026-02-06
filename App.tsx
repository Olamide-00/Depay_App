import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Btn from "./src/components/common/btn";
import Input from "./src/components/common/input";
import Onboarding from "./src/screens/auth/onboarding";
import SignUp from "./src/screens/auth/signUp";
import Login from "./src/screens/auth/login";

export default function App() {
  return <Login />;
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
