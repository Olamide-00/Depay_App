import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../constants/Colors";

interface InputProps {
  width?: string | number;
  placeholder?: string;
}

const Input = (props: InputProps) => {
  return (
    <TextInput
      placeholder={props.placeholder}
      style={[styles.input, { width: props.width }]}
      onChangeText={(value) => value}
      placeholderTextColor={COLORS.black}
    />
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    height: hp("6.5%"),
    width: wp("80%"),
    backgroundColor: COLORS.input,
    borderRadius: 6,
    paddingHorizontal: 10,
    color: COLORS.black,
  },
});
