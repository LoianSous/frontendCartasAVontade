import React from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import { Styles } from './style';

export default function Loading() {
  return (
    <View style={Styles.container}>
      <LottieView
        source={require("../../../assets/animations/carta.json")}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}