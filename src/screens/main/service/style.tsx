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
  servicesContainer: {
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
    paddingBottom: hp("10%"),
  },
  sectionHeader: {
    marginTop: hp("2%"),
    marginBottom: hp("1.5%"),
  },
  sectionTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    color: "#1A1A1A",
  },
  servicesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("2%"),
  },
  serviceItem: {},
  serviceIconContainer: {},
  serviceImage: {
    width: wp("8%"),
    height: wp("8%"),
  },
  imageContainer: {
    width: wp("18%"),
    alignItems: "center",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("1%"),
    backgroundColor: COLORS.white,
    borderRadius: wp("3%"),
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceLabel: {
    fontSize: wp("3%"),
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    marginTop: hp("0.3%"),
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp("10%"),
  },
  emptyStateText: {
    fontSize: wp("4%"),
    color: COLORS.gray,
    textAlign: "center",
  },
});
