import { View, Image, Animated, Easing, Dimensions } from "react-native";
import React, { useEffect, useRef } from "react";
import { styles } from "./style";
import Text from "../../../components/common/txt";
import Btn from "../../../components/common/btn";
import { COLORS } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const Success = () => {
  const navigation = useNavigation();
  
  // Main animations
  const imageScale = useRef(new Animated.Value(0.5)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageTranslateY = useRef(new Animated.Value(50)).current;

  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;

  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Floating animation
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Confetti animations using translateX and translateY
  const confettiCount = 30;
  const confettiAnimations = useRef(
    Array.from({ length: confettiCount }).map(() => ({
      translateX: useRef(new Animated.Value(Math.random() * width - width / 2))
        .current,
      translateY: useRef(new Animated.Value(-100)).current,
      rotation: useRef(new Animated.Value(0)).current,
      scale: useRef(new Animated.Value(0)).current,
      opacity: useRef(new Animated.Value(0)).current,
    })),
  ).current;

  useEffect(() => {
    // Main sequence animation
    Animated.sequence([
      // Image entrance with slide up
      Animated.parallel([
        Animated.spring(imageScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(imageTranslateY, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]),

      // Start floating animation
      Animated.timing(floatAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),

      // Text animation
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // Button animation
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonTranslateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.back(1)),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Floating animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Confetti animation (delayed start)
    setTimeout(() => {
      confettiAnimations.forEach((confetti, index) => {
        Animated.sequence([
          Animated.delay(index * 50),
          Animated.parallel([
            Animated.timing(confetti.opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(confetti.scale, {
              toValue: 1,
              duration: 400,
              easing: Easing.elastic(1),
              useNativeDriver: true,
            }),
            Animated.timing(confetti.translateY, {
              toValue: height + 100,
              duration: 3000 + Math.random() * 2000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(confetti.rotation, {
              toValue: Math.random() * 720,
              duration: 3000,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      });
    }, 500);
  }, []);

  // Floating interpolation
  const floatInterpolation = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  return (
    <View style={styles.root}>
      {/* Confetti Particles */}
      {confettiAnimations.map((confetti, index) => {
        const colors = ["#FF6B6B", "#4ECDC4", "#FFD166", "#06D6A0", "#118AB2"];
        const color = colors[index % colors.length];

        return (
          <Animated.View
            key={`confetti-${index}`}
            style={[
              styles.confetti,
              {
                backgroundColor: color,
                opacity: confetti.opacity,
                transform: [
                  { translateX: confetti.translateX },
                  { translateY: confetti.translateY },
                  { scale: confetti.scale },
                  {
                    rotate: confetti.rotation.interpolate({
                      inputRange: [0, 360],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          />
        );
      })}

      {/* Success Image with floating animation */}
      <Animated.Image
        source={require("../../../../assets/images/success.png")}
        resizeMode="contain"
        style={[
          styles.image,
          {
            opacity: imageOpacity,
            transform: [
              { scale: imageScale },
              { translateY: Animated.add(imageTranslateY, floatInterpolation) },
            ],
          },
        ]}
      />

      {/* Text Content */}
      <Animated.View
        style={[
          styles.descContainer,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          },
        ]}
      >
        <Text variant="bold" size="xl" color="#fff">
          Success
        </Text>
        <View style={styles.desc}>
          <Text variant="regular" color="#fff">
            Transaction completed
          </Text>
         
        </View>
      </Animated.View>

      {/* Button */}
      <Animated.View
        style={{
          opacity: buttonOpacity,
          transform: [{ translateY: buttonTranslateY }, { scale: buttonScale }],
          width: "80%",
          alignSelf: "center",
        }}
      >
        <Btn
          title="Done"
          style={styles.btn}
          textStyle={{ color: COLORS.brand }}
          onPress={() => {
            // Button press animation
            Animated.sequence([
              Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(buttonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
              }),
            ]).start();

            //navigation
            navigation.navigate("TabNav");
          }}
        />
      </Animated.View>
    </View>
  );
};

export default Success;
