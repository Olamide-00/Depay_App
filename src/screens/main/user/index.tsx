import { View, Animated, TouchableOpacity, StyleSheet } from "react-native";
import React, { useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import ProfileInfoItem from "./component/item";
import Text from "../../../components/common/txt";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuthStore from "../../../store/userStore";

const BRAND = "#1B3710";
const BRAND_DEEP = "#122808";
const ACCENT_GREEN = "#A9D99B";
const INK = "#141613";
const MUTED = "#6B7268";
const SCREEN_BG = "#F7F9F6";
const BORDER = "#ECEFEA";
const AMBER = "#E8862E";
const ERROR_RED = "#D92D20";

const BANNER_HEIGHT = 96;

const User = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const userData = useAuthStore((state: any) => state.userData);

  const scrollY = useRef(new Animated.Value(0)).current;

  const displayName = userData?.fullName || userData?.name || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const kycStatus: "verified" | "pending" | "unverified" =
    userData?.kycStatus ?? "unverified";

  const kycConfig = {
    verified: {
      label: "Verified",
      icon: "checkmark-circle" as const,
      tint: BRAND,
    },
    pending: { label: "Pending", icon: "time-outline" as const, tint: AMBER },
    unverified: {
      label: "Unverified",
      icon: "alert-circle-outline" as const,
      tint: ERROR_RED,
    },
  }[kycStatus];

  // Subtle parallax on the banner — the cover moves slower than the scroll,
  // a restrained effect rather than a dramatic collapse
  const bannerTranslate = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [-30, 0, 40],
    extrapolate: "clamp",
  });

  const bannerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.3, 1],
    extrapolateRight: "clamp",
  });

  const handleBack = () => navigation.goBack();
  const handleEdit = () => navigation.navigate("EditUser");

  return (
    <View style={styles.root}>
      {/* NAV BAR — floats above the banner, always visible */}
      <View style={[styles.navBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={8}
          style={styles.navButton}
        >
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Profile</Text>
        <TouchableOpacity onPress={handleEdit} hitSlop={8}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* BANNER */}
      <View style={styles.bannerClip}>
        <Animated.View
          style={[
            styles.banner,
            {
              height: BANNER_HEIGHT + insets.top + 40,
              transform: [
                { translateY: bannerTranslate },
                { scale: bannerScale },
              ],
            },
          ]}
        >
          {/* faint diagonal texture instead of a glow blob */}
          <View style={styles.bannerStripe} />
          <View style={[styles.bannerStripe, styles.bannerStripe2]} />
        </Animated.View>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: BANNER_HEIGHT + insets.top - 36 },
        ]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* IDENTITY ROW — avatar overlaps the banner's bottom edge */}
        <View style={styles.identityRow}>
          {userData?.profilePicture ? (
            <Image
              source={{ uri: userData.profilePicture }}
              style={styles.avatarImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text variant="bold" size="lg" color={ACCENT_GREEN}>
                {initial}
              </Text>
            </View>
          )}

          <View style={styles.identityText}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {displayName}
              </Text>
              <View
                style={[
                  styles.kycChip,
                  { backgroundColor: `${kycConfig.tint}14` },
                ]}
              >
                <Ionicons
                  name={kycConfig.icon}
                  size={11}
                  color={kycConfig.tint}
                />
                <Text style={[styles.kycChipText, { color: kycConfig.tint }]}>
                  {kycConfig.label}
                </Text>
              </View>
            </View>
            <Text style={styles.email} numberOfLines={1}>
              {userData?.email || "---"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Personal details</Text>
        <View style={styles.card}>
          <ProfileInfoItem
            icon="person-outline"
            label="Full Name"
            value={displayName}
          />
          <ProfileInfoItem
            icon="mail-outline"
            label="Email Address"
            value={userData?.email || "---"}
          />
          <ProfileInfoItem
            icon="call-outline"
            label="Phone Number"
            value={userData?.phoneNumber || "---"}
          />
          <ProfileInfoItem
            icon="calendar-outline"
            label="Date of Birth"
            value={
              userData?.dateOfBirth
                ? new Date(userData.dateOfBirth).toLocaleDateString("en-NG")
                : "---"
            }
          />
          <ProfileInfoItem
            icon="male-female-outline"
            label="Gender"
            value={
              userData?.gender
                ? userData.gender.charAt(0).toUpperCase() +
                  userData.gender.slice(1)
                : "---"
            }
            isLast
          />
        </View>

        <Text style={styles.sectionTitle}>Verification</Text>
        <View style={styles.card}>
          <ProfileInfoItem
            icon={kycConfig.icon}
            label="KYC Status"
            value={kycConfig.label}
            tint={kycConfig.tint}
            isLast
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SCREEN_BG,
  },

  // ── Nav bar ───────────────────────────────────
  navBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: 14.5,
    fontFamily: "Poppins-SemiBold",
    color: "#FFFFFF",
  },
  editButton: {
    fontSize: 13.5,
    fontFamily: "Poppins-SemiBold",
    color: "#FFFFFF",
  },

  // ── Banner ────────────────────────────────────
  bannerClip: {
    height: BANNER_HEIGHT,
    overflow: "hidden",
  },
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: BRAND,
    overflow: "hidden",
  },
  bannerStripe: {
    position: "absolute",
    width: "70%",
    height: 220,
    backgroundColor: BRAND_DEEP,
    opacity: 0.4,
    transform: [{ rotate: "-18deg" }],
    top: -60,
    left: -40,
  },
  bannerStripe2: {
    left: undefined,
    right: -60,
    top: -20,
    opacity: 0.25,
  },

  // ── Identity row ──────────────────────────────
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  avatarFallback: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: BRAND,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  identityText: {
    flex: 1,
    marginLeft: 12,
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 17,
    fontFamily: "Poppins-SemiBold",
    color: INK,
    flexShrink: 1,
  },
  email: {
    fontSize: 12.5,
    fontFamily: "Poppins-Regular",
    color: MUTED,
    marginTop: 2,
  },
  kycChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  kycChipText: {
    fontSize: 10,
    fontFamily: "Poppins-SemiBold",
  },

  // ── Body ──────────────────────────────────────
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: MUTED,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BORDER,
  },
});
