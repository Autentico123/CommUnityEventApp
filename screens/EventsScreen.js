import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

export default function EventsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample events data
  const sampleEvents = [
    {
      id: 1,
      title: "Community Cleanup Day",
      date: "October 12, 2025",
      time: "10:00 AM",
      location: "Central Park",
      category: "Community",
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
      description:
        "An evening of live music featuring local bands and artists. Food and drinks available!",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {["All", "Community", "Music", "Sports", "Education"].map(
          (filter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterButton,
                index === 0 && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  index === 0 && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>

      {/* Events List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sampleEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => navigation.navigate("EventDetails", { event })}
          >
            <View style={styles.eventHeader}>
              <View style={styles.eventCategoryBadge}>
                <Text style={styles.eventCategoryText}>{event.category}</Text>
              </View>
              <Text style={styles.eventTime}>{event.time}</Text>
            </View>

            <Text style={styles.eventTitle}>{event.title}</Text>

            <View style={styles.eventDetails}>
              <View style={styles.eventDetailRow}>
                <Text style={styles.eventDetailIcon}>📅</Text>
                <Text style={styles.eventDetailText}>{event.date}</Text>
              </View>
              <View style={styles.eventDetailRow}>
                <Text style={styles.eventDetailIcon}>📍</Text>
                <Text style={styles.eventDetailText}>{event.location}</Text>
              </View>
            </View>

            <View style={styles.eventActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("EventDetails", { event })}
              >
                <Text style={styles.actionButtonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.iconButtonText}>❤️</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {/* Create Event Button */}
        <TouchableOpacity
          style={styles.createEventButton}
          onPress={() => navigation.navigate("CreateEvent")}
        >
          <Text style={styles.createEventIcon}>✍️</Text>
          <Text style={styles.createEventText}>Create New Event</Text>
        </TouchableOpacity>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchIcon: {
    fontSize: 18,
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
    maxHeight: 60,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  filterTextActive: {
    color: colors.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  eventCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  eventCategoryBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  eventCategoryText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
  },
  eventTime: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  eventTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  eventDetails: {
    marginBottom: spacing.md,
  },
  eventDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  eventDetailIcon: {
    fontSize: 14,
    marginRight: spacing.sm,
  },
  eventDetailText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  eventActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  actionButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  iconButton: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonText: {
    fontSize: 18,
  },
  createEventButton: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  createEventIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  createEventText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
});
