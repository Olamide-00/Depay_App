import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";

const Receipt = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction Receipt</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Text style={styles.infoIcon}>ⓘ</Text>
          </TouchableOpacity>
        </View>

        {/* Merchant Info */}
        <View style={styles.merchantSection}>
          <Text style={styles.emoji}>👋</Text>
          <Text style={styles.merchantName}>JAAN</Text>
          <Text style={styles.bundleName}>MTN 125GB MT Bundle</Text>
          <Text style={styles.amount}>₦ 20,000</Text>
          <View style={styles.successBadge}>
            <Text style={styles.successText}>Successful</Text>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Type</Text>
            <Text style={styles.detailValue}>Internet Purchase</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>PhoneNumber</Text>
            <Text style={styles.detailValue}>080×××××××5682</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>₦ 20,002</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Status</Text>
            <Text style={styles.detailValueSuccess}>Success</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <Text style={styles.detailValue}>2025700097640×××××31</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Date</Text>
            <Text style={styles.detailValue}>Feb 8th, 2025 10:41:44PM</Text>
          </View>
        </View>

        {/* Referral Banner */}
        <View style={styles.referralBanner}>
          <Text style={styles.referralText}>
            Share your Referral Code with more friends to earn more Bonus
          </Text>
          <View style={styles.referralCode}>
            <Text style={styles.referralCodeText}>JAANREF123</Text>
            <Text style={styles.copyIcon}>📋</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.downloadIcon}>⬇</Text>
            <Text style={styles.secondaryButtonText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.shareIcon}>⤴</Text>
            <Text style={styles.secondaryButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Done Button */}
        <TouchableOpacity style={styles.doneButton}>
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
  backIcon: {
    fontSize: 24,
    color: "#333",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  infoButton: {
    width: 40,
    alignItems: "flex-end",
  },
  infoIcon: {
    fontSize: 20,
    color: "#FF6B6B",
  },
  merchantSection: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 2,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  merchantName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  bundleName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  amount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  successText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 5,
  },
  checkmark: {
    color: "#4CAF50",
    fontSize: 14,
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
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  detailValueSuccess: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  referralBanner: {
    backgroundColor: "#FFF9E6",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },
  referralText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
    lineHeight: 18,
  },
  referralCode: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  referralCodeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  copyIcon: {
    fontSize: 16,
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
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  downloadIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  shareIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  doneButton: {
    backgroundColor: "#7C4DFF",
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
