import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Btn from "./src/components/common/btn";
import Input from "./src/components/common/input";
import Onboarding from "./src/screens/auth/onboarding";

export default function App() {
  return <Onboarding />;
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
