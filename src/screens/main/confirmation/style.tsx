// style.ts
import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../../constants/Colors";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },

  // flex column — card grows to fill, buttons stick to bottom
  container: {
    flex: 1,
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("2%"),
    justifyContent: "space-between", // ← pushes actions to bottom
  },

  // ── Icon section ──────────────────────────────
  iconSection: {
    alignItems: "center",
    paddingVertical: hp("1.5%"),
  },
  iconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F0E6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("1%"),
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1E",
    letterSpacing: -0.3,
  },
  reviewSubtext: {
    fontSize: 12,
    color: "#9A9AA0",
    textAlign: "center",
    marginTop: 2,
  },

  // ── Details card ──────────────────────────────
  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: wp("4.5%"),
    borderWidth: 1.5,
    borderColor: "#EDE6FA",
    shadowColor: "#7B3FE4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },

  // ── Amount ────────────────────────────────────
  amountSection: {
    backgroundColor: "#F5EEFF",
    paddingVertical: hp("1.5%"), // tighter than before
    paddingHorizontal: wp("4%"),
    borderRadius: 14,
    alignItems: "center",
    marginBottom: hp("1.5%"),
    borderWidth: 1,
    borderColor: "#E8D9FF",
  },
  amountLabel: {
    fontSize: 10,
    color: "#9A80C0",
    fontWeight: "600",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.brand,
    letterSpacing: -0.5,
  },
  amountBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 6,
    backgroundColor: "#EDE1FF",
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 20,
  },
  amountBadgeText: {
    fontSize: 10,
    color: COLORS.brand,
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  // ── Divider ───────────────────────────────────
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: hp("1.5%"),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#F0EDF7",
  },
  dividerLabel: {
    fontSize: 10,
    color: "#C0B8D4",
    fontWeight: "600",
    letterSpacing: 1,
  },

  // ── Items ─────────────────────────────────────
  itemContainer: {
    gap: hp("1%"), // tighter gap
  },

  // ── Note ──────────────────────────────────────
  noteCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
    marginTop: hp("1.5%"),
    backgroundColor: "#FBF8FF",
    padding: wp("3%"),
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.brand,
  },
  noteText: {
    flex: 1,
    fontSize: 11,
    color: "#7B6A99",
    lineHeight: 15,
  },

  // ── Actions — always at bottom ────────────────
  actions: {
    paddingTop: hp("1.5%"),
  },
  btn: {
    backgroundColor: COLORS.brand,
    borderWidth: 0,
    paddingVertical: hp("1.8%"),
    borderRadius: 14,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 5,
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  cancelButton: {
    paddingVertical: hp("1.2%"),
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 13,
    color: "#B0A8C4",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
