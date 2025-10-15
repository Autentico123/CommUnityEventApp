import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from "react-native";
import * as Calendar from "expo-calendar";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
// MapView removed - not compatible with Expo Go
// import MapView, { Marker } from "react-native-maps";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

export default function EventDetailsScreen({ route, navigation }) {
  const { event } = route.params;
  const [isSaved, setIsSaved] = useState(false);

  // Default map location (can be enhanced with geocoding)
  const [mapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const handleSaveToCalendar = async () => {
    try {
      // Request calendar permissions
      const { status } = await Calendar.requestCalendarPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Calendar access is needed to save events to your calendar."
        );
        return;
      }

      // Get the default calendar
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      const defaultCalendar =
        calendars.find((cal) => cal.allowsModifications && cal.isPrimary) ||
        calendars.find((cal) => cal.allowsModifications);

      if (!defaultCalendar) {
        Alert.alert("Error", "No calendar available to save the event.");
        return;
      }

      // Parse the event date and time
      const eventDateTime = event.dateTime || new Date();
      const endDateTime = new Date(eventDateTime);
      endDateTime.setHours(endDateTime.getHours() + 2); // Default 2 hour duration

      // Create calendar event
      const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
        title: event.title,
        startDate: eventDateTime,
        endDate: endDateTime,
        location: event.location,
        notes: event.description,
        alarms: [{ relativeOffset: -60 }], // 1 hour before
      });

      if (eventId) {
        Alert.alert("Success!", "Event added to your calendar");
      }
    } catch (error) {
      console.error("Calendar error:", error);
      Alert.alert("Error", "Failed to add event to calendar");
    }
  };

  const handleShare = async () => {
    try {
      const shareMessage = `
Join me at ${event.title}!

When: ${event.date} at ${event.time}
Where: ${event.location}
${event.description ? `\n${event.description}` : ""}

See you there!
      `.trim();

      if (Platform.OS === "web") {
        // Web share API
        if (navigator.share) {
          await navigator.share({
            title: event.title,
            text: shareMessage,
          });
        } else {
          // Fallback: copy to clipboard
          Alert.alert("Share Event", shareMessage, [
            { text: "OK", onPress: () => {} },
          ]);
        }
      } else {
        // Mobile: Use native share
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          // For demo, we'll use Alert as actual file sharing needs a file
          Alert.alert("Share Event", "Choose how to share:", [
            {
              text: "Message",
              onPress: () => Alert.alert("Share via Message", shareMessage),
            },
            {
              text: "Copy Link",
              onPress: () => {
                Alert.alert("Link Copied", "Event link copied to clipboard!");
              },
            },
            { text: "Cancel", style: "cancel" },
          ]);
        }
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleGetDirections = () => {
    const address = encodeURIComponent(event.location);
    const url = Platform.select({
      ios: `maps://app?daddr=${address}`,
      android: `google.navigation:q=${address}`,
      default: `https://www.google.com/maps/search/?api=1&query=${address}`,
    });

    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Unable to open maps");
    });
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      isSaved ? "Removed" : "Saved!",
      isSaved
        ? "Event removed from your saved list"
        : "Event added to your saved list"
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <TouchableOpacity onPress={toggleSave} style={styles.saveButton}>
          <Ionicons
            name={isSaved ? "heart" : "heart-outline"}
            size={28}
            color={colors.surface}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Event Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {event.category || "Event"}
            </Text>
          </View>
        </View>

        {/* Event Title */}
        <Text style={styles.title}>{event.title}</Text>

        {/* Event Info Cards */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={colors.primary}
              style={styles.infoIcon}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{event.date}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons
              name="time-outline"
              size={24}
              color={colors.primary}
              style={styles.infoIcon}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>{event.time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={24}
              color={colors.primary}
              style={styles.infoIcon}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{event.location}</Text>
            </View>
            <TouchableOpacity
              onPress={handleGetDirections}
              style={styles.directionsButton}
            >
              <Text style={styles.directionsText}>Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Map View - Placeholder for Expo Go */}
        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>Location on Map</Text>
          <View style={styles.mapPlaceholder}>
            <Ionicons
              name="location"
              size={48}
              color={colors.primary}
              style={styles.mapIconLarge}
            />
            <Text style={styles.mapPlaceholderText}>{event.location}</Text>
            <Text style={styles.mapNote}>
              Map view available in development build
            </Text>
            <TouchableOpacity
              style={styles.openMapsButton}
              onPress={handleGetDirections}
            >
              <Text style={styles.openMapsButtonText}>Open in Maps</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        {event.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>About This Event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSaveToCalendar}
          >
            <Ionicons
              name="calendar"
              size={20}
              color={colors.surface}
              style={styles.buttonIcon}
            />
            <Text style={styles.primaryButtonText}>Add to Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleShare}
          >
            <Ionicons
              name="share-outline"
              size={20}
              color={colors.surface}
              style={styles.buttonIcon}
            />
            <Text style={styles.secondaryButtonText}>Share Event</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineButton}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={colors.primary}
              style={styles.buttonIcon}
            />
            <Text style={styles.outlineButtonText}>I'm Attending</Text>
          </TouchableOpacity>
        </View>

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primary,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 28,
    color: colors.surface,
    fontWeight: typography.fontWeight.bold,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
  },
  saveButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  badgeContainer: {
    padding: spacing.md,
    paddingBottom: 0,
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    alignSelf: "flex-start",
  },
  categoryBadgeText: {
    color: colors.surface,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    marginRight: spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  directionsButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  directionsText: {
    color: colors.surface,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  mapContainer: {
    margin: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  map: {
    height: 200,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  mapPlaceholder: {
    height: 200,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  mapIconLarge: {
    marginBottom: spacing.sm,
  },
  mapPlaceholderText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  mapNote: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  openMapsButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  openMapsButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  descriptionContainer: {
    padding: spacing.md,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },
  actionsContainer: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  secondaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  outlineButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  secondaryButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  outlineButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});
