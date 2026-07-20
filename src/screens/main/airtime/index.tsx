import { View, TouchableOpacity, Animated, StyleSheet } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import CommonHeader from "../../../components/ui/commonHeader";
import AirtimeTab from "./component/airtimeTab";
import DataTab from "./component/dataTab";
import { ContactsProvider } from "../../../utils/contactProvider";
import Text from "../../../components/common/txt";

const BRAND = "#1B3710";
const LIGHT_GREEN = "#EAF3E9";
const MUTED = "#6B7268";

const Airtime = () => {
  const route = useRoute<any>();
  const initialType = route.params?.serviceType === "data" ? "data" : "airtime";
  const preselectedNetwork: string | undefined = route.params?.network;

  const [activeTab, setActiveTab] = useState<"airtime" | "data">(initialType);
  const [tabWidth, setTabWidth] = useState(0);
  const indicatorX = useRef(
    new Animated.Value(initialType === "data" ? 1 : 0)
  ).current;

  useEffect(() => {
    Animated.spring(indicatorX, {
      toValue: activeTab === "data" ? 1 : 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 4,
    }).start();
  }, [activeTab]);

  const translateX = indicatorX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });

  return (
    <ContactsProvider>
      <View style={styles.root}>
        <CommonHeader title="Airtime & Data" back />

        {/* Tabs */}
        <View
          style={styles.tabContainer}
          onLayout={(e) => setTabWidth((e.nativeEvent.layout.width - 8) / 2)}
        >
          {tabWidth > 0 && (
            <Animated.View
              style={[
                styles.indicator,
                { width: tabWidth, transform: [{ translateX }] },
              ]}
            />
          )}

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab("airtime")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "airtime" && styles.activeTabText,
              ]}
            >
              Airtime
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab("data")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "data" && styles.activeTabText,
              ]}
            >
              Data
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content — only the tab matching the hint gets the preselect */}
        {activeTab === "airtime" ? (
          <AirtimeTab
            preselectedNetwork={
              initialType === "airtime" ? preselectedNetwork : undefined
            }
          />
        ) : (
          <DataTab
            preselectedNetwork={
              initialType === "data" ? preselectedNetwork : undefined
            }
          />
        )}
      </View>
    </ContactsProvider>
  );
};

export default Airtime;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: LIGHT_GREEN,
    borderRadius: 14,
    padding: 4,
  },
  indicator: {
    position: "absolute",
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: MUTED,
  },
  activeTabText: {
    color: BRAND,
    fontFamily: "Poppins-SemiBold",
  },
});
