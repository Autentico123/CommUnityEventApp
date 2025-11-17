import {
  saveUserProfile,
  getUserProfile,
  saveEvent,
  getSavedEvents,
  removeSavedEvent,
  saveSettings,
  getSettings,
} from "./utils/storage";

const exampleUserProfile = async () => {
  const profile = {
    name: "Vincent",
    email: "vincent@example.com",
    bio: "Event enthusiast",
    avatar: "https://example.com/avatar.jpg",
  };

  await saveUserProfile(profile);

  const savedProfile = await getUserProfile();
  console.log("User Profile:", savedProfile);
};

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

const exampleGetSavedEvents = async () => {
  const events = await getSavedEvents();
  console.log("Saved Events:", events);
  console.log("Total saved events:", events.length);
};

const exampleRemoveEvent = async (eventId) => {
  await removeSavedEvent(eventId);
  console.log(`Event ${eventId} removed!`);
};

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

const exampleGetSettings = async () => {
  const settings = await getSettings();
  console.log("User Settings:", settings);

  const notifications = settings?.notifications ?? true;
  console.log("Notifications enabled:", notifications);
};

import React, { useState, useEffect } from "react";
import { View, Button } from "react-native";
import { saveUserProfile, getUserProfile } from "./utils/storage";

const ProfileComponent = () => {
  const [profile, setProfile] = useState(null);

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
    loadProfile();
  };

  return (
    <View>
      <Button title="Update Profile" onPress={updateProfile} />
    </View>
  );
};

const isEventSaved = async (eventId) => {
  const savedEvents = await getSavedEvents();
  return savedEvents.some((event) => event.id === eventId);
};

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
