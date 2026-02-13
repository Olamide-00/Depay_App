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
  formContainer: {
    gap: hp("2.5%"),
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  inputWrapper: {
    position: "relative",
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
    paddingRight: wp("12%"),
  },
  eyeIcon: {
    position: "absolute",
    right: wp("4%"),
    top: "50%",
    transform: [{ translateY: -10 }],
    padding: 4,
  },
  requirementsContainer: {
    marginTop: 8,
    gap: 6,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  requirementText: {
    fontSize: 13,
    color: "#6B7280",
  },
  requirementMet: {
    color: "#10B981",
  },
  buttonContainer: {
    position: "absolute",
    bottom: hp("3%"),
    left: wp("5%"),
    right: wp("5%"),
  },
  button: {
    backgroundColor: "#7C3AED",
    borderRadius: 12,
    paddingVertical: hp("2%"),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
