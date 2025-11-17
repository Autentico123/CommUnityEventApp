import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
  Image,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { user, logout, refreshUser, isAuthenticated } = useAuth();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Refresh user data when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (isAuthenticated) {
        refreshUser();
        // Reset and trigger animations
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });

    return unsubscribe;
  }, [navigation, isAuthenticated]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout, style: "destructive" },
    ]);
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleMyEvents = () => {
    navigation.navigate("Events", {
      screen: "EventsList",
      params: { initialScope: "mine" },
    });
  };

  const handleSavedEvents = () => {
    navigation.navigate("Events", {
      screen: "EventsList",
      params: { initialScope: "saved" },
    });
  };

  const handleAttendingEvents = () => {
    navigation.navigate("Events", {
      screen: "EventsList",
      params: { initialScope: "attending" },
    });
  };

  const handleSettings = () => {
    Alert.alert("Settings", "Settings screen coming soon!");
  };

  const handleHelp = () => {
    Alert.alert(
      "Help & Support",
      "Need help? Contact us at:\n\nsupport@communityevent.com\n\nOr visit our FAQ section in the app.",
      [{ text: "OK" }]
    );
  };

  const menuItems = [
    {
      icon: "heart",
      label: "Saved Events",
      count: user?.savedEvents?.length?.toString() || "0",
      color: colors.secondary,
      onPress: handleSavedEvents,
    },
    {
      icon: "ticket",
      label: "My Events",
      count: user?.eventsCreated?.length?.toString() || "0",
      color: colors.primary,
      onPress: handleMyEvents,
    },
    {
      icon: "calendar",
      label: "Attending Events",
      count: user?.eventsAttending?.length?.toString() || "0",
      color: "#4ECDC4",
      onPress: handleAttendingEvents,
    },
    {
      icon: "settings",
      label: "Settings",
      color: colors.textSecondary,
      onPress: handleSettings,
    },
    {
      icon: "help-circle",
      label: "Help & Support",
      color: colors.primary,
      onPress: handleHelp,
    },
  ];

  // Show login prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.guestContainer}>
          <View style={styles.guestIconContainer}>
            <Ionicons
              name="person-circle-outline"
              size={120}
              color={colors.primary}
            />
          </View>
          <Text style={styles.guestTitle}>Welcome to CommUnity</Text>
          <Text style={styles.guestSubtitle}>
            Sign in to view your profile, create events, and connect with your
            community
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerBackground}
        >
          <View style={styles.headerDecorCircle1} />
          <View style={styles.headerDecorCircle2} />
        </LinearGradient>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleEditProfile}
          >
            <Ionicons name="create-outline" size={20} color={colors.surface} />
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <View style={styles.avatarGradient}>
                {user?.avatar ? (
                  <Image
                    source={{ uri: user.avatar }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handleEditProfile}
            >
              <Ionicons name="camera" size={18} color={colors.surface} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name || "Guest User"}</Text>
          <View style={styles.subtitleContainer}>
            <Ionicons
              name="settings-outline"
              size={14}
              color={colors.surface}
              style={styles.subtitleIcon}
            />
            <Text style={styles.headerSubtitle}>
              Manage your profile and settings
            </Text>
          </View>
          {user?.bio && (
            <View style={styles.bioContainer}>
              <Ionicons
                name="document-text-outline"
                size={14}
                color={colors.surface}
                style={styles.bioIcon}
              />
              <Text style={styles.userBio}>{user.bio}</Text>
            </View>
          )}
          {user?.email && (
            <View style={styles.emailContainer}>
              <Ionicons
                name="mail-outline"
                size={14}
                color={colors.surface}
                style={styles.emailIcon}
              />
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          )}

          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.badgeText}>
                Member since{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).getFullYear()
                  : "2024"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Animated.View
        style={[
          styles.statsContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <TouchableOpacity
          style={styles.statItem}
          onPress={handleAttendingEvents}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[colors.primary + "30", colors.primary + "10"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statIconBox}
          >
            <Ionicons name="calendar" size={28} color={colors.primary} />
          </LinearGradient>
          <Text style={styles.statNumber}>
            {user?.eventsAttending?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Attending</Text>
        </TouchableOpacity>
        <View style={styles.statDivider} />
        <TouchableOpacity
          style={styles.statItem}
          onPress={handleMyEvents}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[colors.secondary + "30", colors.secondary + "10"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statIconBox}
          >
            <Ionicons name="create" size={28} color={colors.secondary} />
          </LinearGradient>
          <Text style={styles.statNumber}>
            {user?.eventsCreated?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Created</Text>
        </TouchableOpacity>
        <View style={styles.statDivider} />
        <TouchableOpacity
          style={styles.statItem}
          onPress={handleSavedEvents}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={["#4ECDC4" + "30", "#4ECDC4" + "10"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statIconBox}
          >
            <Ionicons name="heart" size={28} color="#4ECDC4" />
          </LinearGradient>
          <Text style={styles.statNumber}>
            {user?.savedEvents?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Saved</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.section,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="time" size={22} color={colors.primary} />
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
        <View style={styles.activityCard}>
          {user?.eventsCreated?.length > 0 && (
            <View style={styles.activityItem}>
              <LinearGradient
                colors={[colors.primary + "30", colors.primary + "10"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activityIcon}
              >
                <Ionicons name="calendar" size={20} color={colors.primary} />
              </LinearGradient>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  Created{" "}
                  {user.eventsCreated[user.eventsCreated.length - 1]?.title ||
                    "an event"}
                </Text>
                <Text style={styles.activityTime}>
                  {user.eventsCreated[user.eventsCreated.length - 1]?.date ||
                    "Recently"}
                </Text>
              </View>
            </View>
          )}
          {user?.eventsAttending?.length > 0 && (
            <View style={styles.activityItem}>
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  Attending{" "}
                  {user.eventsAttending[user.eventsAttending.length - 1]
                    ?.title || "an event"}
                </Text>
                <Text style={styles.activityTime}>
                  {user.eventsAttending[user.eventsAttending.length - 1]
                    ?.date || "Recently"}
                </Text>
              </View>
            </View>
          )}
          {user?.savedEvents?.length > 0 && (
            <View style={styles.activityItem}>
              <LinearGradient
                colors={["#4ECDC4" + "30", "#4ECDC4" + "10"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activityIcon}
              >
                <Ionicons name="heart" size={20} color="#4ECDC4" />
              </LinearGradient>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  Saved {user.savedEvents.length} event
                  {user.savedEvents.length !== 1 ? "s" : ""}
                </Text>
                <Text style={styles.activityTime}>Recently</Text>
              </View>
            </View>
          )}
          {!user?.eventsCreated?.length &&
            !user?.eventsAttending?.length &&
            !user?.savedEvents?.length && (
              <View style={styles.emptyActivity}>
                <Ionicons
                  name="calendar-outline"
                  size={40}
                  color={colors.textSecondary}
                />
                <Text style={styles.emptyActivityText}>
                  No recent activity yet
                </Text>
                <Text style={styles.emptyActivityHint}>
                  Start exploring events to see your activity here
                </Text>
              </View>
            )}
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.section,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="settings" size={22} color={colors.primary} />
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast,
              ]}
              activeOpacity={0.7}
              onPress={item.onPress}
            >
              <View
                style={[
                  styles.menuIconBox,
                  { backgroundColor: item.color + "20" },
                ]}
              >
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.menuText}>{item.label}</Text>
              {item.count && (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{item.count}</Text>
                </View>
              )}
              {item.badge && (
                <View style={styles.notificationDot}>
                  <Text style={styles.notificationDotText}>{item.badge}</Text>
                </View>
              )}
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textLight}
              />
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.actionsContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleEditProfile}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color={colors.surface}
            style={styles.buttonIcon}
          />
          <Text style={styles.primaryButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#FF6B6B"
            style={styles.buttonIcon}
          />
          <Text style={[styles.secondaryButtonText, {color: "#FF6B6B"}]}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: Platform.OS === "ios" ? 120 : 100,
  },
  headerContainer: {
    position: "relative",
    marginBottom: spacing.xl,
    minHeight: 420,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 420,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  headerDecorCircle1: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.1)",
    top: -40,
    right: -30,
  },
  headerDecorCircle2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: 20,
    left: -20,
  },
  header: {
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + spacing.lg
        : spacing.xxl,
    paddingBottom: spacing.lg,
    alignItems: "center",
  },
  settingsButton: {
    position: "absolute",
    top:
      Platform.OS === "android"
        ? StatusBar.currentHeight + spacing.md
        : spacing.xl,
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: spacing.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: colors.surface,
    ...shadows.lg,
    elevation: 10,
  },
  avatarGradient: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 56,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.secondary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.surface,
    ...shadows.md,
  },
  userName: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.surface,
    marginBottom: spacing.xs,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.surface,
    opacity: 1,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    alignSelf: "center",
  },
  subtitleIcon: {
    marginRight: spacing.xs,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  userBio: {
    fontSize: typography.fontSize.base,
    color: colors.surface,
    textAlign: "center",
    flex: 1,
    fontWeight: typography.fontWeight.medium,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bioContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    alignSelf: "center",
    maxWidth: "85%",
  },
  bioIcon: {
    marginRight: spacing.xs,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xs,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    alignSelf: "center",
  },
  emailIcon: {
    marginRight: spacing.xs,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  userEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.surface,
    textAlign: "center",
    opacity: 1,
    fontWeight: typography.fontWeight.medium,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: colors.primary,
  },
  badgeContainer: {
    marginTop: spacing.md,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    gap: spacing.xs,
  },
  badgeText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.lg,
    marginTop: -spacing.xxl,
    elevation: 10,
    borderWidth: 1,
    borderColor: colors.border + "30",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.divider,
  },
  section: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: 0.3,
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.border + "30",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  activityTime: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  emptyActivity: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  emptyActivityText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginTop: spacing.sm,
  },
  emptyActivityHint: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  menuContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.lg,
    borderWidth: 1,
    borderColor: colors.border + "30",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: "600",
  },
  countBadge: {
    backgroundColor: colors.primary + "20",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  countBadgeText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  notificationDot: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
    minWidth: 20,
    alignItems: "center",
  },
  notificationDotText: {
    color: colors.surface,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  actionsContainer: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md + 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
    minHeight: 56,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md + 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FF6B6B",
    minHeight: 56,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  logoutContainer: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    gap: spacing.sm,
  },
  logoutText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: "#FF6B6B",
  },
  bottomSpacing: {
    height: 100,
  },
  // Guest/Login screen styles
  guestContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surface,
  },
  guestIconContainer: {
    marginBottom: spacing.xl,
  },
  guestTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  guestSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xxl,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.xl,
    width: "100%",
    alignItems: "center",
    marginBottom: spacing.md,
    ...shadows.md,
  },
  loginButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  registerButton: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.xl,
    width: "100%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  registerButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
});
