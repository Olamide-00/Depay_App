
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

const BASE_WIDTH = 375;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scale = SCREEN_WIDTH / BASE_WIDTH;

function normalize(size: number): number {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const sizeMap: Record<TextSize, number> = {
  xs:   normalize(8),
  sm:   normalize(10),
  md:   normalize(13),
  lg:   normalize(16),
  xl:   normalize(20),
  "2xl": normalize(24),
  "3xl": normalize(30),
  "4xl": normalize(36),
};

// ── Tinos font family map ──────────────────────
// Tinos has 4 cuts: Regular, Bold, Italic, BoldItalic
// semibold → Bold (closest available)
// light    → Regular (closest available)
const variantMap: Record<TextVariant, TextStyle> = {
  regular:  { fontFamily: "Tinos-Regular" },
  bold:     { fontFamily: "Tinos-Bold"    },
  semibold: { fontFamily: "Tinos-Bold"    },
  light:    { fontFamily: "Tinos-Regular" },
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
    <RNText {...rest} allowFontScaling={false} style={[textStyle, style]}>
      {children}
    </RNText>
  );
};

export const TextWithFontFamily: React.FC
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
    // explicit fontFamily prop overrides variant map
    fontFamily: fontFamily ?? variantMap[variant].fontFamily,
  };

  return (
    <RNText {...rest} allowFontScaling={false} style={[textStyle, style]}>
      {children}
    </RNText>
  );
};

export default Text;