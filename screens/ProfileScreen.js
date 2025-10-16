import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

export default function ProfileScreen() {
  const menuItems = [
    {
      icon: "heart",
      label: "Saved Events",
      count: "12",
      color: colors.secondary,
    },
    { icon: "ticket", label: "My Events", count: "5", color: colors.primary },
    { icon: "calendar", label: "Calendar", color: "#4ECDC4" },
    { icon: "settings", label: "Settings", color: colors.textSecondary },
    {
      icon: "notifications",
      label: "Notifications",
      badge: "3",
      color: "#FFE66D",
    },
    { icon: "help-circle", label: "Help & Support", color: colors.primary },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerBackground} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons
              name="settings-outline"
              size={20}
              color={colors.surface}
            />
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <View style={styles.avatarGradient}>
                <Ionicons name="person" size={50} color={colors.primary} />
              </View>
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={18} color={colors.surface} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>Vincent Autentico</Text>
          <Text style={styles.userBio}>
            Event enthusiast • Community builder
          </Text>

          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.badgeText}>Pro Member</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statItem}>
          <View
            style={[
              styles.statIconBox,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Ionicons name="calendar" size={20} color={colors.primary} />
          </View>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Events Joined</Text>
        </TouchableOpacity>
        <View style={styles.statDivider} />
        <TouchableOpacity style={styles.statItem}>
          <View
            style={[
              styles.statIconBox,
              { backgroundColor: colors.secondary + "20" },
            ]}
          >
            <Ionicons name="create" size={20} color={colors.secondary} />
          </View>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Created</Text>
        </TouchableOpacity>
        <View style={styles.statDivider} />
        <TouchableOpacity style={styles.statItem}>
          <View
            style={[styles.statIconBox, { backgroundColor: "#4ECDC4" + "20" }]}
          >
            <Ionicons name="people" size={20} color="#4ECDC4" />
          </View>
          <Text style={styles.statNumber}>48</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
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
              <Text style={styles.activityTitle}>Attended Tech Workshop</Text>
              <Text style={styles.activityTime}>2 days ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View
              style={[
                styles.activityIcon,
                { backgroundColor: colors.secondary + "20" },
              ]}
            >
              <Ionicons name="heart" size={20} color={colors.secondary} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Saved 3 new events</Text>
              <Text style={styles.activityTime}>5 days ago</Text>
            </View>
          </View>
        </View>
      </View>

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
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Ionicons
            name="create-outline"
            size={20}
            color={colors.surface}
            style={styles.buttonIcon}
          />
          <Text style={styles.primaryButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons
            name="share-social-outline"
            size={20}
            color={colors.primary}
            style={styles.buttonIcon}
          />
          <Text style={styles.secondaryButtonText}>Share Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    position: "relative",
    marginBottom: spacing.xl,
  },
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
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + spacing.lg
        : spacing.xxl,
    paddingBottom: spacing.xxl,
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
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.surface,
    ...shadows.lg,
  },
  avatarGradient: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.secondary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.surface,
    ...shadows.md,
  },
  userName: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  userBio: {
    fontSize: typography.fontSize.base,
    color: colors.surface,
    textAlign: "center",
    opacity: 1,
    fontWeight: typography.fontWeight.medium,
    paddingHorizontal: spacing.lg,
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
    fontWeight: typography.fontWeight.bold,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.lg,
    marginTop: -spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  statNumber: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.divider,
  },
  section: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  menuContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.sm,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
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
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
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
    height: spacing.xl,
  },
});
