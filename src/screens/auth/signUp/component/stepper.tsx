import React from "react";
import { View, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../../../constants/Colors";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.step,
            index < currentStep && styles.completedStep,
            index === currentStep && styles.activeStep,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: wp("2%"),
    paddingHorizontal: wp("5%"),
    paddingTop: hp("2%"),
  },
  step: {
    flex: 1,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },
  completedStep: {
    backgroundColor: COLORS.brand,
  },
  activeStep: {
    backgroundColor: COLORS.brand,
  },
});

export default Stepper;
