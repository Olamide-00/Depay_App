import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  Alert,
  Image,
  Share,
} from "react-native";
import React, { useRef } from "react";
import { COLORS } from "../../../constants/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useAuthStore from "../../../store/userStore";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import Text from "../../../components/common/txt";

const Receipt = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const transaction = route.params?.transaction || {};
  const receiptRef = useRef<any>(null);

  const userData = useAuthStore((state) => state.userData);

  const label = transaction.service || transaction.label || "Transaction";
  const amount = parseFloat(transaction.amount) || 0;
  const rawStatus = transaction.status || "pending";
  const status = rawStatus.toUpperCase(); // normalize — API returns "SUCCESS"
  const category = transaction.service || transaction.category || "wallet";
  const dateStr = transaction.transaction_date || transaction.date || "";
  const displayDate = dateStr
    ? new Date(dateStr).toLocaleString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "---";
  const transactionId =
    transaction.transaction_id || // ← primary: from log
    transaction.transactionReference || // ← fallback 1
    transaction._id || // ← fallback 2
    transaction.id ||
    "---";
  const beneficiary =
    transaction.unique_element || // ← phone/meter/decoder used for the service
    transaction.beneficiary ||
    transaction.phone ||
    transaction.email ||
    userData?.email ||
    "---";
  const referralCode = userData?.tag ? `JAAN${userData.tag}` : "JAANREF123";
  const isSuccess = status === "SUCCESS";

  const handleCopyId = () => {
    Clipboard.setString(transactionId);
    Alert.alert("Copied", "Transaction ID copied to clipboard");
  };

  const handleCopyReferral = () => {
    Clipboard.setString(referralCode);
    Alert.alert("Copied", "Referral code copied to clipboard");
  };

  // ─── Download: capture receipt as PNG and save to gallery ───
  const handleDownload = async () => {
    try {
      const { status: permStatus } =
        await MediaLibrary.requestPermissionsAsync();
      if (permStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to save the receipt.",
        );
        return;
      }

      const uri = await captureRef(receiptRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Saved!", "Receipt saved to your photo gallery.");
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "Could not save receipt. Please try again.");
    }
  };

  // ─── Share: capture receipt then open native share sheet ───
  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        // Fallback to text share
        await Share.share({
          message: `JAAN Transaction Receipt\n\nType: ${category}\nAmount: ₦${amount.toLocaleString(
            "en-NG",
            { minimumFractionDigits: 2 },
          )}\nStatus: ${status}\nDate: ${displayDate}\nTransaction ID: ${transactionId}`,
          title: "Transaction Receipt",
        });
        return;
      }

      const uri = await captureRef(receiptRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });

      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "Share Transaction Receipt",
        UTI: "public.png",
      });
    } catch (error) {
      console.error("Share error:", error);
      Alert.alert("Error", "Could not share receipt. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header — outside capture so it doesn't appear in saved image */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Receipt</Text>
        <TouchableOpacity style={styles.alertButton}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={22}
            color={COLORS.brand}
          />
        </TouchableOpacity>
      </View>

      {/* ─── ViewShot wraps only the receipt content ─── */}
      <ViewShot ref={receiptRef} options={{ format: "png", quality: 1 }}>
        <View style={styles.captureWrapper}>
          {/* Top Card */}
          <View style={styles.topCard}>
            <View style={styles.logoRow}>
              <Image
                source={require("../../../../assets/images/logo2.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.bundleName}>{label}</Text>

            <Text style={styles.amount}>
              ₦{" "}
              {amount.toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {isSuccess
                  ? "Successful"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
              <MaterialCommunityIcons
                name={isSuccess ? "check-circle" : "close-circle"}
                size={16}
                color={isSuccess ? "#22c55e" : "#ef4444"}
              />
            </View>
          </View>

          {/* Transaction Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Transaction Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction Type</Text>
              <Text style={styles.detailValue}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Beneficiary</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {beneficiary}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailValue}>
                ₦ {amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction Status</Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: isSuccess ? "#22c55e" : "#ef4444" },
                ]}
              >
                {isSuccess ? "Success" : status}
              </Text>
            </View>

            <TouchableOpacity style={styles.detailRow} onPress={handleCopyId}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <View style={styles.copyRow}>
                <Text style={styles.detailValue} numberOfLines={1}>
                  {transactionId.length > 16
                    ? transactionId.slice(0, 16) + "..."
                    : transactionId}
                </Text>
                <MaterialCommunityIcons
                  name="content-copy"
                  size={14}
                  color={COLORS.brand}
                />
              </View>
            </TouchableOpacity>

            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>Transaction Date</Text>
              <Text style={styles.detailValue}>{displayDate}</Text>
            </View>
          </View>

          {/* Referral Code */}
          <View style={styles.referralCard}>
            <Text style={styles.referralHint}>
              Share your Referral Code with more friends to earn more Bonus.
            </Text>
            <View style={styles.referralCodeRow}>
              <Text style={styles.referralCode}>{referralCode}</Text>
              <TouchableOpacity onPress={handleCopyReferral}>
                <MaterialCommunityIcons
                  name="content-copy"
                  size={18}
                  color={COLORS.brand}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ViewShot>

      {/* Action Buttons — outside capture */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleDownload}
        >
          <MaterialCommunityIcons
            name="download-outline"
            size={20}
            color="#333"
          />
          <Text style={styles.secondaryButtonText}>Download</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
          <MaterialCommunityIcons
            name="share-variant-outline"
            size={20}
            color="#333"
          />
          <Text style={styles.secondaryButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Done Button */}
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  captureWrapper: {
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 38,
    paddingBottom: 14,
    backgroundColor: "#F5F5F5",
  },
  backButton: {
    width: 36,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  alertButton: {
    width: 36,
    alignItems: "flex-end",
  },
  topCard: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 6,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  logoEmoji: {
    fontSize: 22,
  },
  logoImage: {
    width: 80,
    height: 28,
  },
  bundleName: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  amount: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#22c55e",
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    marginTop: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  detailLabel: {
    fontSize: 13,
    color: "#888",
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
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
  referralCard: {
    backgroundColor: "#FFFFFF",
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  referralHint: {
    fontSize: 12,
    color: "#888",
    marginBottom: 10,
  },
  referralCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F5FF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EDE9FE",
  },
  referralCode: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    flex: 1,
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  doneButton: {
    backgroundColor: COLORS.brand,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 36,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Receipt;
