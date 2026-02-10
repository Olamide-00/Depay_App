import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../../../components/common/txt";

interface ProfileInfoItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  iconColor?: string;
}

const ProfileInfoItem: React.FC<ProfileInfoItemProps> = ({
  icon,
  label,
  value,
  iconColor = "#6C2BD9",
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    marginBottom: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F5F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "400",
  },
  value: {
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },
});

export default ProfileInfoItem;
