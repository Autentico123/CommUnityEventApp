import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography, spacing, borderRadius, shadows } from "../theme";
import { useTheme } from "../context/ThemeContext"; // ✅ Add this

export default function EventsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const { colors, isDarkMode } = useTheme(); // ✅ access theme colors

  const sampleEvents = [
    {
      id: 1,
      title: "Community Cleanup Day",
      date: "October 12, 2025",
      time: "10:00 AM",
      location: "Central Park",
      category: "Community",
      attendees: 45,
      image: "🌳",
      description:
        "Join us for a community cleanup event to make our neighborhood cleaner and greener!",
    },
    {
      id: 2,
      title: "Tech Workshop",
      date: "October 15, 2025",
      time: "2:00 PM",
      location: "Innovation Hub",
      category: "Education",
      attendees: 120,
      image: "💻",
      description:
        "Learn about the latest technologies and trends in software development.",
    },
    {
      id: 3,
      title: "Live Music Festival",
      date: "October 20, 2025",
      time: "6:00 PM",
      location: "City Square",
      category: "Music",
      attendees: 300,
      image: "🎵",
      description:
        "An evening of live music featuring local bands and artists. Food and drinks available!",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDarkMode ? colors.cardDark : colors.surface,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Discover Events
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {sampleEvents.length} events available
            </Text>
          </View>
          <TouchableOpacity style={[styles.filterIconButton, { backgroundColor: colors.primary + "30" }]}>
            <Ionicons name="options-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: isDarkMode ? colors.cardDark : colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search events, locations..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {["All", "Community", "Music", "Sports", "Education"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  selectedFilter === filter
                    ? colors.primary
                    : isDarkMode
                    ? colors.cardDark
                    : colors.surface,
                borderColor:
                  selectedFilter === filter ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    selectedFilter === filter ? colors.surface : colors.text,
                },
              ]}
            >
              {filter}
            </Text>
            {selectedFilter === filter && (
              <View style={[styles.filterDot, { backgroundColor: colors.surface }]} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Events List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sampleEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={[
              styles.eventCard,
              { backgroundColor: isDarkMode ? colors.cardDark : colors.surface },
            ]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("EventDetails", { event })}
          >
            <View
              style={[
                styles.eventImagePlaceholder,
                { backgroundColor: colors.primary + "25" },
              ]}
            >
              <Text style={styles.eventImageEmoji}>{event.image}</Text>
              <TouchableOpacity style={styles.eventHeartButton}>
                <Ionicons name="heart-outline" size={20} color={colors.surface} />
              </TouchableOpacity>
            </View>

            <View style={styles.eventContent}>
              <View style={styles.eventHeader}>
                <View
                  style={[
                    styles.eventCategoryBadge,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={[styles.eventCategoryText, { color: colors.surface }]}>
                    {event.category}
                  </Text>
                </View>
                <View style={styles.attendeesContainer}>
                  <Ionicons name="people" size={14} color={colors.primary} />
                  <Text style={[styles.attendeesText, { color: colors.primary }]}>
                    {event.attendees}+
                  </Text>
                </View>
              </View>

              <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={2}>
                {event.title}
              </Text>

              <View style={styles.eventDetails}>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
                    {event.date}
                  </Text>
                </View>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
                    {event.time}
                  </Text>
                </View>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
                    {event.location}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.eventFooter,
                  { borderTopColor: colors.border },
                ]}
              >
                <TouchableOpacity
                  style={styles.viewDetailsButton}
                  onPress={() => navigation.navigate("EventDetails", { event })}
                >
                  <Text style={[styles.viewDetailsText, { color: colors.primary }]}>
                    View Details
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Floating Action Button */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.secondary }]}
          onPress={() => navigation.navigate("CreateEvent")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color={colors.surface} />
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    ...shadows.md,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
  },
  filterIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
  },
  filterContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    maxHeight: 70,
  },
  filterContent: { gap: spacing.sm },
  filterButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  filterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  eventCard: {
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadows.lg,
  },
  eventImagePlaceholder: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  eventImageEmoji: { fontSize: 60 },
  eventHeartButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  eventContent: { padding: spacing.md },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  eventCategoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  eventCategoryText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  attendeesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  attendeesText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  eventTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.md,
    lineHeight: typography.fontSize.lg * 1.3,
  },
  eventDetails: { gap: spacing.sm, marginBottom: spacing.md },
  eventDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  eventDetailText: { fontSize: typography.fontSize.sm, flex: 1 },
  eventFooter: { borderTopWidth: 1, paddingTop: spacing.sm },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  viewDetailsText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.lg,
    elevation: 8,
  },
  bottomSpacing: { height: spacing.xxl * 2 },
});
