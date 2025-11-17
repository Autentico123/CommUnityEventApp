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
import { useEvents } from "../context/EventContext";
import { useTheme } from "../context/ThemeContext"; // for colors + dark mode
import { colors as defaultColors, typography, spacing, borderRadius, shadows } from "../theme";

export default function HomeScreen({ navigation }) {
  const { allEvents } = useEvents();
  const { colors, isDarkMode } = useTheme();

  const categories = [
    { name: "Sports", icon: "football", color: "#FF6B6B", count: 12 },
    { name: "Music", icon: "musical-notes", color: "#4ECDC4", count: 8 },
    { name: "Education", icon: "school", color: "#95E1D3", count: 15 },
    { name: "Community", icon: "people", color: "#FFE66D", count: 20 },
    { name: "Food", icon: "restaurant", color: "#FF6B9D", count: 10 },
    { name: "Tech", icon: "laptop", color: "#A8E6CF", count: 7 },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <View style={styles.logoCircle}>
                <Ionicons name="people" size={24} color={colors.surface} />
              </View>
              <View>
                <Text style={[styles.greeting, { color: colors.surface }]}>
                  Hello! 👋
                </Text>
                <Text style={[styles.headerTitle, { color: colors.surface }]}>
                  CommUnity
                </Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.searchButton}>
                <Ionicons name="search-outline" size={20} color={colors.surface} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={20} color={colors.surface} />
                <View style={[styles.notificationBadge, { backgroundColor: colors.secondary }]}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.headerSubtitle, { color: colors.surface }]}>
            Discover amazing events near you
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: colors.primary + "20" }]}>
            <Ionicons name="calendar" size={22} color={colors.primary} />
          </View>
          <Text style={styles.statNumber}>{allEvents.length}</Text>
          <Text style={styles.statLabel} numberOfLines={1}>
            Upcoming
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: colors.secondary + "20" }]}>
            <Ionicons name="heart" size={22} color={colors.secondary} />
          </View>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel} numberOfLines={1}>
            Saved
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: "#4ECDC4" + "20" }]}>
            <Ionicons name="checkmark-circle" size={22} color="#4ECDC4" />
          </View>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel} numberOfLines={1}>
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
                { backgroundColor: isDarkMode ? colors.cardDark : colors.surface },
              ]}
              onPress={() => navigation.navigate("Events")}
            >
              <View
                style={[
                  styles.categoryIconBox,
                  { backgroundColor: category.color + "20" },
                ]}
              >
                <Ionicons name={category.icon} size={24} color={category.color} />
              </View>
              <Text style={[styles.categoryName, { color: colors.text }]}>
                {category.name}
              </Text>
              <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>
                {category.count} events
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  headerContainer: {
    backgroundColor: defaultColors.primary,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
    ...shadows.lg,
    position: "relative",
    overflow: "hidden",
  },
  header: { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + spacing.lg : spacing.xxl, paddingBottom: spacing.xl, paddingHorizontal: spacing.lg },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 },
  logoCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "rgba(255,255,255,0.3)" },
  headerRight: { flexDirection: "row", gap: spacing.sm },
  searchButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  greeting: { fontSize: typography.fontSize.sm, opacity: 0.9, marginBottom: spacing.xs / 2 },
  headerTitle: { fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, letterSpacing: 0.5 },
  headerSubtitle: { fontSize: typography.fontSize.base, opacity: 0.85, lineHeight: 22, paddingLeft: spacing.xs },
  notificationButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center", position: "relative" },
  notificationBadge: { position: "absolute", top: 4, right: 4, minWidth: 16, height: 16, borderRadius: 8, justifyContent: "center", alignItems: "center", paddingHorizontal: 4, borderWidth: 2, borderColor: defaultColors.primary },
  notificationBadgeText: { color: defaultColors.surface, fontSize: 9, fontWeight: typography.fontWeight.bold },
  statsRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.xl },
  statCard: { flex: 1, backgroundColor: defaultColors.surface, borderRadius: borderRadius.xl, padding: spacing.md, alignItems: "center", ...shadows.md, minWidth: 0 },
  statIconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", marginBottom: spacing.sm },
  statNumber: { fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, marginTop: spacing.xs },
  statLabel: { fontSize: typography.fontSize.xs, color: defaultColors.textSecondary, marginTop: spacing.xs / 2, fontWeight: typography.fontWeight.medium, textAlign: "center" },
  section: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, marginBottom: spacing.md },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  categoryCard: { width: "31%", borderRadius: borderRadius.lg, padding: spacing.md, alignItems: "center", ...shadows.sm },
  categoryIconBox: { width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", marginBottom: spacing.sm },
  categoryName: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
  categoryCount: { fontSize: typography.fontSize.xs, marginTop: spacing.xs },
});
