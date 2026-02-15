import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../../constants/Colors";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: hp("4%"),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    textAlign: "center",
    marginRight: 40, // To center the title properly
  },
  editButtonContainer: {
    padding: 4,
  },
  editButton: {
    fontSize: 16,
    color: COLORS.brand,
    fontWeight: "500",
  },
  profileImageContainer: {
    alignItems: "center",
    paddingVertical: hp("3%"),
    backgroundColor: COLORS.white,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB",
  },
  infoContainer: {
    marginTop: hp("2%"),
    backgroundColor: COLORS.white,
  },
});
