import React, { useRef, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "../../screens/main/home";
import ProfileScreen from "../../screens/main/profile";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Home2, Profile, Wallet, Category } from "iconsax-react-native";
import Service from "../../screens/main/service";
import Transaction from "../../screens/main/transaction";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../../components/common/txt";

const BRAND = "#1B3710";
const BRAND_DEEP = "#122808";
const INACTIVE_ICON = "#8A9086";

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

// ─── One tab button — split native (transform) vs JS (layout/color) driven animations ──
const TabButton = ({
  focused,
  label,
  Icon,
  onPress,
}: {
  focused: boolean;
  label: string;
  Icon: React.ComponentType<any>;
  onPress: () => void;
}) => {
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: focused ? 1 : 0,
      useNativeDriver: false, // width/backgroundColor — JS driver only
      speed: 16,
      bounciness: 6,
    }).start();
  }, [focused]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true, // transform — native driver only
      speed: 50,
      bounciness: 0,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8,
    }).start();
  };

  const pillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [44, 118],
  });
  const pillBg = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0,0,0,0)", BRAND],
  });
  const labelOpacity = progress;
  const labelWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 70],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabTouchable}
    >
      {/* Outer view: native-driven scale ONLY */}
      <Animated.View style={{ transform: [{ scale }] }}>
        {/* Inner view: JS-driven width/backgroundColor ONLY */}
        <Animated.View
          style={[styles.pill, { width: pillWidth, backgroundColor: pillBg }]}
        >
          <Icon
            size={20}
            color={focused ? "#FFFFFF" : INACTIVE_ICON}
            variant={focused ? "Bold" : "Outline"}
          />
          <Animated.View
            style={{
              width: labelWidth,
              opacity: labelOpacity,
              overflow: "hidden",
            }}
          >
            <Text style={styles.pillLabel} numberOfLines={1}>
              {label}
            </Text>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── Custom tab bar — fully owns its own layout, no layering issues ──
const CustomTabBar = ({ state, navigation }: any) => {
  const insets = useSafeAreaInsets();

  // Float above the true bottom edge; on devices with a large inset
  // (Android 3-button nav, iOS home indicator) the gap grows accordingly
  // so the bar never crowds system UI.
  const bottomOffset =
    Math.max(insets.bottom, 12) + (Platform.OS === "android" ? 4 : 0);

  return (
    <View
      style={[styles.barWrapper, { paddingBottom: bottomOffset }]}
      pointerEvents="box-none"
    >
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const tab = TABS.find((t) => t.name === route.name)!;
          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabButton
              key={route.key}
              focused={focused}
              label={tab.label}
              Icon={tab.Icon}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
};

export default function TabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
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
  barWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: BRAND_DEEP,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 12,
  },
  tabTouchable: {
    borderRadius: 22,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 12,
  },
  pillLabel: {
    fontSize: 12.5,
    fontFamily: "Poppins-SemiBold",
    color: "#FFFFFF",
  },
});
