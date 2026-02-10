import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "../../screens/main/home";
import ProfileScreen from "../../screens/main/profile";
import { Platform } from "react-native";
import { Home2, Profile, Wallet, Category } from "iconsax-react-native";
import { COLORS } from "../../constants/Colors";
import Service from "../../screens/main/service";

// Define your tab param list for TypeScript
export type MainTabParamList = {
  HomeTab: undefined;
  Service: undefined;
  WalletTab: undefined;
  ProfileTab: undefined;
};

// Create the tab navigator instance
const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          height: Platform.OS === "ios" ? 85 : 60,
          paddingBottom: Platform.OS === "ios" ? 25 : 8,
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
        name="WalletTab"
        component={Home}
        options={{
          tabBarLabel: "Wallet",
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
