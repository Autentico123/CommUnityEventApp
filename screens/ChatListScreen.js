import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function ChatListScreen({ navigation }) {
  const { conversations, unreadCount, fetchConversations, searchUsers } =
    useChat();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendedUsers, setRecommendedUsers] = useState([]);

  useEffect(() => {
    loadConversations();
    loadRecommendedUsers();

    // Refresh on screen focus
    const unsubscribe = navigation.addListener("focus", () => {
      loadConversations();
      loadRecommendedUsers();
    });

    return unsubscribe;
  }, [navigation]);

  const loadConversations = async () => {
    setLoading(true);
    await fetchConversations();
    setLoading(false);
  };

  const loadRecommendedUsers = async () => {
    try {
      if (!user) {
        console.log("⚠️ No user available for recommendations");
        return;
      }

      console.log("🔍 Loading recommended users...");
      const response = await api.get("/users/recommendations");
      console.log("✅ Recommendations response:", response);

      if (!response.data || !Array.isArray(response.data)) {
        console.warn("⚠️ Invalid recommendations response format");
        setRecommendedUsers([]);
        return;
      }

      // Filter out users who already have conversations
      const existingUserIds = conversations
        .map((conv) => conv.partner?._id)
        .filter(Boolean);
      const userId = user._id || user.id;
      const filtered = response.data.filter(
        (u) =>
          u && u._id && !existingUserIds.includes(u._id) && u._id !== userId
      );

      console.log(`📋 ${filtered.length} recommended users after filtering`);
      setRecommendedUsers(filtered.slice(0, 5));
    } catch (error) {
      console.error("❌ Error loading recommended users:", error);
      setRecommendedUsers([]);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.trim().length > 0) {
      setIsSearching(true);
      const results = await searchUsers(query);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectUser = (selectedUser) => {
    navigation.navigate("Chat", { user: selectedUser });
    setSearchQuery("");
    setSearchResults([]);
  };

  const formatTime = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diff = now - messageDate;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return messageDate.toLocaleDateString();
  };

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleSelectUser(item.partner)}
    >
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={() =>
          navigation.navigate("UserProfile", { userId: item.partner._id })
        }
      >
        {item.partner.avatar ? (
          <Image source={{ uri: item.partner.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.partner.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>
              {item.unreadCount > 9 ? "9+" : item.unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.userName}>{item.partner.name}</Text>
          <Text style={styles.timestamp}>
            {formatTime(item.lastMessage.createdAt)}
          </Text>
        </View>
        <Text
          style={[
            styles.lastMessage,
            item.unreadCount > 0 && styles.unreadMessage,
          ]}
          numberOfLines={1}
        >
          {item.lastMessage.sender === (user?._id || user?.id) ? "You: " : ""}
          {item.lastMessage.message}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handleSelectUser(item)}
    >
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.searchResultContent}>
        <Text style={styles.userName}>{item.name}</Text>
        {item.bio && (
          <Text style={styles.userBio} numberOfLines={1}>
            {item.bio}
          </Text>
        )}
      </View>
      <Ionicons name="chatbubble-outline" size={20} color={colors.primary} />
    </TouchableOpacity>
  );

  const renderRecommendedUser = ({ item }) => (
    <TouchableOpacity
      style={styles.recommendedUserCard}
      onPress={() => handleSelectUser(item)}
    >
      <View style={styles.recommendedAvatarContainer}>
        {item.avatar ? (
          <Image
            source={{ uri: item.avatar }}
            style={styles.recommendedAvatar}
          />
        ) : (
          <View style={styles.recommendedAvatarPlaceholder}>
            <Text style={styles.recommendedAvatarText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.recommendedUserName} numberOfLines={1}>
        {item.name.split(" ")[0]}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        {unreadCount > 0 && (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {isSearching ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : searchQuery.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color={colors.border} />
              <Text style={styles.emptyText}>No users found</Text>
            </View>
          }
        />
      ) : loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          {/* Recommended Users */}
          {recommendedUsers.length > 0 && (
            <View style={styles.recommendedSection}>
              <Text style={styles.sectionTitle}>People You May Know</Text>
              <FlatList
                horizontal
                data={recommendedUsers}
                renderItem={renderRecommendedUser}
                keyExtractor={(item) => item._id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recommendedList}
              />
            </View>
          )}

          {/* Conversations */}
          <FlatList
            data={conversations}
            renderItem={renderConversationItem}
            keyExtractor={(item) => item.partner._id}
            contentContainerStyle={styles.listContainer}
            refreshing={loading}
            onRefresh={loadConversations}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={64}
                  color={colors.border}
                />
                <Text style={styles.emptyText}>No conversations yet</Text>
                <Text style={styles.emptySubtext}>
                  Start chatting with recommended people above
                </Text>
              </View>
            }
          />
        </>
      )}
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
    backgroundColor: colors.primary,
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + spacing.md
        : spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.surface,
    fontWeight: "700",
  },
  headerBadge: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    marginLeft: spacing.sm,
  },
  headerBadgeText: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    paddingVertical: spacing.md,
    color: colors.text,
  },
  listContainer: {
    flexGrow: 1,
  },
  conversationItem: {
    flexDirection: "row",
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchResultItem: {
    flexDirection: "row",
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: "700",
  },
  unreadBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.round,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  unreadText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.surface,
    fontWeight: "700",
  },
  conversationContent: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: "center",
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs / 2,
  },
  userName: {
    ...typography.body,
    fontWeight: "600",
    color: colors.text,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  lastMessage: {
    ...typography.body,
    color: colors.textSecondary,
  },
  unreadMessage: {
    fontWeight: "600",
    color: colors.text,
  },
  searchResultContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userBio: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  recommendedSection: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    ...typography.h4,
    fontWeight: "600",
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  recommendedList: {
    paddingHorizontal: spacing.lg,
  },
  recommendedUserCard: {
    alignItems: "center",
    marginRight: spacing.md,
    width: 70,
  },
  recommendedAvatarContainer: {
    marginBottom: spacing.xs,
  },
  recommendedAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  recommendedAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  recommendedAvatarText: {
    fontSize: typography.fontSize.lg,
    fontWeight: "700",
    color: colors.primary,
  },
  recommendedUserName: {
    ...typography.caption,
    fontSize: 11,
    color: colors.text,
    textAlign: "center",
    fontWeight: "500",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxl * 2,
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
});
