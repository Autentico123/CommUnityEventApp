import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext"; // ✅ get colors + dark mode
import { typography, spacing, borderRadius, shadows } from "../theme";

export default function HomeScreen({ navigation }) {
  const categories = [
    { name: "Sports", icon: "football", color: "#FF6B6B", count: 12 },
    { name: "Music", icon: "musical-notes", color: "#4ECDC4", count: 8 },
    { name: "Education", icon: "school", color: "#95E1D3", count: 15 },
    { name: "Community", icon: "people", color: "#FFE66D", count: 20 },
    { name: "Food", icon: "restaurant", color: "#FF6B9D", count: 10 },
    { name: "Tech", icon: "laptop", color: "#A8E6CF", count: 7 },
  ];

  // ✅ Use dynamic colors from ThemeContext
  const { colors, isDarkMode } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={[
          styles.headerContainer,
          { backgroundColor: colors.primary, shadowColor: colors.shadow },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: colors.surface }]}>
                Hello! 👋
              </Text>
              <Text style={[styles.headerTitle, { color: colors.surface }]}>
                CommUnity
              </Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.surface}
              />
              <View
                style={[
                  styles.notificationBadge,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={[styles.headerSubtitle, { color: colors.surface }]}>
            Discover amazing events near you
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: isDarkMode
                  ? colors.cardDark
                  : colors.surface,
              },
            ]}
          >
            <Ionicons name="calendar" size={24} color={colors.primary} />
            <Text style={[styles.statNumber, { color: colors.text }]}>24</Text>
            <Text
              style={[styles.statLabel, { color: colors.textSecondary }]}
            >
              Upcoming
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: isDarkMode
                  ? colors.cardDark
                  : colors.surface,
              },
            ]}
          >
            <Ionicons name="heart" size={24} color={colors.secondary} />
            <Text style={[styles.statNumber, { color: colors.text }]}>12</Text>
            <Text
              style={[styles.statLabel, { color: colors.textSecondary }]}
            >
              Saved
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: isDarkMode
                  ? colors.cardDark
                  : colors.surface,
              },
            ]}
          >
            <Ionicons name="ticket" size={24} color="#4ECDC4" />
            <Text style={[styles.statNumber, { color: colors.text }]}>5</Text>
            <Text
              style={[styles.statLabel, { color: colors.textSecondary }]}
            >
              Attending
            </Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Browse by Category
          </Text>
          <View style={styles.categoryGrid}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: isDarkMode
                      ? colors.cardDark
                      : colors.surface,
                  },
                ]}
                onPress={() => navigation.navigate("Events")}
              >
                <View
                  style={[
                    styles.categoryIconBox,
                    { backgroundColor: category.color + "20" },
                  ]}
                >
                  <Ionicons
                    name={category.icon}
                    size={24}
                    color={category.color}
                  />
                </View>
                <Text
                  style={[styles.categoryName, { color: colors.text }]}
                >
                  {category.name}
                </Text>
                <Text
                  style={[
                    styles.categoryCount,
                    { color: colors.textSecondary },
                  ]}
                >
                  {category.count} events
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// ✅ Styles remain clean and reusable
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    ...shadows.lg,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: typography.fontSize.base,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.base,
    opacity: 0.9,
  },
  content: {
    padding: spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: -spacing.xl,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
    ...shadows.sm,
  },
  statNumber: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.md,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  categoryCard: {
    width: "31%",
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
    ...shadows.sm,
  },
  categoryIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  categoryCount: {
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
  },
});
