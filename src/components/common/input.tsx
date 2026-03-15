import { StyleSheet, TextInput, View, TextInputProps } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../constants/Colors";

interface InputProps extends TextInputProps {
  width?: string | number;
  placeholder?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  value?: string;
  onChangeText?: (text: string) => void;
}

const Input = (props: InputProps) => {
  const {
    width,
    placeholder,
    rightIcon,
    leftIcon,
    value,
    onChangeText,
    ...rest
  } = props;

  return (
    <View style={[styles.container, { width: width }]}>
      {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

      <TextInput
        placeholder={placeholder}
        style={[
          styles.input,
          leftIcon && styles.inputWithLeftIcon,
          rightIcon && styles.inputWithRightIcon,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#999"
        allowFontScaling={false}
        {...rest}
      />

      {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: hp("7%"),
    width: wp("80%"),
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    position: "relative",
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 16,
    color: "#333",
    fontSize: 14,
  },
  inputWithLeftIcon: {
    paddingLeft: 50,
  },
  inputWithRightIcon: {
    paddingRight: 50,
  },
  leftIconContainer: {
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  rightIconContainer: {
    position: "absolute",
    right: 16,
    zIndex: 1,
  },
});
