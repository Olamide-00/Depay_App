import { View, Text, Animated, TouchableOpacity } from "react-native";
import React, { useEffect, useRef } from "react";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";
import Spacer from "../../../components/common/spacer";
import Item from "../../../components/common/item";
import Btn from "../../../components/common/btn";
import { COLORS } from "../../../constants/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Derive service type from serviceID
  const isData = serviceID.toLowerCase().includes("data");
  const isElectricity =
    variation_code === "prepaid" || variation_code === "postpaid";
  const isDstv = serviceID === "dstv";
  const isGotv = serviceID === "gotv";
  const isStartimes = serviceID === "startimes";
  const isTV = isDstv || isGotv || isStartimes;

  // Resolve human-readable service type label
  const serviceTypeLabel = isData
    ? "Data"
    : isElectricity
      ? "Electricity"
      : isTV
        ? "TV"
        : "Airtime";

  const numericAmount = parseFloat(amount) || 0;

  // Format provider name nicely
  const providerLabel = serviceID
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <View style={styles.root}>
      <CommonHeader title="Confirm Transaction" back />
      <View style={styles.container}>
        <Spacer size={3} />

        {/* Icon Section */}
        <Animated.View
          style={[
            styles.iconSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="check-circle"
              size={50}
              color={COLORS.brand}
            />
          </View>
          <Text style={styles.reviewText}>Review Your Transaction</Text>
          <Text style={styles.reviewSubtext}>
            Please confirm the details below before proceeding
          </Text>
        </Animated.View>

        <Spacer size={4} />

        {/* Transaction Details Card */}
        <Animated.View
          style={[
            styles.detailsCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Amount Section - Highlighted */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount to Pay</Text>
            <Text style={styles.amountValue}>
              ₦
              {numericAmount.toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Dynamic Details */}
          <View style={styles.itemContainer}>
            {/* Type — always shown */}
            <Item label="Type" value={serviceTypeLabel} />

            {/* Amount — always shown */}
            <Item
              label="Amount"
              value={`₦${numericAmount.toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            />

            {/* Provider — always shown */}
            <Item label="Provider" value={providerLabel} />

            {/* Data: show plan name */}
            {isData && plan?.name && (
              <Item label="Data Plan" value={plan.name} />
            )}
            {isData && variation_code && !plan?.name && (
              <Item label="Plan Code" value={variation_code} />
            )}

            {/* TV: show package and smartcard */}
            {isTV && variation_code && (
              <Item label="Package" value={variation_code} />
            )}
            {isTV && billersCode && (
              <Item label="Smartcard Number" value={billersCode} />
            )}

            {/* Electricity: show meter type and meter number */}
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

            {/* Phone number — shown for airtime and data */}
            {(isData || (!isTV && !isElectricity)) && phoneNumber && (
              <Item label="Phone Number" value={phoneNumber} />
            )}

            {/* Airtime: no extra fields needed beyond provider, phone, amount */}
          </View>
        </Animated.View>

        <Spacer size={9} />

        {/* Action Buttons */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Btn
            title="Confirm & Continue"
            style={styles.btn}
            textStyle={{ color: COLORS.white }}
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
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel Transaction</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

export default Confirmation;
