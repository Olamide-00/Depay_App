// Header.tsx
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "../common/txt";
import { useNavigation } from "@react-navigation/native";
import useAuthStore, { selectUserData } from "../../store/userStore";

const BRAND = "#1B3710";
const BRAND_DEEP = "#122808";
const LIGHT_GREEN = "#EAF3E9";
const ACCENT_GREEN = "#A9D99B";
const INK = "#141613";
const MUTED = "#8A9086";

interface HeaderProps {
  notificationCount?: number;
}

const Header = ({ notificationCount = 0 }: HeaderProps) => {
  const navigation = useNavigation<any>();
  const [imageFailed, setImageFailed] = useState(false);

  const userData = useAuthStore(selectUserData);
  const name = userData?.name || "User";
  const firstName = name.split(" ")[0];
  const initial = firstName.charAt(0).toUpperCase();
  const profilePicture = (userData as any)?.profilePicture;

  const showImage = !!profilePicture && !imageFailed;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <View style={styles.container}>
      {/* Left — avatar + greeting */}
      <TouchableOpacity
        style={styles.left}
        onPress={() => navigation.navigate("StackNav", { screen: "User" })}
        activeOpacity={0.8}
      >
        <View style={styles.avatarRing}>
          {showImage ? (
            <Image
              source={{ uri: profilePicture }}
              style={styles.avatarImage}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <View style={styles.avatar}>
              <Text variant="bold" size="md" color={ACCENT_GREEN}>
                {initial}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.greetingText}>
          <Text size="xs" color={MUTED} variant="regular">
            {getGreeting()} 👋
          </Text>
          <Text variant="bold" color={INK} style={styles.name}>
            {firstName}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Right — soft icon buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate("StackNav", { screen: "Support" })}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="headset" size={19} color={BRAND} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() =>
            navigation.navigate("StackNav", { screen: "Notification" })
          }
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="bell-outline" size={19} color={BRAND} />
          {notificationCount > 0 && (
            <View style={styles.notifBadge}>
              <Text
                size="xs"
                color="#fff"
                variant="bold"
                style={styles.notifCount}
              >
                {notificationCount > 9 ? "9+" : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  // ── Left ──────────────────────────────────────
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  avatarRing: {
    padding: 2.5,
    borderRadius: 26,
    backgroundColor: LIGHT_GREEN,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  greetingText: {
    gap: 1,
  },
  name: {
    fontSize: 17,
    letterSpacing: -0.3,
    lineHeight: 21,
  },

  // ── Right ─────────────────────────────────────
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  // Notification badge
  notifBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  notifCount: {
    fontSize: 9,
    lineHeight: 11,
  },
});
