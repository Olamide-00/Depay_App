import { View, Text, Animated, TouchableOpacity } from "react-native";
import React, { useEffect, useRef } from "react";
import { styles } from "./style";
import CommonHeader from "../../../components/ui/commonHeader";
import Spacer from "../../../components/common/spacer";
import Item from "../../../components/common/item";
import Btn from "../../../components/common/btn";
import { COLORS } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Confirmation = () => {
  const navigation = useNavigation();
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
            <Text style={styles.amountValue}>₦1,000.00</Text>
          </View>

          <View style={styles.divider} />

          {/* Other Details */}
          <View style={styles.itemContainer}>
            <Item label="Phone Number" value="09036018013" />
            <Item label="Mobile Network" value="MTN" />
          </View>
        </Animated.View>

        <Spacer size={14} />

        {/* Info Card */}

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
            onPress={() => navigation.navigate("OTP")}
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
