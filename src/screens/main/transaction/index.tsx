import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CommonHeader from "../../../components/ui/commonHeader";
import { COLORS } from "../../../constants/Colors";
import useAuthStore from "../../../store/userStore";
import { useGetBillsHistory } from "../../../api/hooks/useBills";

type TransactionItem = {
  label: string;
  amount: string;
  status: string;
  date?: string;
  transaction_date?: string;
  type?: "debit" | "credit";
  category?: string;
};

const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: string } = {
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
  return iconMap[category] || "wallet";
};

const getCategoryColor = (category: string) => {
  const colorMap: { [key: string]: string } = {
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
  return colorMap[category] || COLORS.brand;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return null;
  return new Date(dateString).toISOString().split("T")[0];
};

const Transaction = () => {
  const [activeTab, setActiveTab] = useState<"all" | "expenses" | "funding">("all");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const userData = useAuthStore((state: any) => state.userData);
  const email = userData?.email || "";

  const { data: histories = [], isLoading } = useGetBillsHistory(email);

  // Filter by tab
  const tabFiltered = histories.filter((item: TransactionItem) => {
    if (activeTab === "expenses") return item.type === "debit";
    if (activeTab === "funding") return item.type === "credit";
    return true;
  });

  // Filter by selected date
  const filteredData = selectedDate
    ? tabFiltered.filter((item: TransactionItem) => {
        const itemDate = formatDate(item.transaction_date || item.date);
        return itemDate === selectedDate;
      })
    : tabFiltered;

  const renderItem = ({ item }: { item: TransactionItem }) => {
    const category = item.category || "wallet";
    const isCredit = item.type === "credit";
    const amount = parseFloat(item.amount) || 0;
    const dateStr = item.transaction_date || item.date || "";
    const displayDate = dateStr
      ? new Date(dateStr).toLocaleString("en-NG", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "---";

    return (
      <TouchableOpacity style={styles.transactionItem} activeOpacity={0.7}>
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${getCategoryColor(category)}20` },
          ]}
        >
          <MaterialCommunityIcons
            name={getCategoryIcon(category) as any}
            size={22}
            color={getCategoryColor(category)}
          />
        </View>

        {/* Details */}
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>{item.label || "Transaction"}</Text>
          <Text style={styles.transactionDate}>{displayDate}</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === "success" ? "#22c55e20" : "#ef444420",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: item.status === "success" ? "#22c55e" : "#ef4444",
                },
              ]}
            >
              {item.status || "pending"}
            </Text>
          </View>
        </View>

        {/* Amount */}
        <Text
          style={[
            styles.amount,
            isCredit ? styles.amountCredit : styles.amountDebit,
          ]}
        >
          {isCredit ? "+" : "-"}₦{amount.toLocaleString()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <CommonHeader title="Transactions" back />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(["all", "expenses", "funding"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction List */}
      {isLoading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Loading transactions...</Text>
        </View>
      ) : filteredData.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="receipt" size={48} color="#ddd" />
          <Text style={styles.emptyText}>No transactions found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
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
    backgroundColor: "#F5F5F5",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: wp("5%"),
    marginTop: hp("2%"),
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: hp("1.2%"),
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#F0F0F0",
  },
  tabText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#333",
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: wp("5%"),
    paddingTop: hp("2%"),
    paddingBottom: hp("4%"),
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: wp("4%"),
    borderRadius: 12,
    marginBottom: hp("1.5%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("3%"),
  },
  transactionDetails: {
    flex: 1,
    gap: 3,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  transactionDate: {
    fontSize: 12,
    color: "#999",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
  },
  amountDebit: {
    color: "#FF6B6B",
  },
  amountCredit: {
    color: "#4CAF50",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
  },
});

export default Transaction;