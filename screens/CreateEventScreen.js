import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useEvents } from "../context/EventContext";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

export default function CreateEventScreen({ navigation }) {
  const { addEvent } = useEvents();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Community");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const categories = [
    "Community",
    "Music",
    "Sports",
    "Education",
    "Social",
    "Other",
  ];

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permission Denied",
          text2: "Location permission is required to use GPS",
          position: "top",
          visibilityTime: 3000,
        });
        setLoadingLocation(false);
        return;
      }

      // Get current position
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Reverse geocode to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];

        // Format Philippine address with Purok, Barangay, Municipality
        let formattedAddress = "";

        if (address.street) {
          formattedAddress += address.street + ", ";
        }
        if (address.subregion || address.district) {
          // Barangay level
          formattedAddress += (address.subregion || address.district) + ", ";
        }
        if (address.city) {
          // Municipality/City
          formattedAddress += address.city + ", ";
        }
        if (address.region) {
          // Province
          formattedAddress += address.region + ", ";
        }
        if (address.country) {
          formattedAddress += address.country;
        }

        setLocation(formattedAddress || address.name || "Location detected");

        Toast.show({
          type: "success",
          text1: "📍 Location Detected",
          text2: "Your current location has been added",
          position: "top",
          visibilityTime: 2500,
        });
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Toast.show({
        type: "error",
        text1: "Location Error",
        text2: "Could not retrieve your current location",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleCreateEvent = () => {
    if (!title.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Title",
        text2: "Please enter an event title",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    if (!location.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Location",
        text2: "Please enter a location",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    const newEvent = {
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      category,
      date: formatDate(date),
      time: formatTime(time),
      dateTime: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
      ),
      createdAt: new Date().toISOString(),
    };

    // Add event to context
    const createdEvent = addEvent(newEvent);

    // Reset form
    setTitle("");
    setDescription("");
    setLocation("");
    setCategory("Community");
    setDate(new Date());
    setTime(new Date());

    // Show custom success toast
    Toast.show({
      type: "success",
      text1: "🎉 Event Created Successfully!",
      text2: `"${newEvent.title}" has been added to your events`,
      position: "top",
      visibilityTime: 4000,
      topOffset: 60,
    });

    // Navigate to Events tab after a short delay
    setTimeout(() => {
      navigation.navigate("Events");
    }, 500);
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
        <Text style={styles.headerTitle}>Create Event</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event title"
            placeholderTextColor={colors.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Category Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryPill,
                  category === cat && styles.categoryPillActive,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Date Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date *</Text>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.primary}
              style={styles.dateTimeIcon}
            />
            <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Time Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time *</Text>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons
              name="time-outline"
              size={20}
              color={colors.primary}
              style={styles.dateTimeIcon}
            />
            <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
          </TouchableOpacity>
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
          />
        )}

        {/* Location Input */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Location *</Text>
            <TouchableOpacity
              style={styles.gpsButton}
              onPress={getCurrentLocation}
              disabled={loadingLocation}
            >
              {loadingLocation ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <>
                  <Ionicons name="location" size={16} color={colors.primary} />
                  <Text style={styles.gpsButtonText}>Use GPS</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="e.g. Purok 5, Brgy. San Isidro, Trinidad, Bohol"
            placeholderTextColor={colors.textLight}
            value={location}
            onChangeText={setLocation}
            multiline
            numberOfLines={2}
          />
          <Text style={styles.locationHint}>
            💡 Tip: Use GPS to auto-detect your location or manually enter
            Purok, Barangay, Municipality
          </Text>
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us more about your event..."
            placeholderTextColor={colors.textLight}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateEvent}
          activeOpacity={0.8}
        >
          <View style={styles.createButtonContent}>
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={colors.surface}
            />
            <Text style={styles.createButtonText}>Create Event</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.surface} />
          </View>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  gpsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.primary + "15",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  gpsButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationHint: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: "italic",
    lineHeight: 16,
  },
  textArea: {
    minHeight: 120,
    paddingTop: spacing.md,
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryPill: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
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
  categoryTextActive: {
    color: colors.surface,
  },
  dateTimeButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateTimeIcon: {
    marginRight: spacing.sm,
  },
  dateTimeText: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  createButton: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
    ...shadows.lg,
    elevation: 8,
  },
  createButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  createButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  bottomSpacing: {
    height: spacing.xxl,
  },
});
