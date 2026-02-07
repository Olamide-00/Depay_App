import { Image, Pressable, View } from "react-native";
import Text from "../../../components/common/txt";
import { styles } from "./style";
import Input from "../../../components/common/input";
import Btn from "../../../components/common/btn";
import { COLORS } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";

export default function SignUp() {
  const navigation = useNavigation();
  return (
    <View style={styles.root}>
      <Image
        source={require("../../../../assets/images/logo.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <Text size="xl" variant="bold" color="#fff" style={styles.desc}>
        CREATE AN ACCOUNT
      </Text>
      <View style={styles.inputs}>
        <Input placeholder="Name" width="100%" />
        <Input placeholder="Username" width="100%" />
        <Input placeholder="Email Address" width="100%" />
        <Input placeholder="Phone Number" width="100%" />
        <Input placeholder="Referral Code" width="100%" />
        <Input placeholder="Password" width="100%" />
        <Input placeholder="Confirm Password" width="100%" />
      </View>
      <View style={styles.footer}>
        <Btn title="REGISTER" />
        <Text color="#fff" style={{ marginTop: 15, alignSelf: "center" }}>
          Already have an account?{" "}
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text color={COLORS.yellow} variant="bold">
              Sign In
            </Text>
          </Pressable>
        </Text>
      </View>
    </View>
  );
}
