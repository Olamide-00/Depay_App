import React from "react";
import { View, TouchableOpacity, StyleSheet, Vibration } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "../common/txt";

interface CustomKeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  showForgotPin?: boolean;
  onForgotPin?: () => void;
  submitIcon?: keyof typeof Ionicons.glyphMap;
  submitColor?: string;
  vibrate?: boolean;
}

const CustomKeypad: React.FC<CustomKeypadProps> = ({
  onKeyPress,
  onDelete,
  onSubmit,
  showForgotPin = true,
  onForgotPin,
  submitIcon = "play",
  submitColor = "#6C2BD9",
  vibrate = true,
}) => {
  const handlePress = (key: string) => {
    if (vibrate) {
      Vibration.vibrate(10);
    }
    onKeyPress(key);
  };

  const handleDelete = () => {
    if (vibrate) {
      Vibration.vibrate(10);
    }
    onDelete();
  };

  const handleSubmit = () => {
    if (vibrate) {
      Vibration.vibrate(10);
    }
    onSubmit();
  };

  const renderKey = (value: string) => (
    <TouchableOpacity
      key={value}
      style={styles.key}
      onPress={() => handlePress(value)}
      activeOpacity={0.7}
    >
      <Text style={styles.keyText}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Forgot Pin Link */}
      {showForgotPin && (
        <TouchableOpacity
          style={styles.forgotPinContainer}
          onPress={onForgotPin}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotPinText}>Forgot Pin?</Text>
        </TouchableOpacity>
      )}

      {/* Keypad Grid */}
      <View style={styles.keypad}>
        {/* Row 1 */}
        <View style={styles.row}>
          {renderKey("1")}
          {renderKey("2")}
          {renderKey("3")}
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          {renderKey("4")}
          {renderKey("5")}
          {renderKey("6")}
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          {renderKey("7")}
          {renderKey("8")}
          <TouchableOpacity
            style={[styles.key, styles.deleteKey]}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Ionicons name="backspace-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Row 4 */}
        <View style={styles.row}>
          {renderKey("9")}
          {renderKey("0")}
          <TouchableOpacity
            style={[styles.key, styles.submitKey]}
            onPress={handleSubmit}
            activeOpacity={0.7}
          >
            <Ionicons name={submitIcon} size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
  },
  forgotPinContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  forgotPinText: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "500",
  },
  keypad: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  key: {
    flex: 1,
    height: 64,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  keyText: {
    fontSize: 28,
    fontWeight: "400",
    color: "#000",
  },
  deleteKey: {
    backgroundColor: "#E8E8E8",
  },
  submitKey: {
    backgroundColor: "#6C2BD9",
  },
});

export default CustomKeypad;
