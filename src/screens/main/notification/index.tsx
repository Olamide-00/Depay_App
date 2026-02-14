import { View, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { styles } from "./style";
import Text from "../../../components/common/txt";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Notification = () => {
  const navigation = useNavigation();
  const notifications = [
    {
      id: 1,
      icon: "💰",
      title: "🎉 Special Offer",
      message:
        "Get 30% bonus on your MTN Airtime funny Recharge from 4th- 9th January! Don't miss out on this great opportunity to save on airtime for your calls, data, and SMS.",
      time: "10:39 AM, February 2, 2025",
      isNew: true,
      onPress: () => console.log("Special Offer clicked"),
    },
    {
      id: 2,
      icon: "📱",
      title: "New Feature Unlocked!",
      message:
        "Congratulations! You've unlocked 3 Tokens for referring 3 friends to create account. This bonus has been added to your JARA wallet. Use it to make payments, send transfers, and more.",
      time: "04:37 PM, January 7, 2025",
      isNew: false,
      onPress: () => console.log("New Feature clicked"),
    },
    {
      id: 3,
      icon: "✅",
      title: "Payment Successful!",
      message:
        "Your payment of ₦4,500 to Ikeja Electricity Distribution Company for transaction reference 'RU12345' has been successfully processed. Transaction ID is 98765432.",
      time: "07:37 AM, January 5, 2025",
      isNew: false,
      onPress: () => console.log("Payment Successful clicked"),
    },
    {
      id: 4,
      icon: "💰",
      title: "Flash Sale!",
      message:
        "Lightning Deal! 20% cashback for the next 24 hours. Don't miss out on this limited time offer!",
      time: "01:27 PM, January 7, 2025",
      isNew: false,
      onPress: () => console.log("Flash Sale clicked"),
    },
    {
      id: 5,
      icon: "🎁",
      title: "New Redeem Bill Payment Reminders",
      message:
        "Never miss a due date! Enable bill payment reminders and we'll notify you 24h early. More miss a payment again and avoid late fees.",
      time: "05:39 AM, January 5, 2025",
      isNew: false,
      onPress: () => console.log("Bill Payment Reminders clicked"),
    },
    {
      id: 6,
      icon: "👤",
      title: "Profile Updated Successfully",
      message:
        "Your profile picture has been successfully updated. You can now use it across the app.",
      time: "03:15 PM, January 4, 2025",
      isNew: false,
      onPress: () => console.log("Profile Updated clicked"),
    },
  ];

  return (
    <View style={styles.root}>
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={styles.notificationCard}
            onPress={notification.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.notificationHeader}>
              <View style={styles.titleContainer}>
                <Text style={styles.notificationIcon}>{notification.icon}</Text>
                <Text style={styles.notificationTitle}>
                  {notification.title}
                </Text>
              </View>
              {notification.isNew && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>New</Text>
                </View>
              )}
            </View>

            <Text style={styles.notificationMessage} numberOfLines={3}>
              {notification.message}
            </Text>

            <View style={styles.notificationFooter}>
              <Text style={styles.notificationTime}>{notification.time}</Text>
              <TouchableOpacity onPress={notification.onPress}>
                <Text style={styles.viewLink}>View</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Notification;
