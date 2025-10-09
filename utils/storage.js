// AsyncStorage utility for local data management
import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: "@user_profile",
  SAVED_EVENTS: "@saved_events",
  USER_SETTINGS: "@user_settings",
  RECENT_SEARCHES: "@recent_searches",
};

/**
 * Save data to AsyncStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 * @returns {Promise<boolean>} - Success status
 */
export const saveData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error("Error saving data:", error);
    return false;
  }
};

/**
 * Get data from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<any|null>} - Retrieved value or null
 */
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error reading data:", error);
    return null;
  }
};

/**
 * Remove data from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<boolean>} - Success status
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Error removing data:", error);
    return false;
  }
};

/**
 * Clear all data from AsyncStorage
 * @returns {Promise<boolean>} - Success status
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing storage:", error);
    return false;
  }
};

/**
 * Get all keys from AsyncStorage
 * @returns {Promise<string[]>} - Array of storage keys
 */
export const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (error) {
    console.error("Error getting keys:", error);
    return [];
  }
};

// Specific storage functions for common use cases

/**
 * Save user profile
 * @param {Object} profile - User profile data
 */
export const saveUserProfile = async (profile) => {
  return await saveData(STORAGE_KEYS.USER_PROFILE, profile);
};

/**
 * Get user profile
 * @returns {Promise<Object|null>} - User profile or null
 */
export const getUserProfile = async () => {
  return await getData(STORAGE_KEYS.USER_PROFILE);
};

/**
 * Save an event to saved events
 * @param {Object} event - Event to save
 */
export const saveEvent = async (event) => {
  const savedEvents = (await getData(STORAGE_KEYS.SAVED_EVENTS)) || [];
  const updatedEvents = [...savedEvents, event];
  return await saveData(STORAGE_KEYS.SAVED_EVENTS, updatedEvents);
};

/**
 * Get all saved events
 * @returns {Promise<Array>} - Array of saved events
 */
export const getSavedEvents = async () => {
  return (await getData(STORAGE_KEYS.SAVED_EVENTS)) || [];
};

/**
 * Remove a saved event by ID
 * @param {string} eventId - ID of event to remove
 */
export const removeSavedEvent = async (eventId) => {
  const savedEvents = (await getData(STORAGE_KEYS.SAVED_EVENTS)) || [];
  const updatedEvents = savedEvents.filter((event) => event.id !== eventId);
  return await saveData(STORAGE_KEYS.SAVED_EVENTS, updatedEvents);
};

/**
 * Save user settings
 * @param {Object} settings - Settings object
 */
export const saveSettings = async (settings) => {
  return await saveData(STORAGE_KEYS.USER_SETTINGS, settings);
};

/**
 * Get user settings
 * @returns {Promise<Object|null>} - Settings object or null
 */
export const getSettings = async () => {
  return await getData(STORAGE_KEYS.USER_SETTINGS);
};
