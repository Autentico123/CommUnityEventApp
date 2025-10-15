import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  LinearGradient,
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
      {/* Enhanced Header with Gradient */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hello! 👋</Text>
              <Text style={styles.headerTitle}>CommUnity</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.surface}
              />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>
            Discover amazing events near you
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Quick Stats Cards */}
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.primary + "15" },
            ]}
          >
            <Ionicons name="calendar" size={24} color={colors.primary} />
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.secondary + "15" },
            ]}
          >
            <Ionicons name="heart" size={24} color={colors.secondary} />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View
            style={[styles.statCard, { backgroundColor: "#4ECDC4" + "15" }]}
          >
            <Ionicons name="ticket" size={24} color="#4ECDC4" />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Attending</Text>
          </View>
        </View>

        {/* Featured Event Banner */}
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

        {/* Quick Actions */}
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

        {/* Categories Grid */}
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

        {/* Trending Section */}
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
    color: colors.surface,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
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
    backgroundColor: colors.secondary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.surface,
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
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
    ...shadows.md,
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
    marginTop: spacing.xs,
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
