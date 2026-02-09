import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    backgroundColor: "#F5F3FF",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#6C2BD9",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6C2BD9",
  },
  activeTabText: {
    color: "#fff",
  },
  networkSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 24,
  },
  networkText: {
    fontSize: 14,
    color: "#6C2BD9",
    marginLeft: 6,
    fontWeight: "500",
  },
  chevronIcon: {
    marginLeft: 4,
  },
  inputContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  phoneInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  phoneIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: "#fff",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    color: "#000",
  },
  contactButton: {
    padding: 8,
    marginLeft: 8,
  },
  selectWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  selectPlaceholder: {
    fontSize: 15,
    color: "#999",
  },
  continueButton: {
    marginHorizontal: 16,
    backgroundColor: "#E8DEFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
  },
  continueButtonText: {
    fontSize: 16,
    color: "#6C2BD9",
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
  },
  selectorContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
