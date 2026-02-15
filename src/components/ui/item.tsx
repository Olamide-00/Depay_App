import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import Text from "../common/txt";
import { Bus } from "iconsax-react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";

const Item = ({ data }: any) => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.navigate("StackNav", { screen: "Receipt" })}
      style={styles.container}
    >
      <View style={styles.row1}>
        <View style={styles.iconContainer}>
          <Bus size={24} color={COLORS.brand} />
        </View>
        <View style={styles.innerRow}>
          <Text variant="semibold" size="md" color="#1A1A1A">
            {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
          </Text>
          <Text
            variant="regular"
            size="sm"
            color="#666"
            style={styles.timeText}
          >
            {data.time}
          </Text>
        </View>
      </View>
      <Text variant="bold" size="md" color="#1A1A1A" style={styles.amountText}>
        {data.amount}
      </Text>
    </Pressable>
  );
};

export default Item;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("2%"),
    marginVertical: hp("0.3%"),
    borderRadius: wp("3%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  row1: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("3%"),
    flex: 1,
  },
  iconContainer: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    // backgroundColor: `${COLORS.brand}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  innerRow: {
    flex: 1,
    gap: hp("0.3%"),
  },
  timeText: {
    opacity: 0.8,
  },
  amountText: {
    marginLeft: wp("2%"),
  },
});
