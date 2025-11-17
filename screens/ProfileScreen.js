import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout, style: "destructive" },
    ]);
  };

  const menuItems = [
    {
      icon: "heart",
      label: "Saved Events",
      count: user?.savedEvents?.length?.toString() || "0",
      color: colors.secondary,
      route: "SavedEvents",
    },
    {
      icon: "ticket",
      label: "My Events",
      count: user?.createdEvents?.length?.toString() || "0",
      color: colors.primary,
    },
    { icon: "calendar", label: "Calendar", color: "#4ECDC4" },
    { icon: "settings", label: "Settings", color: colors.textSecondary },
    {
      icon: "notifications",
      label: "Notifications",
      badge: "3",
      color: "#FFE66D",
      route: null,
    },
    {
      icon: "help-circle",
      label: "Help & Support",
      color: colors.primary,
      route: "HelpSupport",
    },
    {
      icon: "log-out",
      label: "Logout",
      color: "#ff4444",
      onPress: handleLogout,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={["#4ECDC4", "#5563DE"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerBackground}
        />
        <View style={styles.header}>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={22} color={colors.surface} />
          </TouchableOpacity>
          <Animatable.View animation="fadeInDown" style={styles.avatarContainer}>
            <LinearGradient colors={["#ffffff", "#d4f1f9"]} style={styles.avatar}>
              <Ionicons name="person" size={60} color={colors.primary} />
            </LinearGradient>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={18} color={colors.surface} />
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.Text animation="fadeInUp" delay={300} style={styles.userName}>
            {user?.name || "Guest User"}
          </Animatable.Text>
          <Text style={styles.userBio}>
            {user?.bio || "Event enthusiast • Community builder"}
          </Text>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.badgeText}>Pro Member</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statItem}>
          <View style={[styles.statIconBox, { backgroundColor: colors.primary + "15" }]}>
            <Ionicons name="calendar" size={22} color={colors.primary} />
          </View>
          <Text style={styles.statNumber}>{user?.attendingEvents?.length || 0}</Text>
          <Text style={styles.statLabel}>Events Joined</Text>
        </TouchableOpacity>

        <View style={styles.statDivider} />

        <TouchableOpacity style={styles.statItem}>
          <View style={[styles.statIconBox, { backgroundColor: colors.secondary + "15" }]}>
            <Ionicons name="create" size={22} color={colors.secondary} />
          </View>
          <Text style={styles.statNumber}>{user?.createdEvents?.length || 0}</Text>
          <Text style={styles.statLabel}>Created</Text>
        </TouchableOpacity>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={[styles.statIconBox, { backgroundColor: "#4ECDC4" + "15" }]}>
            <Ionicons name="people" size={22} color="#4ECDC4" />
          </View>
          <Text style={styles.statNumber}>48</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
      </View>

      {/* Account Menu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
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
              <View style={[styles.menuIconBox, { backgroundColor: item.color + "20" }]}>
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

              <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Ionicons name="create-outline" size={20} color={colors.surface} style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons name="share-social-outline" size={20} color={colors.primary} style={styles.buttonIcon} />
          <Text style={styles.secondaryButtonText}>Share Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 100 },
  headerContainer: { position: "relative", marginBottom: spacing.xl },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
  },
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + spacing.lg : spacing.xxl,
    paddingBottom: spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.lg,
  },
  settingsButton: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight + spacing.md : spacing.xl,
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: { position: "relative", marginBottom: spacing.sm },
  avatar: {
    width: 115,
    height: 115,
    borderRadius: 58,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
    ...shadows.lg,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.secondary,
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
    marginTop: spacing.sm,
  },
  userBio: {
    fontSize: typography.fontSize.base,
    color: colors.surface,
    textAlign: "center",
    fontWeight: typography.fontWeight.medium,
    paddingHorizontal: spacing.lg,
    opacity: 1,
  },
  badgeContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
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
    fontWeight: typography.fontWeight.medium,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginTop: -spacing.lg,
    ...shadows.md,
  },
  statItem: { flex: 1, alignItems: "center" },
  statIconBox: { width: 42, height: 42, borderRadius: 21, justifyContent: "center", alignItems: "center", marginBottom: spacing.xs },
  statDivider: { width: 1, backgroundColor: colors.divider },
  statNumber: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.text },
  statLabel: { fontSize: typography.fontSize.xs, color: colors.textSecondary },
  section: { marginTop: spacing.lg, marginHorizontal: spacing.lg },
  sectionTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text, marginBottom: spacing.md },
  menuContainer: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, overflow: "hidden", ...shadows.sm },
  menuItem: { flexDirection: "row", alignItems: "center", padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
  menuItemLast: { borderBottomWidth: 0 },
  menuIconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginRight: spacing.md },
  menuText: { flex: 1, fontSize: typography.fontSize.base, color: colors.text, fontWeight: typography.fontWeight.medium },
  countBadge: { backgroundColor: colors.primary + "20", paddingHorizontal: spacing.sm, paddingVertical: spacing.xs / 2, borderRadius: borderRadius.sm, marginRight: spacing.sm },
  countBadgeText: { color: colors.primary, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  notificationDot: { backgroundColor: colors.secondary, paddingHorizontal: spacing.xs, borderRadius: borderRadius.sm, marginRight: spacing.sm, minWidth: 20, alignItems: "center" },
  notificationDotText: { color: colors.surface, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  actionsContainer: { marginTop: spacing.lg, marginHorizontal: spacing.lg, gap: spacing.sm },
  primaryButton: { backgroundColor: colors.primary, borderRadius: borderRadius.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "center", ...shadows.md },
  buttonIcon: { marginRight: spacing.sm },
  primaryButtonText: { color: colors.surface, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
  secondaryButton: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.primary },
  secondaryButtonText: { color: colors.primary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
  logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: spacing.md, gap: spacing.sm, marginTop: spacing.lg },
  logoutText: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium, color: "#FF6B6B" },
});
