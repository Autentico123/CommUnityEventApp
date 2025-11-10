import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEvents } from "../context/EventContext";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

export default function EventsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const { allEvents } = useEvents();

  const sampleEvents = allEvents;

  // Filter events based on selected filter and search query
  const filteredEvents = sampleEvents.filter((event) => {
    const matchesFilter =
      selectedFilter === "All" || event.category === selectedFilter;
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
          <TouchableOpacity style={styles.filterIconButton}>
            <Ionicons name="options-outline" size={20} color={colors.primary} />
            <View style={styles.filterNotificationDot} />
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {["All", "Community", "Music", "Sports", "Education", "Food"].map(
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
          filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("EventDetails", { event })}
            >
              <View style={styles.eventImagePlaceholder}>
                <Text style={styles.eventImageEmoji}>{event.image}</Text>
                <TouchableOpacity style={styles.eventHeartButton}>
                  <Ionicons
                    name="heart-outline"
                    size={22}
                    color={colors.surface}
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
                    {event.isUserCreated && (
                      <View style={styles.userCreatedBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={12}
                          color={colors.success || "#4CAF50"}
                        />
                        <Text style={styles.userCreatedText}>Your Event</Text>
                      </View>
                    )}
                    <View style={styles.attendeesContainer}>
                      <Ionicons
                        name="people"
                        size={14}
                        color={colors.secondary}
                      />
                      <Text style={styles.attendeesText}>
                        {event.attendees}+
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.eventTitle} numberOfLines={2}>
                  {event.title}
                </Text>

                <Text style={styles.eventDescription} numberOfLines={2}>
                  {event.description}
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
                    <Text style={styles.eventDetailText}>{event.date}</Text>
                  </View>
                  <View style={styles.eventDetailRow}>
                    <View style={styles.eventDetailIcon}>
                      <Ionicons name="time" size={14} color={colors.primary} />
                    </View>
                    <Text style={styles.eventDetailText}>{event.time}</Text>
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
                      {event.location}
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
          ))
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("CreateEvent")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={32} color={colors.surface} />
        </TouchableOpacity>

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
  filterIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight + "20",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filterNotificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.surface,
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
  filterContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    maxHeight: 70,
  },
  filterContent: {
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.sm,
  },
  filterButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.md,
  },
  filterText: {
    fontSize: typography.fontSize.sm,
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
  eventImageEmoji: {
    fontSize: 70,
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
  fab: {
    position: "absolute",
    bottom: spacing.xl + 60,
    right: spacing.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.lg,
    elevation: 10,
  },
  bottomSpacing: {
    height: spacing.xxl * 2,
  },
});
