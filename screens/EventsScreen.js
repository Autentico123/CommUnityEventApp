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
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

export default function EventsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

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
                {sampleEvents.length} events available
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>

        {sampleEvents.map((event) => (
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
                  <Ionicons name="pricetag" size={12} color={colors.primary} />
                  <Text style={styles.eventCategoryText}>{event.category}</Text>
                </View>
                <View style={styles.attendeesContainer}>
                  <Ionicons name="people" size={14} color={colors.secondary} />
                  <Text style={styles.attendeesText}>{event.attendees}+</Text>
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
                  onPress={() => navigation.navigate("EventDetails", { event })}
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
        ))}

        <TouchableOpacity
          style={styles.fab}
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
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.lg,
    elevation: 8,
  },
  bottomSpacing: {
    height: spacing.xxl * 2,
  },
});
