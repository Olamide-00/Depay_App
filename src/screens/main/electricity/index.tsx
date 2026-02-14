import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";
import AirtimeTab from "./component/airtimeTab";
import DataTab from "./component/dataTab";
import { ContactsProvider } from "../../../utils/contactProvider";

const Electricity = () => {
  const [activeTab, setActiveTab] = useState<"airtime" | "data">("data");

  return (
    <ContactsProvider>
      <View style={styles.root}>
        <CommonHeader title="Electricity" back />

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "airtime" && styles.activeTab]}
            onPress={() => setActiveTab("airtime")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "airtime" && styles.activeTabText,
              ]}
            >
              Prepaid
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "data" && styles.activeTab]}
            onPress={() => setActiveTab("data")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "data" && styles.activeTabText,
              ]}
            >
              PostPaid
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === "airtime" ? <AirtimeTab /> : <DataTab />}
      </View>
    </ContactsProvider>
  );
};

export default Electricity;
