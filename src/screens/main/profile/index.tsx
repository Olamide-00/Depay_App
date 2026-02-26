import { View, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import React from "react";
import Text from "../../../components/common/txt";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";
import ProfileMenuItem from "./component/item";
import { useNavigation } from "@react-navigation/native";
import useAuthStore from "../../../store/userStore";
import * as SecureStore from "expo-secure-store";

const Profile = () => {
  const navigation = useNavigation<any>();

  const userData = useAuthStore((state) => state.userData);
  const accountDetails = useAuthStore((state) => state.accountDetails);
  const logout = useAuthStore((state) => state.logout);

  const displayName = userData?.name || "User";
  const profilePicture = userData?.profilePicture;
  const account = accountDetails?.[0];
  const accountNumber = account?.accountNumber || "No account yet";
  const balance = userData?.balance ?? 0;
  const gender =
    typeof userData?.gender === "string" && userData.gender.length > 0
      ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)
      : null;
  const dateOfBirth = userData?.dateOfBirth
    ? new Date(userData.dateOfBirth).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const formatBalance = (amount: number) =>
    `₦${Number(amount).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("token");
          await SecureStore.deleteItemAsync("loginDate");
          await SecureStore.deleteItemAsync("isFreshLogin");
          logout();
        },
      },
    ]);
  };

  const handleViewProfile = () =>
    navigation.navigate("StackNav", { screen: "User" });
  const handleReferrals = () =>
    navigation.navigate("StackNav", { screen: "Refer" });
  const handleAnalytics = () => console.log("Navigate to Analytics");
  const handleSecurity = () =>
    navigation.navigate("StackNav", { screen: "Security" });
  const handleTheme = () => console.log("Navigate to Theme");
  const handleNotifications = () => console.log("Navigate to Notifications");
  const handleGenerateBankAccount = () =>
    navigation.navigate("StackNav", { screen: "Wallet" });
  const handleSupport = () =>
    navigation.navigate("StackNav", { screen: "Support" });
  const handleLegal = () =>
    navigation.navigate("StackNav", { screen: "Legal" });
  const handleJoinCommunity = () => console.log("Navigate to Join Community");
  const handleRateApp = () => console.log("Rate App");

  return (
    <View style={styles.root}>
      <CommonHeader title="Profile" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <Image
              source={
                profilePicture
                  ? { uri: profilePicture }
                  : { uri: "https://via.placeholder.com/50" }
              }
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <Text variant="bold" size="lg">
                {displayName}
              </Text>
              <Text size="sm" style={styles.accountNumber}>
                Account: {accountNumber}
              </Text>
              <Text size="sm" style={styles.walletBalance}>
                Balance: {formatBalance(balance)}
              </Text>
              {gender && (
                <Text size="sm" style={styles.accountNumber}>
                  Gender: {gender}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewProfileButton}
            onPress={handleViewProfile}
          >
            <Text style={styles.viewProfileText}>View</Text>
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

          {/* <ProfileMenuItem
            icon="stats-chart-outline"
            iconColor="#EF4444"
            iconBgColor="#FEF2F2"
            title="Analytics"
            onPress={handleAnalytics}
          /> */}

          <ProfileMenuItem
            icon="shield-checkmark-outline"
            iconColor="#10B981"
            iconBgColor="#F0FDF4"
            title="Security"
            onPress={handleSecurity}
          />

          {/* <ProfileMenuItem
            icon="color-palette-outline"
            iconColor="#F59E0B"
            iconBgColor="#FFFBEB"
            title="Theme"
            onPress={handleTheme}
          /> */}

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
