// components/Icons.js
import React from "react";
import { View, StyleSheet } from "react-native";
import * as Iconss from "lucide-react-native";

const Icons = ({
  name,
  size = 20,
  color = "#000",
  withCircle = false,
  backgroundColor = "#FDECEA",
  circleSize = 36,
  style,
}) => {
  const IconComponent = Iconss[name];

  if (!IconComponent) {
    console.warn(`Lucide icon "${name}" does not exist.`);
    return null;
  }

  if (!withCircle) {
    return <IconComponent size={size} color={color} />;
  }

  return (
    <View
      style={[
        styles.iconCircle,
        {
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          backgroundColor,
        },
        style,
      ]}
    >
      <IconComponent size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconCircle: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Icons;
