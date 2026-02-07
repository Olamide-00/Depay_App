import { StyleSheet, View, TouchableOpacity } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Text from "../common/txt";
import { ArrowLeft2 } from "iconsax-react-native";
import { COLORS } from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
  title: string;
  back?: boolean;
  onBackPress?: () => void;
}

const CommonHeader = ({ title, back, onBackPress }: HeaderProps) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {back && (
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft2 size={wp("6%")} color={COLORS.black} />
          </TouchableOpacity>
        )}

        <View
          style={[
            styles.titleContainer,
            back ? styles.titleWithBack : styles.titleWithoutBack,
          ]}
        >
          <Text variant="bold" size="xl" style={styles.title}>
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: wp("4%"),
    paddingTop: hp("4%"),
    paddingBottom: hp("1%"),
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: hp("6%"),
  },
  backButton: {
    padding: wp("1%"),
    marginRight: wp("3%"),
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  titleWithBack: {
    marginLeft: 0,
  },
  titleWithoutBack: {
    alignItems: "center",
  },
  title: {
    color: COLORS.black,
    textAlign: "center",
  },
});
