import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Easing,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import useAuthStore from "../../../../store/userStore";
import Text from "../../../../components/common/txt";

const { height } = Dimensions.get("window");

const BRAND = "#1B3710";
const LIGHT_GREEN = "#EAF3E9";
const INK = "#141613";
const MUTED = "#6B7268";
const AMBER = "#8B6E00";
const AMBER_BG = "#FDF6E3";

interface TopUpModalProps {
  visible: boolean;
  onClose: () => void;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ visible, onClose }) => {
  // Backdrop
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // Sheet position + subtle scale (Apple-style: sheet starts slightly
  // scaled down and un-scales as it settles)
  const slideAnim = useRef(new Animated.Value(height)).current;
  const sheetScale = useRef(new Animated.Value(0.96)).current;
  // Content inside the sheet — fades/rises in just after the sheet lands
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(16)).current;

  // Waiting dots
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  const [copied, setCopied] = useState(false);
  const [rendered, setRendered] = useState(visible);

  const userData = useAuthStore((state) => state.userData);
  const isWalletCreated = useAuthStore((state) => state.isWalletCreated);

  const accountName = userData?.name || "—";
  const bankName = (userData as any)?.bankName || "—";
  const accountNumber = (userData as any)?.accountNumber || "—";

  const hasAccount =
    isWalletCreated && !!accountNumber && accountNumber !== "—";

  useEffect(() => {
    if (visible) {
      setRendered(true);

      // 1) Backdrop dims first (quick)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 230,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      // 2) Sheet rises with a controlled, non-bouncy spring
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 68,
        friction: 14,
      }).start();

      Animated.spring(sheetScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 68,
        friction: 14,
      }).start();

      // 3) Content inside fades/rises in slightly after the sheet
      //    has begun settling — this is what makes it feel sequenced
      //    rather than "everything at once"
      contentOpacity.setValue(0);
      contentTranslate.setValue(16);
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 280,
          delay: 140,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(contentTranslate, {
          toValue: 0,
          delay: 140,
          useNativeDriver: true,
          speed: 16,
          bounciness: 4,
        }),
      ]).start();
    } else {
      // Reverse: content drops out fast, sheet + backdrop follow
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start();

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 260,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(sheetScale, {
          toValue: 0.96,
          duration: 260,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => setRendered(false));
    }
  }, [visible]);

  // Waiting-dots pulse loop
  useEffect(() => {
    if (!visible || !hasAccount) return;

    const pulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );

    const anims = [pulse(dot1, 0), pulse(dot2, 150), pulse(dot3, 300)];
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, [visible, hasAccount]);

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleMoneySent = async () => {
    if (!copied && accountNumber !== "—") {
      await Clipboard.setStringAsync(accountNumber);
    }
    onClose();
  };

  if (!rendered) return null;

  return (
    <Modal
      visible={rendered}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ translateY: slideAnim }, { scale: sheetScale }],
                },
              ]}
            >
              <View style={styles.handleBar} />

              <Animated.View
                style={{
                  opacity: contentOpacity,
                  transform: [{ translateY: contentTranslate }],
                }}
              >
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {/* Header */}
                  <View style={styles.header}>
                    <View>
                      <Text style={styles.headerTitle}>Top Up Wallet</Text>
                      <Text style={styles.headerSubtitle}>
                        via Bank Transfer
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={onClose}
                      style={styles.closeButton}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons
                        name="close"
                        size={22}
                        color={MUTED}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Icon Section */}
                  <View style={styles.iconSection}>
                    <View style={styles.iconContainer}>
                      <MaterialCommunityIcons
                        name="bank-transfer"
                        size={44}
                        color={BRAND}
                      />
                    </View>
                    <Text style={styles.iconSubtitle}>
                      Transfer to the account below to fund your wallet
                      instantly
                    </Text>
                  </View>

                  {/* No account state */}
                  {!hasAccount ? (
                    <View style={styles.noAccountCard}>
                      <View style={styles.noAccountIconCircle}>
                        <MaterialCommunityIcons
                          name="bank-off-outline"
                          size={30}
                          color={BRAND}
                        />
                      </View>
                      <Text style={styles.noAccountTitle}>No Account Yet</Text>
                      <Text style={styles.noAccountSubtitle}>
                        You haven't created a wallet account yet. Create one to
                        start receiving money.
                      </Text>
                    </View>
                  ) : (
                    <>
                      {/* Bank Details Card */}
                      <View style={styles.bankDetailsCard}>
                        {/* Account Name */}
                        <View style={styles.bankDetailRow}>
                          <View style={styles.bankDetailLeft}>
                            <View style={styles.iconWrapper}>
                              <MaterialCommunityIcons
                                name="account"
                                size={20}
                                color={BRAND}
                              />
                            </View>
                            <View style={styles.bankDetailTextContainer}>
                              <Text style={styles.bankDetailLabel}>
                                Account Name
                              </Text>
                              <Text style={styles.bankDetailValue}>
                                {accountName}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Bank Name */}
                        <View style={styles.bankDetailRow}>
                          <View style={styles.bankDetailLeft}>
                            <View style={styles.iconWrapper}>
                              <MaterialCommunityIcons
                                name="bank"
                                size={20}
                                color={BRAND}
                              />
                            </View>
                            <View style={styles.bankDetailTextContainer}>
                              <Text style={styles.bankDetailLabel}>
                                Bank Name
                              </Text>
                              <Text style={styles.bankDetailValue}>
                                {bankName}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Account Number */}
                        <View style={styles.bankDetailRow}>
                          <View style={styles.bankDetailLeft}>
                            <View style={styles.iconWrapper}>
                              <MaterialCommunityIcons
                                name="credit-card-outline"
                                size={20}
                                color={BRAND}
                              />
                            </View>
                            <View style={styles.bankDetailTextContainer}>
                              <Text style={styles.bankDetailLabel}>
                                Account Number
                              </Text>
                              <Text style={styles.bankDetailValue}>
                                {accountNumber}
                              </Text>
                            </View>
                          </View>
                          <TouchableOpacity
                            style={[
                              styles.copyButton,
                              copied && styles.copyButtonActive,
                            ]}
                            onPress={() => handleCopy(accountNumber)}
                            activeOpacity={0.7}
                          >
                            <MaterialCommunityIcons
                              name={copied ? "check" : "content-copy"}
                              size={18}
                              color={copied ? "#FFFFFF" : BRAND}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Info Note */}
                      <View style={styles.infoCard}>
                        <MaterialCommunityIcons
                          name="information"
                          size={18}
                          color={AMBER}
                        />
                        <Text style={styles.infoText}>
                          Your wallet will be funded automatically within 2
                          minutes after sending money from your bank app
                        </Text>
                      </View>

                      {/* Money Sent Button */}
                      <TouchableOpacity
                        style={styles.moneySentButton}
                        onPress={handleMoneySent}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.moneySentButtonText}>
                          I've Sent The Money
                        </Text>
                      </TouchableOpacity>

                      <View style={styles.waitingContainer}>
                        <View style={styles.dotContainer}>
                          <Animated.View
                            style={[styles.dot, { opacity: dot1 }]}
                          />
                          <Animated.View
                            style={[styles.dot, { opacity: dot2 }]}
                          />
                          <Animated.View
                            style={[styles.dot, { opacity: dot3 }]}
                          />
                        </View>
                        <Text style={styles.waitingText}>
                          Waiting for transfer
                        </Text>
                      </View>
                    </>
                  )}

                  <View style={styles.bottomSpacer} />
                </ScrollView>
              </Animated.View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(18,40,8,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#F7F9F6",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 10,
    maxHeight: height * 0.85,
    minHeight: height * 0.6,
  },
  handleBar: {
    width: 42,
    height: 5,
    backgroundColor: "#DDE3DA",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    color: INK,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: MUTED,
    marginTop: 3,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  iconSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 22,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: LIGHT_GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  iconSubtitle: {
    fontSize: 13.5,
    fontFamily: "Poppins-Regular",
    color: MUTED,
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 16,
  },
  noAccountCard: {
    alignItems: "center",
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    gap: 6,
  },
  noAccountIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  noAccountTitle: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: INK,
  },
  noAccountSubtitle: {
    fontSize: 12.5,
    fontFamily: "Poppins-Regular",
    color: MUTED,
    textAlign: "center",
    lineHeight: 18,
  },
  bankDetailsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  bankDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bankDetailLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: LIGHT_GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bankDetailTextContainer: { flex: 1 },
  bankDetailLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: MUTED,
    marginBottom: 3,
  },
  bankDetailValue: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: INK,
  },
  copyButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: LIGHT_GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  copyButtonActive: {
    backgroundColor: BRAND,
  },
  divider: {
    height: 1,
    backgroundColor: "#F2F5F0",
    marginVertical: 14,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: AMBER_BG,
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: "Poppins-Regular",
    color: AMBER,
    lineHeight: 17,
  },
  moneySentButton: {
    backgroundColor: BRAND,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  moneySentButtonText: {
    color: "#FFFFFF",
    fontSize: 15.5,
    fontFamily: "Poppins-SemiBold",
  },
  waitingContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  dotContainer: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BRAND,
  },
  waitingText: {
    fontSize: 12.5,
    fontFamily: "Poppins-Regular",
    color: MUTED,
  },
  bottomSpacer: { height: 24 },
});

export default TopUpModal;
