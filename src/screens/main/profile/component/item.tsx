import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../../../components/common/txt";

const BRAND = "#1B3710";
const LIGHT_GREEN = "#EAF3E9";
const INK = "#141613";

interface ProfileMenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  /** For destructive rows like logout */
  danger?: boolean;
  /** Hide the divider on the last row of a group */
  isLast?: boolean;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  danger = false,
  isLast = false,
}) => {
  const tint = danger ? "#D92D20" : BRAND;
  const bg = danger ? "#FEF0EF" : LIGHT_GREEN;

  return (
    <TouchableOpacity
      style={[styles.menuItem, !isLast && styles.withDivider]}
      onPress={onPress}
      activeOpacity={0.65}
    >
      <View style={[styles.iconContainer, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={18} color={tint} />
      </View>

      <View style={styles.textBlock}>
        <Text style={[styles.menuText, danger && { color: "#D92D20" }]}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {showChevron && (
        <Ionicons name="chevron-forward" size={18} color="#C2C9BE" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  withDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#F2F5F0",
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    flex: 1,
    gap: 1,
  },
  menuText: {
    fontSize: 15,
    color: INK,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 12,
    color: "#8A9086",
  },
});

export default ProfileMenuItem;
