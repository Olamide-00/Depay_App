import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/Colors";
import Text from "../../../../components/common/txt";
import TopUpModal from "./topupModal";
import { io } from "socket.io-client";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useAuthStore from "../../../../store/userStore";
import { useGetBalance } from "../../../../api/hooks/useAuth";

const SOCKET_URL = "https://jaa.up.railway.app";

const Dashboard = () => {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(null);

  const userData = useAuthStore((state) => state.userData);
  const accountDetails = useAuthStore((state) => state.accountDetails);

  const email = userData?.email || "";
  const displayName = userData?.name || "User";

  // Account details from store
  const account = accountDetails?.[0]; // first account
  const accountNumber = account?.accountNumber || "—";
  const bankName = account?.bankName || "JAAN";

  // Truncate long names cleanly
  const truncate = (str: string, max: number) =>
    str?.length > max ? str.slice(0, max) + "…" : str;

  const accountLabel = `${accountNumber} (${bankName}/${truncate(displayName.toUpperCase(), 14)})`;

  // Socket
  useEffect(() => {
    if (!email) return;

    const socket = io(SOCKET_URL);
    socket.emit("join", email);

    socket.on("balance_updated", (data) => {
      setCurrentBalance(data.newBalance);
    });

    return () => {
      socket.off("balance_updated");
      socket.disconnect();
    };
  }, [email]);

  // Balance REST fetch
  const { balance, refetch, isLoading: balanceLoading } = useGetBalance(email);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const formatCurrency = (amount: number) =>
    Number(amount).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const rawBalance = currentBalance ?? balance?.data ?? "0.00";

  const displayBalance = balanceLoading
    ? <ActivityIndicator size="small"/>
    : balanceVisible
      ? `₦${formatCurrency(rawBalance)}`
      : "₦****.**";

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.innerContainer}>
            <View style={styles.balanceContainer}>
              <Text variant="light" color="#fff" size="sm">
                Balance
              </Text>
              <TouchableOpacity
                onPress={() => setBalanceVisible(!balanceVisible)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={balanceVisible ? "eye-off" : "eye"}
                  size={20}
                  color="#fff"
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
              <View style={styles.liveDot} />
            </View>

            <View style={styles.balanceDetails}>
              <Text
                variant="bold"
                size="4xl"
                color="#fff"
                style={styles.amountText}
              >
                {displayBalance}
              </Text>

              {account ? (
                <>
                  <View style={styles.accountInfo}>
                    <MaterialCommunityIcons
                      name="credit-card-outline"
                      size={16}
                      color="rgba(255,255,255,0.7)"
                      style={styles.accountIcon}
                    />
                    <Text
                      variant="light"
                      color="rgba(255,255,255,0.8)"
                      size="xs"
                    >
                      {truncate(bankName, 20)}
                    </Text>
                  </View>
                  <View style={styles.accountInfo}>
                    <MaterialCommunityIcons
                      name="account-outline"
                      size={16}
                      color="rgba(255,255,255,0.7)"
                      style={styles.accountIcon}
                    />
                    <Text variant="light" color="#fff" size="xs">
                      {accountLabel}
                    </Text>
                  </View>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.createAccountBtn}
                  onPress={() =>
                    navigation.navigate("StackNav", { screen: "Wallet" })
                  }
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="plus-circle-outline"
                    size={14}
                    color="rgba(255,255,255,0.9)"
                  />
                  <Text variant="light" color="rgba(255,255,255,0.9)" size="xs">
                    Create Account to receive money
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.topUp}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={styles.plusIconContainer}>
              <MaterialCommunityIcons
                name="plus"
                size={18}
                color={COLORS.brand}
              />
            </View>
            <Text variant="semibold" color={COLORS.brand} size="sm">
              Top Up
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row2}>
          <TouchableOpacity style={styles.yellowContent} activeOpacity={0.8}>
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={20}
              color={COLORS.brand}
              style={styles.boltIcon}
            />
            <View style={styles.yellowTextContainer}>
              <Text variant="semibold" color={COLORS.brand} size="sm">
                Quick Actions
              </Text>
              <Text variant="light" color={COLORS.brand} size="xs">
                Transfer, Pay Bills, Buy Airtime
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={COLORS.brand}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TopUpModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  innerContainer: { flex: 1 },
  balanceContainer: {
    flexDirection: "row",
    gap: wp("2%"),
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  eyeIcon: { opacity: 0.8 },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#22c55e",
    marginLeft: "auto",
  },
  balanceDetails: { gap: hp("0.5%") },
  amountText: { letterSpacing: 0.5, marginBottom: hp("0.5%") },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1.5%"),
  },
  accountIcon: { opacity: 0.8 },
  topUp: {
    flexDirection: "row",
    gap: wp("1.5%"),
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: wp("22%"),
    height: hp("4.5%"),
    borderRadius: 12,
    justifyContent: "center",
    marginRight: wp("4%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  plusIconContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.brand,
    padding: wp("3%"),
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
  },
  row2: {
    height: hp("5.5%"),
    backgroundColor: COLORS.yellow,
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.2%"),
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
  },
  yellowContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  yellowTextContainer: {
    flex: 1,
    marginLeft: wp("3%"),
    gap: 2,
  },
  boltIcon: { opacity: 0.9 },
  createAccountBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1.5%"),
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.6%"),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignSelf: "flex-start",
    marginTop: hp("0.5%"),
  },
});
