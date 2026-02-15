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
    marginRight: 50, // To center the title properly
  },
  saveButton: {
    padding: 4,
  },
  saveText: {
    fontSize: 16,
    color: COLORS.brand,
    fontWeight: "500",
  },
  scrollContent: {
    paddingBottom: hp("3%"),
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
    marginBottom: 12,
  },
  changeImageButton: {
    paddingVertical: 4,
  },
  changeImageText: {
    fontSize: 14,
    color: COLORS.brand,
    fontWeight: "500",
  },
  formContainer: {
    backgroundColor: COLORS.white,
    marginTop: hp("2%"),
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
    fontWeight: "400",
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#000",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: "top",
  },
});
