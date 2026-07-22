// style.ts
import { StyleSheet } from "react-native";

const BRAND = "#1B3710";
const BRAND_TINT = "#EAF0E6";
const INK = "#141613";
const MUTED = "#6B7268";
const BORDER = "#E5E8E3";
const FIELD_BG = "#FAFBF9";
const DIVIDER = "#EDEFEA";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },

  // ── Icon + heading ──
  iconSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: BRAND_TINT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewText: {
    color: INK,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  reviewSubtext: {
    color: MUTED,
    fontSize: 14,
    textAlign: "center",
  },

  // ── Details card ──
  detailsCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: FIELD_BG,
    padding: 24,
  },

  amountSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  amountLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
  },
  amountValue: {
    color: INK,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  amountBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: BRAND_TINT,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  amountBadgeText: {
    color: BRAND,
    fontSize: 11,
    fontWeight: "700",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: DIVIDER,
  },
  dividerLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },

  itemContainer: {
    marginBottom: 16,
  },

  noteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: BRAND_TINT,
    borderRadius: 12,
    padding: 12,
  },
  noteText: {
    flex: 1,
    color: BRAND,
    fontSize: 12.5,
    lineHeight: 18,
  },

  // ── Fixed bottom actions ──
  actions: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: DIVIDER,
    backgroundColor: "#FFFFFF",
  },
  btn: {
    height: 56,
    borderRadius: 14,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 16.5,
    fontWeight: "700",
  },
  cancelButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: MUTED,
    fontSize: 14.5,
    fontWeight: "600",
  },
});
