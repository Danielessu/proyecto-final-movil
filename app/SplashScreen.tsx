import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container} accessibilityLabel="Splash Screen">
      <Image 
        source={require("../assets/images/autocarelogo.png")}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="AutoCare Logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
});
