// Text.tsx
import React from "react";
import {
  Text as RNText,
  TextStyle,
  TextProps as RNTextProps,
} from "react-native";

export type TextVariant = "regular" | "bold" | "semibold" | "light";
export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

export interface TextProps extends RNTextProps {
  /** Text content */
  children: React.ReactNode;
  /** Text size variant */
  size?: TextSize;
  /** Font weight variant */
  variant?: TextVariant;
  /** Text color */
  color?: string;
  /** Center align text */
  center?: boolean;
  /** Custom style to override default styles */
  style?: TextStyle;
}

const sizeMap: Record<TextSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
};

const variantMap: Record<TextVariant, TextStyle> = {
  regular: { fontWeight: "400" },
  bold: { fontWeight: "700" },
  semibold: { fontWeight: "600" },
  light: { fontWeight: "300" },
};

/**
 * A customizable Text component with consistent typography
 *
 * @example
 * <Text size="lg" variant="bold" color="#333">
 *   Hello World
 * </Text>
 */
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
    <RNText style={[textStyle, style]} {...rest}>
      {children}
    </RNText>
  );
};

// Alternative version with more flexibility using fontFamily if you have custom fonts
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
    fontFamily: fontFamily || undefined,
    ...variantMap[variant],
  };

  return (
    <RNText style={[textStyle, style]} {...rest}>
      {children}
    </RNText>
  );
};

export default Text;
