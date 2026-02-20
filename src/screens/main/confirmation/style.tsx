import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../../constants/Colors";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  container: {
    paddingHorizontal: wp("5%"),
  },
  iconSection: {
    alignItems: "center",
    paddingVertical: hp("2%"),
    marginTop: hp("-4%")
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 45,
    backgroundColor: "#F0E6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  reviewText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: hp("0.5%"),
  },
  reviewSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: wp("5%"),
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: wp("5%"),
    borderWidth: 2,
    borderColor: "#F0E6FF",
  },
  amountSection: {
    backgroundColor: "#F0E6FF",
    padding: wp("4%"),
    borderRadius: 12,
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  amountLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.brand,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: hp("2%"),
  },
  itemContainer: {
    gap: hp("2%"),
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFF9E6",
    padding: wp("4%"),
    borderRadius: 12,
    alignItems: "center",
    gap: wp("3%"),
    borderLeftWidth: 4,
    borderLeftColor: COLORS.brand,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#8B7500",
    lineHeight: 18,
  },
  btn: {
    backgroundColor: COLORS.brand,
    borderWidth: 0,
    paddingVertical: hp("2%"),
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: "transparent",
    paddingVertical: hp("1.5%"),
    alignItems: "center",
    marginTop: hp("1.5%"),
  },
  cancelButtonText: {
    fontSize: 15,
    color: "#999",
    fontWeight: "600",
  },
});
