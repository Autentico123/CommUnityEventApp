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
  Image,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useEvents } from "../context/EventContext";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

export default function CreateEventScreen({ navigation }) {
  const { addEvent } = useEvents();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [status, setStatus] = useState("published");
  const [category, setCategory] = useState("Community");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [capacity, setCapacity] = useState("");
  const [hasCapacity, setHasCapacity] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 9.9191, // Trinidad, Bohol
    longitude: 124.3715,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [selectedMapLocation, setSelectedMapLocation] = useState(null);

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

      // Save coordinates
      setCoordinates({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
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
        const addressParts = [];

        // Purok/Street level (name, streetNumber, street)
        if (
          address.name &&
          address.name !== address.city &&
          address.name !== address.subregion
        ) {
          addressParts.push(address.name);
        } else if (address.street) {
          if (address.streetNumber) {
            addressParts.push(`${address.streetNumber} ${address.street}`);
          } else {
            addressParts.push(address.street);
          }
        }

        // Barangay level (sublocality, district, or subregion)
        const barangay =
          address.sublocality || address.district || address.subregion;
        if (barangay && barangay !== address.city) {
          // Ensure it starts with "Brgy." or "Barangay" prefix
          if (
            !barangay.toLowerCase().includes("brgy") &&
            !barangay.toLowerCase().includes("barangay")
          ) {
            addressParts.push(`Brgy. ${barangay}`);
          } else {
            addressParts.push(barangay);
          }
        }

        // Municipality/City
        if (address.city) {
          addressParts.push(address.city);
        }

        // Province
        if (address.region && address.region !== address.city) {
          addressParts.push(address.region);
        }

        formattedAddress = addressParts.join(", ");
        setLocation(formattedAddress || "Location detected");

        Toast.show({
          type: "success",
          text1: "📍 Location Detected",
          text2: "Coordinates saved for map view",
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

  const openMapPicker = async () => {
    try {
      // Get current location to center the map
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setMapRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setSelectedMapLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      }
    } catch (error) {
      console.error("Error getting location for map:", error);
    }
    setShowMapPicker(true);
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedMapLocation({ latitude, longitude });
  };

  const confirmMapLocation = async () => {
    if (!selectedMapLocation) {
      Toast.show({
        type: "error",
        text1: "No Location Selected",
        text2: "Please tap on the map to select a location",
        position: "top",
      });
      return;
    }

    try {
      setLoadingLocation(true);

      // Save coordinates
      setCoordinates(selectedMapLocation);

      // Reverse geocode to get address
      const reverseGeocode = await Location.reverseGeocodeAsync(
        selectedMapLocation
      );

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];

        // Format Philippine address with Purok, Barangay, Municipality
        const addressParts = [];

        // Purok/Street level (name, streetNumber, street)
        if (
          address.name &&
          address.name !== address.city &&
          address.name !== address.subregion
        ) {
          addressParts.push(address.name);
        } else if (address.street) {
          if (address.streetNumber) {
            addressParts.push(`${address.streetNumber} ${address.street}`);
          } else {
            addressParts.push(address.street);
          }
        }

        // Barangay level (sublocality, district, or subregion)
        const barangay =
          address.sublocality || address.district || address.subregion;
        if (barangay && barangay !== address.city) {
          // Ensure it starts with "Brgy." or "Barangay" prefix
          if (
            !barangay.toLowerCase().includes("brgy") &&
            !barangay.toLowerCase().includes("barangay")
          ) {
            addressParts.push(`Brgy. ${barangay}`);
          } else {
            addressParts.push(barangay);
          }
        }

        // Municipality/City
        if (address.city) {
          addressParts.push(address.city);
        }

        // Province
        if (address.region && address.region !== address.city) {
          addressParts.push(address.region);
        }

        const formattedAddress = addressParts.join(", ");
        setLocation(formattedAddress || "Selected location");
      } else {
        setLocation(
          `${selectedMapLocation.latitude.toFixed(
            4
          )}, ${selectedMapLocation.longitude.toFixed(4)}`
        );
      }

      setShowMapPicker(false);
      Toast.show({
        type: "success",
        text1: "📍 Location Selected",
        text2: "Location saved from map",
        position: "top",
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error("Error processing map location:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to process selected location",
        position: "top",
      });
    } finally {
      setLoadingLocation(false);
    }
  };

  const pickImage = async () => {
    Alert.alert("Add Event Image", "Choose image source", [
      {
        text: "Camera",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Toast.show({
              type: "error",
              text1: "Permission Denied",
              text2: "Camera permission is required",
              position: "top",
            });
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.7,
          });

          if (!result.canceled && result.assets[0]) {
            await uploadImageToBackend(result.assets[0].uri);
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          try {
            console.log("Gallery button pressed");
            
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            console.log("Gallery permission status:", status);
            
            if (status !== "granted") {
              Toast.show({
                type: "error",
                text1: "Permission Denied",
                text2: "Gallery permission is required",
                position: "top",
              });
              return;
            }

            console.log("Opening gallery...");
            
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: 'images',
              allowsEditing: true,
              aspect: [16, 9],
              quality: 0.7,
            });

            console.log("Gallery result:", result);

            if (!result.canceled && result.assets[0]) {
              console.log("Image selected, uploading...");
              await uploadImageToBackend(result.assets[0].uri);
            } else {
              console.log("Gallery selection canceled");
            }
          } catch (error) {
            console.error("Gallery error:", error);
            Toast.show({
              type: "error",
              text1: "Gallery Error",
              text2: error.message,
              position: "top",
            });
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const uploadImageToBackend = async (uri) => {
    try {
      setLoadingLocation(true);

      // Create form data
      const formData = new FormData();

      // Get file extension from URI
      const uriParts = uri.split('.');
      const fileExtension = uriParts[uriParts.length - 1];
      const fileName = `event-${Date.now()}.${fileExtension}`;

      // For React Native, the file object needs to be structured this way
      const fileToUpload = {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        name: fileName,
        type: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
      };

      // Append the image file
      formData.append('image', fileToUpload);

      // Get auth token from storage
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Toast.show({
          type: "error",
          text1: "Authentication Required",
          text2: "Please log in to upload images",
          position: "top",
        });
        return;
      }

      // Upload to backend
      const { API_URL } = require("../config/apiConfig");
      const uploadUrl = `${API_URL}/events/upload-image`;
      console.log("Uploading to:", uploadUrl);
      
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Upload response status:", response.status);
      
      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Upload response data:", data);

      if (data.success) {
        // Store the backend URL
        const fullImageUrl = `${API_URL.replace("/api", "")}${data.imageUrl}`;
        setImageUri(fullImageUrl);

        Toast.show({
          type: "success",
          text1: "✓ Image Uploaded",
          text2: "Photo uploaded successfully",
          position: "top",
          visibilityTime: 2000,
        });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: "Could not upload image. Please try again.",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleCreateEvent = async () => {
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

    if (hasCapacity && (!capacity || parseInt(capacity) < 1)) {
      Toast.show({
        type: "error",
        text1: "Invalid Capacity",
        text2: "Please enter a valid capacity limit",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    try {
      setCreatingEvent(true);

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
        imageUrl: imageUri || null,
        capacity: hasCapacity ? parseInt(capacity) : null,
        coordinates: coordinates || null,
        status: status,
      };

      // Add event to backend and context
      const createdEvent = await addEvent(newEvent);

      if (createdEvent) {
        // Reset form
        setTitle("");
        setDescription("");
        setLocation("");
        setCoordinates(null);
        setStatus("published");
        setCategory("Community");
        setDate(new Date());
        setTime(new Date());
        setImageUri(null);
        setCapacity("");
        setHasCapacity(false);

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
      }
    } catch (error) {
      console.error("Error creating event:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Create Event",
        text2: "Please try again later",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setCreatingEvent(false);
    }
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
          <Text style={styles.label}>Location *</Text>
          <View style={styles.locationButtonsRow}>
            <TouchableOpacity
              style={[
                styles.locationButton,
                { flex: 1, marginRight: spacing.xs },
              ]}
              onPress={openMapPicker}
              disabled={loadingLocation}
            >
              {loadingLocation ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <>
                  <Ionicons name="map" size={16} color={colors.primary} />
                  <Text style={styles.gpsButtonText}>Select on Map</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.locationButton,
                { flex: 1, marginLeft: spacing.xs },
              ]}
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
          />
        </View>

        {/* Image Upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Image (Optional)</Text>
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImageUri(null)}
              >
                <Ionicons name="close-circle" size={24} color={colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={pickImage}
            >
              <Ionicons name="image-outline" size={40} color={colors.primary} />
              <Text style={styles.imageUploadText}>Add Event Photo</Text>
              <Text style={styles.imageUploadSubtext}>
                From camera or gallery
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Capacity Input */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Capacity Limit</Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => {
                setHasCapacity(!hasCapacity);
                if (hasCapacity) setCapacity("");
              }}
            >
              <Ionicons
                name={hasCapacity ? "checkbox" : "square-outline"}
                size={20}
                color={colors.primary}
              />
              <Text style={styles.toggleButtonText}>
                {hasCapacity ? "Limited" : "Unlimited"}
              </Text>
            </TouchableOpacity>
          </View>
          {hasCapacity && (
            <TextInput
              style={styles.input}
              placeholder="Maximum number of attendees"
              placeholderTextColor={colors.textLight}
              value={capacity}
              onChangeText={setCapacity}
              keyboardType="number-pad"
            />
          )}
        </View>

        {/* Status Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Status</Text>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                status === "draft" && styles.statusButtonActive,
              ]}
              onPress={() => setStatus("draft")}
            >
              <Ionicons
                name="document-text-outline"
                size={20}
                color={status === "draft" ? colors.surface : colors.text}
              />
              <Text
                style={[
                  styles.statusButtonText,
                  status === "draft" && styles.statusButtonTextActive,
                ]}
              >
                Draft
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusButton,
                status === "published" && styles.statusButtonActive,
              ]}
              onPress={() => setStatus("published")}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={status === "published" ? colors.surface : colors.text}
              />
              <Text
                style={[
                  styles.statusButtonText,
                  status === "published" && styles.statusButtonTextActive,
                ]}
              >
                Publish Now
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.statusHint}>
            {status === "draft"
              ? "Save as draft - only you can see it"
              : "Publish immediately - visible to everyone"}
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
          style={[
            styles.createButton,
            creatingEvent && styles.createButtonDisabled,
          ]}
          onPress={handleCreateEvent}
          activeOpacity={0.8}
          disabled={creatingEvent}
        >
          <View style={styles.createButtonContent}>
            {creatingEvent ? (
              <>
                <ActivityIndicator size="small" color={colors.surface} />
                <Text style={styles.createButtonText}>Creating Event...</Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.surface}
                />
                <Text style={styles.createButtonText}>Create Event</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={colors.surface}
                />
              </>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Map Picker Modal */}
      <Modal
        visible={showMapPicker}
        animationType="slide"
        onRequestClose={() => setShowMapPicker(false)}
      >
        <View style={styles.mapPickerContainer}>
          <View style={styles.mapPickerHeader}>
            <TouchableOpacity
              style={styles.mapCloseButton}
              onPress={() => setShowMapPicker(false)}
            >
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.mapPickerTitle}>Select Event Location</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.mapPickerInstructions}>
            <Ionicons
              name="information-circle"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.mapPickerInstructionsText}>
              Tap anywhere on the map to select location
            </Text>
          </View>

          <MapView
            style={styles.mapPickerMap}
            provider={PROVIDER_GOOGLE}
            region={mapRegion}
            onPress={handleMapPress}
            showsUserLocation
            showsMyLocationButton
          >
            {selectedMapLocation && (
              <Marker
                coordinate={selectedMapLocation}
                title="Event Location"
                pinColor={colors.primary}
              >
                <View style={styles.customMarker}>
                  <Ionicons name="location" size={40} color={colors.error} />
                </View>
              </Marker>
            )}
          </MapView>

          <View style={styles.mapPickerFooter}>
            {selectedMapLocation && (
              <Text style={styles.selectedCoordinates}>
                📍 {selectedMapLocation.latitude.toFixed(4)},{" "}
                {selectedMapLocation.longitude.toFixed(4)}
              </Text>
            )}
            <TouchableOpacity
              style={[
                styles.confirmLocationButton,
                !selectedMapLocation && styles.confirmLocationButtonDisabled,
              ]}
              onPress={confirmMapLocation}
              disabled={!selectedMapLocation || loadingLocation}
            >
              {loadingLocation ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.surface}
                  />
                  <Text style={styles.confirmLocationButtonText}>
                    Confirm Location
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: spacing.sm,
  },
  locationButtonsRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.primary + "15",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.primary + "30",
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
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.primary + "15",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  toggleButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  imagePreviewContainer: {
    position: "relative",
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    backgroundColor: colors.surface,
  },
  removeImageButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.round,
  },
  imageUploadButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  imageUploadText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  imageUploadSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusContainer: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  statusButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  statusButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  statusButtonTextActive: {
    color: colors.surface,
  },
  statusHint: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontStyle: "italic",
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
  createButtonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.6,
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
  // Map Picker Modal Styles
  mapPickerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapPickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    paddingTop: spacing.xl + 20,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  mapCloseButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  mapPickerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  mapPickerInstructions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary + "15",
    padding: spacing.md,
    margin: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary + "30",
  },
  mapPickerInstructionsText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  mapPickerMap: {
    flex: 1,
  },
  customMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  mapPickerFooter: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.md,
  },
  selectedCoordinates: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.sm,
    fontWeight: typography.fontWeight.medium,
  },
  confirmLocationButton: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    ...shadows.md,
  },
  confirmLocationButtonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.5,
  },
  confirmLocationButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
});
