import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import Text from "../common/txt";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  const label =
    typeof data.label === "string" && data.label.length > 0
      ? data.label
      : category.charAt(0).toUpperCase() + category.slice(1);

  const isDebit = data.type !== "credit";
  const amount = parseFloat(data.amount) || 0;
  const displayAmount = `${isDebit ? "-" : "+"}₦${amount.toLocaleString(
    "en-NG",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
  const amountColor = isDebit ? "#EF4444" : "#22C55E";

  const status = typeof data.status === "string" ? data.status : "pending";
  const isSuccess = status === "success";
  const dateStr = data.transaction_date || data.date || data.time || "";
  const displayDate = formatDate(dateStr);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("StackNav", {
          screen: "Receipt",
          params: { transaction: data },
        })
      }
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {/* Icon */}
      <View
        style={[styles.iconContainer, { backgroundColor: `${COLORS.brand}18` }]}
      >
        <MaterialCommunityIcons
          name={getCategoryIcon(category) as any}
          size={20}
          color={COLORS.white}
        />
      </View>

      {/* Middle — label + date */}
      <View style={styles.middle}>
        <Text variant="semibold" size="md" color="#1A1A1E">
          {label}
        </Text>
        <Text variant="regular" size="xs" color="#A0A0A8">
          {displayDate}
        </Text>
      </View>

      {/* Right — amount + status */}
      <View style={styles.right}>
        <Text variant="bold" size="md" color={amountColor}>
          {displayAmount}
        </Text>
        <View
          style={[
            styles.statusBadge,
            isSuccess ? styles.badgeSuccess : styles.badgeFailed,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              isSuccess ? styles.dotSuccess : styles.dotFailed,
            ]}
          />
          <Text
            variant="semibold"
            size="xs"
            color={isSuccess ? "#16A34A" : "#DC2626"}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default Item;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F2F2F5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },

  // ── Icon ──────────────────────────────────────
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  // ── Middle ────────────────────────────────────
  middle: {
    flex: 1,
    gap: 3,
  },

  // ── Right ─────────────────────────────────────
  right: {
    alignItems: "flex-end",
    gap: 5,
    flexShrink: 0,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
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
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  dotSuccess: {
    backgroundColor: "#22C55E",
  },
  dotFailed: {
    backgroundColor: "#EF4444",
  },
});
