import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useEvents } from "../context/EventContext";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

export default function MapViewScreen({ navigation, route }) {
  const { allEvents, fetchEvents, loading } = useEvents();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 9.9191, // Trinidad, Bohol
    longitude: 124.3715,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
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

  useEffect(() => {
    fetchEvents();
    getCurrentLocation();
  }, []);

  // Handle navigation params for selected event
  useEffect(() => {
    if (route?.params?.selectedEvent) {
      setSelectedEvent(route.params.selectedEvent);
    }
    if (route?.params?.initialRegion) {
      setRegion(route.params.initialRegion);
    }
  }, [route?.params]);

  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is needed to show your position on the map"
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const currentPos = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(currentPos);
      setRegion({
        ...currentPos,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleMarkerPress = (event) => {
    setSelectedEvent(event);
  };

  const handleNavigateToDetails = () => {
    if (selectedEvent) {
      navigation.navigate("EventDetails", { event: selectedEvent });
    }
  };

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      Community: "👥",
      Music: "🎵",
      Sports: "⚽",
      Education: "📚",
      Social: "🎉",
      Food: "🍽️",
      Other: "📌",
    };
    return emojiMap[category] || "📌";
  };

  // Filter events with coordinates and by category
  const eventsWithCoordinates = allEvents.filter((event) => {
    const hasCoordinates =
      event?.coordinates?.latitude && event?.coordinates?.longitude;
    const matchesCategory =
      selectedCategory === "All" || event?.category === selectedCategory;
    const isPublished = event?.status === "published" || !event?.status;
    return hasCoordinates && matchesCategory && isPublished;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Event Map</Text>
        <Text style={styles.headerSubtitle}>
          {eventsWithCoordinates.length} events with locations
        </Text>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryPill,
                selectedCategory === category && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category === "All"
                  ? "All"
                  : `${getCategoryEmoji(category)} ${category}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Map */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {/* Event Markers */}
          {eventsWithCoordinates.map((event) => (
            <Marker
              key={event._id || event.id}
              coordinate={{
                latitude: event.coordinates.latitude,
                longitude: event.coordinates.longitude,
              }}
              onPress={() => handleMarkerPress(event)}
              pinColor={
                selectedEvent?._id === event._id
                  ? colors.secondary
                  : colors.primary
              }
            >
              <View style={styles.customMarker}>
                <Text style={styles.markerEmoji}>
                  {event.image || getCategoryEmoji(event.category)}
                </Text>
              </View>
            </Marker>
          ))}

          {/* Current Location Marker */}
          {currentLocation && (
            <Marker
              coordinate={currentLocation}
              title="You are here"
              pinColor={colors.success}
            />
          )}
        </MapView>
      )}

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={getCurrentLocation}
          disabled={loadingLocation}
        >
          {loadingLocation ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Ionicons name="locate" size={24} color={colors.surface} />
          )}
        </TouchableOpacity>
      </View>

      {/* Selected Event Card */}
      {selectedEvent && (
        <View style={styles.eventCard}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedEvent(null)}
          >
            <Ionicons
              name="close-circle"
              size={28}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <View style={styles.eventCardHeader}>
            <Text style={styles.eventCardEmoji}>
              {selectedEvent.image || getCategoryEmoji(selectedEvent.category)}
            </Text>
            <View style={styles.eventCardBadges}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {selectedEvent.category}
                </Text>
              </View>
              {selectedEvent.capacity && (
                <View
                  style={[
                    styles.capacityBadge,
                    (selectedEvent.attendees || 0) >= selectedEvent.capacity &&
                      styles.capacityBadgeFull,
                  ]}
                >
                  <Ionicons
                    name="people-outline"
                    size={12}
                    color={
                      (selectedEvent.attendees || 0) >= selectedEvent.capacity
                        ? colors.surface
                        : colors.primary
                    }
                  />
                  <Text
                    style={[
                      styles.capacityBadgeText,
                      (selectedEvent.attendees || 0) >=
                        selectedEvent.capacity && styles.capacityBadgeTextFull,
                    ]}
                  >
                    {(selectedEvent.attendees || 0) >= selectedEvent.capacity
                      ? "Full"
                      : `${
                          selectedEvent.capacity -
                          (selectedEvent.attendees || 0)
                        } left`}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.eventCardTitle} numberOfLines={2}>
            {selectedEvent.title}
          </Text>

          <View style={styles.eventCardDetails}>
            <View style={styles.eventCardDetailRow}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.eventCardDetailText}>
                {selectedEvent.date}
              </Text>
            </View>
            <View style={styles.eventCardDetailRow}>
              <Ionicons name="time-outline" size={18} color={colors.primary} />
              <Text style={styles.eventCardDetailText}>
                {selectedEvent.time}
              </Text>
            </View>
            <View style={styles.eventCardDetailRow}>
              <Ionicons
                name="location-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.eventCardDetailText} numberOfLines={2}>
                {selectedEvent.location}
              </Text>
            </View>
            <View style={styles.eventCardDetailRow}>
              <Ionicons
                name="people-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.eventCardDetailText}>
                {selectedEvent.attendees || 0} attending
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={handleNavigateToDetails}
          >
            <Text style={styles.viewDetailsButtonText}>View Full Details</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.surface} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xl + 20,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.surface,
    opacity: 0.9,
  },
  categoryFilterContainer: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryScrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  categoryPill: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.surface,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  customMarker: {
    width: 40,
    height: 40,
    backgroundColor: colors.surface,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.primary,
    ...shadows.md,
  },
  markerEmoji: {
    fontSize: 20,
  },
  fabContainer: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.lg,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.lg,
    elevation: 8,
  },
  eventCard: {
    position: "absolute",
    top: "50%",
    left: spacing.lg,
    right: spacing.lg,
    transform: [{ translateY: -150 }], // Adjust this value based on card height
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: "50%",
    ...shadows.xl,
    elevation: 12,
  },
  closeButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 10,
  },
  eventCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  eventCardEmoji: {
    fontSize: 48,
    marginRight: spacing.md,
  },
  eventCardBadges: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  categoryBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  categoryBadgeText: {
    color: colors.surface,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  capacityBadge: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  capacityBadgeFull: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  capacityBadgeText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  capacityBadgeTextFull: {
    color: colors.surface,
  },
  eventCardTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: typography.fontSize.xl * 1.3,
  },
  eventCardDetails: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  eventCardDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  eventCardDetailText: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    flex: 1,
    fontWeight: typography.fontWeight.medium,
  },
  viewDetailsButton: {
    backgroundColor: colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.md,
  },
  viewDetailsButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
  },
});
