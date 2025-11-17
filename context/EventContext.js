import React, { createContext, useState, useContext, useEffect } from "react";
import { eventAPI } from "../utils/api";
import Toast from "react-native-toast-message";

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from MongoDB on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch all events from the API
  const fetchEvents = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventAPI.getAllEvents(filters);

      if (response.success) {
        // Normalize MongoDB _id to id and remove _id
        const transformedEvents = response.events.map((event) => {
          const { _id, ...rest } = event;
          return {
            ...rest,
            id: _id || event.id,
          };
        });
        setAllEvents(transformedEvents);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message);

      // Show error toast
      Toast.show({
        type: "error",
        text1: "Connection Error",
        text2: "Could not connect to server. Using offline mode.",
        position: "top",
        visibilityTime: 3000,
      });

      // Fallback to local sample events if API fails
      setAllEvents(getSampleEvents());
    } finally {
      setLoading(false);
    }
  };

  // Add new event to MongoDB
  const addEvent = async (event) => {
    try {
      const response = await eventAPI.createEvent(event);

      if (response.success) {
        const { _id, ...rest } = response.event;
        const newEvent = {
          ...rest,
          id: _id || response.event.id,
        };

        // Update local state
        setAllEvents((prevEvents) => [newEvent, ...prevEvents]);

        return newEvent;
      }
    } catch (err) {
      console.error("Error creating event:", err);

      // Show error toast
      Toast.show({
        type: "error",
        text1: "Failed to Create Event",
        text2: err.message || "Could not save event to server",
        position: "top",
        visibilityTime: 3000,
      });

      // Fallback: Add event locally if API fails
      const localEvent = {
        ...event,
        id: Date.now(),
        attendees: 0,
        image: getCategoryEmoji(event.category),
        isUserCreated: true,
      };
      setAllEvents((prevEvents) => [localEvent, ...prevEvents]);
      return localEvent;
    }
  };

  // Update event in MongoDB
  const updateEvent = async (eventId, eventData) => {
    try {
      const response = await eventAPI.updateEvent(eventId, eventData);

      if (response.success) {
        const updatedEvent = {
          ...response.event,
          id: response.event._id,
        };

        // Update local state
        setAllEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId ? updatedEvent : event
          )
        );

        Toast.show({
          type: "success",
          text1: "Event Updated",
          text2: "Event has been updated successfully",
          position: "top",
          visibilityTime: 2000,
        });

        return updatedEvent;
      }
    } catch (err) {
      console.error("Error updating event:", err);

      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: err.message || "Could not update event",
        position: "top",
        visibilityTime: 3000,
      });

      throw err;
    }
  };

  // Delete event from MongoDB
  const deleteEvent = async (eventId) => {
    try {
      const response = await eventAPI.deleteEvent(eventId);

      if (response.success) {
        // Update local state
        setAllEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );

        Toast.show({
          type: "success",
          text1: "Event Deleted",
          text2: "Event has been removed",
          position: "top",
          visibilityTime: 2000,
        });

        return true;
      }
    } catch (err) {
      console.error("Error deleting event:", err);

      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: err.message || "Could not delete event",
        position: "top",
        visibilityTime: 3000,
      });

      throw err;
    }
  };

  // Update event status
  const updateEventStatus = async (eventId, status) => {
    try {
      const response = await eventAPI.updateEventStatus(eventId, status);

      if (response.success) {
        // Update local state
        setAllEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId ? { ...event, status } : event
          )
        );

        return response.event;
      }
    } catch (err) {
      console.error("Error updating event status:", err);
      throw err;
    }
  };

  // Attend event (toggle attendance)
  const attendEvent = async (eventId) => {
    try {
      const response = await eventAPI.attendEvent(eventId);

      if (response.success) {
        const { _id, ...rest } = response.event;
        const updatedEvent = {
          ...rest,
          id: _id || response.event.id,
        };

        // Update local state
        setAllEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId ? updatedEvent : event
          )
        );

        Toast.show({
          type: "success",
          text1: response.attending
            ? "Attendance Confirmed"
            : "Attendance Removed",
          text2: response.attending
            ? "You're registered for this event!"
            : "You've been removed from this event",
          position: "top",
          visibilityTime: 2000,
        });

        return { event: updatedEvent, attending: response.attending };
      }
    } catch (err) {
      console.error("Error attending event:", err);

      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: err.message || "Could not update attendance",
        position: "top",
        visibilityTime: 3000,
      });

      throw err;
    }
  };

  // Save/unsave event (toggle bookmark)
  const saveEvent = async (eventId) => {
    try {
      const response = await eventAPI.saveEvent(eventId);

      if (response.success) {
        const isSaved = response.saved || response.isSaved;

        Toast.show({
          type: "success",
          text1: isSaved ? "Event Saved" : "Event Removed",
          text2: isSaved
            ? "Added to your saved events"
            : "Removed from saved events",
          position: "top",
          visibilityTime: 2000,
        });

        return response;
      }
    } catch (err) {
      console.error("Error saving event:", err);

      Toast.show({
        type: "error",
        text1: "Save Failed",
        text2: err.message || "Could not save event",
        position: "top",
        visibilityTime: 3000,
      });

      throw err;
    }
  };

  // Helper function to get category emoji
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

  // Fallback sample events for offline mode
  const getSampleEvents = () => [];

  return (
    <EventContext.Provider
      value={{
        allEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        updateEventStatus,
        attendEvent,
        saveEvent,
        fetchEvents,
        loading,
        error,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
