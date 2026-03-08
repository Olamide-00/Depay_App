import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "../../screens/main/home";
import ProfileScreen from "../../screens/main/profile";
import { Platform } from "react-native";
import { Home2, Profile, Wallet, Category } from "iconsax-react-native";
import { COLORS } from "../../constants/Colors";
import Service from "../../screens/main/service";
import Transaction from "../../screens/main/transaction";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type MainTabParamList = {
  HomeTab: undefined;
  Service: undefined;
  Transaction: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigation() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          height: Platform.OS === "ios" ? 85 : 60 + insets.bottom,
          paddingBottom: Platform.OS === "ios" ? 25 : 8 + insets.bottom,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.brand,
        tabBarInactiveTintColor: "#999999",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Home2
              size={size}
              color={color}
              variant={focused ? "Bold" : "Outline"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Service"
        component={Service}
        options={{
          tabBarLabel: "Service",
          tabBarIcon: ({ focused, color, size }) => (
            <Category
              size={size}
              color={color}
              variant={focused ? "Bold" : "Outline"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Transaction"
        component={Transaction}
        options={{
          tabBarLabel: "Transaction",
          tabBarIcon: ({ focused, color, size }) => (
            <Wallet
              size={size}
              color={color}
              variant={focused ? "Bold" : "Outline"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <Profile
              size={size}
              color={color}
              variant={focused ? "Bold" : "Outline"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
