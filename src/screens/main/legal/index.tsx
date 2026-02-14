import { View, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "./style";
import Text from "../../../components/common/txt";
import CommonHeader from "../../../components/ui/commonHeader";
import { Ionicons } from "@expo/vector-icons";

const Legal = () => {
  const legalItems = [
    {
      id: 1,
      title: "Terms and Conditions",
      icon: "document-text-outline",
      onPress: () => {
        // Navigate to Terms and Conditions
        console.log("Navigate to Terms and Conditions");
      },
    },
    {
      id: 2,
      title: "Privacy Policies",
      icon: "shield-checkmark-outline",
      onPress: () => {
        // Navigate to Privacy Policies
        console.log("Navigate to Privacy Policies");
      },
    },
    {
      id: 3,
      title: "FAQs",
      icon: "help-circle-outline",
      onPress: () => {
        // Navigate to FAQs
        console.log("Navigate to FAQs");
      },
    },
    {
      id: 4,
      title: "AML & KYC Policy",
      icon: "document-lock-outline",
      onPress: () => {
        // Navigate to AML & KYC Policy
        console.log("Navigate to AML & KYC Policy");
      },
    },
  ];

  return (
    <View style={styles.root}>
      <CommonHeader title="Legal" back />
      <View style={styles.container}>
        <View style={styles.menuContainer}>
          {legalItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === legalItems.length - 1 && styles.menuItemLast,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon} size={22} color="#8B5CF6" />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Legal;
