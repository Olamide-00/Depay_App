import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  Alert,
} from "react-native";
import React from "react";
import { COLORS } from "../../../constants/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useAuthStore from "../../../store/userStore";

const Receipt = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const transaction = route.params?.transaction || {};

  const userData = useAuthStore((state) => state.userData);

  const label = transaction.label || "Transaction";
  const amount = parseFloat(transaction.amount) || 0;
  const status = transaction.status || "pending";
  const isCredit = transaction.type === "credit";
  const category = transaction.category || "wallet";
  const dateStr = transaction.transaction_date || transaction.date || "";
  const displayDate = dateStr
    ? new Date(dateStr).toLocaleString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "---";
  const transactionId = transaction._id || transaction.id || "---";
  const phone = transaction.phone || transaction.phoneNumber || userData?.phoneNumber || "---";
  const isSuccess = status === "success";

  const handleCopyId = () => {
    Clipboard.setString(transactionId);
    Alert.alert("Copied", "Transaction ID copied to clipboard");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction Receipt</Text>
          <View style={styles.backButton} />
        </View>

        {/* Merchant Info */}
        <View style={styles.merchantSection}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="receipt" size={36} color={COLORS.white} />
          </View>
          <Text style={styles.merchantName}>JAAN</Text>
          <Text style={styles.bundleName}>{label}</Text>
          <Text style={styles.amount}>
            {isCredit ? "+" : "-"}₦{amount.toLocaleString("en-NG", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isSuccess ? "#E8F5E9" : "#FEECEC" },
            ]}
          >
            <Text style={[styles.statusText, { color: isSuccess ? "#4CAF50" : "#ef4444" }]}>
              {isSuccess ? "Successful" : status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
            <MaterialCommunityIcons
              name={isSuccess ? "check-circle" : "close-circle"}
              size={16}
              color={isSuccess ? "#4CAF50" : "#ef4444"}
            />
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Type</Text>
            <Text style={styles.detailValue}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </View>

          {phone !== "---" && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone Number</Text>
              <Text style={styles.detailValue}>{phone}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>
              ₦{amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Status</Text>
            <Text style={[styles.detailValue, { color: isSuccess ? "#4CAF50" : "#ef4444" }]}>
              {isSuccess ? "Success" : status}
            </Text>
          </View>

          <TouchableOpacity style={styles.detailRow} onPress={handleCopyId}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <View style={styles.copyRow}>
              <Text style={styles.detailValue} numberOfLines={1}>
                {transactionId.slice(0, 20)}...
              </Text>
              <MaterialCommunityIcons name="content-copy" size={14} color={COLORS.brand} />
            </View>
          </TouchableOpacity>

          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.detailLabel}>Transaction Date</Text>
            <Text style={styles.detailValue}>{displayDate}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleCopyId}>
            <MaterialCommunityIcons name="content-copy" size={18} color="#333" />
            <Text style={styles.secondaryButtonText}>Copy ID</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <MaterialCommunityIcons name="share-variant" size={18} color="#333" />
            <Text style={styles.secondaryButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Done Button */}
        <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  merchantSection: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 2,
    gap: 8,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${COLORS.brand}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  merchantName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  bundleName: {
    fontSize: 14,
    color: "#666",
  },
  amount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  detailsSection: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
  },
  copyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "flex-end",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  secondaryButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  doneButton: {
    backgroundColor: COLORS.brand,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Receipt;