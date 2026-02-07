// Onboarding.tsx (without navigation)
import { View, Image } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { styles } from "./style";
import Text from "../../../components/common/txt";
import Btn from "../../../components/common/btn";
import { onboardingData } from "../../../constants/onboardingData";
import { COLORS } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";

const Onboarding = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentData = onboardingData[currentIndex];
  const isLastSlide = currentIndex === onboardingData.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      navigation.navigate("Login" as never); // Navigate to Login screen
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    // TODO: Skip to login screen
    console.log("Skip to login");
  };

  return (
    <View style={styles.root}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="center"
        />
        <MaterialCommunityIcons
          name="close-circle"
          size={24}
          color="white"
          onPress={handleSkip}
        />
      </View>

      <View style={styles.contentContainer}>
        {/* Only show icon if it exists in the data */}
        {currentData.icon && (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={currentData.icon as any}
              size={80}
              color={COLORS.white}
            />
          </View>
        )}

        <Text
          variant="bold"
          color="white"
          size="xl"
          style={styles.title}
          center
        >
          {currentData.title}
        </Text>

        <View style={styles.dotContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.btnContainer}>
        <Btn
          title={isLastSlide ? "Get Started" : "Next"}
          rounded
          buttonStyle={styles.btn}
          onPress={handleNext}
        />
      </View>
    </View>
  );
};

export default Onboarding;
