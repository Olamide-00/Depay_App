import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CommonHeader from "../../../components/ui/commonHeader";
import { COLORS } from "../../../constants/Colors";
import useAuthStore from "../../../store/userStore";
import { useGetBillsHistory } from "../../../api/hooks/useBills";
import { useNavigation } from "@react-navigation/native";
import Text from "../../../components/common/txt";

type TransactionItem = {
  _id?: string;
  label: string;
  amount: string;
  status: string;
  date?: string;
  transaction_date?: string;
  type?: "debit" | "credit";
  category?: string;
  phone?: string;
  phoneNumber?: string;
};

const getCategoryIcon = (category: string) => {
  const map: { [key: string]: string } = {
    airtime: "phone",
    data: "wifi",
    betting: "cards-spade",
    netflix: "netflix",
    electricity: "lightning-bolt",
    gotv: "television",
    dstv: "television",
    tv: "television",
    education: "school",
    transfer: "bank-transfer",
  };
  return map[category?.toLowerCase()] || "wallet";
};

const getCategoryColor = (category: string) => {
  const map: { [key: string]: string } = {
    airtime: "#FF6B6B",
    data: "#4ECDC4",
    betting: "#FFD93D",
    netflix: "#E50914",
    electricity: "#95E1D3",
    gotv: "#6C5CE7",
    dstv: "#A29BFE",
    tv: "#6C5CE7",
    education: "#4C6FFF",
    transfer: "#22c55e",
  };
  return map[category?.toLowerCase()] || COLORS.brand;
};

const TABS = ["all", "expenses", "funding"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  all: "All",
  expenses: "Expenses",
  funding: "Funding",
};

const Transaction = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const userData = useAuthStore((state: any) => state.userData);
  const email = userData?.email || "";

  const { data: histories = [], isLoading } = useGetBillsHistory(email);

  const tabFiltered = histories.filter((item: TransactionItem) => {
    const type =
      typeof item.type === "string" ? item.type.toLowerCase() : "debit";
    if (activeTab === "expenses") return type === "debit";
    if (activeTab === "funding") return type === "credit";
    return true;
  });

  const renderItem = ({
    item,
    index,
  }: {
    item: TransactionItem;
    index: number;
  }) => {
    const category =
      typeof item.category === "string"
        ? item.category.toLowerCase()
        : "wallet";
    const type =
      typeof item.type === "string" ? item.type.toLowerCase() : "debit";
    const isCredit = type === "credit";
    const amount = parseFloat(item.amount) || 0;
    const dateStr = item.transaction_date || item.date || "";
    const status =
      typeof item.status === "string" ? item.status.toLowerCase() : "pending";
    const isSuccess = status === "success";
    const color = getCategoryColor(category);

    const displayDate = dateStr
      ? new Date(dateStr).toLocaleString("en-NG", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "---";

    const label =
      typeof item.label === "string" && item.label.length > 0
        ? item.label
        : category.charAt(0).toUpperCase() + category.slice(1);

    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate("StackNav", {
            screen: "Receipt",
            params: { transaction: item },
          })
        }
      >
        {/* Icon */}
        <View style={[styles.iconBox, { backgroundColor: `${color}18` }]}>
          <MaterialCommunityIcons
            name={getCategoryIcon(category) as any}
            size={20}
            color={"#fff"}
          />
        </View>

        {/* Details */}
        <View style={styles.details}>
          <Text variant="semibold" size="sm" color="#1A1A1E" numberOfLines={1}>
            {label}
          </Text>
          <Text size="xs" color="#A0A0A8">
            {displayDate}
          </Text>
          <View
            style={[
              styles.badge,
              isSuccess ? styles.badgeSuccess : styles.badgeFailed,
            ]}
          >
            <View
              style={[
                styles.badgeDot,
                isSuccess ? styles.dotSuccess : styles.dotFailed,
              ]}
            />
            <Text
              size="xs"
              variant="semibold"
              color={isSuccess ? "#16A34A" : "#DC2626"}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Amount */}
        <Text variant="bold" size="sm" color={isCredit ? "#22C55E" : "#EF4444"}>
          {isCredit ? "+" : "-"}₦
          {amount.toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </TouchableOpacity>
    );
  };

  const SkeletonItem = () => (
    <View style={styles.skeletonItem}>
      <View style={styles.skeletonIcon} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonLine} />
        <View style={styles.skeletonLineShort} />
      </View>
      <View style={styles.skeletonAmount} />
    </View>
  );

  return (
    <View style={styles.root}>
      <CommonHeader title="Transactions" back />

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.7}
          >
            <Text
              variant={activeTab === tab ? "semibold" : "regular"}
              size="sm"
              color={activeTab === tab ? COLORS.brand : "#9A9AA0"}
            >
              {TAB_LABELS[tab]}
            </Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.skeletonList}>
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonItem key={i} />
          ))}
        </View>
      ) : tabFiltered.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons
            name="receipt-text-outline"
            size={48}
            color="rgba(108,43,217,0.15)"
          />
          <Text variant="semibold" size="md" color="#9CA3AF">
            No transactions found
          </Text>
          <Text size="sm" color="#C4C4CC" center>
            {activeTab === "all"
              ? "Your transactions will appear here"
              : `No ${TAB_LABELS[activeTab].toLowerCase()} yet`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={tabFiltered}
          keyExtractor={(item, i) => item._id || i.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={5}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },

  // ── Tabs ──────────────────────────────────────
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F5",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    position: "relative",
    gap: 0,
  },
  tabActive: {},
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "20%",
    right: "20%",
    height: 2.5,
    borderRadius: 2,
    backgroundColor: COLORS.brand,
  },

  // ── List ──────────────────────────────────────
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 8,
  },

  // ── Item ──────────────────────────────────────
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#F2F2F5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  details: {
    flex: 1,
    gap: 3,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
    marginTop: 1,
  },
  badgeSuccess: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  badgeFailed: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  dotSuccess: { backgroundColor: "#22C55E" },
  dotFailed: { backgroundColor: "#EF4444" },

  // ── Skeleton ──────────────────────────────────
  skeletonList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  skeletonItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 12,
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

  // ── Empty ─────────────────────────────────────
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingBottom: 60,
  },
});

export default Transaction;
