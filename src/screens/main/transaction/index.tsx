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
import { useNavigation } from "@react-navigation/native";

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
  return iconMap[category?.toLowerCase()] || "wallet";
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
  return colorMap[category?.toLowerCase()] || COLORS.brand;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return null;
  return new Date(dateString).toISOString().split("T")[0];
};

const Transaction = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<"all" | "expenses" | "funding">("all");

  const userData = useAuthStore((state: any) => state.userData);
  const email = userData?.email || "";

  const { data: histories = [], isLoading } = useGetBillsHistory(email);

  const tabFiltered = histories.filter((item: TransactionItem) => {
    if (activeTab === "expenses") return item.type === "debit";
    if (activeTab === "funding") return item.type === "credit";
    return true;
  });

  const renderItem = ({ item }: { item: TransactionItem }) => {
    const category = typeof item.category === "string" ? item.category : "wallet";
    const isCredit = item.type === "credit";
    const amount = parseFloat(item.amount) || 0;
    const dateStr = item.transaction_date || item.date || "";
    const status = typeof item.status === "string" ? item.status : "pending";
    const isSuccess = status === "success";

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
      <TouchableOpacity
        style={styles.transactionItem}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate("StackNav", {
            screen: "Receipt",
            params: { transaction: item },
          })
        }
      >
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
            color={COLORS.white}
          />
        </View>

        {/* Details */}
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>
            {typeof item.label === "string" && item.label.length > 0
              ? item.label
              : category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
          <Text style={styles.transactionDate}>{displayDate}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isSuccess ? "#22c55e20" : "#ef444420" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: isSuccess ? "#22c55e" : "#ef4444" },
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
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
          {isCredit ? "+" : "-"}₦
          {amount.toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
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
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {isLoading ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="loading" size={32} color="#ddd" />
          <Text style={styles.emptyText}>Loading transactions...</Text>
        </View>
      ) : tabFiltered.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="receipt" size={48} color="#ddd" />
          <Text style={styles.emptyText}>No transactions found</Text>
        </View>
      ) : (
        <FlatList
          data={tabFiltered}
          keyExtractor={(item, index) => item._id || index.toString()}
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
    color: "#ef4444",
  },
  amountCredit: {
    color: "#22c55e",
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