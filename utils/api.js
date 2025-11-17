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

  // Update event status
  updateEventStatus: async (eventId, status) => {
    try {
      const token = await getAuthToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/events/${eventId}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error updating event status:", error);
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

// Chat API methods
export const chatAPI = {
  // Get all conversations
  getConversations: async (token) => {
    try {
      const response = await fetch(`${API_URL}/chat/conversations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  },

  // Get messages with a specific user
  getMessages: async (token, userId) => {
    try {
      const response = await fetch(`${API_URL}/chat/messages/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  // Send a message (REST fallback)
  sendMessage: async (token, receiverId, message) => {
    try {
      const response = await fetch(`${API_URL}/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver: receiverId,
          message,
        }),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Delete a message
  deleteMessage: async (token, messageId) => {
    try {
      const response = await fetch(`${API_URL}/chat/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  },

  // Get unread message count
  getUnreadCount: async (token) => {
    try {
      const response = await fetch(`${API_URL}/chat/unread-count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  },

  // Search users to chat with
  searchUsers: async (token, query) => {
    try {
      const response = await fetch(
        `${API_URL}/chat/search-users?query=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return await handleResponse(response);
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },
};

// Group API methods
export const getGroups = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.sort) queryParams.append("sort", filters.sort);

    const url = `${API_URL}/groups${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;
    const response = await fetch(url);
    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }
};

export const getGroup = async (groupId) => {
  try {
    const response = await fetch(`${API_URL}/groups/${groupId}`);
    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("Error fetching group:", error);
    throw error;
  }
};

export const createGroup = async (groupData) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(groupData),
    });
    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};

export const updateGroup = async (groupId, groupData) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/groups/${groupId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(groupData),
    });
    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("Error updating group:", error);
    throw error;
  }
};

export const deleteGroup = async (groupId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/groups/${groupId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await handleResponse(response);
    return true;
  } catch (error) {
    console.error("Error deleting group:", error);
    throw error;
  }
};

export const joinGroup = async (groupId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/groups/${groupId}/join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await handleResponse(response);
    return true;
  } catch (error) {
    console.error("Error joining group:", error);
    throw error;
  }
};

export const leaveGroup = async (groupId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/groups/${groupId}/leave`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await handleResponse(response);
    return true;
  } catch (error) {
    console.error("Error leaving group:", error);
    throw error;
  }
};

export const getGroupPosts = async (groupId) => {
  try {
    const response = await fetch(`${API_URL}/groups/${groupId}/posts`);
    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const createPost = async (groupId, postData) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/groups/${groupId}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });
    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/groups/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await handleResponse(response);
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export const likePost = async (postId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/groups/posts/${postId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

export const getComments = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/groups/posts/${postId}/comments`);
    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const createComment = async (postId, content) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/groups/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/groups/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await handleResponse(response);
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// User API methods
export const userAPI = {
  // Get recommended users
  getRecommendations: async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/users/recommendations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error("Error getting recommendations:", error);
      throw error;
    }
  },

  // Search users
  searchUsers: async (query) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/users/search?query=${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  },
};

// Generic API client for simple requests
const api = {
  get: async (endpoint) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await handleResponse(response);
      return { data };
    } catch (error) {
      console.error(`Error GET ${endpoint}:`, error);
      throw error;
    }
  },

  post: async (endpoint, body) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });
      const data = await handleResponse(response);
      return { data };
    } catch (error) {
      console.error(`Error POST ${endpoint}:`, error);
      throw error;
    }
  },
};

export default api;
