import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
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
} from "iconsax-react-native";

const QuickAction = () => {
  // Map icon names to Iconsax components
  const getIconComponent = (icon, color = "#FF8A65") => {
    if (React.isValidElement(icon)) {
      return icon;
    }

    const iconProps = {
      size: wp("6.5%"),
      color: color,
      variant: "Bulk",
    };

    switch (icon) {
      case "Simcard1":
        return <Simcard1 {...iconProps} />;
      case "Simcard":
        return <Simcard {...iconProps} />;
      case "phone-landscape":
        return <Mobile {...iconProps} />;
      case "Electricity":
        return <Electricity {...iconProps} />;
      case "Receipt21":
        return <Receipt21 {...iconProps} />;
      case "WalletMoney":
        return <WalletMoney {...iconProps} />;
      case "Send2":
        return <Send2 {...iconProps} />;
      case "AddCircle":
        return <AddCircle {...iconProps} />;
      case "Card":
        return <Card {...iconProps} />;
      case "People":
        return <People {...iconProps} />;
      case "Simcard2":
        return <Simcard2 {...iconProps} />;
      default:
        return <AddCircle {...iconProps} />;
    }
  };

  // Color palette for icons
  const iconColors = [
    "#FF8A65",
    "#6B34FF",
    "#81C784",
    "#FFB609",
    "#9575CD",
    "green",
    "#FFB74D",
    "#7986CB",
    "#A1887F",
    "#90A4AE",
  ];

  const renderServiceItem = ({ item, index }) => {
    const iconColor = iconColors[index % iconColors.length];

    return (
      <TouchableOpacity
        style={styles.serviceItem}
        onPress={() => console.log("Navigate to:", item.screen)}
        activeOpacity={0.7}
      >
        <View
          style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}
        >
          {getIconComponent(item.icon, iconColor)}
        </View>
        <Text style={styles.serviceTitle} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quick Access</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={serviceData}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={5}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
};

export default QuickAction;

const styles = StyleSheet.create({
  container: {
    marginBottom: hp("-1%"),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  headerTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    color: "#1A1A1A",
  },
  seeAllText: {
    fontSize: wp("3.8%"),
    color: "#666",
    fontWeight: "500",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: hp("2.5%"),
  },
  serviceItem: {
    width: wp("15%"),
    alignItems: "center",
  },
  iconContainer: {},
  serviceTitle: {
    fontSize: wp("3.2%"),
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
    marginTop: hp("0.5%"),
  },
});
