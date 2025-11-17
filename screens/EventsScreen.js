import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useEvents } from "../context/EventContext";
import { useAuth } from "../context/AuthContext";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

const EVENT_SCOPE_FILTERS = [
  { key: "all", label: "All Events", icon: "planet" },
  { key: "saved", label: "Saved", icon: "bookmark", requiresAuth: true },
  {
    key: "attending",
    label: "Attending",
    icon: "checkmark-circle",
    requiresAuth: true,
  },
  { key: "mine", label: "My Events", icon: "create", requiresAuth: true },
];

export default function EventsScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedScope, setSelectedScope] = useState("all");
  const [savingEventId, setSavingEventId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { allEvents, saveEvent, fetchEvents } = useEvents();
  const { user, isAuthenticated, refreshUser } = useAuth();

  // All events are dynamically fetched from the backend
  const events = allEvents;

  // Handle navigation params when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Handle initial scope from navigation params
      if (route?.params?.initialScope) {
        setSelectedScope(route.params.initialScope);
      }
      
      // Handle initial filter from navigation params (from category selection)
      if (route?.params?.selectedFilter) {
        setSelectedFilter(route.params.selectedFilter);
        // Clear the param after setting to avoid sticky state
        navigation.setParams({ selectedFilter: undefined });
      }
    }, [route?.params?.initialScope, route?.params?.selectedFilter, navigation])
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setSelectedScope("all");
    }
  }, [isAuthenticated]);

  const userId = useMemo(() => user?.id, [user?.id]);

  const savedEventIds = useMemo(() => {
    const ids = user?.savedEvents || [];
    // Convert all IDs to strings for comparison
    const idSet = new Set(Array.isArray(ids) ? ids.map(id => String(id)) : []);
    return idSet;
  }, [user?.savedEvents]);

  const attendingEventIds = useMemo(() => {
    const ids = user?.eventsAttending || [];
    // Convert all IDs to strings for comparison
    return new Set(Array.isArray(ids) ? ids.map(id => String(id)) : []);
  }, [user?.eventsAttending]);

  const createdEventIds = useMemo(() => {
    const ids = user?.eventsCreated || [];
    // Convert all IDs to strings for comparison
    return new Set(Array.isArray(ids) ? ids.map(id => String(id)) : []);
  }, [user?.eventsCreated]);

  const matchesScope = (event) => {
    const eventId = String(event.id); // Convert to string for comparison

    switch (selectedScope) {
      case "saved":
        return isAuthenticated && eventId && savedEventIds.has(eventId);
      case "attending":
        if (!isAuthenticated || !eventId) return false;
        if (attendingEventIds.has(eventId)) return true;
        if (Array.isArray(event.attendeesList)) {
          return event.attendeesList.some(
            (attendeeId) => String(attendeeId) === String(userId)
          );
        }
        return false;
      case "mine":
        if (!isAuthenticated || !eventId) return false;
        if (createdEventIds.has(eventId)) return true;
        const creatorId =
          typeof event.creator === "object" ? event.creator?.id : event.creator;
        return creatorId ? String(creatorId) === String(userId) : false;
      default:
        return true;
    }
  };

  const scopedEvents = events.filter((event) => matchesScope(event));

  // Filter events based on selected filter and search query
  const filteredEvents = scopedEvents.filter((event) => {
    const matchesFilter =
      selectedFilter === "All" || event.category === selectedFilter;
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchEvents(),
        isAuthenticated ? refreshUser() : Promise.resolve(),
      ]);
    } catch (error) {
      console.error("Failed to refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleScopeChange = (scopeKey, disabled) => {
    if (disabled) {
      Alert.alert(
        "Login Required",
        "Sign in to view your saved and personalized events."
      );
      return;
    }
    setSelectedScope(scopeKey);
  };

  const handleToggleSave = async (eventId) => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "Sign in to save events for later.");
      return;
    }

    if (!eventId) {
      Alert.alert("Unavailable", "This event cannot be saved while offline.");
      return;
    }

    try {
      setSavingEventId(eventId);
      await saveEvent(eventId);
      await refreshUser();
    } catch (error) {
      console.error("Error toggling save state:", error);
    } finally {
      setSavingEventId(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.decorativeCircle} />

        <View style={styles.headerTop}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.titleIconBox}>
              <Ionicons name="compass" size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Discover Events</Text>
              <Text style={styles.headerSubtitle}>
                {filteredEvents.length} events available
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.createEventButton}
            onPress={() => navigation.navigate("CreateEvent")}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, locations..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.scopeContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scopeContent}
        >
          {EVENT_SCOPE_FILTERS.map((scope) => {
            const isDisabled = scope.requiresAuth && !isAuthenticated;
            const isActive = selectedScope === scope.key;

            return (
              <TouchableOpacity
                key={scope.key}
                style={[
                  styles.scopeChip,
                  isActive && styles.scopeChipActive,
                  isDisabled && styles.scopeChipDisabled,
                ]}
                activeOpacity={0.8}
                onPress={() => handleScopeChange(scope.key, isDisabled)}
                disabled={isDisabled}
              >
                <Ionicons
                  name={scope.icon}
                  size={16}
                  color={isActive ? colors.surface : colors.primary}
                />
                <Text
                  style={[
                    styles.scopeLabel,
                    isActive && styles.scopeLabelActive,
                  ]}
                >
                  {scope.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {!isAuthenticated && (
          <Text style={styles.scopeHelperText}>
            Sign in to access saved, attending, and created events.
          </Text>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {["All", "Community", "Music", "Sports", "Education", "Social", "Food"].map(
          (filter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <View style={styles.filterButtonContent}>
                {filter === "All" && (
                  <Ionicons
                    name="apps"
                    size={16}
                    color={
                      selectedFilter === filter
                        ? colors.surface
                        : colors.primary
                    }
                  />
                )}
                {filter === "Community" && (
                  <Ionicons
                    name="people"
                    size={16}
                    color={
                      selectedFilter === filter
                        ? colors.surface
                        : colors.primary
                    }
                  />
                )}
                {filter === "Music" && (
                  <Ionicons
                    name="musical-notes"
                    size={16}
                    color={
                      selectedFilter === filter
                        ? colors.surface
                        : colors.primary
                    }
                  />
                )}
                {filter === "Sports" && (
                  <Ionicons
                    name="football"
                    size={16}
                    color={
                      selectedFilter === filter
                        ? colors.surface
                        : colors.primary
                    }
                  />
                )}
                {filter === "Education" && (
                  <Ionicons
                    name="school"
                    size={16}
                    color={
                      selectedFilter === filter
                        ? colors.surface
                        : colors.primary
                    }
                  />
                )}
                {filter === "Social" && (
                  <Ionicons
                    name="happy"
                    size={16}
                    color={
                      selectedFilter === filter
                        ? colors.surface
                        : colors.primary
                    }
                  />
                )}
                {filter === "Food" && (
                  <Ionicons
                    name="restaurant"
                    size={16}
                    color={
                      selectedFilter === filter
                        ? colors.surface
                        : colors.primary
                    }
                  />
                )}
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </View>
            </TouchableOpacity>
          )
        )}
      </ScrollView>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <Text style={styles.sectionTitle}>Upcoming Events</Text>

        {filteredEvents.length === 0 ? (
          <View style={styles.noEventsContainer}>
            <Ionicons
              name="calendar-outline"
              size={64}
              color={colors.textLight}
            />
            <Text style={styles.noEventsText}>No events found</Text>
            <Text style={styles.noEventsSubtext}>
              Try adjusting your filters or search query
            </Text>
          </View>
        ) : (
          filteredEvents.map((event) => {
            const eventId = event.id;
            const eventKey = eventId || event.title;
            const eventEmoji = event.image || event.imageEmoji || "🎉";
            const attendeesCount =
              event.attendees ?? event.attendeesList?.length ?? 0;
            const isSavedEvent = Boolean(eventId && savedEventIds.has(eventId));
            const isAttendingEvent = Boolean(
              eventId &&
                (attendingEventIds.has(eventId) ||
                  (Array.isArray(event.attendeesList) &&
                    event.attendeesList.some(
                      (attendeeId) => String(attendeeId) === String(userId)
                    )))
            );
            const creatorId =
              typeof event.creator === "object"
                ? String(event.creator?.id || event.creator?._id)
                : String(event.creator);
            const isMyEvent = Boolean(
              userId && creatorId && String(userId) === creatorId
            );

            return (
              <TouchableOpacity
                key={eventKey}
                style={styles.eventCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate("EventDetails", { event })}
              >
                <View style={styles.eventImagePlaceholder}>
                  {event.imageUrl ? (
                    <Image
                      source={{ uri: event.imageUrl }}
                      style={styles.eventImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.eventImageEmoji}>{eventEmoji}</Text>
                  )}

                  {/* Capacity Badge - show when event has capacity limit */}
                  {event.capacity && (
                    <View
                      style={[
                        styles.capacityBadge,
                        event.attendees >= event.capacity &&
                          styles.capacityBadgeFull,
                      ]}
                    >
                      <Ionicons
                        name="people"
                        size={10}
                        color={
                          event.attendees >= event.capacity
                            ? colors.surface
                            : colors.primary
                        }
                      />
                      <Text
                        style={[
                          styles.capacityBadgeText,
                          event.attendees >= event.capacity &&
                            styles.capacityBadgeTextFull,
                        ]}
                      >
                        {event.attendees >= event.capacity
                          ? "Full"
                          : `${event.capacity - event.attendees} left`}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.eventHeartButton,
                      isSavedEvent && styles.eventHeartButtonActive,
                    ]}
                    onPress={() => handleToggleSave(eventId)}
                    disabled={savingEventId === eventId}
                  >
                    <Ionicons
                      name={isSavedEvent ? "heart" : "heart-outline"}
                      size={22}
                      color={isSavedEvent ? colors.secondary : colors.surface}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <View style={styles.eventCategoryBadge}>
                      <Ionicons
                        name="pricetag"
                        size={12}
                        color={colors.primary}
                      />
                      <Text style={styles.eventCategoryText}>
                        {event.category}
                      </Text>
                    </View>
                    <View style={styles.eventHeaderRight}>
                      {isMyEvent && (
                        <View style={styles.userCreatedBadge}>
                          <Ionicons
                            name="checkmark-circle"
                            size={12}
                            color={colors.success || "#4CAF50"}
                          />
                          <Text style={styles.userCreatedText}>Your Event</Text>
                        </View>
                      )}
                      {isAttendingEvent && (
                        <View style={styles.attendingBadge}>
                          <Ionicons
                            name="ticket"
                            size={12}
                            color={colors.primary}
                          />
                          <Text style={styles.attendingText}>Attending</Text>
                        </View>
                      )}
                      <View style={styles.attendeesContainer}>
                        <Ionicons
                          name="people"
                          size={14}
                          color={colors.secondary}
                        />
                        <Text style={styles.attendeesText}>
                          {attendeesCount}+
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {event.title}
                  </Text>

                  <Text style={styles.eventDescription} numberOfLines={2}>
                    {event.description || "No description provided."}
                  </Text>

                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetailRow}>
                      <View style={styles.eventDetailIcon}>
                        <Ionicons
                          name="calendar"
                          size={14}
                          color={colors.primary}
                        />
                      </View>
                      <Text style={styles.eventDetailText}>
                        {event.date || "Date TBA"}
                      </Text>
                    </View>
                    <View style={styles.eventDetailRow}>
                      <View style={styles.eventDetailIcon}>
                        <Ionicons
                          name="time"
                          size={14}
                          color={colors.primary}
                        />
                      </View>
                      <Text style={styles.eventDetailText}>
                        {event.time || "Time TBA"}
                      </Text>
                    </View>
                    <View style={styles.eventDetailRow}>
                      <View style={styles.eventDetailIcon}>
                        <Ionicons
                          name="location"
                          size={14}
                          color={colors.primary}
                        />
                      </View>
                      <Text style={styles.eventDetailText} numberOfLines={1}>
                        {event.location || "Location TBA"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.eventFooter}>
                    <TouchableOpacity
                      style={styles.viewDetailsButton}
                      onPress={() =>
                        navigation.navigate("EventDetails", { event })
                      }
                    >
                      <Text style={styles.viewDetailsText}>View Details</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={16}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + spacing.md
        : spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
    ...shadows.lg,
    position: "relative",
    overflow: "hidden",
  },
  decorativeCircle: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight + "20",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  titleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight + "30",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  createEventButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  scopeContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  scopeContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  scopeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs / 2,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scopeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  scopeChipDisabled: {
    opacity: 0.6,
  },
  scopeLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  scopeLabelActive: {
    color: colors.surface,
    fontWeight: typography.fontWeight.bold,
  },
  scopeHelperText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    paddingLeft: spacing.sm,
  },
  filterContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    maxHeight: 70,
  },
  filterContent: {
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.sm,
  },
  filterButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs / 2,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.md,
  },
  filterText: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  filterTextActive: {
    color: colors.surface,
    fontWeight: typography.fontWeight.bold,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  eventCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    marginBottom: spacing.lg,
    overflow: "hidden",
    ...shadows.lg,
  },
  eventImagePlaceholder: {
    height: 160,
    backgroundColor: colors.primaryLight + "30",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  eventImageEmoji: {
    fontSize: 70,
  },
  capacityBadge: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.primary + "90",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  capacityBadgeFull: {
    backgroundColor: colors.error + "E0",
  },
  capacityBadgeText: {
    color: colors.surface,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  capacityBadgeTextFull: {
    color: colors.surface,
  },
  eventHeartButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  eventHeartButtonActive: {
    backgroundColor: colors.primary,
    ...shadows.lg,
  },
  eventContent: {
    padding: spacing.lg,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  eventCategoryBadge: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  eventCategoryText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  eventHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  attendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.secondary + "20",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  attendingText: {
    fontSize: typography.fontSize.xs,
    color: colors.secondary,
    fontWeight: typography.fontWeight.bold,
  },
  userCreatedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#4CAF50" + "15",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  userCreatedText: {
    fontSize: typography.fontSize.xs,
    color: "#4CAF50",
    fontWeight: typography.fontWeight.bold,
  },
  attendeesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.secondary + "15",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  attendeesText: {
    fontSize: typography.fontSize.xs,
    color: colors.secondary,
    fontWeight: typography.fontWeight.bold,
  },
  eventTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: typography.fontSize.xl * 1.3,
  },
  eventDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  eventDetails: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  eventDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  eventDetailIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  eventDetailText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    flex: 1,
    fontWeight: typography.fontWeight.medium,
  },
  eventFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  viewDetailsText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  noEventsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl * 3,
  },
  noEventsText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.lg,
  },
  noEventsSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  bottomSpacing: {
    height: spacing.xxl * 2,
  },
});
