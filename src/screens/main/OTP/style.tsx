// style.ts
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
    borderColor: "#DCDCE0", // empty = outlined circle
  },
  dotFilled: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand, // filled = solid brand color
  },
  dotError: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444", // wrong PIN = red
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

  // ── Full-screen loading overlay ───────────────
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // covers entire screen
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },
  loadingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 48,
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#F0EDF7",
  },
  loadingText: {
    fontSize: 14,
    color: "#7B6A99",
    fontWeight: "600",
    letterSpacing: 0.2,
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
