import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import React, { useRef } from "react";
import CommonHeader from "../../../components/ui/commonHeader";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../../components/common/txt";

const BRAND = "#1B3710";
const LIGHT_GREEN = "#EAF3E9";
const INK = "#141613";
const MUTED = "#6B7268";
const BORDER = "#ECEFEA";

const examBoards = [
  {
    id: "1",
    label: "JAMB",
    screen: "Jamb",
    icon: "school-outline" as const,
  },
  {
    id: "2",
    label: "WAEC",
    screen: "Waec",
    icon: "document-text-outline" as const,
  },
  {
    id: "3",
    label: "NECO",
    screen: "Neco",
    icon: "ribbon-outline" as const,
  },
  {
    id: "4",
    label: "NABTEB",
    screen: "Nabteb",
    icon: "medal-outline" as const,
  },
];

const ExamCard = ({
  board,
  onPress,
}: {
  board: (typeof examBoards)[number];
  onPress: () => void;
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();

  return (
    <Animated.View style={[styles.cardWrap, { transform: [{ scale }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={0.85}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={board.icon} size={28} color={BRAND} />
        </View>
        <Text style={styles.cardLabel}>{board.label}</Text>
        <View style={styles.subPill}>
          <Text style={styles.cardSub}>Buy PIN</Text>
          <Ionicons name="arrow-forward" size={11} color={BRAND} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Education = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.root}>
      <CommonHeader title="Education" back />
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Select Exam Board</Text>
        <Text style={styles.sectionSubtitle}>
          Choose the exam board you want to purchase a pin for
        </Text>

        <View style={styles.grid}>
          {examBoards.map((board) => (
            <ExamCard
              key={board.id}
              board={board}
              onPress={() => navigation.navigate(board.screen)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default Education;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: INK,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: MUTED,
    marginBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  cardWrap: {
    width: "47%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: BORDER,
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: INK,
  },
  subPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  cardSub: {
    fontSize: 11,
    fontFamily: "Poppins-SemiBold",
    color: BRAND,
  },
});
