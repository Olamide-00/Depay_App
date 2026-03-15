// RecentTransaction.tsx
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import React from "react";
import Item from "../../../../components/ui/item";
import { COLORS } from "../../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useAuthStore from "../../../../store/userStore";
import { useGetBillsHistory } from "../../../../api/hooks/useBills";
import Text from "../../../../components/common/txt";

const RecentTransaction = () => {
  const navigation = useNavigation<any>();

  const userData = useAuthStore((state) => state.userData);
  const email = userData?.email || "";

  const { data: history = [], isLoading } = useGetBillsHistory(email);
  const recentTransactions = history.slice(0, 5);

  const sanitize = (item: any) => ({
    ...item,
    label: typeof item.label === "string" ? item.label : "Transaction",
    status:
      typeof item.status === "string" ? item.status.toLowerCase() : "pending",
    category:
      typeof item.category === "string"
        ? item.category.toLowerCase()
        : "wallet",
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
        <Text variant="semibold" size="md" color="#1A1A1E">
          Recent Transactions
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Transaction")}>
          <Text variant="semibold" size="sm" color={COLORS.brand}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.skeletonContainer}>
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
          <Text variant="semibold" size="md" color="#9CA3AF">
            No Transactions Yet
          </Text>
          <Text variant="regular" size="sm" color="#D1D5DB" center>
            Your recent transactions will appear here
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={false}
        >
          <View style={styles.listContainer}>
            {recentTransactions.map((item: any, index: number) => (
              <Item
                key={item._id || item.id || index.toString()}
                data={sanitize(item)}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default RecentTransaction;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },

  // ── Header ────────────────────────────────────
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  // ── Scroll area ───────────────────────────────
  scrollArea: {
    height: 320, // fixed height — inner scroll lives here
  },
  listContainer: {
    gap: 8,
  },

  // ── Empty ─────────────────────────────────────
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },

  // ── Skeleton ──────────────────────────────────
  skeletonContainer: {
    gap: 8,
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F2F2F5",
  },
  skeletonIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
  },
  skeletonContent: {
    flex: 1,
    gap: 6,
  },
  skeletonLine: {
    width: "55%",
    height: 13,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
  },
  skeletonLineShort: {
    width: "35%",
    height: 11,
    backgroundColor: "#F9FAFB",
    borderRadius: 4,
  },
  skeletonAmount: {
    width: 60,
    height: 13,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
  },
});
