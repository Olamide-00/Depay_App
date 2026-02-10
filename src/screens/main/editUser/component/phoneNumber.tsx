import React from "react";
import { View, Text, TextInput, StyleSheet, Image } from "react-native";

interface PhoneNumberInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder = "+234 901 234 5678",
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <View style={styles.countryCode}>
          <Text style={styles.flag}>🇳🇬</Text>
          <Text style={styles.codeText}>+234</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
    fontWeight: "400",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    gap: 6,
  },
  flag: {
    fontSize: 20,
  },
  codeText: {
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    paddingVertical: 10,
    paddingLeft: 12,
  },
});

export default PhoneNumberInput;
