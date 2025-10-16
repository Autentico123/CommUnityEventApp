import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  LinearGradient,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

export default function HomeScreen({ navigation }) {
  const categories = [
    { name: "Sports", icon: "football", color: "#FF6B6B", count: 12 },
    { name: "Music", icon: "musical-notes", color: "#4ECDC4", count: 8 },
    { name: "Education", icon: "school", color: "#95E1D3", count: 15 },
    { name: "Community", icon: "people", color: "#FFE66D", count: 20 },
    { name: "Food", icon: "restaurant", color: "#FF6B9D", count: 10 },
    { name: "Tech", icon: "laptop", color: "#A8E6CF", count: 7 },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerContainer}>
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Ionicons name="people" size={24} color={colors.surface} />
                </View>
              </View>
              <View>
                <Text style={styles.greeting}>Hello! 👋</Text>
                <Text style={styles.headerTitle}>CommUnity</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.searchButton}>
                <Ionicons
                  name="search-outline"
                  size={20}
                  color={colors.surface}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={colors.surface}
                />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            Discover amazing events near you
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconBox,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Ionicons name="calendar" size={22} color={colors.primary} />
            </View>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel} numberOfLines={1}>
              Upcoming
            </Text>
          </View>
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconBox,
                { backgroundColor: colors.secondary + "20" },
              ]}
            >
              <Ionicons name="heart" size={22} color={colors.secondary} />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel} numberOfLines={1}>
              Saved
            </Text>
          </View>
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconBox,
                { backgroundColor: "#4ECDC4" + "20" },
              ]}
            >
              <Ionicons name="checkmark-circle" size={22} color="#4ECDC4" />
            </View>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel} numberOfLines={1}>
              Attending
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Event</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => navigation.navigate("Events")}
          >
            <View style={styles.featuredGradient}>
              <View style={styles.eventBadge}>
                <Ionicons name="star" size={12} color={colors.surface} />
                <Text style={styles.eventBadgeText}>FEATURED</Text>
              </View>
              <Text style={styles.featuredTitle}>Welcome to CommUnity!</Text>
              <Text style={styles.featuredDescription}>
                Your event-sharing platform is ready. Start exploring and
                creating amazing events!
              </Text>
              <View style={styles.featuredFooter}>
                <View style={styles.featuredInfo}>
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={colors.surface}
                  />
                  <Text style={styles.featuredInfoText}>Today</Text>
                </View>
                <View style={styles.featuredInfo}>
                  <Ionicons
                    name="people-outline"
                    size={14}
                    color={colors.surface}
                  />
                  <Text style={styles.featuredInfoText}>150+ Attending</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.actionCard, styles.actionCardPrimary]}
              onPress={() => navigation.navigate("Events")}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="search" size={28} color={colors.surface} />
              </View>
              <Text style={styles.actionTitle}>Browse</Text>
              <Text style={styles.actionSubtitle}>Explore Events</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, styles.actionCardSecondary]}
              onPress={() => navigation.navigate("CreateEvent")}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="add-circle" size={28} color={colors.surface} />
              </View>
              <Text style={styles.actionTitle}>Create</Text>
              <Text style={styles.actionSubtitle}>New Event</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse by Category</Text>
          </View>
          <View style={styles.categoryGrid}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryCard}
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
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>
                  {category.count} events
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now 🔥</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.trendingCard}
                onPress={() => navigation.navigate("Events")}
              >
                <View style={styles.trendingBadge}>
                  <Ionicons name="flame" size={12} color="#FF6B6B" />
                  <Text style={styles.trendingBadgeText}>HOT</Text>
                </View>
                <Text style={styles.trendingTitle}>
                  Summer Music Fest {item}
                </Text>
                <View style={styles.trendingFooter}>
                  <View style={styles.trendingInfo}>
                    <Ionicons
                      name="location"
                      size={12}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.trendingInfoText}>Downtown</Text>
                  </View>
                  <View style={styles.trendingAttendees}>
                    <Ionicons name="people" size={12} color={colors.primary} />
                    <Text style={styles.trendingAttendeesText}>200+</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
    ...shadows.lg,
    position: "relative",
    overflow: "hidden",
  },
  decorativeCircle1: {
    position: "absolute",
    top: -50,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -40,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  header: {
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + spacing.lg
        : spacing.xxl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  logoContainer: {
    marginRight: spacing.xs,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  headerRight: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontSize: typography.fontSize.sm,
    color: colors.surface,
    opacity: 0.9,
    marginBottom: spacing.xs / 2,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
    letterSpacing: 0.5,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: colors.secondary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  notificationBadgeText: {
    color: colors.surface,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.surface,
    opacity: 0.85,
    lineHeight: 22,
    paddingLeft: spacing.xs,
  },
  content: {
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    alignItems: "center",
    ...shadows.md,
    minWidth: 0,
  },
  statIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  statNumber: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
    fontWeight: typography.fontWeight.medium,
    textAlign: "center",
    numberOfLines: 1,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  seeAll: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  featuredCard: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.lg,
  },
  featuredGradient: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    minHeight: 180,
    justifyContent: "space-between",
  },
  eventBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
    gap: spacing.xs,
  },
  eventBadgeText: {
    color: colors.surface,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  featuredTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
    marginTop: spacing.sm,
  },
  featuredDescription: {
    fontSize: typography.fontSize.base,
    color: colors.surface,
    opacity: 0.9,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
    marginTop: spacing.sm,
  },
  featuredFooter: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  featuredInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  featuredInfoText: {
    color: colors.surface,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  quickActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: "center",
    ...shadows.md,
    minHeight: 140,
    justifyContent: "center",
  },
  actionCardPrimary: {
    backgroundColor: colors.primary,
  },
  actionCardSecondary: {
    backgroundColor: colors.secondary,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  actionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
    marginTop: spacing.xs,
  },
  actionSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.surface,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  categoryCard: {
    width: "31%",
    backgroundColor: colors.surface,
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
    color: colors.text,
    marginTop: spacing.xs,
  },
  categoryCount: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  trendingCard: {
    width: 200,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    ...shadows.md,
  },
  trendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B15",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
    gap: spacing.xs,
  },
  trendingBadgeText: {
    color: "#FF6B6B",
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  trendingTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  trendingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trendingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  trendingInfoText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  trendingAttendees: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  trendingAttendeesText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
});
