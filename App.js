import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MainNavigator from "./navigation/MainNavigator";
import { colors } from "./theme";
// must be color Brown 

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <MainNavigator />
        <StatusBar style="light" backgroundColor={colors.primary} />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
