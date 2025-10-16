// screens/SettingsScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography, spacing, borderRadius, shadows } from "../theme";
import { useTheme } from "../context/ThemeContext"; // ✅ Use context instead of static colors

export default function SettingsScreen({ navigation }) {
  const { isDarkMode, setIsDarkMode, colors } = useTheme(); // ✅ access theme

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="settings-outline" size={26} color={colors.primary} />
        <Text style={[styles.headerText, { color: colors.text }]}>Settings</Text>
      </View>

      {/* Preferences Section */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>

        <View style={[styles.row, { borderBottomColor: colors.divider }]}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon-outline" size={22} color={colors.textSecondary} />
            <Text style={[styles.rowText, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={() => setIsDarkMode(!isDarkMode)} // ✅ updates context
            thumbColor={isDarkMode ? colors.primary : "#f4f3f4"}
            trackColor={{ false: "#ccc", true: colors.primary + "70" }}
          />
        </View>
      </View>

      {/* Account Section */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>

        <TouchableOpacity style={styles.rowButton} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <Ionicons name="key-outline" size={22} color={colors.textSecondary} />
            <Text style={[styles.rowText, { color: colors.text }]}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.rowButton} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <Ionicons name="shield-outline" size={22} color={colors.textSecondary} />
            <Text style={[styles.rowText, { color: colors.text }]}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.rowButton} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={colors.textSecondary}
            />
            <Text style={[styles.rowText, { color: colors.text }]}>About App</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        activeOpacity={0.8}
        onPress={() => {
          alert("You have been logged out successfully!");
          navigation.navigate("Home");
        }}
      >
        <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
        <Text style={[styles.logoutText, { color: "#FF6B6B" }]}>Logout</Text>
      </TouchableOpacity>

      <View style={{ height: spacing.lg }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  headerText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginLeft: spacing.sm,
  },
  section: {
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowText: {
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  rowButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  logoutText: {
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
});
