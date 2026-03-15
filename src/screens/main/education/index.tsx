import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import CommonHeader from "../../../components/ui/commonHeader";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Text from "../../../components/common/txt";

const examBoards = [
  {
    id: "1",
    label: "JAMB",
    screen: "Jamb",
    icon: "school-outline",
    color: "#4C6FFF",
  },
  {
    id: "2",
    label: "WAEC",
    screen: "Waec",
    icon: "document-text-outline",
    color: "#FF6B6B",
  },
  {
    id: "3",
    label: "NECO",
    screen: "Neco",
    icon: "ribbon-outline",
    color: "#6BCB77",
  },
  {
    id: "4",
    label: "NABTEB",
    screen: "Nabteb",
    icon: "medal-outline",
    color: "#FFD93D",
  },
];

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
            <TouchableOpacity
              key={board.id}
              style={styles.card}
              onPress={() => navigation.navigate(board.screen)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: board.color + "20" },
                ]}
              >
                <Ionicons
                  name={board.icon as any}
                  size={32}
                  color={board.color}
                />
              </View>
              <Text style={styles.cardLabel}>{board.label}</Text>
              <Text style={styles.cardSub}>Buy PIN</Text>
            </TouchableOpacity>
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
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(4),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#888",
    marginBottom: hp(3),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(4),
  },
  card: {
    width: (wp(100) - wp(8) - wp(4)) / 2,
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(4),
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },
  cardSub: {
    fontSize: 12,
    color: "#888",
  },
});
