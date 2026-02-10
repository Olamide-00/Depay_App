import { View } from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import Text from "../../../components/common/txt";
import CommonHeader from "../../../components/ui/commonHeader";
import CustomKeypad from "../../../components/keypad/customKeyPad";
import { COLORS } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";

const OTP = () => {
  const navigation = useNavigation();
  const [pin, setPin] = useState("");
  const maxPinLength = 4;

  const handleKeyPress = (key: string) => {
    if (pin.length < maxPinLength) {
      setPin(pin + key);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pin.length === maxPinLength) {
      console.log("PIN submitted:", pin);
      navigation.navigate("Success");
    }
  };

  const handleForgotPin = () => {
    console.log("Forgot PIN clicked");
    // Navigate to forgot PIN screen
  };

  return (
    <View style={styles.root}>
      <CommonHeader title="Airtime & Data" back />
      <View style={styles.container}>
        <View style={styles.desc}>
          <Text variant="bold" size="3xl">
            Enter 4 Digits PIN
          </Text>
          <Text>Enter your four digit PIN to confirm purchase</Text>
        </View>

        {/* PIN Dots */}
        <View style={styles.dotContainer}>
          {[...Array(maxPinLength)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index < pin.length && {
                  backgroundColor: COLORS.brand,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Keypad at Bottom */}
      <View style={styles.keypadContainer}>
        <CustomKeypad
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          showForgotPin={true}
          onForgotPin={handleForgotPin}
          submitIcon="play"
          submitColor={COLORS.brand}
          vibrate={true}
        />
      </View>
    </View>
  );
};

export default OTP;
