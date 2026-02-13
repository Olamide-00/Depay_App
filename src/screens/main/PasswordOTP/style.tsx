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
    flex: 1,
    paddingHorizontal: wp("5%"),
    paddingTop: hp("2%"),
  },
  header: {
    marginBottom: hp("3%"),
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: hp("1%"),
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("3%"),
    gap: wp("2%"),
  },
  otpInput: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#1F2937",
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("1.5%"),
  },
  resendText: {
    fontSize: 14,
    color: "#6B7280",
  },
  resendLink: {
    fontSize: 14,
    color: "#7C3AED",
    fontWeight: "500",
  },
  otherMethodsLink: {
    fontSize: 14,
    color: "#7C3AED",
    fontWeight: "500",
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: hp("3%"),
    left: wp("5%"),
    right: wp("5%"),
    gap: hp("1.5%"),
  },
  verifyButton: {
    backgroundColor: "#C4B5FD",
    borderRadius: 12,
    paddingVertical: hp("2%"),
    alignItems: "center",
    justifyContent: "center",
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  switchButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: hp("2%"),
    alignItems: "center",
    justifyContent: "center",
  },
  switchButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#7C3AED",
  },
});
