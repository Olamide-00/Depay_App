import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { serviceData } from "../../../../constants/serviceData";
import {
  Simcard1,
  Simcard,
  Mobile,
  Flash,
  Receipt21,
  WalletMoney,
  Send2,
  AddCircle,
  Card,
  People,
  Electricity,
  Simcard2,
  Book1,
  Game,
} from "iconsax-react-native";
import { useNavigation } from "@react-navigation/native";
import Text from "../../../../components/common/txt";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN = 5;
const H_PADDING = 30;
const GAP = 8;
const ITEM_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - GAP * (COLUMN - 1)) / COLUMN;
const ICON_SIZE = Math.round(ITEM_WIDTH * 0.3);

const iconColors = [
  "#FF8A65",
  "#6B34FF",
  "#22C55E",
  "#FFB609",
  "#9575CD",
  "#06B6D4",
  "#FFB74D",
  "#7986CB",
  "#A1887F",
  "#90A4AE",
];

const getIconComponent = (icon: string, color: string) => {
  const p = { size: ICON_SIZE, color, variant: "Bulk" };
  switch (icon) {
    case "Simcard1":
      return <Simcard1 {...p} />;
    case "Simcard":
      return <Simcard {...p} />;
    case "phone-landscape":
      return <Mobile {...p} />;
    case "Electricity":
      return <Electricity {...p} />;
    case "Receipt21":
      return <Receipt21 {...p} />;
    case "Book1":
      return <Book1 {...p} />;
    case "Game":
      return <Game {...p} />;
    case "Card":
      return <Card {...p} />;
    case "People":
      return <People {...p} />;
    case "Simcard2":
      return <Simcard2 {...p} />;
    default:
      return <AddCircle {...p} />;
  }
};

const QuickAction = () => {
  const navigation = useNavigation<any>();

  const handlePress = (item: any, index: number) => {
    if (index === serviceData.length - 1) {
      navigation.navigate("Service");
    } else {
      navigation.navigate("StackNav", { screen: item.screen });
    }
  };

  const renderItem = ({ item, index }: any) => {
    const color = iconColors[index % iconColors.length];
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => handlePress(item, index)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconBox, { backgroundColor: `${color}18` }]}>
          {getIconComponent(item.icon, color)}
        </View>
        <Text size="xs" color="#4A4A4E" style={styles.label} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text variant="semibold" size="md" color="#1A1A1E" style={styles.title}>
        Quick Access
      </Text>

      <FlatList
        data={serviceData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={COLUMN}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default QuickAction;

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  title: {
    marginBottom: 12,
    letterSpacing: -0.1,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

  item: {
    width: ITEM_WIDTH,
    alignItems: "center",
    gap: 6,
  },
  iconBox: {
    width: ITEM_WIDTH * 0.65,
    height: ITEM_WIDTH * 0.65,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    textAlign: "center",
    letterSpacing: 0.1,
  },
});
