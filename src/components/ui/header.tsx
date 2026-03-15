// Header.tsx
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "../common/txt";
import { useNavigation } from "@react-navigation/native";
import useAuthStore, { selectUserData } from "../../store/userStore";

const Header = () => {
  const navigation = useNavigation<any>();

  const userData = useAuthStore(selectUserData);
  const name = userData?.name || "User";
  const firstName = name.split(" ")[0];
  const initial = firstName.charAt(0).toUpperCase();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
    SS;
  };

  return (
    <View style={styles.container}>
      {/* Left — avatar + greeting */}
      <TouchableOpacity
        style={styles.greetingRow}
        onPress={() => navigation.navigate("StackNav", { screen: "User" })}
        activeOpacity={0.75}
      >
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text variant="bold" size="lg" color="#fff">
              {initial}
            </Text>
          </View>
          {/* Online dot */}
          <View style={styles.onlineDot} />
        </View>

        {/* Greeting text */}
        <View style={styles.greetingText}>
          <Text
            size="xs"
            color="#9A9AA0"
            variant="regular"
            style={styles.greeting}
          >
            {getGreeting()} 👋
          </Text>
          <Text variant="bold" size="lg" color="#1A1A1E" style={styles.name}>
            {firstName}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Right — action buttons */}
      <View style={styles.actions}>
        {/* Customer care */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate("StackNav", { screen: "Support" })}
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons name="headset" size={20} color="#7B3FE4" />
        </TouchableOpacity>

        {/* Notification */}
        <TouchableOpacity
          style={[styles.iconBtn, styles.iconBtnDark]}
          onPress={() =>
            navigation.navigate("StackNav", { screen: "Notification" })
          }
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons
            name="bell-outline"
            size={20}
            color="#1A1A1E"
          />
          <View style={styles.notifBadge}>
            <Text
              size="xs"
              color="#fff"
              variant="bold"
              style={styles.notifCount}
            >
              3
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",

    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // ── Left ──────────────────────────────────────
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  // Avatar
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#7B3FE4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#7B3FE4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#EDE1FF",
  },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "#fff",
  },

  // Greeting
  greetingText: {
    gap: 1,
  },
  greeting: {
    letterSpacing: 0.1,
  },
  name: {
    letterSpacing: -0.3,
  },

  // ── Right ─────────────────────────────────────
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F0E8FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8D9FF",
  },
  iconBtnDark: {
    backgroundColor: "#F5F5F7",
    borderColor: "#EFEFEF",
  },

  // Notification badge
  notifBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  notifCount: {
    fontSize: 9,
    lineHeight: 11,
  },
});
