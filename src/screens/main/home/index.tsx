import { View, ScrollView, RefreshControl } from "react-native";
import React, { useState, useCallback } from "react";
import { styles } from "./style";
import Header from "../../../components/ui/header";
import Dashboard from "./component/dashboard";
import Spacer from "../../../components/common/spacer";
import QuickAction from "./component/quickAction";
import Ad from "./component/ad";
import RecentTransaction from "./component/recentTransaction";
import { COLORS } from "../../../constants/Colors";

export function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // bump tick — Dashboard watches this to trigger its own refetch
    setRefreshTick((t) => t + 1);
    // spinner shows for ~1s then hides; Dashboard refetch handles actual timing
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <View style={styles.root}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.brand]}
            tintColor={COLORS.brand}
          />
        }
      >
        <Spacer size={2} />
        <Dashboard refreshTick={refreshTick} />
        <Spacer size={2} />
        <QuickAction />
        <Spacer size={1} />
        <Ad />
        <Spacer size={1} />
        <RecentTransaction />
      </ScrollView>
    </View>
  );
}

export default Home;
