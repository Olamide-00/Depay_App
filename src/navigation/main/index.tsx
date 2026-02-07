import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "../../screens/main/home";
import { Platform } from "react-native";
import { Home2, Profile, Wallet, Category } from "iconsax-react-native";

// Import your other screens

// Define your tab param list for TypeScript
export type MainTabParamList = {
  HomeTab: undefined;
  CategoryTab: undefined;
  WalletTab: undefined;
  ProfileTab: undefined;
};

// Create the tab navigator instance
const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigation() {
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
        tabBarActiveTintColor: "#FF6B35", // Your brand color
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
        name="CategoryTab"
        component={Home}
        options={{
          tabBarLabel: "Category",
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
        component={Home}
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
