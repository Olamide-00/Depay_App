import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Clipboard,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/Colors";
import Text from "../../../../components/common/txt";
import TopUpModal from "./topupModal";
import { io } from "socket.io-client";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useAuthStore from "../../../../store/userStore";
import { useGetBalance } from "../../../../api/hooks/useAuth";

const SOCKET_URL = "https://jaa.up.railway.app";

interface DashboardProps {
  refreshTick?: number;
}

const Dashboard = ({ refreshTick = 0 }: DashboardProps) => {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(null);

  const userData = useAuthStore((state) => state.userData);
  const isWalletCreated = useAuthStore((state) => state.isWalletCreated);

  const email = userData?.email || "";
  const accountNumber = (userData as any)?.accountNumber || "—";
  const bankName = (userData as any)?.bankName || "—";

  const truncate = (str: string, max: number) =>
    str?.length > max ? str.slice(0, max) + "…" : str;

  const handleCopy = (value: string, label: string) => {
    Clipboard.setString(value);
    Alert.alert("Copied", `${label} copied to clipboard`);
  };

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

  const { balance, refetch, isLoading: balanceLoading } = useGetBalance(email);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    if (refreshTick > 0) {
      setCurrentBalance(null);
      refetch();
    }
  }, [refreshTick]);

  const formatCurrency = (amount: number) =>
    Number(amount).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const rawBalance = currentBalance ?? balance?.data ?? "0.00";

  const displayBalance = balanceLoading ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : balanceVisible ? (
    `₦${formatCurrency(rawBalance)}`
  ) : (
    "₦****.**"
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.innerContainer}>
            {/* Balance header */}
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

            {/* Balance amount + account info */}
            <View style={styles.balanceDetails}>
              <Text
                variant="bold"
                size="3xl"
                color="#fff"
                style={styles.amountText}
              >
                {displayBalance}
              </Text>

              {isWalletCreated ? (
                // ── Wallet exists ─────────────────────────
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

                  <TouchableOpacity
                    style={styles.accountInfo}
                    activeOpacity={0.7}
                    onPress={() => handleCopy(accountNumber, "Account number")}
                  >
                    <MaterialCommunityIcons
                      name="account-outline"
                      size={16}
                      color="rgba(255,255,255,0.7)"
                      style={styles.accountIcon}
                    />
                    <Text variant="light" color="#fff" size="xs">
                      {accountNumber}
                    </Text>
                    <MaterialCommunityIcons
                      name="content-copy"
                      size={13}
                      color="rgba(255,255,255,0.6)"
                      style={styles.copyIcon}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                // ── No wallet — prompt to create ──────────
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

          {/* Top Up button */}
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

        {/* Quick actions bar */}
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
    gap: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  eyeIcon: { opacity: 0.8 },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#22c55e",
    marginLeft: "auto",
  },
  balanceDetails: { gap: 4 },
  amountText: { letterSpacing: 0.5, marginBottom: 4 },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  accountIcon: { opacity: 0.8 },
  copyIcon: { marginLeft: 4, opacity: 0.7 },
  topUp: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: 88,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  plusIconContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
    padding: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.brand,
    padding: 12,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
  },
  row2: {
    height: 44,
    backgroundColor: COLORS.yellow,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    marginLeft: 12,
    gap: 2,
  },
  boltIcon: { opacity: 0.9 },
  createAccountBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignSelf: "flex-start",
    marginTop: 4,
  },
});
