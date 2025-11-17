// App.js
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import MainNavigator from "./navigation/MainNavigator";
import ProfileScreen from "./screens/ProfileScreen";
import SavedEventsScreen from "./screens/SavedEventsScreen";
import MyEventsScreen from "./screens/MyEventsScreen";
import CalendarScreen from "./screens/CalendarScreen";
import SettingsScreen from "./screens/SettingsScreen";
import HelpSupportScreen from "./screens/HelpSupportScreen";

import { EventProvider } from "./context/EventContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { toastConfig } from "./config/toastConfig";

const Stack = createStackNavigator();

function ThemedApp() {
  const { colors, isDarkMode } = useTheme();

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
        <AuthProvider>
          <EventProvider>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="MainNavigator"
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="MainNavigator" component={MainNavigator} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="SavedEvents" component={SavedEventsScreen} />
                <Stack.Screen name="MyEvents" component={MyEventsScreen} />
                <Stack.Screen name="Calendar" component={CalendarScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
              </Stack.Navigator>
              <StatusBar style={isDarkMode ? "light" : "dark"} backgroundColor={colors.primary} />
            </NavigationContainer>
            <Toast config={toastConfig} />
          </EventProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}
