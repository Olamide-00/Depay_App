import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Item from "../../../../components/ui/item";
import { COLORS } from "../../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useAuthStore from "../../../../store/userStore";
import { useGetBillsHistory } from "../../../../api/hooks/useBills";

const RecentTransaction = () => {
  const navigation = useNavigation<any>();

  const userData = useAuthStore((state) => state.userData);
  const email = userData?.email || "";

  const { data: history = [], isLoading } = useGetBillsHistory(email);

  // Only show 5 latest
  const recentTransactions = history.slice(0, 5);

  const renderItem = ({ item }: { item: any }) => <Item data={item} />;

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="receipt-text-outline"
        size={40}
        color="rgba(108, 43, 217, 0.2)"
      />
      <Text style={styles.emptyTitle}>No Transactions Yet</Text>
      <Text style={styles.emptySubtitle}>
        Your recent transactions will appear here
      </Text>
    </View>
  );

  const SkeletonRow = () => (
    <View style={styles.skeletonRow}>
      <View style={styles.skeletonIcon} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonLine} />
        <View style={styles.skeletonLineShort} />
      </View>
      <View style={styles.skeletonAmount} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Service")}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View>
          {[1, 2, 3].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </View>
      ) : recentTransactions.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={recentTransactions}
          renderItem={renderItem}
          keyExtractor={(item, index) => item._id || item.id || index.toString()}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

export default RecentTransaction;

const styles = StyleSheet.create({
  container: {},
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
  flatListContent: {
    paddingHorizontal: wp("0%"),
  },

  // Empty state
  emptyContainer: {
    alignItems: "center",
    paddingVertical: hp("4%"),
    gap: hp("1%"),
  },
  emptyTitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#9ca3af",
  },
  emptySubtitle: {
    fontSize: wp("3.3%"),
    color: "#d1d5db",
    textAlign: "center",
  },

  // Skeleton
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp("1.2%"),
    paddingHorizontal: wp("2%"),
    gap: wp("3%"),
  },
  skeletonIcon: {
    width: hp("5%"),
    height: hp("5%"),
    borderRadius: hp("2.5%"),
    backgroundColor: "#f3f4f6",
  },
  skeletonContent: {
    flex: 1,
    gap: hp("0.5%"),
  },
  skeletonLine: {
    width: wp("35%"),
    height: 13,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
  },
  skeletonLineShort: {
    width: wp("22%"),
    height: 11,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
  },
  skeletonAmount: {
    width: wp("18%"),
    height: 13,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
  },
});