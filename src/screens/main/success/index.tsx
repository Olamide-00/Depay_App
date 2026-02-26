import { View, Image } from "react-native";
import React from "react";
import { styles } from "./style";
import Text from "../../../components/common/txt";
import Btn from "../../../components/common/btn";
import { COLORS } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";

const Success = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      <Image
        source={require("../../../../assets/images/success.png")}
        resizeMode="contain"
        style={styles.image}
      />

      <View style={styles.descContainer}>
        <Text variant="bold" size="xl" color="#fff">
          Success
        </Text>
        <Text variant="regular" color="#fff">
          Transaction completed
        </Text>
      </View>

      <View style={styles.btnContainer}>
        <Btn
          title="Done"
          style={styles.btn}
          textStyle={{ color: COLORS.brand }}
          onPress={() => navigation.navigate("TabNav")}
        />
      </View>
    </View>
  );
};

export default Success;
