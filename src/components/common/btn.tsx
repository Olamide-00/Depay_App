// Btn.tsx
import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { Text, TextProps } from "./txt"; // Adjust import path as needed
import { COLORS } from "../../constants/Colors";

export type BtnVariant = "primary" | "secondary" | "outline" | "ghost";
export type BtnSize = "sm" | "md" | "lg" | "xl";

export interface BtnProps extends TouchableOpacityProps {
  /** Button text content */
  title: string;
  /** Button variant style */
  variant?: BtnVariant;
  /** Button size */
  size?: BtnSize;
  /** Show loading state */
  loading?: boolean;
  /** Disable button */
  disabled?: boolean;
  /** Icon component to display on the left */
  leftIcon?: React.ReactNode;
  /** Icon component to display on the right */
  rightIcon?: React.ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Custom button style */
  buttonStyle?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
  /** Custom text props */
  textProps?: Omit<TextProps, "children">;
  /** Loading indicator color */
  loadingColor?: string;
  /** Rounded button */
  rounded?: boolean;
}

/**
 * A customizable Button component with multiple variants and states
 *
 * @example
 * <Btn
 *   title="Submit"
 *   variant="primary"
 *   onPress={() => console.log('Pressed')}
 * />
 */
export const Btn: React.FC<BtnProps> = ({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  buttonStyle,
  textStyle,
  textProps = {},
  loadingColor,
  rounded = false,
  style,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  // Get variant styles
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: isDisabled ? COLORS.disabled : COLORS.bg,
          borderWidth: 2,
          borderColor: COLORS.yellow,
        };
      case "secondary":
        return {
          backgroundColor: isDisabled ? COLORS.disabled : COLORS.secondary,
          borderWidth: 2,
          borderColor: COLORS.secondary,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: isDisabled ? COLORS.disabled : COLORS.primary,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          borderWidth: 0,
        };
      default:
        return {};
    }
  };

  // Get size styles
  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case "sm":
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: rounded ? 20 : 6,
        };
      case "md":
        return {
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: rounded ? 24 : 8,
        };
      case "lg":
        return {
          paddingVertical: 14,
          paddingHorizontal: 28,
          borderRadius: rounded ? 28 : 10,
        };
      case "xl":
        return {
          paddingVertical: 18,
          paddingHorizontal: 36,
          borderRadius: rounded ? 32 : 12,
        };
      default:
        return {};
    }
  };

  // Get text color based on variant
  const getTextColor = (): string => {
    if (isDisabled) {
      return COLORS.textDisabled;
    }

    switch (variant) {
      case "primary":
        return COLORS.textPrimary;
      case "secondary":
        return COLORS.textSecondary;
      case "outline":
        return COLORS.primary;
      case "ghost":
        return COLORS.primary;
      default:
        return COLORS.textPrimary;
    }
  };

  // Get text size based on button size
  const getTextSize = (): TextProps["size"] => {
    switch (size) {
      case "sm":
        return "sm";
      case "md":
        return "md";
      case "lg":
        return "lg";
      case "xl":
        return "xl";
      default:
        return "md";
    }
  };

  // Get text variant based on button size
  const getTextVariant = (): TextProps["variant"] => {
    switch (size) {
      case "sm":
        return "regular";
      case "md":
        return "regular";
      case "lg":
        return "semibold";
      case "xl":
        return "bold";
      default:
        return "regular";
    }
  };

  const buttonStyles: ViewStyle = {
    ...getVariantStyle(),
    ...getSizeStyle(),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    opacity: isDisabled ? 0.6 : 1,
    width: fullWidth ? "100%" : undefined,
  };

  // Determine loading color if not provided
  const getLoadingColor = () => {
    if (loadingColor) return loadingColor;
    switch (variant) {
      case "primary":
        return COLORS.textPrimary;
      case "secondary":
        return COLORS.textSecondary;
      case "outline":
        return COLORS.primary;
      case "ghost":
        return COLORS.primary;
      default:
        return COLORS.textPrimary;
    }
  };

  return (
    <TouchableOpacity
      style={[buttonStyles, styles.base, buttonStyle, style]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getLoadingColor()} />
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text
            size={getTextSize()}
            variant={getTextVariant()}
            color={getTextColor()}
            style={textStyle}
            {...textProps}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Btn;
