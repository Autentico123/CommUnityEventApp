// navigation/MainNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { Platform, ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography } from "../theme";
import { useAuth } from "../context/AuthContext";

import HomeScreen from "../screens/HomeScreen";
import EventsScreen from "../screens/EventsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import EventDetailsScreen from "../screens/EventDetailsScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AboutScreen from "../screens/AboutScreen";

// Extra screens for Profile features
import SavedEventsScreen from "../screens/SavedEventsScreen";
import MyEventsScreen from "../screens/MyEventsScreen";
import CalendarScreen from "../screens/CalendarScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HelpSupportScreen from "../screens/HelpSupportScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

// Events Stack
function EventsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventsList" component={EventsScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
    </Stack.Navigator>
  );
}

// Home Stack
function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
    </Stack.Navigator>
  );
}

// Profile Stack
function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: "My Profile" }}
      />
      <Stack.Screen name="SavedEvents" component={SavedEventsScreen} />
      <Stack.Screen name="MyEvents" component={MyEventsScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
    </Stack.Navigator>
  );
}

// Auth Stack
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// Main Tab
function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 8,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 10),
          paddingHorizontal: 10,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.medium,
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Events"
        component={EventsStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarLabel: "About",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main Navigator
export default function MainNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />;
}
