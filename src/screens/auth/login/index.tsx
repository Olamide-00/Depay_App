import { Image, View } from "react-native";
import Text from "../../../components/common/txt";
import { styles } from "./style";
import Input from "../../../components/common/input";
import Btn from "../../../components/common/btn";
import { COLORS } from "../../../constants/Colors";

export default function Login() {
  return (
    <View style={styles.root}>
      <Image
        source={require("../../../../assets/images/logo.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <Text size="xl" variant="bold" color="#fff" style={styles.desc}>
        LOGIN TO YOUR ACCOUNT
      </Text>
      <View style={styles.inputs}>
        <Input placeholder="Username" width="100%" />
        <Input placeholder="Password" width="100%" />
      </View>
      <View style={styles.footer}>
        <Btn title="LOGIN" />
        <Text color="#fff" style={{ marginTop: 15, alignSelf: "center" }}>
          Don't have an account?{" "}
          <Text color={COLORS.yellow} variant="bold">
            register
          </Text>
        </Text>
      </View>
    </View>
  );
}
