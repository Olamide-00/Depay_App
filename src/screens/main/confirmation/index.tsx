// Confirmation.tsx
import { View, Animated, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useRef } from "react";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";
import Item from "../../../components/common/item";
import Btn from "../../../components/common/btn";
import { COLORS } from "../../../constants/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "../../../components/common/txt";

type ConfirmationParams = {
  serviceID: string;
  variation_code?: string;
  amount: string;
  phoneNumber?: string;
  billersCode?: string;
  type?: string;
  plan?: { name?: string };
};

const Confirmation = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const {
    serviceID = "",
    variation_code,
    amount,
    phoneNumber,
    billersCode,
    type,
    plan,
  } = (route.params as ConfirmationParams) || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const cardAnim = useRef(new Animated.Value(24)).current;
  const btnAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(cardAnim, {
        toValue: 0,
        tension: 55,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(btnAnim, {
        toValue: 0,
        tension: 55,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isData = serviceID.toLowerCase().includes("data");
  const isElectricity =
    variation_code === "prepaid" || variation_code === "postpaid";
  const isTV = ["dstv", "gotv", "startimes"].includes(serviceID);

  const serviceTypeLabel = isData
    ? "Data"
    : isElectricity
      ? "Electricity"
      : isTV
        ? "TV"
        : "Airtime";
  const numericAmount = parseFloat(amount) || 0;
  const formattedAmount = numericAmount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const providerLabel = serviceID
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <View style={styles.root}>
      <CommonHeader title="Confirm Transaction" back />

      <View style={styles.container}>
        {/* ── Scrollable content ── */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Icon + heading */}
          <Animated.View
            style={[
              styles.iconSection,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.iconRing}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={26}
                  color={COLORS.brand}
                />
              </View>
            </View>
            <Text style={styles.reviewText}>Review Transaction</Text>
            <Text style={styles.reviewSubtext}>
              Confirm details before proceeding
            </Text>
          </Animated.View>

          {/* Details card */}
          <Animated.View
            style={[
              styles.detailsCard,
              { opacity: fadeAnim, transform: [{ translateY: cardAnim }] },
            ]}
          >
            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>TOTAL AMOUNT</Text>
              <Text style={styles.amountValue}>₦{formattedAmount}</Text>
              <View style={styles.amountBadge}>
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={10}
                  color={COLORS.brand}
                />
                <Text style={styles.amountBadgeText}>Instant Processing</Text>
              </View>
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>DETAILS</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.itemContainer}>
              <Item label="Service Type" value={serviceTypeLabel} />
              <Item label="Amount" value={`₦${formattedAmount}`} />
              <Item label="Provider" value={providerLabel} />

              {isData && plan?.name && (
                <Item label="Data Plan" value={plan.name} />
              )}
              {isData && variation_code && !plan?.name && (
                <Item label="Plan Code" value={variation_code} />
              )}
              {isTV && variation_code && (
                <Item label="Package" value={variation_code} />
              )}
              {isTV && billersCode && (
                <Item label="Smartcard No." value={billersCode} />
              )}
              {isElectricity && variation_code && (
                <Item
                  label="Meter Type"
                  value={
                    variation_code.charAt(0).toUpperCase() +
                    variation_code.slice(1)
                  }
                />
              )}
              {isElectricity && billersCode && (
                <Item label="Meter Number" value={billersCode} />
              )}
              {(isData || (!isTV && !isElectricity)) && phoneNumber && (
                <Item label="Phone Number" value={phoneNumber} />
              )}
            </View>

            <View style={styles.noteCard}>
              <MaterialCommunityIcons
                name="information-outline"
                size={13}
                color={COLORS.brand}
              />
              <Text style={styles.noteText}>
                Once confirmed, this transaction cannot be reversed.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>

        {/* ── Buttons — fixed outside scroll, always visible ── */}
        <Animated.View
          style={[
            styles.actions,
            { opacity: fadeAnim, transform: [{ translateY: btnAnim }] },
          ]}
        >
          <Btn
            title="Confirm & Continue"
            style={styles.btn}
            textStyle={styles.btnText}
            onPress={() =>
              navigation.navigate("OTP", {
                serviceID,
                variation_code,
                amount: numericAmount,
                phoneNumber,
                billersCode,
                type,
              })
            }
          />
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.6}
          >
            <Text style={styles.cancelButtonText}>Cancel Transaction</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

export default Confirmation;
