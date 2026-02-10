import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import Text from "../../../components/common/txt";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";
import ProfileMenuItem from "./component/item";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const navigation = useNavigation();
  // Navigation handlers
  const handleViewProfile = () => {
    navigation.navigate("StackNav", { screen: "User" });
  };

  const handleReferrals = () => {
    console.log("Navigate to Referrals");
    // navigation.navigate("Referrals");
  };

  const handleAnalytics = () => {
    console.log("Navigate to Analytics");
    // navigation.navigate("Analytics");
  };

  const handleSecurity = () => {
    console.log("Navigate to Security");
    // navigation.navigate("Security");
  };

  const handleTheme = () => {
    console.log("Navigate to Theme");
    // navigation.navigate("Theme");
  };

  const handleNotifications = () => {
    console.log("Navigate to Notifications");
    // navigation.navigate("Notifications");
  };

  const handleGenerateBankAccount = () => {
    console.log("Navigate to Generate Bank Account");
    // navigation.navigate("GenerateBankAccount");
  };

  const handleSupport = () => {
    console.log("Navigate to Support");
    // navigation.navigate("Support");
  };

  const handleLegal = () => {
    console.log("Navigate to Legal");
    // navigation.navigate("Legal");
  };

  const handleJoinCommunity = () => {
    console.log("Navigate to Join Community");
    // navigation.navigate("JoinCommunity");
  };

  const handleRateApp = () => {
    console.log("Rate App");
    // Open app store rating
  };

  const handleLogout = () => {
    console.log("Logout");
    // Show logout confirmation
  };

  return (
    <View style={styles.root}>
      <CommonHeader title="Profile" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: "https://via.placeholder.com/50" }}
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <Text variant="bold" size="lg">
                Olamide Oladele
              </Text>
              <Text size="sm" style={styles.accountNumber}>
                Account Number: 9036018013
              </Text>
              <Text size="sm" style={styles.walletBalance}>
                Wallet Balance: ₦18,288.00
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewProfileButton}
            onPress={handleViewProfile}
          >
            <Text style={styles.viewProfileText}>View Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <ProfileMenuItem
            icon="people-outline"
            iconColor="#6C2BD9"
            iconBgColor="#F5F3FF"
            title="Referrals"
            onPress={handleReferrals}
          />

          <ProfileMenuItem
            icon="stats-chart-outline"
            iconColor="#EF4444"
            iconBgColor="#FEF2F2"
            title="Analytics"
            onPress={handleAnalytics}
          />

          <ProfileMenuItem
            icon="shield-checkmark-outline"
            iconColor="#10B981"
            iconBgColor="#F0FDF4"
            title="Security"
            onPress={handleSecurity}
          />

          <ProfileMenuItem
            icon="color-palette-outline"
            iconColor="#F59E0B"
            iconBgColor="#FFFBEB"
            title="Theme"
            onPress={handleTheme}
          />

          <ProfileMenuItem
            icon="notifications-outline"
            iconColor="#3B82F6"
            iconBgColor="#EFF6FF"
            title="Notifications"
            onPress={handleNotifications}
          />

          <ProfileMenuItem
            icon="card-outline"
            iconColor="#8B5CF6"
            iconBgColor="#F5F3FF"
            title="Generate Bank Account"
            onPress={handleGenerateBankAccount}
          />

          <ProfileMenuItem
            icon="help-circle-outline"
            iconColor="#EF4444"
            iconBgColor="#FEF2F2"
            title="Support"
            onPress={handleSupport}
          />

          <ProfileMenuItem
            icon="document-text-outline"
            iconColor="#6B7280"
            iconBgColor="#F9FAFB"
            title="Legal"
            onPress={handleLegal}
          />

          <ProfileMenuItem
            icon="people-circle-outline"
            iconColor="#10B981"
            iconBgColor="#F0FDF4"
            title="Join Our Community"
            onPress={handleJoinCommunity}
          />

          <ProfileMenuItem
            icon="star-outline"
            iconColor="#F59E0B"
            iconBgColor="#FFFBEB"
            title="Rate App"
            onPress={handleRateApp}
            showChevron={false}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Profile;
