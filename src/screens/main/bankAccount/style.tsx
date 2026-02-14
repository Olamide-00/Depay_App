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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp("12%"),
  },
  container: {
    paddingHorizontal: wp("5%"),
    paddingTop: hp("2%"),
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
    marginBottom: hp("3%"),
  },
  toggleButton: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#7C3AED",
  },
  toggleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  formContainer: {
    marginBottom: hp("2%"),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: hp("0.5%"),
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: hp("2.5%"),
    lineHeight: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.8%"),
    fontSize: 15,
    color: "#1F2937",
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("4%"),
    marginTop: hp("2%"),
    marginBottom: hp("2%"),
    gap: 8,
  },
  warningText: {
    fontSize: 14,
    color: "#1F2937",
    flex: 1,
  },
  clickButton: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("0.8%"),
    borderRadius: 6,
  },
  clickButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: hp("1%"),
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  buttonContainer: {
    position: "absolute",
    bottom: hp("3%"),
    left: wp("5%"),
    right: wp("5%"),
  },
  generateButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 12,
    paddingVertical: hp("2%"),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#C4B5FD",
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
