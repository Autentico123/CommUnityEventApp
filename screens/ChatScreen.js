import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

export default function ChatScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { user: chatUser } = route.params;
  const { user } = useAuth();
  const {
    messages,
    setActiveChatUser,
    sendMessage,
    sendTypingIndicator,
    stopTypingIndicator,
    typingUsers,
    isConnected,
  } = useChat();

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    console.log("📱 ChatScreen mounted for:", chatUser.name);
    // Set active chat user
    setActiveChatUser(chatUser);
    setLoading(false);

    // Cleanup
    return () => {
      console.log("📱 ChatScreen unmounted");
      setActiveChatUser(null);
    };
  }, [chatUser]);

  useEffect(() => {
    console.log("💬 Messages updated:", messages.length);
    // Scroll to bottom when new messages arrive
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    const trimmedText = inputText.trim();
    if (trimmedText.length === 0) return;

    console.log("📤 Sending message:", trimmedText);
    console.log("📤 To user:", chatUser._id);
    console.log("📤 Socket connected:", isConnected);

    sendMessage(chatUser._id, trimmedText);
    setInputText("");

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    stopTypingIndicator(chatUser._id);
  };

  const handleInputChange = (text) => {
    setInputText(text);

    // Send typing indicator
    if (text.length > 0) {
      sendTypingIndicator(chatUser._id);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTypingIndicator(chatUser._id);
      }, 2000);
    } else {
      stopTypingIndicator(chatUser._id);
    }
  };

  const formatTime = (date) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateHeader = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const renderMessage = ({ item, index }) => {
    // Handle both _id and id formats for user
    const currentUserId = user?._id || user?.id;
    // Handle both _id and id formats for message sender
    const messageSenderId = item.sender?._id || item.sender?.id || item.sender;

    const isMyMessage = messageSenderId === currentUserId;

    console.log("🎨 Rendering message:", {
      messageSenderId,
      currentUserId,
      isMyMessage,
      senderObj: item.sender,
    });

    const showDateHeader =
      index === 0 ||
      formatDateHeader(item.createdAt) !==
        formatDateHeader(messages[index - 1]?.createdAt);

    return (
      <>
        {showDateHeader && (
          <View style={styles.dateHeaderContainer}>
            <View style={styles.dateHeader}>
              <Text style={styles.dateHeaderText}>
                {formatDateHeader(item.createdAt)}
              </Text>
            </View>
          </View>
        )}
        <View
          style={[
            styles.messageContainer,
            isMyMessage
              ? styles.myMessageContainer
              : styles.theirMessageContainer,
          ]}
        >
          {!isMyMessage && (
            <View style={styles.avatarContainer}>
              {chatUser.avatar ? (
                <Image
                  source={{ uri: chatUser.avatar }}
                  style={styles.messageAvatar}
                />
              ) : (
                <View style={styles.messageAvatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {chatUser.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          )}
          <View
            style={[
              styles.messageBubble,
              isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isMyMessage ? styles.myMessageText : styles.theirMessageText,
              ]}
            >
              {item.message}
            </Text>
            <Text
              style={[
                styles.messageTime,
                isMyMessage ? styles.myMessageTime : styles.theirMessageTime,
              ]}
            >
              {formatTime(item.createdAt)}
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primary + "ee"]}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.surface} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerUserInfo}
          onPress={() =>
            navigation.navigate("UserProfile", { userId: chatUser._id })
          }
        >
          {chatUser.avatar ? (
            <Image
              source={{ uri: chatUser.avatar }}
              style={styles.headerAvatar}
            />
          ) : (
            <View style={styles.headerAvatarPlaceholder}>
              <Text style={styles.headerAvatarText}>
                {chatUser.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerName}>{chatUser.name}</Text>
            {typingUsers.has(chatUser._id) ? (
              <Text style={styles.typingIndicator}>typing...</Text>
            ) : (
              <View style={styles.connectionStatus}>
                <View
                  style={[
                    styles.statusDot,
                    isConnected ? styles.connectedDot : styles.disconnectedDot,
                  ]}
                />
                <Text style={styles.statusText}>
                  {isConnected ? "Connected" : "Connecting..."}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </LinearGradient>

      {/* Messages */}
      <View style={styles.messagesWrapper}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubbles-outline"
              size={64}
              color={colors.border}
            />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start the conversation!</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.messagesContainer}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
        )}
      </View>

      {/* Input */}
      <View
        style={[
          styles.inputContainer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) + 50 }, // 50 for tab bar height
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          value={inputText}
          onChangeText={handleInputChange}
          multiline
          maxLength={1000}
          returnKeyType="send"
          blurOnSubmit={false}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            inputText.trim().length === 0 && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={inputText.trim().length === 0}
        >
          <Ionicons
            name="send"
            size={20}
            color={
              inputText.trim().length === 0
                ? colors.textSecondary
                : colors.surface
            }
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesWrapper: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + spacing.md
        : spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  headerAvatarText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "700",
  },
  headerTextContainer: {
    marginLeft: spacing.md,
  },
  headerName: {
    ...typography.body,
    fontWeight: "600",
    color: colors.surface,
  },
  typingIndicator: {
    ...typography.caption,
    color: colors.surface,
    fontStyle: "italic",
    marginTop: spacing.xs / 2,
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs / 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs / 2,
  },
  connectedDot: {
    backgroundColor: "#4ade80",
  },
  disconnectedDot: {
    backgroundColor: "#fbbf24",
  },
  statusText: {
    ...typography.caption,
    color: colors.surface,
    fontSize: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    ...typography.h4,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  messagesContainer: {
    padding: spacing.md,
  },
  dateHeaderContainer: {
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  dateHeader: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border + "60",
  },
  dateHeaderText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: spacing.xs,
    marginHorizontal: spacing.md,
    maxWidth: "75%",
  },
  myMessageContainer: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    marginLeft: "25%",
  },
  theirMessageContainer: {
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    marginRight: "25%",
  },
  avatarContainer: {
    marginRight: spacing.sm,
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  messageAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary + "40",
  },
  avatarText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
  },
  messageBubble: {
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    maxWidth: "100%",
    minWidth: 60,
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  theirMessageBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border + "40",
  },
  messageText: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 21,
    letterSpacing: 0.2,
  },
  myMessageText: {
    color: colors.surface,
    fontWeight: "500",
  },
  theirMessageText: {
    color: colors.text,
    fontWeight: "400",
  },
  messageTime: {
    ...typography.caption,
    fontSize: 10,
    marginTop: spacing.xs,
    letterSpacing: 0.3,
  },
  myMessageTime: {
    color: colors.surface,
    opacity: 0.8,
    textAlign: "right",
  },
  theirMessageTime: {
    color: colors.textSecondary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border + "60",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 70,
  },
  input: {
    flex: 1,
    ...typography.body,
    fontSize: 15,
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingVertical: Platform.OS === "ios" ? spacing.sm : spacing.xs,
    paddingTop: Platform.OS === "ios" ? spacing.sm : spacing.md,
    maxHeight: 100,
    minHeight: 44,
    marginRight: spacing.sm,
    color: colors.text,
    textAlignVertical: "center",
    borderWidth: 1,
    borderColor: colors.border + "40",
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
});
