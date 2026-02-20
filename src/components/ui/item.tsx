import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import Text from "../common/txt";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";

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

const formatDate = (dateString?: string) => {
  if (!dateString) return "---";
  return new Date(dateString).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Item = ({ data }: any) => {
  const navigation = useNavigation<any>();

  const category = typeof data.category === "string" ? data.category : "wallet";
  const label = typeof data.label === "string" && data.label.length > 0
    ? data.label
    : category.charAt(0).toUpperCase() + category.slice(1);

  const isDebit = data.type !== "credit";
  const amount = parseFloat(data.amount) || 0;
  const displayAmount = `${isDebit ? "-" : "+"}₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const amountColor = isDebit ? "#ef4444" : "#22c55e";

  const status = typeof data.status === "string" ? data.status : "pending";
  const dateStr = data.transaction_date || data.date || data.time || "";
  const displayDate = formatDate(dateStr);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("StackNav", { screen: "Receipt", params: { transaction: data } })
      }
      style={styles.container}
    >
      <View style={styles.row1}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: `${COLORS.brand}15` }]}>
          <MaterialCommunityIcons
            name={getCategoryIcon(category) as any}
            size={22}
            color={COLORS.white}
          />
        </View>

        {/* Label + Date + Status */}
        <View style={styles.innerRow}>
          <Text variant="semibold" size="md" color="#1A1A1A">
            {label}
          </Text>
          <Text variant="regular" size="sm" color="#999" style={styles.timeText}>
            {displayDate}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: status === "success" ? "#22c55e20" : "#ef444420" },
            ]}
          >
            <Text
              variant="semibold"
              size="sm"
              color={status === "success" ? "#22c55e" : "#ef4444"}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      {/* Amount */}
      <Text variant="bold" size="md" color={amountColor} style={styles.amountText}>
        {displayAmount}
      </Text>
    </Pressable>
  );
};

export default Item;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("2%"),
    marginVertical: hp("0.3%"),
    borderRadius: wp("3%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  row1: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("3%"),
    flex: 1,
  },
  iconContainer: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  innerRow: {
    flex: 1,
    gap: hp("0.3%"),
  },
  timeText: {
    opacity: 0.8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: wp("2%"),
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  amountText: {
    marginLeft: wp("2%"),
  },
});