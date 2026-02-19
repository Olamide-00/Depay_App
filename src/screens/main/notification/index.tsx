import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import Text from "../../../components/common/txt";
import { COLORS } from "../../../constants/Colors";
import useAuthStore from "../../../store/userStore";
import { useGetBillsHistory } from "../../../api/hooks/useBills";
import CommonHeader from "../../../components/ui/commonHeader";

type NotificationItem = {
  _id?: string;
  id?: string;
  service?: string;
  label?: string;
  amount?: string | number;
  status?: string;
  date?: string;
  transaction_date?: string;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "Unknown Date";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
};

const formatAmount = (amount?: string | number) => {
  if (!amount) return "₦0.00";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(Number(amount));
};

// Skeleton loader — matches completed project
const SkeletonLoader = () => (
  <MotiView
    from={{ opacity: 0.3 }}
    animate={{ opacity: 0.8 }}
    transition={{ loop: true, type: "timing", duration: 1000 }}
    style={styles.skeletonCard}
  >
    <View style={styles.skeletonLeft}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonSubtitle} />
    </View>
    <View style={styles.skeletonRight}>
      <View style={styles.skeletonAmount} />
      <View style={styles.skeletonStatus} />
    </View>
  </MotiView>
);

const EmptyState = ({ message, showDateHint = false }: { message: string; showDateHint?: boolean }) => (
  <View style={styles.emptyContainer}>
    <MaterialIcons name="notifications-none" size={48} color="rgba(108, 43, 217, 0.25)" />
    <Text style={styles.emptyText}>{message}</Text>
    {showDateHint && (
      <Text style={styles.emptySubtext}>Try selecting a different date</Text>
    )}
  </View>
);

const Notification = () => {
  const navigation = useNavigation<any>();
  const [selectedDate, setSelectedDate] = useState("");

  const userData = useAuthStore((state: any) => state.userData);
  const email = userData?.email || "";

  const { data: notifications = [], isLoading, isError } = useGetBillsHistory(email);

  // Filter by selected date — same logic as completed project
  const filteredNotifications = selectedDate
    ? notifications.filter((item: NotificationItem) => {
        const itemDate = formatDate(item.transaction_date || item.date);
        return itemDate === formatDate(selectedDate);
      })
    : notifications;

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const isFailed = item.status === "FAILED" || item.status === "failed";
    const statusColor = isFailed ? "#ef4444" : "#10b981";
    const statusBg = isFailed ? "#fef2f2" : "#f0fdf4";
    const statusBorder = isFailed ? "#fecaca" : "#bbf7d0";
    const displayDate = formatDate(item.transaction_date || item.date);

    return (
      <View style={styles.notificationCard}>
        {/* Coloured left strip */}
        <View style={[styles.statusStrip, { backgroundColor: statusColor }]} />

        <View style={styles.cardContent}>
          {/* Left */}
          <View style={styles.leftSection}>
            <View style={styles.iconContainer}>
              <MaterialIcons
                name={isFailed ? "error-outline" : "check-circle-outline"}
                size={22}
                color={statusColor}
              />
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.serviceName} numberOfLines={1}>
                {item.service || item.label || "Transaction"}
              </Text>
              <View style={styles.metaRow}>
                <MaterialIcons name="schedule" size={13} color="#6b7280" />
                <Text style={styles.dateText}>{displayDate}</Text>
              </View>
            </View>
          </View>

          {/* Right */}
          <View style={styles.rightSection}>
            <Text style={[styles.amount, { color: statusColor }]}>
              {formatAmount(item.amount)}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusBg, borderColor: statusBorder }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {(item.status || "PENDING").toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <MaterialIcons
          name="chevron-right"
          size={20}
          color="rgba(107, 114, 128, 0.3)"
        />
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <CommonHeader title="Notifications" back />

      {/* Simple date text filter */}
      <View style={styles.dateRow}>
        <MaterialIcons name="date-range" size={18} color={COLORS.brand} />
        <Text style={styles.dateLabel}>Filter by Date</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isLoading ? (
          <FlatList
            data={[1, 2, 3, 4, 5]}
            keyExtractor={(item) => item.toString()}
            renderItem={() => <SkeletonLoader />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : isError || notifications.length === 0 ? (
          <EmptyState message="No notifications at the moment" />
        ) : filteredNotifications.length > 0 ? (
          <FlatList
            data={filteredNotifications}
            keyExtractor={(item, index) => item._id || item.id || index.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            updateCellsBatchingPeriod={50}
            windowSize={5}
          />
        ) : (
          <EmptyState message="No notifications found" showDateHint={!!selectedDate} />
        )}
      </View>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.5%"),
  },
  dateLabel: {
    fontSize: 14,
    color: COLORS.brand,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("4%"),
    gap: hp("1.2%"),
  },

  // Notification card
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(108, 43, 217, 0.08)",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    overflow: "hidden",
  },
  statusStrip: {
    width: 4,
    alignSelf: "stretch",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1.8%"),
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: wp("3%"),
  },
  iconContainer: {
    width: hp("5%"),
    height: hp("5%"),
    borderRadius: hp("2.5%"),
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  detailsContainer: {
    flex: 1,
    gap: hp("0.3%"),
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1%"),
  },
  dateText: {
    fontSize: 12,
    color: "#6b7280",
  },
  rightSection: {
    alignItems: "flex-end",
    gap: hp("0.5%"),
  },
  amount: {
    fontSize: 14,
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: wp("2%"),
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },

  // Skeleton
  skeletonCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
    borderRadius: 14,
  },
  skeletonLeft: { flex: 1, gap: hp("0.5%") },
  skeletonTitle: { width: wp("35%"), height: 14, backgroundColor: "#e5e7eb", borderRadius: 4 },
  skeletonSubtitle: { width: wp("25%"), height: 12, backgroundColor: "#f3f4f6", borderRadius: 4 },
  skeletonRight: { alignItems: "flex-end", gap: hp("0.5%") },
  skeletonAmount: { width: wp("18%"), height: 14, backgroundColor: "#e5e7eb", borderRadius: 4 },
  skeletonStatus: { width: wp("14%"), height: 12, backgroundColor: "#f3f4f6", borderRadius: 4 },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: hp("1.5%"),
    paddingTop: hp("6%"),
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 12,
    color: "#d1d5db",
    textAlign: "center",
  },
});