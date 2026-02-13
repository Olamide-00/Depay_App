import { View, Text, TouchableOpacity, Switch } from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Security = () => {
  const navigation = useNavigation();
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  return (
    <View style={styles.root}>
      <CommonHeader title="Security" back />
      <View style={styles.container}>
        <View style={styles.menuContainer}>
          {/* Biometrics */}
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="finger-print-outline"
                  size={24}
                  color="#8B5CF6"
                />
              </View>
              <Text style={styles.menuText}>Biometrics</Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: "#E5E7EB", true: "#8B5CF6" }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Change Pin */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate("StackNav", { screen: "ChangePIN1" })
            }
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="keypad-outline" size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.menuText}>Change Pin</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Change Password */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate("StackNav", { screen: "ChangePassword" })
            }
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color="#8B5CF6"
                />
              </View>
              <Text style={styles.menuText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Security;
