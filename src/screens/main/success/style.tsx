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
    paddingHorizontal: wp("8%"),
  },
  image: {
    width: wp("50%"),
    height: hp("25%"),
    maxWidth: 280,
    maxHeight: 280,
  },
  descContainer: {
    marginTop: hp("4%"),
    alignItems: "center",
    gap: hp("1%"),
  },
  btnContainer: {
    width: "100%",
    marginTop: hp("10%"),
  },
  btn: {
    backgroundColor: COLORS.white,
    borderWidth: 0,
    width: "100%",
    paddingVertical: hp("2.5%"),
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
});
