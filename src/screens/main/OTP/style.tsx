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
    marginTop: hp("2%"),
    paddingHorizontal: wp("4%"),
  },
  desc: {
    gap: 5,
  },
  dotContainer: {
    flexDirection: "row",
    gap: 10,
    alignSelf: "center",
    marginTop: hp("4%"),
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.gray,
  },
  keypadContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: hp("4%"),
  },
});
