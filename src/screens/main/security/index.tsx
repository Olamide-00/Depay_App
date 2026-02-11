import { View, Text } from "react-native";
import React from "react";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";

const Security = () => {
  return (
    <View style={styles.root}>
      <CommonHeader title="Security" back />
      <View style={styles.container}></View>
    </View>
  );
};

export default Security;
