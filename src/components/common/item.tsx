import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import React from "react";
import Text from "./txt";

interface ItemProps {
  label: string;
  value: string | number;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<any>;
  valueStyle?: StyleProp<any>;
  reverse?: boolean;
  customLabel?: React.ReactNode;
  customValue?: React.ReactNode;
  gap?: number;
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
      accessibilityLabel={`${label}: ${String(value)}`}
    >
      {/* Label */}
      <View style={styles.labelWrapper}>
        {customLabel || (
          <Text
            variant="semibold"
            size="sm"
            style={[
              styles.labelText,
              labelStyle,
              reverse && styles.reverseText,
            ]}
            accessibilityRole="text"
            numberOfLines={1}
          >
            {label}
          </Text>
        )}
      </View>

      {/* Dot separator line */}
      <View style={styles.separator} />

      {/* Value */}
      <View style={styles.valueWrapper}>
        {customValue || (
          <Text
            variant="bold"
            size="sm"
            style={[styles.valueText, valueStyle]}
            accessibilityRole="text"
          >
            {String(value)}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Item;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 36,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#F9F9FB",
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  reverse: {
    flexDirection: "row-reverse",
  },
  reverseText: {
    textAlign: "right",
  },

  labelWrapper: {
    flexShrink: 0,
    maxWidth: "38%",
    paddingTop: 1,
  },
  labelText: {
    color: "#8A8A8E", // muted label tone
    letterSpacing: 0.2,
  },

  separator: {
    flex: 1,
    height: 1,
    marginHorizontal: 8,
    marginTop: 10, // vertically center with text baseline
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#DCDCE0",
  },

  valueWrapper: {
    flexShrink: 1,
    maxWidth: "48%",
    alignItems: "flex-end",
  },
  valueText: {
    textAlign: "right",
    color: "#1A1A1E", // strong value tone
    letterSpacing: -0.2,
  },
});
