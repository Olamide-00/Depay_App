import { View, Text } from "react-native";
import React from "react";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";
import Spacer from "../../../components/common/spacer";
import Item from "../../../components/common/item";
import Btn from "../../../components/common/btn";
import { COLORS } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";

const Confirmation = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.root}>
      <CommonHeader title="Confirm Transaction" back />
      <View style={styles.container}>
        <Spacer size={5} horizontal />
        <View style={styles.itemContainer}>
          <Item label="Amount" value="1,000.00" />
          <Item label="Phone Number" value="09036018013" />
          <Item label="Mobile Network" value="MTN" />
        </View>
        <Btn
          title="Continue"
          style={styles.btn}
          textStyle={{ color: COLORS.white }}
          onPress={() => navigation.navigate("OTP")}
        />
      </View>
    </View>
  );
};

export default Confirmation;
