import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CommonHeader from "../../../components/ui/commonHeader";
import { COLORS } from "../../../constants/Colors";

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: "debit" | "credit";
  category:
    | "airtime"
    | "data"
    | "betting"
    | "netflix"
    | "electricity"
    | "gotv"
    | "dstv";
}

const transactionsData: Transaction[] = [
  {
    id: "1",
    title: "MTN Airtime Recharge",
    date: "Nov 15, 2024 - 2:30 PM",
    amount: 4025,
    type: "debit",
    category: "airtime",
  },
  {
    id: "2",
    title: "MTN Airtime Recharge",
    date: "Nov 15, 2024 - 2:30 PM",
    amount: 4025,
    type: "debit",
    category: "airtime",
  },
  {
    id: "3",
    title: "JAAN Wallet Top Up",
    date: "Nov 15, 2024 - 2:30 PM",
    amount: 10000,
    type: "credit",
    category: "data",
  },
  {
    id: "4",
    title: "JAAN Wallet Top Up",
    date: "Nov 15, 2024 - 2:30 PM",
    amount: 10000,
    type: "credit",
    category: "data",
  },
  {
    id: "5",
    title: "Betlife Sports Betting",
    date: "Nov 14, 2024 - 6:45 PM",
    amount: 4025,
    type: "debit",
    category: "betting",
  },
  {
    id: "6",
    title: "Netflix Video Subscription",
    date: "Nov 14, 2024 - 4:20 PM",
    amount: 42200,
    type: "debit",
    category: "netflix",
  },
  {
    id: "7",
    title: "BEDC Utility Bill Payment",
    date: "Nov 14, 2024 - 1:15 PM",
    amount: 42200,
    type: "debit",
    category: "electricity",
  },
  {
    id: "8",
    title: "JAAN Wallet Top Up",
    date: "Nov 13, 2024 - 10:30 AM",
    amount: 10000,
    type: "credit",
    category: "data",
  },
  {
    id: "9",
    title: "GO Data Top Up",
    date: "Nov 13, 2024 - 9:15 AM",
    amount: 262550,
    type: "debit",
    category: "gotv",
  },
  {
    id: "10",
    title: "GO Data Top Up",
    date: "Nov 12, 2024 - 7:45 PM",
    amount: 262550,
    type: "debit",
    category: "gotv",
  },
  {
    id: "11",
    title: "GOTV Gotable Subscription",
    date: "Nov 12, 2024 - 3:20 PM",
    amount: 41275,
    type: "debit",
    category: "gotv",
  },
  {
    id: "12",
    title: "JAAN Wallet Top Up",
    date: "Nov 11, 2024 - 5:10 PM",
    amount: 10000,
    type: "credit",
    category: "data",
  },
  {
    id: "13",
    title: "JAAN Wallet Top Up",
    date: "Nov 11, 2024 - 2:30 PM",
    amount: 10000,
    type: "credit",
    category: "data",
  },
];

const Transaction = () => {
  const [activeTab, setActiveTab] = useState<"all" | "expenses" | "funding">(
    "all",
  );

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      airtime: "phone",
      data: "wifi",
      betting: "cards-spade",
      netflix: "netflix",
      electricity: "lightning-bolt",
      gotv: "television",
      dstv: "television",
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
    };
    return colorMap[category] || COLORS.brand;
  };

  const filteredTransactions = transactionsData.filter((transaction) => {
    if (activeTab === "expenses") return transaction.type === "debit";
    if (activeTab === "funding") return transaction.type === "credit";
    return true;
  });

  return (
    <View style={styles.root}>
      <CommonHeader title="Transactions" back />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => setActiveTab("all")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.activeTabText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "expenses" && styles.activeTab]}
          onPress={() => setActiveTab("expenses")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "expenses" && styles.activeTabText,
            ]}
          >
            Expenses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "funding" && styles.activeTab]}
          onPress={() => setActiveTab("funding")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "funding" && styles.activeTabText,
            ]}
          >
            Funding
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.transactionList}>
          {filteredTransactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionItem}
              activeOpacity={0.7}
            >
              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: `${getCategoryColor(transaction.category)}20`,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={getCategoryIcon(transaction.category) as any}
                  size={22}
                  color={getCategoryColor(transaction.category)}
                />
              </View>

              {/* Transaction Details */}
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>

              {/* Amount */}
              <Text
                style={[
                  styles.amount,
                  transaction.type === "credit"
                    ? styles.amountCredit
                    : styles.amountDebit,
                ]}
              >
                {transaction.type === "credit" ? "+" : "-"}₦
                {transaction.amount.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
  scrollView: {
    flex: 1,
    marginTop: hp("2%"),
  },
  transactionList: {
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("2%"),
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: wp("4%"),
    borderRadius: 12,
    marginBottom: hp("1.5%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#999",
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
});

export default Transaction;
