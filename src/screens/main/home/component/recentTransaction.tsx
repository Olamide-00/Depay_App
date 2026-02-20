import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
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

  const recentTransactions = history.slice(0, 5);

  const sanitize = (item: any) => ({
    ...item,
    label: typeof item.label === "string" ? item.label : "Transaction",
    // Normalize to lowercase so "SUCCESS" / "FAILED" / "success" all match
    status: typeof item.status === "string" ? item.status.toLowerCase() : "pending",
    category: typeof item.category === "string" ? item.category.toLowerCase() : "wallet",
    type: typeof item.type === "string" ? item.type.toLowerCase() : "debit",
  });

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
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Service")}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable list area */}
      {isLoading ? (
        <View>
          {[1, 2, 3].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </View>
      ) : recentTransactions.length === 0 ? (
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
      ) : (
        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {recentTransactions.map((item: any, index: number) => (
            <Item
              key={item._id || item.id || index.toString()}
              data={sanitize(item)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default RecentTransaction;

const styles = StyleSheet.create({
  container: {
    paddingBottom: hp("2%"),
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
  scrollArea: {
    height: hp("35%"), // fixed height — adjust to fit your screen
  },
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
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp("1.2%"),
    paddingHorizontal: wp("2%"),
    gap: wp("3%"),
    marginBottom: hp("0.5%"),
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