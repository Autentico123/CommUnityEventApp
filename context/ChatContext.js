import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import io from "socket.io-client";
import { chatAPI } from "../utils/api";
import { useAuth } from "./AuthContext";
import { API_URL } from "../config/apiConfig";
import Toast from "react-native-toast-message";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const socketRef = useRef(null);

  // Initialize Socket.io connection
  useEffect(() => {
    if (isAuthenticated && user && token) {
      // Extract base URL without /api
      const socketUrl = API_URL.replace("/api", "");

      // Handle both _id and id formats
      const userId = user._id || user.id;

      if (!userId) {
        console.error("❌ Cannot initialize socket: User ID not found");
        return;
      }

      const newSocket = io(socketUrl, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("✅ Connected to Socket.io");
        console.log("👤 Registering user:", userId);
        setIsConnected(true);
        newSocket.emit("register", userId);
      });

      newSocket.on("disconnect", () => {
        console.log("❌ Disconnected from Socket.io");
        setIsConnected(false);
      });

      newSocket.on("newMessage", (message) => {
        console.log("📨 New message received:", message);

        // Add to messages if in current chat
        if (
          currentChatUser &&
          (message.sender._id === currentChatUser._id ||
            message.receiver._id === currentChatUser._id)
        ) {
          setMessages((prev) => [...prev, message]);
        }

        // Update conversations
        fetchConversations();
        fetchUnreadCount();

        // Show toast notification if not in chat with sender
        if (!currentChatUser || message.sender._id !== currentChatUser._id) {
          Toast.show({
            type: "info",
            text1: `New message from ${message.sender.name}`,
            text2: message.message.substring(0, 50),
          });
        }
      });

      newSocket.on("messageSent", (message) => {
        console.log("✅ Message sent confirmation:", message);
        setMessages((prev) => [...prev, message]);
        fetchConversations();
      });

      newSocket.on("messageError", (error) => {
        console.error("❌ Message error:", error);
        Toast.show({
          type: "error",
          text1: "Failed to send message",
          text2: error.error,
        });
      });

      newSocket.on("userTyping", ({ userId }) => {
        if (currentChatUser && userId === currentChatUser._id) {
          setTypingUsers((prev) => new Set(prev).add(userId));
        }
      });

      newSocket.on("userStoppedTyping", ({ userId }) => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user, token]);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!token) return;

    try {
      const response = await chatAPI.getConversations(token);
      if (response.success) {
        setConversations(response.conversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  // Fetch messages with a user
  const fetchMessages = async (userId) => {
    if (!token) return;

    try {
      const response = await chatAPI.getMessages(token, userId);
      if (response.success) {
        setMessages(response.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load messages",
        text2: error.message,
      });
    }
  };

  // Send message via Socket.io
  const sendMessage = (receiverId, message) => {
    console.log("🔍 sendMessage called with:", {
      receiverId,
      message,
      hasUser: !!user,
    });

    if (!user) {
      console.error("❌ User not available:", user);
      Toast.show({
        type: "error",
        text1: "User Error",
        text2: "User information not available. Please login again.",
      });
      return;
    }

    // Handle both _id and id formats
    const senderId = user._id || user.id;

    if (!senderId) {
      console.error("❌ User ID not found in user object:", user);
      Toast.show({
        type: "error",
        text1: "User Error",
        text2: "User ID not found. Please login again.",
      });
      return;
    }

    if (!receiverId) {
      console.error("❌ Receiver ID not provided");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Receiver information is missing.",
      });
      return;
    }

    if (!message || message.trim().length === 0) {
      console.error("❌ Message is empty");
      return;
    }

    if (!socket) {
      console.error("❌ Socket not initialized");
      Toast.show({
        type: "error",
        text1: "Connection Error",
        text2: "Socket connection not available.",
      });
      return;
    }

    if (!isConnected) {
      console.error("❌ Socket not connected");
      Toast.show({
        type: "error",
        text1: "Connection Error",
        text2: "Not connected to server. Please check your internet.",
      });
      return;
    }

    const messageData = {
      sender: senderId,
      receiver: receiverId,
      message: message.trim(),
    };

    console.log("📤 Sending message via Socket.io:", messageData);
    console.log("🔌 Socket connected:", isConnected);

    socket.emit("sendMessage", messageData);
  };

  // Send typing indicator
  const sendTypingIndicator = (receiverId) => {
    if (socket && isConnected && user) {
      const userId = user._id || user.id;
      socket.emit("typing", {
        sender: userId,
        receiver: receiverId,
      });
    }
  };

  // Stop typing indicator
  const stopTypingIndicator = (receiverId) => {
    if (socket && isConnected && user) {
      const userId = user._id || user.id;
      socket.emit("stopTyping", {
        sender: userId,
        receiver: receiverId,
      });
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    if (!token) return;

    try {
      const response = await chatAPI.getUnreadCount(token);
      if (response.success) {
        setUnreadCount(response.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  // Delete message
  const deleteMessage = async (messageId) => {
    if (!token) return;

    try {
      const response = await chatAPI.deleteMessage(token, messageId);
      if (response.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        Toast.show({
          type: "success",
          text1: "Message deleted",
        });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      Toast.show({
        type: "error",
        text1: "Failed to delete message",
        text2: error.message,
      });
    }
  };

  // Search users
  const searchUsers = async (query) => {
    if (!token || !query) return [];

    try {
      const response = await chatAPI.searchUsers(token, query);
      if (response.success) {
        return response.users;
      }
      return [];
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  };

  // Set current chat user
  const setActiveChatUser = (user) => {
    setCurrentChatUser(user);
    if (user && (user._id || user.id)) {
      fetchMessages(user._id || user.id);
    } else {
      setMessages([]);
    }
  };

  // Refresh data
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchConversations();
      fetchUnreadCount();
    }
  }, [isAuthenticated, token]);

  const value = {
    socket,
    conversations,
    messages,
    unreadCount,
    isConnected,
    currentChatUser,
    typingUsers,
    fetchConversations,
    fetchMessages,
    sendMessage,
    sendTypingIndicator,
    stopTypingIndicator,
    fetchUnreadCount,
    deleteMessage,
    searchUsers,
    setActiveChatUser,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
