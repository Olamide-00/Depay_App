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
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: wp("80%"),
    height: hp("30%"),
    maxWidth: 300,
    maxHeight: 300,
    zIndex: 10,
  },
  descContainer: {
    marginTop: hp("8%"),
    alignItems: "center",
    gap: hp("1%"),
  },
  desc: {
    gap: hp("1%"),
    alignItems: "center",
  },
  btn: {
    backgroundColor: COLORS.white,
    borderWidth: 0,
    width: "100%",
    paddingVertical: hp("2.5%"),
    marginTop: hp("10%"),
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  // Confetti styles
  confetti: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 5,
  },
});
