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
import { useTheme } from "../context/ThemeContext"; // theme colors
import { useEvents } from "../context/EventContext"; // events
import { typography, spacing, borderRadius, shadows } from "../theme";

export default function EventsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const { allEvents } = useEvents();
  const { colors, isDarkMode } = useTheme();

  const filteredEvents = allEvents.filter((event) => {
    const matchesFilter =
      selectedFilter === "All" || event.category === selectedFilter;
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filters = ["All", "Community", "Music", "Sports", "Education", "Food"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? colors.cardDark : colors.surface }]}>
        <View style={styles.decorativeCircle} />

        <View style={styles.headerTop}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.titleIconBox}>
              <Ionicons name="compass" size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Discover Events
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                {filteredEvents.length} events available
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.filterIconButton}>
            <Ionicons name="options-outline" size={20} color={colors.primary} />
            <View style={styles.filterNotificationDot} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? colors.cardDark : colors.background, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
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

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer} contentContainerStyle={styles.filterContent}>
        {filters.map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <View style={styles.filterButtonContent}>
              <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
                {filter}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Events List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredEvents.length === 0 ? (
          <View style={styles.noEventsContainer}>
            <Ionicons name="calendar-outline" size={64} color={colors.textLight} />
            <Text style={styles.noEventsText}>No events found</Text>
            <Text style={styles.noEventsSubtext}>Try adjusting your filters or search query</Text>
          </View>
        ) : (
          filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[styles.eventCard, { backgroundColor: isDarkMode ? colors.cardDark : colors.surface }]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("EventDetails", { event })}
            >
              <View style={styles.eventImagePlaceholder}>
                <Text style={styles.eventImageEmoji}>{event.image}</Text>
                <TouchableOpacity style={styles.eventHeartButton}>
                  <Ionicons name="heart-outline" size={22} color={colors.surface} />
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

                <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
                <Text style={styles.eventDescription} numberOfLines={2}>{event.description}</Text>

                <View style={styles.eventDetails}>
                  <View style={styles.eventDetailRow}>
                    <View style={styles.eventDetailIcon}>
                      <Ionicons name="calendar" size={14} color={colors.primary} />
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
                      <Ionicons name="location" size={14} color={colors.primary} />
                    </View>
                    <Text style={styles.eventDetailText} numberOfLines={1}>{event.location}</Text>
                  </View>
                </View>

                <View style={styles.eventFooter}>
                  <TouchableOpacity style={styles.viewDetailsButton} onPress={() => navigation.navigate("EventDetails", { event })}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Floating Action Button */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.secondary }]}
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
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + spacing.md : spacing.xl,
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
    backgroundColor: "#ddd", // temporary, can use colors.primaryLight + "20"
  },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg },
  headerTitleContainer: { flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 },
  titleIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#eee", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold },
  headerSubtitle: { fontSize: typography.fontSize.xs, marginTop: spacing.xs / 2 },
  filterIconButton: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center", position: "relative" },
  filterNotificationDot: { position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4 },
  searchContainer: { flexDirection: "row", alignItems: "center", borderRadius: borderRadius.xl, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderWidth: 1.5 },
  searchIcon: { marginRight: spacing.sm },
  searchInput: { flex: 1, fontSize: typography.fontSize.base },
  filterContainer: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, maxHeight: 70 },
  filterContent: { gap: spacing.sm },
  filterButton: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.round, flexDirection: "row", alignItems: "center", gap: spacing.xs },
  filterButtonActive: { backgroundColor: "#007bff", borderColor: "#007bff" },
  filterButtonContent: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  filterText: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium },
  filterTextActive: { color: "#fff", fontWeight: typography.fontWeight.bold },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  scrollContent: { paddingBottom: 100 },
  sectionTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, marginBottom: spacing.md },
  eventCard: { borderRadius: borderRadius.xxl, marginBottom: spacing.lg, overflow: "hidden", ...shadows.lg },
  eventImagePlaceholder: { height: 160, justifyContent: "center", alignItems: "center", position: "relative" },
  eventImageEmoji: { fontSize: 70 },
  eventHeartButton: { position: "absolute", top: spacing.md, right: spacing.md, width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  eventContent: { padding: spacing.lg },
  eventHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  eventCategoryBadge: { backgroundColor: "#f0f0f0", paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.round, flexDirection: "row", alignItems: "center", gap: spacing.xs },
  eventCategoryText: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  attendeesContainer: { flexDirection: "row", alignItems: "center", gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs / 2, borderRadius: borderRadius.sm, backgroundColor: "#eee" },
  attendeesText: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  eventTitle: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, marginBottom: spacing.sm },
  eventDescription: { fontSize: typography.fontSize.sm },
  eventDetails: { gap: spacing.sm, marginBottom: spacing.md },
  eventDetailRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  eventDetailIcon: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  eventDetailText: { fontSize: typography.fontSize.sm, flex: 1 },
  eventFooter: { borderTopWidth: 1, paddingTop: spacing.md, marginTop: spacing.xs },
  viewDetailsButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs },
  viewDetailsText: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
  noEventsContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: spacing.xxl * 3 },
  noEventsText: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, marginTop: spacing.lg },
  noEventsSubtext: { fontSize: typography.fontSize.sm, marginTop: spacing.xs, textAlign: "center" },
  fab: { position: "absolute", bottom: spacing.xl + 60, right: spacing.lg, width: 64, height: 64, borderRadius: 32, justifyContent: "center", alignItems: "center" },
  bottomSpacing: { height: spacing.xxl * 2 },
});
