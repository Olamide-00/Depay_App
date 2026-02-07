import { Text, View } from "react-native";
import React, { Component } from "react";
import { styles } from "./style";
import Header from "../../../components/ui/header";
import Dashboard from "./component/dashboard";
import Spacer from "../../../components/common/spacer";
import QuickAction from "./component/quickAction";
import Ad from "./component/ad";
import RecentTransaction from "./component/recentTransaction";

export class Home extends Component {
  render() {
    return (
      <View style={styles.root}>
        <Header />
        <Spacer size={2} />
        <Dashboard />
        <Spacer size={2} />
        <QuickAction />
        <Spacer size={1} />
        <Ad />
        <Spacer size={1} />
        <RecentTransaction />
      </View>
    );
  }
}

export default Home;
