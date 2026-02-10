import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../../constants/Colors";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    paddingHorizontal: wp("5%"),
  },
  itemContainer: {
    gap: hp("2%"),
    marginTop: hp("3%"),
  },
  btn: {
    backgroundColor: COLORS.brand,
    borderWidth: 0,
    paddingVertical: hp("2%"),
    marginTop: hp("10%"),
  },
});
