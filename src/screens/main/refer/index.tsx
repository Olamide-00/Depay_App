import {
  View,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";
import Text from "../../../components/common/txt";
import { Ionicons } from "@expo/vector-icons";

const Refer = () => {
  const [referralCode] = useState("JAANREF123");
  const [showEarningHistory, setShowEarningHistory] = useState(false);

  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    Alert.alert("Copied!", "Referral code copied to clipboard");
  };

  const handleShareCode = () => {
    console.log("Share referral code");
    // Implement share functionality
  };

  const handleViewEarnings = () => {
    setShowEarningHistory(!showEarningHistory);
  };

  return (
    <View style={styles.root}>
      <CommonHeader title="Referrals" back />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Refer Card */}
        <View style={styles.referCard}>
          <View style={styles.referHeader}>
            {/* Referral Icon using emoji/icon */}
            <View style={styles.referIconContainer}>
              <Text style={styles.referIconEmoji}>👋</Text>
            </View>
            <View style={styles.referTextContainer}>
              <Text style={styles.referTitle}>Refer Someone and Earn</Text>
              <Text style={styles.referDescription}>
                Share your referral code and earn{" "}
                <Text style={styles.bold}>5 7 rewards</Text> when they make
                their <Text style={styles.bold}>first ₦500 Account</Text>
              </Text>
            </View>
          </View>

          {/* Referral Code */}
          <View style={styles.codeContainer}>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{referralCode}</Text>
            </View>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyCode}
            >
              <Ionicons name="copy-outline" size={16} color="#6C2BD9" />
              <Text style={styles.copyText}>Copy Code</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {/* JPoints */}
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>JPoints</Text>
            <Text style={styles.statValue}>10</Text>
            <Text style={styles.statSubLabel}>Total</Text>
          </View>

          {/* Referrals Made */}
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Referrals Made</Text>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statSubLabel}>This Month</Text>
          </View>
        </View>

        {/* Earning History */}
        <View style={styles.earningSection}>
          <TouchableOpacity
            style={styles.earningHeader}
            onPress={handleViewEarnings}
          >
            <Text style={styles.earningTitle}>Earning History</Text>
            <View style={styles.earningHeaderRight}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons
                name={showEarningHistory ? "chevron-up" : "chevron-down"}
                size={16}
                color="#9CA3AF"
              />
            </View>
          </TouchableOpacity>

          {/* Earning Items */}
          {showEarningHistory && (
            <View style={styles.earningList}>
              <View style={styles.earningItem}>
                <View style={[styles.earningIconContainer, styles.greenBg]}>
                  <Ionicons name="arrow-down" size={16} color="#10B981" />
                </View>
                <View style={styles.earningDetails}>
                  <Text style={styles.earningName}>JPoints</Text>
                  <Text style={styles.earningDate}>Yesterday, 3:25PM</Text>
                </View>
              </View>

              <View style={styles.earningItem}>
                <View style={[styles.earningIconContainer, styles.blueBg]}>
                  <Ionicons name="card" size={16} color="#3B82F6" />
                </View>
                <View style={styles.earningDetails}>
                  <Text style={styles.earningName}>Coupon Purchase</Text>
                  <Text style={styles.earningDate}>Yesterday, 2:30PM</Text>
                </View>
              </View>

              <View style={styles.earningItem}>
                <View style={[styles.earningIconContainer, styles.redBg]}>
                  <Ionicons name="cart" size={16} color="#EF4444" />
                </View>
                <View style={styles.earningDetails}>
                  <Text style={styles.earningName}>Coupon Purchase</Text>
                  <Text style={styles.earningDate}>Yesterday, 2:30PM</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Share Code Button */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShareCode}>
          <Text style={styles.shareButtonText}>Share Code</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Refer;
