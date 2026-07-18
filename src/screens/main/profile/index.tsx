import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../../components/common/txt";
import CommonHeader from "../../../components/ui/commonHeader";
import ProfileMenuItem from "./component/item";
import { useNavigation } from "@react-navigation/native";
import useAuthStore from "../../../store/userStore";
import * as SecureStore from "expo-secure-store";

const BRAND = "#1B3710";
const LIGHT_GREEN = "#EAF3E9";
const ACCENT_GREEN = "#A9D99B";
const INK = "#141613";
const MUTED = "#6B7268";
const SCREEN_BG = "#F7F9F6";

const Profile = () => {
  const navigation = useNavigation<any>();
  const [imageFailed, setImageFailed] = useState(false);

  const userData = useAuthStore((state) => state.userData);
  const accountDetails = useAuthStore((state) => state.accountDetails);
  const logout = useAuthStore((state) => state.logout);

  const displayName = userData?.name || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const profilePicture = userData?.profilePicture;
  const email = userData?.email || "";
  const account = accountDetails?.[0];
  const accountNumber = account?.accountNumber || null;

  const showImage = !!profilePicture && !imageFailed;

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

  const go = (screen: string) => () =>
    navigation.navigate("StackNav", { screen });

  return (
    <View style={styles.root}>
      <CommonHeader title="Profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── PROFILE CARD ── */}
        <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={0.85}
          onPress={go("User")}
        >
          {showImage ? (
            <Image
              source={{ uri: profilePicture }}
              style={styles.avatar}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text variant="bold" size="lg" color={ACCENT_GREEN}>
                {initial}
              </Text>
            </View>
          )}

          <View style={styles.profileText}>
            <Text variant="bold" size="lg" color="#fff">
              {displayName}
            </Text>
            <Text size="xs" color="rgba(255,255,255,0.7)" numberOfLines={1}>
              {accountNumber ? `Account · ${accountNumber}` : email}
            </Text>
          </View>

          <View style={styles.editBadge}>
            <Ionicons name="chevron-forward" size={16} color={BRAND} />
          </View>
        </TouchableOpacity>

        {/* ── ACCOUNT ── */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.group}>
          <ProfileMenuItem
            icon="card-outline"
            title="Bank Account"
            subtitle={accountNumber ?? "Generate your account number"}
            onPress={go("Wallet")}
          />
          <ProfileMenuItem
            icon="people-outline"
            title="Referrals"
            subtitle="Invite friends, earn rewards"
            onPress={go("Refer")}
          />
          <ProfileMenuItem
            icon="notifications-outline"
            title="Notifications"
            onPress={go("Notification")}
            isLast
          />
        </View>

        {/* ── SECURITY ── */}
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.group}>
          <ProfileMenuItem
            icon="shield-checkmark-outline"
            title="Security"
            subtitle="PIN, password & biometrics"
            onPress={go("Security")}
            isLast
          />
        </View>

        {/* ── SUPPORT ── */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.group}>
          <ProfileMenuItem
            icon="help-circle-outline"
            title="Help & Support"
            onPress={go("Support")}
          />
          <ProfileMenuItem
            icon="document-text-outline"
            title="Legal"
            onPress={go("Legal")}
          />
          <ProfileMenuItem
            icon="star-outline"
            title="Rate App"
            onPress={() => console.log("Rate App")}
            showChevron={false}
            isLast
          />
        </View>

        {/* ── LOG OUT ── */}
        <View style={[styles.group, styles.logoutGroup]}>
          <ProfileMenuItem
            icon="log-out-outline"
            title="Log Out"
            onPress={handleLogout}
            showChevron={false}
            danger
            isLast
          />
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SCREEN_BG,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  // ── Profile card ──────────────────────────────
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    backgroundColor: BRAND,
    borderRadius: 20,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarFallback: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(169,217,155,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileText: {
    flex: 1,
    gap: 2,
  },
  editBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ACCENT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Groups ────────────────────────────────────
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: "600",
    color: MUTED,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
  group: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
  },
  logoutGroup: {
    marginBottom: 12,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#AAB2A6",
  },
});
