import { View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";
import AirtimeTab from "./component/airtimeTab";
import DataTab from "./component/dataTab";
import { ContactsProvider } from "../../../utils/contactProvider";
import Text from "../../../components/common/txt";

const Airtime = () => {
  const route = useRoute<any>();
  const initialType = route.params?.serviceType === "data" ? "data" : "airtime";
  const preselectedNetwork: string | undefined = route.params?.network;

  const [activeTab, setActiveTab] = useState<"airtime" | "data">(initialType);

  return (
    <ContactsProvider>
      <View style={styles.root}>
        <CommonHeader title="Airtime & Data" back />

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
              Airtime
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
