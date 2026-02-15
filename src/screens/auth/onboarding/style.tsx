import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../../constants/Colors";

export const styles = StyleSheet.create({
  root: {
    height: hp("70%"),
    marginTop: hp("10%"),
  },
  container: {
    flex: 1,
    paddingHorizontal: wp("5%"),
    paddingTop: hp("6%"),
    paddingBottom: hp("4%"),
  },
  logoContainer: {
    marginBottom: hp("3%"),
    marginTop: hp("-10%"),
  },
  logoContent: {
    alignSelf: "center",
  },
  emoji: {
    fontSize: 20,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.brand,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("2%"),
  },
  slideImage: {
    width: wp("90%"),
    height: hp("45%"),
  },
  contentContainer: {
    position: "absolute",
    bottom: hp("-15%"),
    paddingHorizontal: wp("5%"),
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: hp("2%"),
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: COLORS.brand,
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  inactiveDot: {
    backgroundColor: "#E0E0E0",
  },
  textContainer: {
    marginBottom: hp("3%"),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: hp("1%"),
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipButton: {
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("4%"),
  },
  skipText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  nextButton: {
    backgroundColor: COLORS.brand,
    borderWidth: 0,
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("12%"),
    borderRadius: 12,
  },
  image: {
    width: wp("20%"),
    height: hp("5%"),
  },
});
