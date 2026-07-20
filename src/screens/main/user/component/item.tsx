import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../../../components/common/txt";

const BRAND = "#1B3710";
const INK = "#141613";
const MUTED = "#8A9086";

interface ProfileInfoItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  tint?: string;
  isLast?: boolean;
  /** Stagger delay in ms for entrance animation */
  delay?: number;
}

const ProfileInfoItem: React.FC<ProfileInfoItemProps> = ({
  icon,
  label,
  value,
  tint = BRAND,
  isLast = false,
  delay = 0,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        speed: 16,
        bounciness: 4,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        !isLast && styles.withDivider,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${tint}14` }]}>
        <Ionicons name={icon} size={18} color={tint} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color: tint === BRAND ? INK : tint }]}>
          {value}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  withDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#F2F5F0",
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 11.5,
    color: MUTED,
    fontFamily: "Poppins-Regular",
  },
  value: {
    fontSize: 14.5,
    fontFamily: "Poppins-Medium",
  },
});

export default ProfileInfoItem;
