import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  RefreshControl,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useGroups } from "../context/GroupContext";
import { useAuth } from "../context/AuthContext";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

export default function GroupDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params;

  const {
    selectedGroup,
    posts,
    fetchGroup,
    fetchPosts,
    joinGroup,
    leaveGroup,
    createPost,
    deletePost,
    likePost,
  } = useGroups();
  const { user, isAuthenticated } = useAuth();

  const [postContent, setPostContent] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadData();
  }, [groupId]);

  const loadData = async () => {
    await fetchGroup(groupId);
    await fetchPosts(groupId);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleJoin = async () => {
    const success = await joinGroup(groupId);
    if (success) {
      await loadData();
    }
  };

  const handleLeave = () => {
    Alert.alert("Leave Group", "Are you sure you want to leave this group?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: async () => {
          const success = await leaveGroup(groupId);
          if (success) {
            await loadData();
          }
        },
      },
    ]);
  };

  const handlePost = async () => {
    if (!postContent.trim()) {
      Alert.alert("Error", "Please enter post content");
      return;
    }

    setPosting(true);
    const newPost = await createPost(groupId, { content: postContent.trim() });
    setPosting(false);

    if (newPost) {
      setPostContent("");
    }
  };

  const handleDeletePost = (postId) => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deletePost(postId),
      },
    ]);
  };

  const isMember = selectedGroup?.members?.some((member) => {
    // Handle both populated member objects and plain IDs
    const memberId =
      typeof member === "string" ? member : member?._id || member?.id;
    const userId = user?._id || user?.id;
    return memberId === userId || String(memberId) === String(userId);
  });

  const isAdmin = selectedGroup?.admins?.some((admin) => {
    // Handle both populated admin objects and plain IDs
    const adminId = typeof admin === "string" ? admin : admin?._id || admin?.id;
    const userId = user?._id || user?.id;
    return adminId === userId || String(adminId) === String(userId);
  });

  const renderPost = ({ item }) => {
    const isAuthor =
      item.author?._id === user?._id || item.author?.id === user?.id;
    const hasLiked = item.likes?.includes(user?._id || user?.id);

    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <LinearGradient
            colors={[colors.primary, colors.secondary || "#7B68EE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.authorAvatar}
          >
            <Text style={styles.authorAvatarText}>
              {item.author?.name?.charAt(0).toUpperCase() || "?"}
            </Text>
          </LinearGradient>
          <View style={styles.postAuthorInfo}>
            <Text style={styles.authorName}>
              {item.author?.name || "Unknown"}
            </Text>
            <Text style={styles.postTime}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          {(isAuthor || isAdmin) && (
            <TouchableOpacity
              onPress={() => handleDeletePost(item._id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.postContent}>{item.content}</Text>

        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => likePost(item._id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={hasLiked ? "heart" : "heart-outline"}
              size={22}
              color={hasLiked ? colors.error : colors.textSecondary}
            />
            <Text
              style={[styles.actionText, hasLiked && styles.actionTextActive]}
            >
              {item.likeCount || 0}
            </Text>
          </TouchableOpacity>

          <View style={styles.actionButton}>
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={styles.actionText}>{item.commentCount || 0}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (!selectedGroup) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[colors.primary, colors.primary + "dd"]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.surface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {selectedGroup.name}
          </Text>
          <Text style={styles.headerSubtitle}>{selectedGroup.category}</Text>
        </View>
        <TouchableOpacity style={styles.headerIconButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.surface} />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.groupInfo}>
          <LinearGradient
            colors={[colors.primary + "20", colors.primary + "05"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.groupCoverGradient}
          >
            <View style={styles.groupAvatarContainer}>
              <LinearGradient
                colors={[colors.primary, colors.secondary || "#7B68EE"]}
                style={styles.groupAvatar}
              >
                <Text style={styles.groupAvatarText}>
                  {selectedGroup.name?.charAt(0).toUpperCase() || "G"}
                </Text>
              </LinearGradient>
            </View>
          </LinearGradient>

          <View style={styles.groupInfoContent}>
            <View style={styles.groupTitleRow}>
              <Text style={styles.groupTitle}>{selectedGroup.name}</Text>
              <View style={styles.privacyBadge}>
                <Ionicons name="lock-closed" size={12} color={colors.primary} />
                <Text style={styles.privacyText}>Private</Text>
              </View>
            </View>

            <Text style={styles.groupDescription}>
              {selectedGroup.description || "No description available"}
            </Text>

            <View style={styles.groupStatsRow}>
              <View style={styles.statCard}>
                <View style={styles.statIconBox}>
                  <Ionicons name="people" size={24} color={colors.primary} />
                </View>
                <Text style={styles.statValue}>
                  {selectedGroup.memberCount}
                </Text>
                <Text style={styles.statLabel}>Members</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconBox}>
                  <Ionicons name="chatbubbles" size={24} color="#4ECDC4" />
                </View>
                <Text style={styles.statValue}>{selectedGroup.postCount}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconBox}>
                  <Ionicons name="calendar" size={24} color="#FF6B9D" />
                </View>
                <Text style={styles.statValue}>
                  {new Date(selectedGroup.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "short", year: "numeric" }
                  )}
                </Text>
                <Text style={styles.statLabel}>Created</Text>
              </View>
            </View>
          </View>

          {isAuthenticated && (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.actionBtn, isMember && styles.actionBtnLeave]}
                onPress={isMember ? handleLeave : handleJoin}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isMember ? "checkmark-circle" : "add-circle"}
                  size={22}
                  color={colors.surface}
                />
                <Text style={styles.actionBtnText}>
                  {isMember ? "Joined" : "Join Group"}
                </Text>
              </TouchableOpacity>

              {isMember && (
                <TouchableOpacity style={styles.actionBtnSecondary}>
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {isMember && (
          <View style={styles.postInput}>
            <TextInput
              style={styles.input}
              placeholder="Share something with the group..."
              value={postContent}
              onChangeText={setPostContent}
              multiline
              maxLength={2000}
              placeholderTextColor={colors.textSecondary}
            />
            <TouchableOpacity
              style={[styles.postButton, posting && styles.postButtonDisabled]}
              onPress={handlePost}
              disabled={posting}
            >
              <Ionicons name="send" size={20} color={colors.surface} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Posts</Text>
          {posts.length === 0 ? (
            <View style={styles.emptyPosts}>
              <Ionicons
                name="chatbubbles-outline"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No posts yet</Text>
              {isMember && (
                <Text style={styles.emptySubtext}>Be the first to post!</Text>
              )}
            </View>
          ) : (
            <FlatList
              data={posts}
              renderItem={renderPost}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + spacing.md
        : spacing.xl + spacing.lg,
    ...shadows.md,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.surface,
    opacity: 0.9,
    marginTop: 2,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
  },
  groupInfo: {
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: -spacing.xl,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.lg,
  },
  groupCoverGradient: {
    height: 120,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  groupAvatarContainer: {
    marginBottom: -40,
  },
  groupAvatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.surface,
    ...shadows.lg,
  },
  groupAvatarText: {
    fontSize: 36,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
  },
  groupInfoContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl + spacing.md,
  },
  groupTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  groupTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    flex: 1,
  },
  privacyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary + "15",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
  },
  privacyText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  groupDescription: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  groupStatsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: "center",
  },
  statIconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  statValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    ...shadows.md,
  },
  actionBtnLeave: {
    backgroundColor: colors.primary,
  },
  actionBtnSecondary: {
    width: 52,
    height: 52,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary + "30",
    ...shadows.sm,
  },
  actionBtnText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  postInput: {
    backgroundColor: colors.surface,
    flexDirection: "row",
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: typography.fontSize.base,
    color: colors.text,
    marginRight: spacing.sm,
  },
  postButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postsSection: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  postCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.border + "15",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    ...shadows.sm,
  },
  authorAvatarText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
  },
  postAuthorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 2,
  },
  postTime: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  postContent: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  postActions: {
    flexDirection: "row",
    gap: spacing.xl,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border + "30",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  actionText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  actionTextActive: {
    color: colors.error,
  },
  emptyPosts: {
    alignItems: "center",
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
