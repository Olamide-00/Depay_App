import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "../../screens/main/home";
import ProfileScreen from "../../screens/main/profile";
import { Platform, View, StyleSheet } from "react-native";
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

const SCREENS: Record<string, React.ComponentType<any>> = {
  HomeTab: Home,
  Service: Service,
  Transaction: Transaction,
  ProfileTab: ProfileScreen,
};

const TABS = [
  { name: "HomeTab", label: "Home", Icon: Home2 },
  { name: "Service", label: "Service", Icon: Category },
  { name: "Transaction", label: "Wallet", Icon: Wallet },
  { name: "ProfileTab", label: "Profile", Icon: Profile },
];

export default function TabNavigation() {
  const insets = useSafeAreaInsets();
  const botPad =
    Platform.OS === "android" ? Math.max(insets.bottom, 8) : insets.bottom;
  const tabH = Platform.OS === "ios" ? 68 : 62;

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => {
        const tab = TABS.find((t) => t.name === route.name)!;

        return {
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0,
            height: tabH + botPad,
            paddingBottom: botPad,
            paddingTop: 6,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 14,
          },
          tabBarActiveTintColor: COLORS.brand,
          tabBarInactiveTintColor: "#C0C0CC",
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
            marginTop: 2,
            letterSpacing: 0,
          },
          tabBarLabel: tab.label, // ← native label — no custom Text, no clipping
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <tab.Icon
                size={22}
                color={color}
                variant={focused ? "Bold" : "Outline"}
              />
              {/* Active dot under icon */}
              {focused && <View style={styles.dot} />}
            </View>
          ),
        };
      }}
    >
      {TABS.map((t) => (
        <Tab.Screen
          key={t.name}
          name={t.name as any}
          component={SCREENS[t.name]}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 32,
    borderRadius: 10,
    gap: 3,
  },
  iconWrapActive: {
    // no bg — dot does the work
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.brand,
  },
});
