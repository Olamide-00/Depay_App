import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../common/txt";
import { ArrowLeft2 } from "iconsax-react-native";
import { useNavigation } from "@react-navigation/native";

const BRAND = "#1B3710";
const LIGHT_GREEN = "#EAF3E9";
const INK = "#141613";

interface HeaderProps {
  title: string;
  back?: boolean;
  onBackPress?: () => void;
  right?: React.ReactNode;
}

const CommonHeader = ({ title, back, onBackPress, right }: HeaderProps) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const topPadding =
    insets.top > 0 ? insets.top + 6 : Platform.OS === "android" ? 14 : 6;

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <View style={styles.content}>
        {back ? (
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <ArrowLeft2 size={20} color={INK} />
          </TouchableOpacity>
        ) : (
          <View style={styles.sideSlot} />
        )}

        <Text variant="bold" size="lg" style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.sideSlot}>{right ?? null}</View>
      </View>
    </View>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 10,
    // no border, no shadow — whitespace does the separating
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    gap: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  sideSlot: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    color: INK,
    textAlign: "center",
    fontSize: 17,
    letterSpacing: -0.3,
  },
});
