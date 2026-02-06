// style.ts
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
    paddingTop: hp("5%"),
    paddingHorizontal: wp("5%"),
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp("6%"),
  },
  logo: {
    width: wp("60%"),
    height: 50,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("10%"),
  },
  iconContainer: {
    marginBottom: hp("5%"),
  },
  title: {
    marginTop: hp("5%"),
    paddingHorizontal: wp("10%"),
    textAlign: "center",
    lineHeight: 28,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("10%"),
    gap: wp("3%"),
    backgroundColor: COLORS.input,
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("0.5%"),
    borderRadius: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    color: COLORS.gray,
  },
  activeDot: {
    backgroundColor: COLORS.yellow,
    width: 12,
    height: 12,
  },
  inactiveDot: {
    backgroundColor: COLORS.white,
    opacity: 0.5,
  },
  btnContainer: {
    marginBottom: hp("5%"),
    alignItems: "center",
  },
  btn: {
    width: wp("50%"),
  },
});
