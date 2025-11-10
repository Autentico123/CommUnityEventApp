import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import MainNavigator from "./navigation/MainNavigator";
import { EventProvider } from "./context/EventContext";
import { AuthProvider } from "./context/AuthContext";
import { toastConfig } from "./config/toastConfig";
import { colors } from "./theme";
// must be color Brown

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <EventProvider>
            <NavigationContainer>
              <MainNavigator />
              <StatusBar style="light" backgroundColor={colors.primary} />
            </NavigationContainer>
            <Toast config={toastConfig} />
          </EventProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
