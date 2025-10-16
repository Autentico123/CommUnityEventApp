import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

export default function EventsScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Community",
    "Music",
    "Sports",
    "Education",
    "Social",
    "Other",
  ];

  // 🗓 Sample Data — 3 per category
  const EVENTS = [
    // COMMUNITY
    {
      id: "c1",
      title: "Community Clean-Up Drive",
      category: "Community",
      date: "October 18, 2025",
      time: "8:00 AM",
      location: "Barangay Plaza",
    },
    {
      id: "c2",
      title: "Tree Planting Day",
      category: "Community",
      date: "October 25, 2025",
      time: "7:30 AM",
      location: "Riverside Area",
    },
    {
      id: "c3",
      title: "Barangay Meeting",
      category: "Community",
      date: "November 2, 2025",
      time: "3:00 PM",
      location: "Barangay Hall",
    },

    // MUSIC
    {
      id: "m1",
      title: "Battle of the Bands",
      category: "Music",
      date: "October 20, 2025",
      time: "7:00 PM",
      location: "Town Plaza",
    },
    {
      id: "m2",
      title: "Choir Festival",
      category: "Music",
      date: "November 5, 2025",
      time: "6:00 PM",
      location: "Community Center",
    },
    {
      id: "m3",
      title: "Acoustic Night",
      category: "Music",
      date: "November 12, 2025",
      time: "8:00 PM",
      location: "Café Harmony",
    },

    // SPORTS
    {
      id: "s1",
      title: "Basketball Tournament Finals",
      category: "Sports",
      date: "October 28, 2025",
      time: "5:00 PM",
      location: "Community Court",
    },
    {
      id: "s2",
      title: "Fun Run 2025",
      category: "Sports",
      date: "November 10, 2025",
      time: "6:00 AM",
      location: "City Park",
    },
    {
      id: "s3",
      title: "Volleyball Exhibition Match",
      category: "Sports",
      date: "November 18, 2025",
      time: "4:00 PM",
      location: "Sports Gym",
    },

    // EDUCATION
    {
      id: "e1",
      title: "Financial Literacy Workshop",
      category: "Education",
      date: "October 30, 2025",
      time: "9:00 AM",
      location: "City Library",
    },
    {
      id: "e2",
      title: "Coding for Beginners",
      category: "Education",
      date: "November 8, 2025",
      time: "1:00 PM",
      location: "Tech Hub Center",
    },
    {
      id: "e3",
      title: "Leadership Seminar",
      category: "Education",
      date: "November 20, 2025",
      time: "10:00 AM",
      location: "Municipal Hall",
    },

    // SOCIAL
    {
      id: "so1",
      title: "Halloween Social Night",
      category: "Social",
      date: "October 31, 2025",
      time: "6:00 PM",
      location: "Clubhouse",
    },
    {
      id: "so2",
      title: "Community Karaoke Night",
      category: "Social",
      date: "November 15, 2025",
      time: "7:30 PM",
      location: "Covered Court",
    },
    {
      id: "so3",
      title: "Movie Under the Stars",
      category: "Social",
      date: "November 22, 2025",
      time: "8:00 PM",
      location: "Open Field",
    },

    // OTHER
    {
      id: "o1",
      title: "Local Market Day",
      category: "Other",
      date: "October 22, 2025",
      time: "7:00 AM",
      location: "Public Market",
    },
    {
      id: "o2",
      title: "Pet Adoption Drive",
      category: "Other",
      date: "November 6, 2025",
      time: "9:00 AM",
      location: "Animal Shelter",
    },
    {
      id: "o3",
      title: "Art Fair 2025",
      category: "Other",
      date: "November 25, 2025",
      time: "10:00 AM",
      location: "City Art Hall",
    },
  ];

  // Filter logic
  const filteredEvents =
    selectedCategory === "All"
      ? EVENTS
      : EVENTS.filter((event) => event.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
      </View>

      {/* Category Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={{ paddingHorizontal: spacing.md }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryPill,
              selectedCategory === cat && styles.categoryPillActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Events List */}
      <ScrollView style={styles.eventsList}>
        {filteredEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => navigation.navigate("EventDetails", { event })}
          >
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventCategory}>{event.category}</Text>
            <Text style={styles.eventInfo}>
              📅 {event.date}   🕐 {event.time}
            </Text>
            <Text style={styles.eventLocation}>📍 {event.location}</Text>
          </TouchableOpacity>
        ))}

        {filteredEvents.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No events found for this category.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    ...shadows.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
  },
  categoryScroll: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryPill: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  categoryTextActive: { color: colors.surface },
  eventsList: { padding: spacing.md },
  eventCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  eventTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  eventCategory: {
    color: colors.secondary,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs,
  },
  eventInfo: { color: colors.textSecondary, marginBottom: spacing.xs },
  eventLocation: { color: colors.textLight },
  emptyState: { alignItems: "center", paddingVertical: spacing.xl },
  emptyText: { color: colors.textSecondary, fontSize: typography.fontSize.base },
});