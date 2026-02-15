import { StyleSheet } from "react-native";
import { COLORS } from "../../../constants/Colors";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.brand,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  phoneInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },
  phoneIconContainer: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: 16,
    color: COLORS.brand,
    fontWeight: "600",
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 16,
    fontSize: 14,
    color: "#333",
  },
  continueButton: {
    backgroundColor: COLORS.brand,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 30,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
