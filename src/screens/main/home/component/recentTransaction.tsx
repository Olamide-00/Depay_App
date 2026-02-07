import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Item from "../../../../components/ui/item";
import { COLORS } from "../../../../constants/Colors";

const RecentTransaction = () => {
  // Sample transaction data
  const transactionData = [
    { id: 1, type: "airtime", amount: "$500.00", time: "Today, 10:30am" },
    { id: 2, type: "data", amount: "$300.00", time: "Today, 9:15am" },
    {
      id: 3,
      type: "electricity",
      amount: "$250.00",
      time: "Yesterday, 3:45pm",
    },
    { id: 4, type: "transfer", amount: "$1000.00", time: "Yesterday, 11:20am" },
    { id: 5, type: "cable", amount: "$150.00", time: "2 days ago, 7:30pm" },
  ];

  // If your Item component expects a data prop, pass the item data
  const renderItem = ({ item }: { item: any }) => <Item data={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Recent Transactions</Text>
        <Text style={styles.viewAllText}>View All</Text>
      </View>
      <FlatList
        data={transactionData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

export default RecentTransaction;

const styles = StyleSheet.create({
  container: {
    // marginTop: hp("3%"),
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("2%"),
    marginBottom: hp("1%"),
  },
  headerTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    color: "#1A1A1A",
  },
  viewAllText: {
    fontSize: wp("3.8%"),
    color: COLORS.brand,
    fontWeight: "500",
  },
  flatList: {
    height: hp("35%"),
  },
  flatListContent: {
    paddingHorizontal: wp("0%"),
  },
});
