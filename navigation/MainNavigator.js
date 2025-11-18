import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import {
  Platform,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography } from "../theme";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import HomeScreen from "../screens/HomeScreen";
import EventsScreen from "../screens/EventsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import EventDetailsScreen from "../screens/EventDetailsScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ChatListScreen from "../screens/ChatListScreen";
import ChatScreen from "../screens/ChatScreen";
import GroupsScreen from "../screens/GroupsScreen";
import CreateGroupScreen from "../screens/CreateGroupScreen";
import GroupDetailScreen from "../screens/GroupDetailScreen";
import PeopleScreen from "../screens/PeopleScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import MapViewScreen from "../screens/MapViewScreen";
import AboutUsScreen from "../screens/AboutUsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const ChatStack = createStackNavigator();
const GroupsStack = createStackNavigator();
const PeopleStack = createStackNavigator();
const MapStack = createStackNavigator();

function EventsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="EventsList" component={EventsScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
}

function MapStackNavigator() {
  return (
    <MapStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MapStack.Screen name="MapView" component={MapViewScreen} />
      <MapStack.Screen name="EventDetails" component={EventDetailsScreen} />
      <MapStack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <MapStack.Screen name="UserProfile" component={UserProfileScreen} />
    </MapStack.Navigator>
  );
}

function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
      <Stack.Screen name="GroupsList" component={GroupsScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <Stack.Screen name="PeopleList" component={PeopleScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
    </Stack.Navigator>
  );
}

function ChatStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
}

function GroupsStackNavigator() {
  return (
    <GroupsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <GroupsStack.Screen name="GroupsList" component={GroupsScreen} />
      <GroupsStack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <GroupsStack.Screen name="GroupDetail" component={GroupDetailScreen} />
    </GroupsStack.Navigator>
  );
}

function PeopleStackNavigator() {
  return (
    <PeopleStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <PeopleStack.Screen name="PeopleList" component={PeopleScreen} />
      <PeopleStack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <PeopleStack.Screen name="UserProfile" component={UserProfileScreen} />
    </PeopleStack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const { unreadCount } = useChat();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 12,
          height: 70 + (insets.bottom > 0 ? insets.bottom : 0),
          paddingHorizontal: 16,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 20,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        },
        tabBarLabelStyle: {
          fontSize: typography.fontSize.xs,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={26}
                color={color}
              />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                styles.tabLabel,
                { color },
                focused && styles.tabLabelFocused,
              ]}
            >
              Home
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}
            >
              <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                size={26}
                color={color}
              />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                styles.tabLabel,
                { color },
                focused && styles.tabLabelFocused,
              ]}
            >
              Events
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}
            >
              <Ionicons
                name={focused ? "map" : "map-outline"}
                size={26}
                color={color}
              />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                styles.tabLabel,
                { color },
                focused && styles.tabLabelFocused,
              ]}
            >
              Map
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={ChatStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}
            >
              <Ionicons
                name={focused ? "chatbubbles" : "chatbubbles-outline"}
                size={26}
                color={color}
              />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                styles.tabLabel,
                { color },
                focused && styles.tabLabelFocused,
              ]}
            >
              Messages
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}
            >
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={26}
                color={color}
              />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                styles.tabLabel,
                { color },
                focused && styles.tabLabelFocused,
              ]}
            >
              Profile
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

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

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 36,
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  iconContainerFocused: {
    backgroundColor: colors.primary + "15", // 15% opacity
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  tabLabelFocused: {
    fontWeight: "700",
  },
  badge: {
    position: "absolute",
    right: 6,
    top: 2,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  badgeText: {
    fontSize: 10,
    color: colors.surface,
    fontWeight: "700",
  },
});
