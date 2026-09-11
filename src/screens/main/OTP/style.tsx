import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../constants/Colors";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    marginTop: 24,
    paddingHorizontal: 20,
  },

  // ── Header text ───────────────────────────────
  desc: {
    gap: 6,
  },
  heading: {
    color: "#1A1A1E",
    letterSpacing: -0.3,
  },
  subheading: {
    color: "#9A9AA0",
    lineHeight: 20,
  },

  // ── PIN dots ──────────────────────────────────
  dotContainer: {
    flexDirection: "row",
    gap: 16,
    alignSelf: "center",
    marginTop: 48,
    marginBottom: 12,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#DCDCE0",
  },
  dotFilled: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  dotError: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },

  // ── Inline error ──────────────────────────────
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "center",
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
  },

  // ── Processing overlay ────────────────────────
  // Just the dim scrim, spinner, and label — no card, no border,
  // no shadow. Nothing sitting inside a box.
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,14,9,0.72)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },
  spinner: {
    marginBottom: 16,
  },
  successIcon: {
    marginBottom: 16,
  },
  loadingLabel: {
    fontSize: 14.5,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    letterSpacing: 0.1,
  },

  // ── Keypad ────────────────────────────────────
  keypadContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === "ios" ? 32 : 24,
  },
});
