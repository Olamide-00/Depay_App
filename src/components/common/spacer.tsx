import { View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

type SpacerProps = {
  size: number;
  horizontal?: boolean;
};

const Spacer: React.FC<SpacerProps> = ({ size, horizontal = false }) => {
  const dimension = horizontal ? wp(`${size}%`) : hp(`${size}%`);

  return (
    <View
      style={{
        [horizontal ? "width" : "height"]: dimension,
      }}
    />
  );
};

export default Spacer;
