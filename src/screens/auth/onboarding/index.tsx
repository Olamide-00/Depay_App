import { View, Image, ImageBackground, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import Text from "../../../components/common/txt";
import Btn from "../../../components/common/btn";
import { COLORS } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";

const Onboarding = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 1,
      image: require("../../../../assets/images/image1.png"),
      background: require("../../../../assets/images/bgcolor.png"),
      title: "Welcome To JAAN",
      description:
        "JAAN is your all-in-one digital hub for seamless payments and connections",
    },
    {
      id: 2,
      image: require("../../../../assets/images/image2.png"),
      background: require("../../../../assets/images/bgcolor2.png"),
      title: "Pay Bills Securely",
      description:
        "Effortlessly pay your bills with secure and reliable transactions, say goodbye to long queues",
    },
  ];

  const currentSlide = slides[currentIndex];
  const isLastSlide = currentIndex === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      navigation.navigate("Login" as never);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    navigation.navigate("Login" as never);
  };

  return (
    <ImageBackground
      source={currentSlide.background}
      style={styles.root}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoContent}>
            <Image
              source={require("../../../../assets/images/logo2.png")}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={currentSlide.image}
            style={styles.slideImage}
            resizeMode="contain"
          />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Dots */}
          <View style={styles.dotContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex
                    ? styles.activeDot
                    : styles.inactiveDot,
                ]}
              />
            ))}
          </View>

          {/* Title and Description */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{currentSlide.title}</Text>
            <Text style={styles.description}>{currentSlide.description}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>skip</Text>
            </TouchableOpacity>

            <Btn
              title={isLastSlide ? "Get Started" : "Next"}
              style={styles.nextButton}
              textStyle={{ color: COLORS.white }}
              onPress={handleNext}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Onboarding;
