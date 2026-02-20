import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Clipboard,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../../../constants/Colors";
import useAuthStore from "../../../../store/userStore";

const { height } = Dimensions.get("window");

interface TopUpModalProps {
  visible: boolean;
  onClose: () => void;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const userData = useAuthStore((state) => state.userData);
  const accountDetails = useAuthStore((state) => state.accountDetails);
  const account = accountDetails?.[0];

  const accountName = userData?.name || "—";
  const bankName = account?.bankName || "—";
  const accountNumber = account?.accountNumber || "—";

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    Alert.alert("Copied", "Account number copied to clipboard");
  };

  return (
    <Modal
      visible={visible}
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
                  transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.handleBar} />

              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* Header */}
                <View style={styles.header}>
                  <View>
                    <Text style={styles.headerTitle}>Top Up Wallet</Text>
                    <Text style={styles.headerSubtitle}>via Bank Transfer</Text>
                  </View>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Icon Section */}
                <View style={styles.iconSection}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name="bank-transfer"
                      size={48}
                      color={COLORS.brand}
                    />
                  </View>
                  <Text style={styles.iconSubtitle}>
                    Transfer to the account below to fund your wallet instantly
                  </Text>
                </View>

                {/* No account state */}
                {!account ? (
                  <View style={styles.noAccountCard}>
                    <MaterialCommunityIcons
                      name="bank-off-outline"
                      size={36}
                      color={COLORS.brand}
                    />
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
                              size={22}
                              color={COLORS.brand}
                            />
                          </View>
                          <View style={styles.bankDetailTextContainer}>
                            <Text style={styles.bankDetailLabel}>Account Name</Text>
                            <Text style={styles.bankDetailValue}>{accountName}</Text>
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
                              size={22}
                              color={COLORS.brand}
                            />
                          </View>
                          <View style={styles.bankDetailTextContainer}>
                            <Text style={styles.bankDetailLabel}>Bank Name</Text>
                            <Text style={styles.bankDetailValue}>{bankName}</Text>
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
                              size={22}
                              color={COLORS.brand}
                            />
                          </View>
                          <View style={styles.bankDetailTextContainer}>
                            <Text style={styles.bankDetailLabel}>Account Number</Text>
                            <Text style={styles.bankDetailValue}>{accountNumber}</Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.copyButton}
                          onPress={() => handleCopy(accountNumber)}
                          activeOpacity={0.7}
                        >
                          <MaterialCommunityIcons
                            name="content-copy"
                            size={20}
                            color={COLORS.brand}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Info Note */}
                    <View style={styles.infoCard}>
                      <MaterialCommunityIcons
                        name="information"
                        size={20}
                        color={COLORS.brand}
                      />
                      <Text style={styles.infoText}>
                        Your wallet will be funded automatically within 2 minutes
                        after sending money from your bank app
                      </Text>
                    </View>

                    {/* Money Sent Button */}
                    <TouchableOpacity
                      style={styles.moneySentButton}
                      onPress={onClose}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.moneySentButtonText}>
                        I've Sent The Money
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.waitingContainer}>
                      <View style={styles.dotContainer}>
                        <View style={styles.dot} />
                        <View style={[styles.dot, styles.dotDelay1]} />
                        <View style={[styles.dot, styles.dotDelay2]} />
                      </View>
                      <Text style={styles.waitingText}>Waiting for transfer</Text>
                    </View>
                  </>
                )}

                <View style={styles.bottomSpacer} />
              </ScrollView>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#F8F8F8",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 10,
    maxHeight: height * 0.85,
    minHeight: height * 0.6,
  },
  handleBar: {
    width: 45,
    height: 5,
    backgroundColor: "#D0D0D0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: wp("5%"),
    paddingTop: hp("1%"),
    paddingBottom: hp("2%"),
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
    marginTop: -4,
  },
  iconSection: {
    alignItems: "center",
    paddingHorizontal: wp("5%"),
    marginBottom: hp("3%"),
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F0E6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("1.5%"),
  },
  iconSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: wp("5%"),
  },

  // No account state
  noAccountCard: {
    alignItems: "center",
    marginHorizontal: wp("5%"),
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: wp("6%"),
    gap: hp("1%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  noAccountTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: hp("0.5%"),
  },
  noAccountSubtitle: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },

  bankDetailsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: wp("5%"),
    borderRadius: 16,
    padding: wp("5%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: hp("2%"),
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
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F0E6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("3%"),
  },
  bankDetailTextContainer: { flex: 1 },
  bankDetailLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 4,
  },
  bankDetailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F0E6FF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: wp("2%"),
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: hp("2%"),
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFF9E6",
    marginHorizontal: wp("5%"),
    padding: wp("4%"),
    borderRadius: 12,
    alignItems: "center",
    marginBottom: hp("2%"),
    gap: wp("3%"),
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#8B7500",
    lineHeight: 18,
  },
  moneySentButton: {
    backgroundColor: COLORS.brand,
    marginHorizontal: wp("5%"),
    paddingVertical: hp("2%"),
    borderRadius: 12,
    alignItems: "center",
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  moneySentButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  waitingContainer: {
    alignItems: "center",
    marginTop: hp("2%"),
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
    backgroundColor: COLORS.brand,
    opacity: 0.3,
  },
  dotDelay1: { opacity: 0.6 },
  dotDelay2: { opacity: 0.9 },
  waitingText: {
    fontSize: 13,
    color: "#999",
  },
  bottomSpacer: { height: hp("3%") },
});

export default TopUpModal;