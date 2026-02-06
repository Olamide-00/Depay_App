import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../../constants/Colors";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.brand,
    paddingHorizontal: wp(5),
  },
  logo: {
    width: wp("30%"),
    height: hp("20%"),
    alignSelf: "center",
  },
  desc: {
    alignSelf: "center",
    marginTop: hp("-2%"),
  },
  inputs: {
    gap: hp("3%"),
    marginTop: hp("4%"),
  },
  footer: {
    marginTop: hp("8%"),
    alignSelf: "center",
    width: "100%",
  },
});
