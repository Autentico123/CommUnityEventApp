// Example usage of AsyncStorage utility functions
// Import these functions in your components as needed

import {
  saveUserProfile,
  getUserProfile,
  saveEvent,
  getSavedEvents,
  removeSavedEvent,
  saveSettings,
  getSettings,
} from "./utils/storage";

// Example 1: Save and retrieve user profile
const exampleUserProfile = async () => {
  // Save profile
  const profile = {
    name: "John Doe",
    email: "john@example.com",
    bio: "Event enthusiast",
    avatar: "https://example.com/avatar.jpg",
  };

  await saveUserProfile(profile);

  // Retrieve profile
  const savedProfile = await getUserProfile();
  console.log("User Profile:", savedProfile);
};

// Example 2: Save an event
const exampleSaveEvent = async () => {
  const event = {
    id: "1",
    title: "Community Cleanup",
    date: "2025-10-12",
    time: "10:00 AM",
    location: "Central Park",
    description: "Join us for a community cleanup event!",
    category: "Community",
  };

  await saveEvent(event);
  console.log("Event saved!");
};

// Example 3: Get all saved events
const exampleGetSavedEvents = async () => {
  const events = await getSavedEvents();
  console.log("Saved Events:", events);
  console.log("Total saved events:", events.length);
};

// Example 4: Remove a saved event
const exampleRemoveEvent = async (eventId) => {
  await removeSavedEvent(eventId);
  console.log(`Event ${eventId} removed!`);
};

// Example 5: Save user settings
const exampleSaveSettings = async () => {
  const settings = {
    notifications: true,
    emailUpdates: false,
    theme: "light",
    language: "en",
  };

  await saveSettings(settings);
  console.log("Settings saved!");
};

// Example 6: Get user settings
const exampleGetSettings = async () => {
  const settings = await getSettings();
  console.log("User Settings:", settings);

  // Use with defaults
  const notifications = settings?.notifications ?? true;
  console.log("Notifications enabled:", notifications);
};

// Example 7: Use in a React component
import React, { useState, useEffect } from "react";
import { View, Button } from "react-native";
import { saveUserProfile, getUserProfile } from "./utils/storage";

const ProfileComponent = () => {
  const [profile, setProfile] = useState(null);

  // Load profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const data = await getUserProfile();
    setProfile(data);
  };

  const updateProfile = async () => {
    const newProfile = {
      name: "Jane Smith",
      email: "jane@example.com",
    };
    await saveUserProfile(newProfile);
    loadProfile(); // Reload after saving
  };

  return (
    <View>
      <Button title="Update Profile" onPress={updateProfile} />
    </View>
  );
};

// Example 8: Check if event is already saved
const isEventSaved = async (eventId) => {
  const savedEvents = await getSavedEvents();
  return savedEvents.some((event) => event.id === eventId);
};

// Example 9: Toggle saved event
const toggleSaveEvent = async (event) => {
  const saved = await isEventSaved(event.id);

  if (saved) {
    await removeSavedEvent(event.id);
    console.log("Event removed from saved");
  } else {
    await saveEvent(event);
    console.log("Event added to saved");
  }
};

export {
  exampleUserProfile,
  exampleSaveEvent,
  exampleGetSavedEvents,
  exampleRemoveEvent,
  exampleSaveSettings,
  exampleGetSettings,
  isEventSaved,
  toggleSaveEvent,
};
