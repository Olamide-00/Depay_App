import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import React from "react";
import Text from "./txt";

interface ItemProps {
  label: string;
  value: string | number;
  /** Optional container style override */
  style?: StyleProp<ViewStyle>;
  /** Optional label text style override */
  labelStyle?: StyleProp<any>;
  /** Optional value text style override */
  valueStyle?: StyleProp<any>;
  /** Reverse layout (value on left, label on right) */
  reverse?: boolean;
  /** Custom label component */
  customLabel?: React.ReactNode;
  /** Custom value component */
  customValue?: React.ReactNode;
  /** Gap between label and value */
  gap?: number;
  /** Test ID for testing frameworks */
  testID?: string;
}

const Item = ({
  label,
  value,
  style,
  labelStyle,
  valueStyle,
  reverse = false,
  customLabel,
  customValue,
  gap = 8,
  testID,
}: ItemProps) => {
  return (
    <View
      style={[styles.container, { gap }, reverse && styles.reverse, style]}
      testID={testID}
      accessibilityLabel={`${label}: ${value}`}
    >
      {customLabel || (
        <Text
          variant="semibold"
          size="md"
          style={[labelStyle, reverse && styles.reverseText]}
          accessibilityRole="text"
        >
          {label}
        </Text>
      )}

      {customValue || (
        <Text
          variant="bold"
          size="xl"
          style={valueStyle}
          accessibilityRole="text"
        >
          {value}
        </Text>
      )}
    </View>
  );
};

export default Item;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    minHeight: 32,
    paddingVertical: 4,
  },
  reverse: {
    flexDirection: "row-reverse",
  },
  reverseText: {
    textAlign: "right",
  },
});
