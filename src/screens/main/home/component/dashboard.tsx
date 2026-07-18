import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Text from "../../../../components/common/txt";
import TopUpModal from "./topupModal";
import { io } from "socket.io-client";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useAuthStore from "../../../../store/userStore";
import { useGetBalance } from "../../../../api/hooks/useAuth";

const SOCKET_URL = "https://jaa.up.railway.app";

const BRAND = "#1B3710";
const BRAND_DEEP = "#122808";
const LIGHT_GREEN = "#DCEDD6";
const ACCENT_GREEN = "#A9D99B";

interface DashboardProps {
  refreshTick?: number;
}

// ─── Animated count-up for the balance ───────────────────────
const useCountUp = (target: number, duration = 800) => {
  const [display, setDisplay] = useState(target);
  const animRef = useRef(new Animated.Value(target)).current;
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      setDisplay(target);
      animRef.setValue(target);
      return;
    }

    const listener = animRef.addListener(({ value }) => setDisplay(value));
    Animated.timing(animRef, {
      toValue: target,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // listener-driven, no styles animated
    }).start(() => {
      animRef.removeListener(listener);
      setDisplay(target);
    });

    return () => animRef.removeListener(listener);
  }, [target]);

  return display;
};

const Dashboard = ({ refreshTick = 0 }: DashboardProps) => {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pressScale = useRef(new Animated.Value(1)).current;

  const userData = useAuthStore((state) => state.userData);
  const isWalletCreated = useAuthStore((state) => state.isWalletCreated);

  const email = userData?.email || "";
  const accountNumber = (userData as any)?.accountNumber || "—";
  const bankName = (userData as any)?.bankName || "—";

  const truncate = (str: string, max: number) =>
    str?.length > max ? str.slice(0, max) + "…" : str;

  const handleCopy = async (value: string) => {
    await Clipboard.setStringAsync(value);
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1800);
  };

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  // ─── Socket: live balance updates ──────────────────────────
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
    }, [refetch])
  );

  useEffect(() => {
    if (refreshTick > 0) {
      setCurrentBalance(null);
      refetch();
    }
  }, [refreshTick]);

  const rawBalance = Number(currentBalance ?? balance?.data ?? 0);
  const animatedBalance = useCountUp(rawBalance);

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const [whole, decimals] = formatCurrency(animatedBalance).split(".");

  // ─── Press feedback on the card ────────────────────────────
  const pressIn = () =>
    Animated.spring(pressScale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();

  const pressOut = () =>
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();

  return (
    <>
      <View style={styles.stackWrap}>
        {/* BACK CARD — light green, rotated, peeking out */}
        <View style={styles.backCard} />

        {/* MAIN CARD */}
        <Animated.View style={{ transform: [{ scale: pressScale }] }}>
          <Pressable onPressIn={pressIn} onPressOut={pressOut}>
            <View style={styles.card}>
              {/* Decorative rings bleeding off the top-right corner */}
              <View style={styles.ringOuter} pointerEvents="none" />
              <View style={styles.ringInner} pointerEvents="none" />

              {/* HEADER */}
              <View style={styles.headerRow}>
                <View style={styles.labelRow}>
                  <View style={styles.liveDot} />
                  <Text variant="light" color="rgba(255,255,255,0.7)" size="sm">
                    Available balance
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setBalanceVisible(!balanceVisible)}
                  activeOpacity={0.7}
                  hitSlop={10}
                  style={styles.eyeButton}
                >
                  <MaterialCommunityIcons
                    name={balanceVisible ? "eye-off-outline" : "eye-outline"}
                    size={17}
                    color="rgba(255,255,255,0.85)"
                  />
                </TouchableOpacity>
              </View>

              {/* BALANCE — oversized */}
              <View style={styles.amountRow}>
                {balanceLoading && currentBalance === null ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : balanceVisible ? (
                  <>
                    <Text
                      variant="bold"
                      color={ACCENT_GREEN}
                      style={styles.currency}
                    >
                      ₦
                    </Text>
                    <Text
                      variant="bold"
                      color="#fff"
                      style={styles.amountWhole}
                    >
                      {whole}
                    </Text>
                    <Text
                      variant="bold"
                      color="rgba(255,255,255,0.5)"
                      style={styles.amountDecimals}
                    >
                      .{decimals}
                    </Text>
                  </>
                ) : (
                  <Text variant="bold" color="#fff" style={styles.amountWhole}>
                    ••••••
                  </Text>
                )}
              </View>

              {/* FOOTER — account / create + Top Up */}
              <View style={styles.footerRow}>
                {isWalletCreated ? (
                  <TouchableOpacity
                    style={styles.accountChip}
                    activeOpacity={0.75}
                    onPress={() => handleCopy(accountNumber)}
                  >
                    <Text
                      variant="light"
                      color="rgba(255,255,255,0.6)"
                      size="xs"
                    >
                      {truncate(bankName, 12)}
                    </Text>
                    <Text variant="semibold" color="#fff" size="sm">
                      {accountNumber}
                    </Text>
                    <MaterialCommunityIcons
                      name={copied ? "check" : "content-copy"}
                      size={13}
                      color={copied ? ACCENT_GREEN : "rgba(255,255,255,0.55)"}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.accountChip}
                    onPress={() =>
                      navigation.navigate("StackNav", { screen: "Wallet" })
                    }
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name="plus-circle-outline"
                      size={14}
                      color={ACCENT_GREEN}
                    />
                    <Text
                      variant="light"
                      color="rgba(255,255,255,0.85)"
                      size="xs"
                    >
                      Create account to receive money
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.topUp}
                  onPress={() => setModalVisible(true)}
                  activeOpacity={0.85}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={17}
                    color={BRAND_DEEP}
                  />
                  <Text variant="semibold" color={BRAND_DEEP} size="sm">
                    Top Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Animated.View>
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
  stackWrap: {
    // room for the back card to peek out
    paddingBottom: 10,
  },
  backCard: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 0,
    height: 60,
    borderRadius: 22,
    backgroundColor: LIGHT_GREEN,
    transform: [{ rotate: "-1.6deg" }],
  },
  card: {
    backgroundColor: BRAND,
    borderRadius: 24,
    padding: 20,
    overflow: "hidden",
    shadowColor: BRAND_DEEP,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 10,
  },
  ringOuter: {
    position: "absolute",
    top: -70,
    right: -70,
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 30,
    borderColor: "rgba(169,217,155,0.09)",
  },
  ringInner: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 22,
    borderColor: "rgba(169,217,155,0.12)",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: ACCENT_GREEN,
  },
  eyeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 16,
    marginBottom: 20,
    minHeight: 52,
  },
  currency: {
    fontSize: 24,
    lineHeight: 40,
    marginRight: 4,
  },
  amountWhole: {
    fontSize: 44,
    lineHeight: 52,
    letterSpacing: -1.5,
  },
  amountDecimals: {
    fontSize: 22,
    lineHeight: 40,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  accountChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexShrink: 1,
  },
  topUp: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: ACCENT_GREEN,
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 42,
    shadowColor: ACCENT_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  topUpText: {},
});
