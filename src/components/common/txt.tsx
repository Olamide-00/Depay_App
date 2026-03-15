// Text.tsx
import React from "react";
import {
  Text as RNText,
  TextStyle,
  TextProps as RNTextProps,
  Dimensions,
  PixelRatio,
} from "react-native";

export type TextVariant = "regular" | "bold" | "semibold" | "light";
export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

export interface TextProps extends RNTextProps {
  children: React.ReactNode;
  size?: TextSize;
  variant?: TextVariant;
  color?: string;
  center?: boolean;
  style?: TextStyle;
}

// --- Responsive font scaling utility ---
const BASE_WIDTH = 375; // iPhone 14 base width (standard design baseline)
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scale = SCREEN_WIDTH / BASE_WIDTH;

/**
 * Normalizes font size across all screen sizes and densities.
 * Keeps fonts proportional without going too large on tablets.
 */
function normalize(size: number): number {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

// --- Size map (design values in dp, normalized at runtime) ---
const sizeMap: Record<TextSize, number> = {
  xs: normalize(8),
  sm: normalize(10),
  md: normalize(13),
  lg: normalize(16),
  xl: normalize(20),
  "2xl": normalize(24),
  "3xl": normalize(30),
  "4xl": normalize(36),
};

const variantMap: Record<TextVariant, TextStyle> = {
  regular: { fontWeight: "400" },
  bold: { fontWeight: "700" },
  semibold: { fontWeight: "600" },
  light: { fontWeight: "300" },
};

export const Text: React.FC<TextProps> = ({
  children,
  size = "md",
  variant = "regular",
  color = "#000000",
  center = false,
  style,
  ...rest
}) => {
  const textStyle: TextStyle = {
    fontSize: sizeMap[size],
    color,
    textAlign: center ? "center" : "left",
    ...variantMap[variant],
  };

  return (
    // allowFontScaling={false} → ignores OS accessibility font size
    // Placed after {...rest} so it can never be overridden by consumers
    <RNText {...rest} allowFontScaling={false} style={[textStyle, style]}>
      {children}
    </RNText>
  );
};

export const TextWithFontFamily: React.FC<
  TextProps & { fontFamily?: string }
> = ({
  children,
  size = "md",
  variant = "regular",
  color = "#000000",
  center = false,
  fontFamily,
  style,
  ...rest
}) => {
  const textStyle: TextStyle = {
    fontSize: sizeMap[size],
    color,
    textAlign: center ? "center" : "left",
    fontFamily: fontFamily ?? undefined,
    ...variantMap[variant],
  };

  return (
    <RNText {...rest} allowFontScaling={false} style={[textStyle, style]}>
      {children}
    </RNText>
  );
};

export default Text;
