import React, { useRef } from "react";
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Vibration,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "../common/txt";
import { COLORS } from "../../constants/Colors";

// Fallbacks in case constants/Colors.ts doesn't export these exact
// keys — swap for COLORS.ink / COLORS.muted / COLORS.border if you
// already have them defined, so this stays in lockstep with the
// rest of the app's palette instead of drifting into its own.
const INK = (COLORS as any).ink ?? "#141613";
const MUTED = (COLORS as any).muted ?? "#6B7268";
const BORDER = (COLORS as any).border ?? "#E5E8E3";
const SURFACE = (COLORS as any).surface ?? "#F7F8F5";

const LETTERS: Record<string, string> = {
  "1": "",
  "2": "ABC",
  "3": "DEF",
  "4": "GHI",
  "5": "JKL",
  "6": "MNO",
  "7": "PQRS",
  "8": "TUV",
  "9": "WXYZ",
  "0": "",
};

interface CustomKeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  showForgotPin?: boolean;
  onForgotPin?: () => void;
  submitIcon?: keyof typeof Ionicons.glyphMap;
  submitColor?: string;
  vibrate?: boolean;
  showSubmit?: boolean;
}

// Every key manages its own tiny press animation — a shared
// TouchableOpacity/activeOpacity gives every key the exact same
// flat opacity dip, which is what made the original feel generic.
// A per-key spring gives each press real, tactile weight.
function AnimatedKey({
  onPress,
  children,
  style,
  vibrate,
}: {
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
  vibrate: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      speed: 40,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      speed: 18,
      bounciness: 9,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (vibrate) Vibration.vibrate(8);
    onPress();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={handlePress}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const CustomKeypad: React.FC<CustomKeypadProps> = ({
  onKeyPress,
  onDelete,
  onSubmit,
  showForgotPin = true,
  onForgotPin,
  submitIcon = "arrow-forward",
  submitColor = COLORS.brand,
  vibrate = true,
  showSubmit = true,
}) => {
  const renderKey = (value: string) => (
    <AnimatedKey
      key={value}
      style={styles.key}
      onPress={() => onKeyPress(value)}
      vibrate={vibrate}
    >
      <Text style={styles.keyText}>{value}</Text>
      {LETTERS[value] ? (
        <Text style={styles.keyLetters}>{LETTERS[value]}</Text>
      ) : (
        <View style={styles.letterSpacer} />
      )}
    </AnimatedKey>
  );

  return (
    <View style={styles.container}>
      {showForgotPin && (
        <View style={styles.forgotPinContainer}>
          <Text style={styles.forgotPinText} onPress={onForgotPin}>
            Forgot PIN?
          </Text>
        </View>
      )}

      <View style={styles.keypad}>
        <View style={styles.row}>
          {renderKey("1")}
          {renderKey("2")}
          {renderKey("3")}
        </View>

        <View style={styles.row}>
          {renderKey("4")}
          {renderKey("5")}
          {renderKey("6")}
        </View>

        <View style={styles.row}>
          {renderKey("7")}
          {renderKey("8")}
          {renderKey("9")}
        </View>

        <View style={styles.row}>
          <AnimatedKey
            style={[styles.key, styles.utilityKey]}
            onPress={onDelete}
            vibrate={vibrate}
          >
            <Ionicons name="backspace-outline" size={22} color={MUTED} />
          </AnimatedKey>

          {renderKey("0")}

          {showSubmit ? (
            <AnimatedKey
              style={[
                styles.key,
                styles.submitKey,
                { backgroundColor: submitColor },
              ]}
              onPress={onSubmit}
              vibrate={vibrate}
            >
              <Ionicons name={submitIcon} size={22} color="#fff" />
            </AnimatedKey>
          ) : (
            // Keeps the grid aligned when there's nothing to submit
            // (e.g. a PIN screen that auto-submits at 4 digits) —
            // an empty, non-interactive slot rather than a button
            // that would silently do nothing if tapped.
            <View style={styles.key} pointerEvents="none" />
          )}
        </View>
      </View>
    </View>
  );
};

const KEY_SIZE = 72;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
  },
  forgotPinContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  forgotPinText: {
    fontSize: 14.5,
    fontFamily: "Poppins-Medium",
    color: MUTED,
    textDecorationLine: "underline",
    textDecorationColor: BORDER,
  },
  keypad: {
    width: "100%",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 18,
  },
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    borderRadius: KEY_SIZE / 2,
    backgroundColor: SURFACE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },
  keyText: {
    fontSize: 25,
    fontFamily: "Poppins-Medium",
    color: INK,
    lineHeight: 30,
  },
  keyLetters: {
    fontSize: 9,
    fontFamily: "Poppins-Medium",
    color: MUTED,
    letterSpacing: 1.5,
    marginTop: 1,
  },
  letterSpacer: {
    height: 12,
  },
  utilityKey: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  submitKey: {
    borderWidth: 0,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
});

export default CustomKeypad;
