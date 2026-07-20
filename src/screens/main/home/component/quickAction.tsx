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
  Receipt21,
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
const ITEM_WIDTH = (SCREEN_WIDTH - H_PADDING * 1 - GAP * (COLUMN - 1)) / COLUMN;
const ICON_SIZE = 30;

const BRAND = "#1B3710";
const INK = "#141613";
const MUTED = "#6B7268";

const getIconComponent = (icon: string) => {
  const p = { size: ICON_SIZE, color: BRAND, variant: "Bulk" as const };
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

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handlePress(item, index)}
      activeOpacity={0.6}
    >
      {getIconComponent(item.icon)}
      <Text
        size="xs"
        color={MUTED}
        variant="regular"
        style={styles.label}
        numberOfLines={1}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text variant="semibold" size="md" color={INK} style={styles.title}>
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
    marginBottom: 14,
    letterSpacing: -0.1,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 18,
  },
  item: {
    width: ITEM_WIDTH,
    alignItems: "center",
    gap: 5,
    paddingVertical: 2,
  },
  label: {
    textAlign: "center",
    letterSpacing: 0.1,
  },
});
