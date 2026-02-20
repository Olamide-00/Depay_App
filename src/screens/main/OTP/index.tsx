import { View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "./style";
import Text from "../../../components/common/txt";
import CommonHeader from "../../../components/ui/commonHeader";
import CustomKeypad from "../../../components/keypad/customKeyPad";
import { COLORS } from "../../../constants/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useVerifyPIN } from "../../../api/hooks/usePIN";
import { usePayBills } from "../../../api/hooks/useBills";
import useAuthStore  from "../../../store/userStore"

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
  const email = userData.email

  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSuccess, setToastSuccess] = useState(false);

  const maxPinLength = 4;

  const { mutate: verifyPin } = useVerifyPIN();
  const { mutate: payBill } = usePayBills();

  const showToast = (message: string, success: boolean) => {
    setToastMessage(message);
    setToastSuccess(success);
    setToastVisible(true);
  };

  useEffect(() => {
    if (pin.length === maxPinLength) {
      setLoading(true);

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
                    // Electricity with token
                    showToast("Transaction Successful", true);
                    setTimeout(() => {
                      navigation.navigate("ElectReceipt", {
                        data: response?.data,
                      });
                    }, 2000);
                  } else if (isSuccess) {
                    showToast("Transaction Completed", true);
                    setTimeout(() => {
                      navigation.navigate("Success", {
                        message: "Transaction Completed",
                      });
                    }, 2000);
                  } else {
                    showToast("Payment Failed. Try again.", false);
                    setTimeout(() => {
                      navigation.navigate("TabNav", {screen: "HomeTab"} );
                    }, 2000);
                  }
                },
                onError: (error: any) => {
                  setLoading(false);
                  const errorMessage =
                    error?.response?.data?.message ||
                    "Payment Failed. Try again.";
                  showToast(errorMessage, false);
                  setTimeout(() => {
                    navigation.navigate("TabNav", {screen: "HomeTab"} );
                  }, 2000);
                },
              },
            );
          },
          onError: () => {
            setLoading(false);
            showToast("Incorrect PIN.", false);
            setPin(""); 
          },
        },
      );
    }
  }, [pin]);

  const handleKeyPress = (key: string) => {
    if (pin.length < maxPinLength) {
      setPin((prev) => prev + key);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    // submission is handled automatically via useEffect when pin reaches 4 digits
  };

  const handleForgotPin = () => {
    navigation.navigate("ChangePIN1")
  };

  return (
    <View style={styles.root}>
      <CommonHeader title="Transaction PIN" back />
      <View style={styles.container}>
        <View style={styles.desc}>
          <Text variant="bold" size="3xl">
            Enter 4 Digits PIN
          </Text>
          <Text>Enter your four digit PIN to confirm purchase</Text>
        </View>

        {/* PIN Dots */}
        <View style={styles.dotContainer}>
          {[...Array(maxPinLength)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index < pin.length && {
                  backgroundColor: COLORS.brand,
                },
              ]}
            />
          ))}
        </View>

        {/* Loading indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.brand} />
          </View>
        )}

        {/* Toast */}
        {toastVisible && (
          <View
            style={[
              styles.toast,
              { backgroundColor: toastSuccess ? "#22c55e" : "#ef4444" },
            ]}
          >
            <Text style={{ color: "#fff" }}>{toastMessage}</Text>
          </View>
        )}
      </View>

      {/* Keypad at Bottom */}
      <View style={styles.keypadContainer}>
        <CustomKeypad
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          showForgotPin={true}
          onForgotPin={handleForgotPin}
          submitIcon="play"
          submitColor={COLORS.brand}
          vibrate={true}
        />
      </View>
    </View>
  );
};

export default OTP;
