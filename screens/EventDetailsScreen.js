import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
  Image,
} from "react-native";
import * as Calendar from "expo-calendar";
import * as Sharing from "expo-sharing";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";
import { useNotifications } from "../context/NotificationContext";
import { useEvents } from "../context/EventContext";
import { useAuth } from "../context/AuthContext";

export default function EventDetailsScreen({ route, navigation }) {
  const { event } = route.params;
  const [isSaved, setIsSaved] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const [reminderId, setReminderId] = useState(null);
  const [isAttending, setIsAttending] = useState(false);
  const [attendingLoading, setAttendingLoading] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);
  const isUpdatingAttendance = useRef(false);
  const { scheduleEventReminder, cancelNotification } = useNotifications();
  const { attendEvent, saveEvent, deleteEvent, updateEventStatus } =
    useEvents();
  const { user, isAuthenticated, refreshUser } = useAuth();

  // Helper function to get status badge color and icon
  const getStatusConfig = (status) => {
    switch (status) {
      case "draft":
        return {
          color: "#FFA500",
          bgColor: "#FFF3E0",
          icon: "document-text",
          label: "Draft",
        };
      case "cancelled":
        return {
          color: colors.error,
          bgColor: "#FFE5E5",
          icon: "close-circle",
          label: "Cancelled",
        };
      case "published":
      default:
        return {
          color: colors.success,
          bgColor: "#E8F5E9",
          icon: "checkmark-circle",
          label: "Published",
        };
    }
  };

  // Safety check - if no event, go back
  React.useEffect(() => {
    if (!event) {
      navigation.goBack();
    }
  }, [event, navigation]);

  // Check if user is already attending this event
  React.useEffect(() => {
    if (user && event && !isUpdatingAttendance.current) {
      const eventId = event.id;
      const attending = Array.isArray(user.eventsAttending)
        ? user.eventsAttending.some((id) => String(id) === String(eventId))
        : false;
      setIsAttending(attending);

      // Check if event is saved
      const saved = Array.isArray(user.savedEvents)
        ? user.savedEvents.some((id) => String(id) === String(eventId))
        : false;
      setIsSaved(saved);
    }
  }, [user, event]);

  const [mapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const handleAttending = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Login Required",
        "Please login to mark attendance for events.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Login",
            onPress: () => navigation.navigate("Profile"),
          },
        ]
      );
      return;
    }

    try {
      setAttendingLoading(true);
      isUpdatingAttendance.current = true;
      const eventId = event.id;

      // Optimistically toggle the UI state
      const newAttendingState = !isAttending;
      setIsAttending(newAttendingState);

      // Make the API call
      await attendEvent(eventId);

      // Refresh user data from server
      await refreshUser();

      // Allow useEffect to run again after a brief delay
      setTimeout(() => {
        isUpdatingAttendance.current = false;
      }, 100);
    } catch (error) {
      console.error("Error toggling attendance:", error);
      Alert.alert("Error", "Failed to update attendance. Please try again.");
      // Revert on error
      setIsAttending(isAttending);
      isUpdatingAttendance.current = false;
    } finally {
      setAttendingLoading(false);
    }
  };

  const handleSaveToCalendar = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Calendar access is needed to save events to your calendar."
        );
        return;
      }

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

      const eventDateTime = event?.dateTime || new Date();
      const endDateTime = new Date(eventDateTime);
      endDateTime.setHours(endDateTime.getHours() + 2);

      const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
        title: event?.title,
        startDate: eventDateTime,
        endDate: endDateTime,
        location: event?.location,
        notes: event?.description,
        alarms: [{ relativeOffset: -60 }],
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
Join me at ${event?.title}!

When: ${event?.date} at ${event?.time}
Where: ${event?.location}
${event?.description ? `\n${event.description}` : ""}

See you there!
      `.trim();

      if (Platform.OS === "web") {
        if (navigator.share) {
          await navigator.share({
            title: event?.title,
            text: shareMessage,
          });
        } else {
          Alert.alert("Share Event", shareMessage, [
            { text: "OK", onPress: () => {} },
          ]);
        }
      } else {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
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

  const handleChangeStatus = async (newStatus) => {
    if (!isAuthenticated || !isEventCreator) {
      Alert.alert("Error", "Only the event creator can change its status");
      return;
    }

    const statusLabels = {
      draft: "Draft",
      published: "Published",
      cancelled: "Cancelled",
    };

    Alert.alert(
      "Change Event Status",
      `Are you sure you want to change this event to ${statusLabels[newStatus]}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              setStatusChanging(true);
              const eventId = event.id;
              await updateEventStatus(eventId, newStatus);

              // Update local event object
              event.status = newStatus;

              Toast.show({
                type: "success",
                text1: "Status Updated",
                text2: `Event status changed to ${statusLabels[newStatus]}`,
                position: "top",
                visibilityTime: 3000,
              });
            } catch (error) {
              console.error("Error changing status:", error);
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to change event status",
                position: "top",
                visibilityTime: 3000,
              });
            } finally {
              setStatusChanging(false);
            }
          },
        },
      ]
    );
  };

  const handleGetDirections = () => {
    const address = encodeURIComponent(event?.location || "");
    const url = Platform.select({
      ios: `maps://app?daddr=${address}`,
      android: `google.navigation:q=${address}`,
      default: `https://www.google.com/maps/search/?api=1&query=${address}`,
    });

    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Unable to open maps");
    });
  };

  const toggleSave = async () => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "Please login to save events.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Login",
          onPress: () => navigation.navigate("Profile"),
        },
      ]);
      return;
    }

    try {
      setSavingLoading(true);
      const eventId = event.id || event._id;
      await saveEvent(eventId);
      await refreshUser();
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error toggling save state:", error);
      Alert.alert("Error", "Failed to save event. Please try again.");
    } finally {
      setSavingLoading(false);
    }
  };

  const handleSetReminder = () => {
    Alert.alert("Set Reminder", "When would you like to be reminded?", [
      {
        text: "30 minutes before",
        onPress: () => scheduleReminder(30),
      },
      {
        text: "1 hour before",
        onPress: () => scheduleReminder(60),
      },
      {
        text: "1 day before",
        onPress: () => scheduleReminder(1440),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const scheduleReminder = async (minutesBefore) => {
    try {
      const notificationId = await scheduleEventReminder(event, minutesBefore);
      setReminderId(notificationId);
      setReminderSet(true);
      Alert.alert(
        "Reminder Set!",
        `You'll be reminded ${
          minutesBefore >= 1440
            ? "1 day"
            : minutesBefore >= 60
            ? "1 hour"
            : "30 minutes"
        } before the event.`
      );
    } catch (error) {
      console.error("Error scheduling reminder:", error);
      Alert.alert("Error", "Failed to set reminder. Please try again.");
    }
  };

  const handleCancelReminder = async () => {
    try {
      if (reminderId) {
        await cancelNotification(reminderId);
      }
      setReminderId(null);
      setReminderSet(false);
      Alert.alert("Reminder Cancelled", "Your reminder has been removed.");
    } catch (error) {
      console.error("Error canceling reminder:", error);
      Alert.alert("Error", "Failed to cancel reminder.");
    }
  };

  const handleDeleteEvent = async () => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const eventId = event?.id || event?._id;
              await deleteEvent(eventId);
              Toast.show({
                type: "success",
                text1: "Event Deleted",
                text2: "Your event has been deleted successfully",
                position: "top",
              });
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting event:", error);
              Alert.alert("Error", "Failed to delete event. Please try again.");
            }
          },
        },
      ]
    );
  };

  // Check if user is the creator of this event
  const isEventCreator = React.useMemo(() => {
    if (!user || !event) return false;
    const userId = String(user.id || user._id);
    const creatorId =
      typeof event.creator === "object" 
        ? String(event.creator?.id || event.creator?._id) 
        : String(event.creator);
    console.log('🔍 Creator check:', { userId, creatorId, isCreator: userId === creatorId });
    return userId === creatorId;
  }, [user, event]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={styles.headerRight}>
          {isEventCreator && (
            <TouchableOpacity
              onPress={handleDeleteEvent}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={24} color={colors.surface} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={toggleSave}
            style={styles.saveButton}
            disabled={savingLoading}
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={28}
              color={savingLoading ? colors.textSecondary : colors.surface}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Image */}
        {event?.imageUrl && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
          </View>
        )}

        <View style={styles.badgeContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {event?.category || "Event"}
            </Text>
          </View>

          {/* Capacity Badge */}
          {event?.capacity && (
            <View
              style={[
                styles.capacityBadge,
                event?.attendees >= event.capacity && styles.capacityBadgeFull,
              ]}
            >
              <Ionicons
                name="people-outline"
                size={14}
                color={
                  event?.attendees >= event.capacity
                    ? colors.surface
                    : colors.primary
                }
              />
              <Text
                style={[
                  styles.capacityBadgeText,
                  event?.attendees >= event.capacity &&
                    styles.capacityBadgeTextFull,
                ]}
              >
                {event?.attendees >= event.capacity
                  ? "Event Full"
                  : `${event.capacity - (event?.attendees || 0)} spots left`}
              </Text>
            </View>
          )}

          {/* Status Badge */}
          {event?.status &&
            (() => {
              const statusConfig = getStatusConfig(event.status);
              return (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusConfig.bgColor },
                  ]}
                >
                  <Ionicons
                    name={statusConfig.icon}
                    size={14}
                    color={statusConfig.color}
                  />
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: statusConfig.color },
                    ]}
                  >
                    {statusConfig.label}
                  </Text>
                </View>
              );
            })()}
        </View>

        <Text style={styles.title}>{event?.title}</Text>

        {/* Your Event Badge - Show for creator's own events */}
        {isEventCreator && (
          <View style={styles.yourEventBadge}>
            <Ionicons name="person-circle" size={16} color={colors.primary} />
            <Text style={styles.yourEventBadgeText}>Your Event</Text>
          </View>
        )}

        {/* Event Creator Info - Only show for other users' events */}
        {event?.creator && !isEventCreator && (
          <TouchableOpacity
              style={styles.creatorCard}
              onPress={() => {
                const creatorId =
                  event.creator._id || event.creator.id || event.creator;
                if (creatorId) {
                  navigation.navigate("UserProfile", { userId: creatorId });
                }
              }}
            >
              <View style={styles.creatorAvatar}>
                {event.creator.avatar ? (
                  <Image
                    source={{ uri: event.creator.avatar }}
                    style={styles.creatorAvatarImage}
                  />
                ) : (
                  <Ionicons name="person" size={20} color={colors.primary} />
                )}
              </View>
              <View style={styles.creatorInfo}>
                <Text style={styles.creatorLabel}>Organized by</Text>
                <Text style={styles.creatorName}>
                  {event.creator.name || "Event Organizer"}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
        )}

        {/* Status Change Controls (for creators only) */}
        {isEventCreator && (
          <View style={styles.statusControlContainer}>
            <Text style={styles.statusControlLabel}>Event Status:</Text>
            <View style={styles.statusButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.statusChangeButton,
                  event?.status === "draft" && styles.statusChangeButtonActive,
                  statusChanging && styles.statusChangeButtonDisabled,
                ]}
                onPress={() => handleChangeStatus("draft")}
                disabled={statusChanging || event?.status === "draft"}
              >
                <Ionicons
                  name="document-text"
                  size={18}
                  color={
                    event?.status === "draft" ? colors.surface : colors.text
                  }
                />
                <Text
                  style={[
                    styles.statusChangeButtonText,
                    event?.status === "draft" &&
                      styles.statusChangeButtonTextActive,
                  ]}
                >
                  Draft
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusChangeButton,
                  event?.status === "published" &&
                    styles.statusChangeButtonActive,
                  statusChanging && styles.statusChangeButtonDisabled,
                ]}
                onPress={() => handleChangeStatus("published")}
                disabled={statusChanging || event?.status === "published"}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={
                    event?.status === "published" ? colors.surface : colors.text
                  }
                />
                <Text
                  style={[
                    styles.statusChangeButtonText,
                    event?.status === "published" &&
                      styles.statusChangeButtonTextActive,
                  ]}
                >
                  Published
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusChangeButton,
                  event?.status === "cancelled" &&
                    styles.statusChangeButtonActive,
                  statusChanging && styles.statusChangeButtonDisabled,
                ]}
                onPress={() => handleChangeStatus("cancelled")}
                disabled={statusChanging || event?.status === "cancelled"}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={
                    event?.status === "cancelled" ? colors.surface : colors.text
                  }
                />
                <Text
                  style={[
                    styles.statusChangeButtonText,
                    event?.status === "cancelled" &&
                      styles.statusChangeButtonTextActive,
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
              <Text style={styles.infoValue}>{event?.date}</Text>
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
              <Text style={styles.infoValue}>{event?.time}</Text>
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
              <Text style={styles.infoValue}>{event?.location}</Text>
            </View>
            <TouchableOpacity
              onPress={handleGetDirections}
              style={styles.directionsButton}
            >
              <Text style={styles.directionsText}>Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {event?.coordinates?.latitude && event?.coordinates?.longitude && (
          <View style={styles.mapContainer}>
            <Text style={styles.sectionTitle}>Location on Map</Text>
            <TouchableOpacity
              style={styles.viewOnMapButton}
              onPress={() =>
                navigation.navigate("Map", {
                  selectedEvent: event,
                  initialRegion: {
                    latitude: event.coordinates.latitude,
                    longitude: event.coordinates.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  },
                })
              }
            >
              <Ionicons
                name="map"
                size={24}
                color={colors.primary}
                style={styles.buttonIcon}
              />
              <Text style={styles.viewOnMapButtonText}>View on Map</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        )}

        {event?.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>About This Event</Text>
            <Text style={styles.description}>{event?.description}</Text>
          </View>
        )}

        {/* Attendees List (for event creators only) */}
        {isEventCreator &&
          event?.attendeesList &&
          event.attendeesList.length > 0 && (
            <View style={styles.attendeesContainer}>
              <View style={styles.attendeesHeader}>
                <Text style={styles.sectionTitle}>Attendees</Text>
                <View style={styles.attendeeCountBadge}>
                  <Ionicons name="people" size={16} color={colors.primary} />
                  <Text style={styles.attendeeCountText}>
                    {event.attendeesList.length}
                    {event?.capacity ? ` / ${event.capacity}` : ""}
                  </Text>
                </View>
              </View>
              <View style={styles.attendeesList}>
                {event.attendeesList.map((attendee, index) => (
                  <TouchableOpacity
                    key={attendee._id || attendee.id || index}
                    style={styles.attendeeItem}
                    onPress={() => {
                      const attendeeId = attendee._id || attendee.id;
                      if (attendeeId) {
                        navigation.navigate("UserProfile", {
                          userId: attendeeId,
                        });
                      }
                    }}
                  >
                    <View style={styles.attendeeAvatar}>
                      {attendee.avatar ? (
                        <Image
                          source={{ uri: attendee.avatar }}
                          style={styles.attendeeAvatarImage}
                        />
                      ) : (
                        <Ionicons
                          name="person"
                          size={20}
                          color={colors.textSecondary}
                        />
                      )}
                    </View>
                    <Text style={styles.attendeeName} numberOfLines={1}>
                      {attendee.name || "Attendee"}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

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

          {/* Only show attending button if user is not the creator */}
          {!isEventCreator && (
            <TouchableOpacity
              style={[
                styles.outlineButton,
                isAttending && styles.attendingButton,
                attendingLoading && styles.buttonDisabled,
                event?.capacity &&
                  event?.attendees >= event.capacity &&
                  !isAttending &&
                  styles.buttonDisabled,
              ]}
              onPress={handleAttending}
              disabled={
                attendingLoading ||
                (event?.capacity &&
                  event?.attendees >= event.capacity &&
                  !isAttending)
              }
            >
              <Ionicons
                name={
                  isAttending
                    ? "checkmark-circle"
                    : event?.capacity && event?.attendees >= event.capacity
                    ? "close-circle-outline"
                    : "checkmark-circle-outline"
                }
                size={20}
                color={
                  event?.capacity &&
                  event?.attendees >= event.capacity &&
                  !isAttending
                    ? colors.textSecondary
                    : isAttending
                    ? colors.surface
                    : colors.primary
                }
                style={styles.buttonIcon}
              />
              <Text
                style={[
                  styles.outlineButtonText,
                  isAttending && styles.attendingButtonText,
                ]}
              >
                {attendingLoading
                  ? "Updating..."
                  : isAttending
                  ? "Remove Attendance"
                  : event?.capacity && event?.attendees >= event.capacity
                  ? "Event Full"
                  : "I'm Attending"}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={
              reminderSet ? styles.reminderSetButton : styles.reminderButton
            }
            onPress={reminderSet ? handleCancelReminder : handleSetReminder}
          >
            <Ionicons
              name={reminderSet ? "notifications" : "notifications-outline"}
              size={20}
              color={reminderSet ? colors.surface : colors.primary}
              style={styles.buttonIcon}
            />
            <Text
              style={
                reminderSet
                  ? styles.reminderSetButtonText
                  : styles.reminderButtonText
              }
            >
              {reminderSet ? "Reminder Set ✓" : "Set Reminder"}
            </Text>
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
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
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: "100%",
    height: 240,
    backgroundColor: colors.surface,
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  badgeContainer: {
    padding: spacing.md,
    paddingBottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  categoryBadgeText: {
    color: colors.surface,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  capacityBadge: {
    backgroundColor: colors.primary + "20",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  capacityBadgeFull: {
    backgroundColor: colors.error,
  },
  capacityBadgeText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  capacityBadgeTextFull: {
    color: colors.surface,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  yourEventBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary + "15",
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    alignSelf: "flex-start",
    gap: spacing.xs,
  },
  yourEventBadgeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
  creatorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  creatorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    overflow: "hidden",
  },
  creatorAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  },
  creatorName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
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
  viewOnMapButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.sm,
  },
  viewOnMapButtonText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
    marginLeft: spacing.sm,
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
  attendeesContainer: {
    margin: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  attendeesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  attendeeCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.primary + "15",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  attendeeCountText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  attendeesList: {
    gap: spacing.xs,
  },
  attendeeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  attendeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
    overflow: "hidden",
  },
  attendeeAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  attendeeName: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
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
  attendingButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  attendingButtonText: {
    color: colors.surface,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  reminderButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  reminderSetButton: {
    backgroundColor: colors.success || colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  reminderButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  reminderSetButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  statusBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: "uppercase",
  },
  statusControlContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  statusControlLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  statusButtonsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statusChangeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  statusChangeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusChangeButtonDisabled: {
    opacity: 0.5,
  },
  statusChangeButtonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  statusChangeButtonTextActive: {
    color: colors.surface,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});
