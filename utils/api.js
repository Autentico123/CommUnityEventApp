// API configuration
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/apiConfig";

// Log API URL for debugging
console.log("🔗 API URL:", API_URL);

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem("authToken");
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Something went wrong");
  }

  return data;
};

// Event API methods
export const eventAPI = {
  // Get all events
  getAllEvents: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters.category) queryParams.append("category", filters.category);
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
      if (filters.order) queryParams.append("order", filters.order);

      const url = `${API_URL}/events${
        queryParams.toString() ? "?" + queryParams.toString() : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  // Get single event by ID
  getEventById: async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  },

  // Create new event
  createEvent: async (eventData) => {
    try {
      const token = await getAuthToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers,
        body: JSON.stringify(eventData),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  // Update event
  updateEvent: async (eventId, eventData) => {
    try {
      const token = await getAuthToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(eventData),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (eventId) => {
    try {
      const token = await getAuthToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: "DELETE",
        headers,
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  // Attend event (toggle)
  attendEvent: async (eventId) => {
    try {
      const token = await getAuthToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/events/${eventId}/attend`, {
        method: "PATCH",
        headers,
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error attending event:", error);
      throw error;
    }
  },

  // Save/unsave event
  saveEvent: async (eventId) => {
    try {
      const token = await getAuthToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/events/${eventId}/save`, {
        method: "POST",
        headers,
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error saving event:", error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_URL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error checking API health:", error);
      throw error;
    }
  },
};

// Authentication API methods
export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (token, userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/updateprofile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Change password
  changePassword: async (token, passwords) => {
    try {
      const response = await fetch(`${API_URL}/auth/changepassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/auth/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },
};

export default eventAPI;
