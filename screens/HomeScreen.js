import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Platform,
  StatusBar,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEvents } from "../context/EventContext";
import { useAuth } from "../context/AuthContext";
import { useGroups } from "../context/GroupContext";
import { useChat } from "../context/ChatContext";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

export default function HomeScreen({ navigation }) {
  const { allEvents } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const { groups, myGroups } = useGroups();
  const { unreadCount } = useChat();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Calculate dynamic stats
  const upcomingEvents = allEvents.length;
  const savedEvents = user?.savedEvents?.length || 0;
  const attendingEvents = user?.eventsAttending?.length || 0;
  const totalGroups = groups.length;
  const myGroupsCount = myGroups.length;

  // Dynamic category mapping with icons and colors
  const categoryConfig = {
    Sports: { icon: "football", color: "#FF6B6B", emoji: "⚽" },
    Music: { icon: "musical-notes", color: "#4ECDC4", emoji: "🎵" },
    Education: { icon: "school", color: "#95E1D3", emoji: "📚" },
    Community: { icon: "people", color: "#FFE66D", emoji: "👥" },
    Social: { icon: "happy", color: "#FF6B9D", emoji: "🎉" },
    Food: { icon: "restaurant", color: "#FFB347", emoji: "🍕" },
    Technology: { icon: "laptop", color: "#A8E6CF", emoji: "💻" },
    Tech: { icon: "laptop", color: "#A8E6CF", emoji: "💻" },
    Art: { icon: "color-palette", color: "#C7B4FF", emoji: "🎨" },
    Business: { icon: "briefcase", color: "#FFB347", emoji: "💼" },
    Health: { icon: "fitness", color: "#77DD77", emoji: "💪" },
    Entertainment: { icon: "game-controller", color: "#FF6B9D", emoji: "🎮" },
    Other: { icon: "apps", color: "#95A5A6", emoji: "🎉" },
  };

  // Helper function to get category emoji
  const getCategoryEmoji = (category) => {
    return categoryConfig[category]?.emoji || "🎉";
  };

  // Helper function to get category icon
  const getCategoryIcon = (category) => {
    return categoryConfig[category]?.icon || "apps";
  };

  // Helper function to format event date safely
  const formatEventDate = (dateString) => {
    if (!dateString) return "TBA";
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original string if it's not a valid date
      }
      
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString || "TBA";
    }
  };

  // Dynamically generate categories from actual events
  const categories = React.useMemo(() => {
    const categoryCounts = {};

    // Count events per category
    allEvents.forEach((event) => {
      const category = event.category || "Other";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    // Convert to array with config
    return Object.entries(categoryCounts)
      .map(([name, count]) => ({
        name,
        count,
        icon: categoryConfig[name]?.icon || "apps",
        color: categoryConfig[name]?.color || "#95A5A6",
      }))
      .sort((a, b) => b.count - a.count) // Sort by count descending
      .slice(0, 6); // Show top 6 categories
  }, [allEvents]);

  // Get active groups (groups with most members or recent activity)
  const activeGroups = React.useMemo(() => {
    return [...groups]
      .sort((a, b) => {
        const membersA = Array.isArray(a.members) ? a.members.length : 0;
        const membersB = Array.isArray(b.members) ? b.members.length : 0;
        return membersB - membersA; // Sort by member count descending
      })
      .slice(0, 5); // Show top 5 active groups
  }, [groups]);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <LinearGradient
        colors={[colors.primary, colors.primary + "dd", colors.primary + "99"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerContainer}
      >
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Ionicons name="people" size={24} color={colors.surface} />
                </View>
              </View>
              <View>
                <Text style={styles.greeting}>
                  Hello
                  {isAuthenticated && user?.name
                    ? `, ${user.name.split(" ")[0]}`
                    : ""}
                  ! 👋
                </Text>
                <Text style={styles.headerTitle}>CommUnity</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => navigation.navigate("Events")}
              >
                <Ionicons
                  name="search-outline"
                  size={20}
                  color={colors.surface}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => navigation.navigate("Messages")}
              >
                <Ionicons
                  name="chatbubbles-outline"
                  size={20}
                  color={colors.surface}
                />
                {unreadCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            Discover amazing events near you
          </Text>
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.sectionHeaderMain}>
            <Ionicons name="flash" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
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

            <TouchableOpacity
              style={[styles.actionCard, styles.actionCardAccent]}
              onPress={() => navigation.navigate("GroupsList")}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="people" size={28} color={colors.surface} />
              </View>
              <Text style={styles.actionTitle}>Groups</Text>
              <Text style={styles.actionSubtitle}>Join Community</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, styles.actionCardPeople]}
              onPress={() => navigation.navigate("PeopleList")}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="person-add" size={28} color={colors.surface} />
              </View>
              <Text style={styles.actionTitle}>People</Text>
              <Text style={styles.actionSubtitle}>Discover Users</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View
          style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <TouchableOpacity
            style={styles.mapCard}
            onPress={() => navigation.navigate("Map")}
            activeOpacity={0.8}
          >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.mapGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.mapCardContent}>
              <View style={styles.mapIconContainer}>
                <Ionicons name="map" size={32} color={colors.surface} />
              </View>
              <View style={styles.mapTextContent}>
                <Text style={styles.mapTitle}>Explore Events on Map</Text>
                <Text style={styles.mapSubtitle}>
                  Find events happening around you
                </Text>
              </View>
              <View style={styles.mapArrowContainer}>
                <Ionicons
                  name="arrow-forward"
                  size={24}
                  color={colors.surface}
                />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="grid" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Browse by Category</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Events")}>
              <Text style={styles.seeAll}>View all</Text>
            </TouchableOpacity>
          </View>
          {categories.length > 0 ? (
            <View style={styles.categoryGrid}>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.categoryCard}
                  onPress={() => navigation.navigate("Events", { 
                    selectedFilter: category.name 
                  })}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[category.color + "15", category.color + "05"]}
                    style={styles.categoryGradient}
                  >
                    <View style={styles.categoryIconBox}>
                      <Ionicons
                        name={category.icon}
                        size={28}
                        color={category.color}
                      />
                    </View>
                    <View style={styles.categoryBadge}>
                      <Text
                        style={[
                          styles.categoryBadgeText,
                          { color: category.color },
                        ]}
                      >
                        {category.count}
                      </Text>
                    </View>
                  </LinearGradient>
                  <Text style={styles.categoryName} numberOfLines={1}>
                    {category.name}
                  </Text>
                  <Text style={styles.categoryCount}>
                    {category.count === 1 ? "event" : "events"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="albums-outline"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyStateText}>
                No events yet. Create one to get started!
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate("CreateEvent")}
              >
                <Text style={styles.emptyStateButtonText}>Create Event</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="people" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Active Groups</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("GroupsList")}>
              <Text style={styles.seeAll}>View all →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.groupScrollContent}
          >
            {activeGroups.length > 0 ? (
              activeGroups.map((group, index) => {
                const memberCount = Array.isArray(group.members)
                  ? group.members.length
                  : group.memberCount || 0;

                const gradientColors = [
                  ["#667eea", "#764ba2"],
                  ["#f093fb", "#f5576c"],
                  ["#4facfe", "#00f2fe"],
                  ["#43e97b", "#38f9d7"],
                  ["#fa709a", "#fee140"],
                ];

                return (
                  <TouchableOpacity
                    key={group._id || index}
                    style={styles.groupCard}
                    onPress={() =>
                      navigation.navigate("GroupDetail", { groupId: group._id })
                    }
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={gradientColors[index % gradientColors.length]}
                      style={styles.groupGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.groupHeader}>
                        <View style={styles.groupAvatarContainer}>
                          <Text style={styles.groupInitial}>
                            {group.name.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.groupOnlineBadge}>
                          <View style={styles.groupOnlineDot} />
                        </View>
                      </View>
                      <View style={styles.groupGradientOverlay}>
                        <Ionicons
                          name="people"
                          size={40}
                          color="rgba(255,255,255,0.15)"
                        />
                      </View>
                    </LinearGradient>
                    <View style={styles.groupCardContent}>
                      <Text style={styles.groupName} numberOfLines={2}>
                        {group.name}
                      </Text>
                      {group.description && (
                        <Text style={styles.groupDescription} numberOfLines={2}>
                          {group.description}
                        </Text>
                      )}
                      <View style={styles.groupFooter}>
                        <View style={styles.groupStatsRow}>
                          <View style={styles.groupStats}>
                            <View style={styles.groupStatBadge}>
                              <Ionicons
                                name="people"
                                size={12}
                                color={colors.primary}
                              />
                              <Text style={styles.groupStatsText}>
                                {memberCount}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.chevronCircleSmall}>
                            <Ionicons
                              name="chevron-forward"
                              size={14}
                              color={colors.primary}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyGroupsCard}>
                <Ionicons
                  name="people-outline"
                  size={32}
                  color={colors.textSecondary}
                />
                <Text style={styles.emptyGroupsText}>No groups yet</Text>
                <TouchableOpacity
                  style={styles.joinGroupButton}
                  onPress={() => navigation.navigate("GroupsList")}
                >
                  <Text style={styles.joinGroupButtonText}>Explore Groups</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </Animated.View>

        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="star" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Popular Events</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Events")}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.popularEventsContainer}>
            {allEvents.slice(0, 3).map((event, index) => {
              const attendees = event.attendees || 0;
              const categoryColors = {
                Sports: "#FF6B6B",
                Music: "#4ECDC4",
                Education: "#95E1D3",
                Community: "#FFE66D",
                Food: "#FF6B9D",
                Technology: "#A8E6CF",
                Tech: "#A8E6CF",
                Art: "#C7B4FF",
                Business: "#FFB347",
                Health: "#77DD77",
                Entertainment: "#FF6B9D",
                Other: "#95A5A6",
              };
              const categoryColor = categoryColors[event.category] || "#95A5A6";

              // Check if event has actual image URL (imageUrl field) or use emoji
              const hasImageUrl =
                event.imageUrl &&
                typeof event.imageUrl === "string" &&
                (event.imageUrl.startsWith("http") ||
                  event.imageUrl.startsWith("file"));
              const eventEmoji =
                event.image || getCategoryEmoji(event.category);

              return (
                <TouchableOpacity
                  key={event._id || index}
                  style={styles.popularEventCard}
                  onPress={() => navigation.navigate("EventDetails", { event })}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[colors.surface, categoryColor + "08"]}
                    style={styles.popularEventGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.popularEventContent}>
                      <View style={styles.popularEventLeft}>
                        {hasImageUrl ? (
                          <Image
                            source={{ uri: event.imageUrl }}
                            style={styles.eventImageBox}
                            resizeMode="cover"
                          />
                        ) : (
                          <View
                            style={[
                              styles.eventIconBox,
                              { backgroundColor: categoryColor + "20" },
                            ]}
                          >
                            <Text style={styles.eventEmoji}>{eventEmoji}</Text>
                          </View>
                        )}
                        <View style={styles.popularEventInfo}>
                          <View style={styles.eventTitleRow}>
                            <Text
                              style={styles.popularEventTitle}
                              numberOfLines={1}
                            >
                              {event.title}
                            </Text>
                            {event.status === "published" && (
                              <View
                                style={[
                                  styles.statusBadge,
                                  { backgroundColor: "#4ECDC4" + "20" },
                                ]}
                              >
                                <Ionicons
                                  name="checkmark-circle"
                                  size={10}
                                  color="#4ECDC4"
                                />
                              </View>
                            )}
                          </View>
                          {event.location && (
                            <View style={styles.eventLocationRow}>
                              <Ionicons
                                name="location-outline"
                                size={12}
                                color={colors.textSecondary}
                              />
                              <Text
                                style={styles.eventLocation}
                                numberOfLines={1}
                              >
                                {event.location}
                              </Text>
                            </View>
                          )}
                          <View style={styles.popularEventMetaRow}>
                            <View style={styles.popularEventMeta}>
                              <Ionicons
                                name="calendar-outline"
                                size={13}
                                color={categoryColor}
                              />
                              <Text
                                style={[
                                  styles.popularEventDate,
                                  { color: categoryColor },
                                ]}
                              >
                                {formatEventDate(event.date)}
                              </Text>
                            </View>
                            {attendees > 0 && (
                              <View
                                style={[
                                  styles.attendeesBadge,
                                  { backgroundColor: categoryColor + "15" },
                                ]}
                              >
                                <Ionicons
                                  name="people"
                                  size={11}
                                  color={categoryColor}
                                />
                                <Text
                                  style={[
                                    styles.attendeesBadgeText,
                                    { color: categoryColor },
                                  ]}
                                >
                                  {attendees}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                      <View style={styles.popularEventRight}>
                        <View
                          style={[
                            styles.chevronCircle,
                            { backgroundColor: categoryColor + "15" },
                          ]}
                        >
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={categoryColor}
                          />
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="stats-chart" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Community Activity</Text>
            </View>
          </View>
          <View style={styles.activityContainer}>
            <TouchableOpacity 
              style={styles.activityCard}
              onPress={() => navigation.navigate("Events")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#FF6B6B" + "15", "#FF6B6B" + "05"]}
                style={styles.activityGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View
                  style={[
                    styles.activityIcon,
                    { backgroundColor: "#FF6B6B" + "20" },
                  ]}
                >
                  <Ionicons name="calendar" size={24} color="#FF6B6B" />
                </View>
                <Text style={styles.activityNumber}>{upcomingEvents}</Text>
                <Text style={styles.activityLabel}>Total Events</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.activityCard}
              onPress={() => navigation.navigate("GroupsList")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#4ECDC4" + "15", "#4ECDC4" + "05"]}
                style={styles.activityGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View
                  style={[
                    styles.activityIcon,
                    { backgroundColor: "#4ECDC4" + "20" },
                  ]}
                >
                  <Ionicons name="people" size={24} color="#4ECDC4" />
                </View>
                <Text style={styles.activityNumber}>{totalGroups}</Text>
                <Text style={styles.activityLabel}>Active Groups</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.activityCard}
              onPress={() => navigation.navigate("Events", { initialScope: "attending" })}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#FFE66D" + "15", "#FFE66D" + "05"]}
                style={styles.activityGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View
                  style={[
                    styles.activityIcon,
                    { backgroundColor: "#FFD93D" + "20" },
                  ]}
                >
                  <Ionicons name="ticket" size={24} color="#F39C12" />
                </View>
                <Text style={styles.activityNumber}>{attendingEvents}</Text>
                <Text style={styles.activityLabel}>Attending</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
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
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
  mapCard: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    marginBottom: spacing.xl,
    ...shadows.lg,
  },
  mapGradient: {
    padding: spacing.lg,
  },
  mapCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  mapIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  mapTextContent: {
    flex: 1,
  },
  mapTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
    marginBottom: spacing.xs / 2,
  },
  mapSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.surface,
    opacity: 0.9,
  },
  mapArrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
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
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  seeAll: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
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
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    alignItems: "center",
    ...shadows.md,
    minHeight: 130,
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  actionCardPrimary: {
    backgroundColor: colors.primary,
  },
  actionCardSecondary: {
    backgroundColor: colors.secondary,
  },
  actionCardAccent: {
    backgroundColor: "#4ECDC4",
  },
  actionCardPeople: {
    backgroundColor: "#A06CD5",
  },
  actionCardChat: {
    backgroundColor: "#FFE66D",
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  actionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
    marginTop: spacing.xs / 2,
  },
  actionSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.surface,
    opacity: 0.9,
    marginTop: spacing.xs / 2,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "31.5%",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    marginBottom: spacing.md,
    ...shadows.md,
  },
  categoryGradient: {
    padding: spacing.lg,
    alignItems: "center",
    position: "relative",
  },
  categoryIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.sm,
  },
  categoryBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xs,
    ...shadows.sm,
  },
  categoryBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  categoryName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: "center",
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  categoryCount: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs / 2,
    marginBottom: spacing.sm,
  },
  groupScrollContent: {
    paddingRight: spacing.lg,
  },
  groupCard: {
    width: 180,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginRight: spacing.md,
    overflow: "hidden",
    ...shadows.lg,
  },
  groupGradient: {
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  groupGradientOverlay: {
    position: "absolute",
    bottom: -10,
    right: -10,
    opacity: 0.3,
  },
  groupHeader: {
    position: "relative",
    zIndex: 1,
  },
  groupAvatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  groupOnlineBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.sm,
  },
  groupOnlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4ECDC4",
  },
  groupCardContent: {
    padding: spacing.md,
  },
  groupIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  groupInitial: {
    fontSize: 28,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  groupName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
    minHeight: 42,
    lineHeight: 20,
  },
  groupDescription: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 16,
  },
  groupFooter: {
    marginTop: spacing.xs,
  },
  groupStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  groupStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupStatBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary + "15",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
  },
  groupStatsText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  chevronCircleSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary + "10",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyGroupsCard: {
    width: 200,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    ...shadows.md,
  },
  emptyGroupsText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  joinGroupButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  joinGroupButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: "center",
    ...shadows.sm,
  },
  emptyStateText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  emptyStateButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  popularEventsContainer: {
    gap: spacing.md,
  },
  popularEventCard: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    backgroundColor: colors.surface,
    ...shadows.lg,
  },
  popularEventGradient: {
    padding: spacing.lg,
  },
  popularEventContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  popularEventLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: spacing.md,
  },
  eventIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  eventImageBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  eventEmoji: {
    fontSize: 32,
  },
  popularEventInfo: {
    flex: 1,
  },
  eventTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.xs / 2,
  },
  popularEventTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  eventLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: spacing.xs,
  },
  eventLocation: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    flex: 1,
  },
  popularEventMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xs / 2,
  },
  popularEventMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  popularEventDate: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  attendeesBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  attendeesBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  popularEventRight: {
    marginLeft: spacing.sm,
  },
  chevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  activityContainer: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  activityCard: {
    flex: 1,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
  },
  activityGradient: {
    padding: spacing.sm,
    alignItems: "center",
    minHeight: 100,
    justifyContent: "center",
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  activityNumber: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  activityLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: typography.fontWeight.medium,
  },
  activityArrow: {
    marginTop: spacing.xs / 2,
    opacity: 0.6,
  },
});
