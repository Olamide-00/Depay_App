// OTP.tsx — full corrected file
import { View, ActivityIndicator, Animated } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { styles } from "./style";
import Text from "../../../components/common/txt";
import CommonHeader from "../../../components/ui/commonHeader";
import CustomKeypad from "../../../components/keypad/customKeyPad";
import { COLORS } from "../../../constants/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useVerifyPIN } from "../../../api/hooks/usePIN";
import { usePayBills } from "../../../api/hooks/useBills";
import useAuthStore from "../../../store/userStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type RouteParams = {
  serviceID?: string;
  variation_code?: string;
  amount?: any;
  phoneNumber?: string;
  billersCode?: string;
  type?: string;
};

const OTP = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { serviceID, variation_code, amount, phoneNumber, billersCode, type } =
    (route.params as RouteParams) || {};

  const userData = useAuthStore((state: any) => state.userData);
  const email = userData.email;

  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  // Separate flag so dots can show red even after pin is cleared
  const [showRedDots, setShowRedDots] = useState(false);

  const maxPinLength = 4;

  const dotAnims = useRef(
    [...Array(maxPinLength)].map(() => new Animated.Value(1)),
  ).current;

  const overlayAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const { mutate: verifyPin } = useVerifyPIN();
  const { mutate: payBill } = usePayBills();

  const animateDot = (index: number) => {
    Animated.sequence([
      Animated.spring(dotAnims[index], {
        toValue: 1.4,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(dotAnims[index], {
        toValue: 1,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const shakeDots = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const showOverlay = () =>
    Animated.timing(overlayAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

  const hideOverlay = () =>
    Animated.timing(overlayAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

  useEffect(() => {
    if (pin.length === maxPinLength) {
      setLoading(true);
      showOverlay();

      verifyPin(
        { email, pin },
        {
          onSuccess: () => {
            payBill(
              {
                serviceID,
                variation_code,
                amount,
                phone: phoneNumber,
                email,
                billersCode,
                type,
              },
              {
                onSuccess: (response: any) => {
                  setLoading(false);
                  hideOverlay();

                  const isSuccess =
                    response?.success === true &&
                    response?.data?.response_description?.includes(
                      "TRANSACTION SUCCESSFUL",
                    );

                  const hasToken =
                    typeof response?.data?.token === "string" &&
                    response?.data?.token.trim() !== "";
                  const hasUnits =
                    typeof response?.data?.units === "string" &&
                    response?.data?.units.trim() !== "";

                  if (isSuccess && hasToken && hasUnits) {
                    setTimeout(
                      () =>
                        navigation.navigate("ElectReceipt", {
                          data: response?.data,
                        }),
                      300,
                    );
                  } else if (isSuccess) {
                    setTimeout(
                      () =>
                        navigation.navigate("Success", {
                          success: true,
                          message: "Transaction Completed",
                        }),
                      300,
                    );
                  } else {
                    setTimeout(
                      () =>
                        navigation.navigate("Success", {
                          success: false,
                          message: "Transaction Failed",
                          subMessage:
                            "Your payment could not be processed. Please try again.",
                        }),
                      300,
                    );
                  }
                },
                onError: (error: any) => {
                  setLoading(false);
                  hideOverlay();
                  const message =
                    error?.response?.data?.message ||
                    "Payment failed. Please try again.";
                  setTimeout(
                    () =>
                      navigation.navigate("Success", {
                        success: false,
                        message: "Transaction Failed",
                        subMessage: message,
                      }),
                    300,
                  );
                },
              },
            );
          },

          onError: () => {
            // ── Wrong PIN — stay on screen, never navigate away ──
            setLoading(false);
            hideOverlay();
            shakeDots();
            setShowRedDots(true); // turn dots red before clearing pin
            setStatus("error");
            setErrorMsg("Incorrect PIN. Please try again.");
            setPin(""); // clear pin so user can retype
          },
        },
      );
    } else {
      if (pin.length > 0) {
        animateDot(pin.length - 1);
        // First new keypress after failure — clear error state
        if (status === "error") {
          setStatus("idle");
          setShowRedDots(false);
        }
      }
    }
  }, [pin]);

  const handleKeyPress = (key: string) => {
    if (pin.length < maxPinLength && !loading) setPin((prev) => prev + key);
  };

  const handleDelete = () => {
    if (!loading) setPin((prev) => prev.slice(0, -1));
  };

  return (
    <View style={styles.root}>
      <CommonHeader title="Transaction PIN" back />

      <View style={styles.container}>
        <View style={styles.desc}>
          <Text variant="bold" size="2xl" style={styles.heading}>
            Enter your PIN
          </Text>
          <Text size="sm" style={styles.subheading}>
            Enter your 4-digit PIN to authorise this transaction
          </Text>
        </View>

        {/* PIN dots */}
        <Animated.View
          style={[
            styles.dotContainer,
            { transform: [{ translateX: shakeAnim }] },
          ]}
        >
          {[...Array(maxPinLength)].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                // Normal fill — brand color as user types
                !showRedDots && index < pin.length && styles.dotFilled,
                // Red fill — all 4 dots red after wrong PIN, before user retypes
                showRedDots && styles.dotError,
                { transform: [{ scale: dotAnims[index] }] },
              ]}
            />
          ))}
        </Animated.View>

        {/* Inline error — persists until user starts retyping */}
        {status === "error" && (
          <View style={styles.errorRow}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={13}
              color="#EF4444"
            />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}
      </View>

      {/* Loading overlay */}
      {loading && (
        <Animated.View
          style={[styles.loadingOverlay, { opacity: overlayAnim }]}
        >
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={COLORS.brand} />
            <Text style={styles.loadingText}>Verifying PIN...</Text>
          </View>
        </Animated.View>
      )}

      {/* Keypad */}
      <View style={styles.keypadContainer}>
        <CustomKeypad
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onSubmit={() => {}}
          showForgotPin
          onForgotPin={() => navigation.navigate("ChangePIN1")}
          submitIcon="play"
          submitColor={COLORS.brand}
          vibrate
        />
      </View>
    </View>
  );
};

export default OTP;
