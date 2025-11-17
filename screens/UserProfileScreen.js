import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows } from "../theme";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function UserProfileScreen({ route, navigation }) {
  const { userId } = route.params;
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile =
    currentUser?._id === userId || currentUser?.id === userId;

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const handleStartChat = () => {
    if (!user) return;

    navigation.navigate("Messages", {
      screen: "Chat",
      params: {
        user: {
          _id: user._id || user.id,
          id: user._id || user.id,
          name: user.name || "User",
          avatar: user.avatar,
          email: user.email,
        },
      },
    });
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="person-outline"
          size={64}
          color={colors.textSecondary}
        />
        <Text style={styles.errorText}>User not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Profile Header with Gradient */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileHeaderGradient}
        >
          <View
            style={[
              styles.headerTop,
              {
                paddingTop:
                  Platform.OS === "android"
                    ? StatusBar.currentHeight + spacing.md
                    : spacing.xl,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.backButtonCircle}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.surface} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfoContainer}>
            <View style={styles.avatarWrapper}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </Text>
                </View>
              )}
              <View style={styles.onlineBadge} />
            </View>
            <Text style={styles.name}>{user?.name || "User"}</Text>
            <Text style={styles.email}>{user?.email || ""}</Text>
            <View style={styles.memberBadge}>
              <Ionicons name="time-outline" size={14} color={colors.surface} />
              <Text style={styles.memberSince}>Member since {memberSince}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        {!isOwnProfile && user && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={handleStartChat}
            >
              <Ionicons name="chatbubble" size={22} color={colors.surface} />
              <Text style={styles.chatButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bio */}
        {user.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.bioCard}>
              <Text style={styles.bioText}>{user.bio}</Text>
            </View>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statCard}>
            <LinearGradient
              colors={[colors.primary + "15", colors.primary + "05"]}
              style={styles.statGradient}
            >
              <View style={styles.statIconBox}>
                <Ionicons name="calendar" size={28} color={colors.primary} />
              </View>
              <Text style={styles.statNumber}>
                {(user.savedEvents?.length || 0) +
                  (user.eventsAttending?.length || 0)}
              </Text>
              <Text style={styles.statLabel}>Events</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard}>
            <LinearGradient
              colors={["#4ECDC4" + "15", "#4ECDC4" + "05"]}
              style={styles.statGradient}
            >
              <View style={styles.statIconBox}>
                <Ionicons name="people" size={28} color="#4ECDC4" />
              </View>
              <Text style={styles.statNumber}>{user.groups?.length || 0}</Text>
              <Text style={styles.statLabel}>Groups</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Groups */}
        {user.groups && user.groups.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Groups ({user.groups.length})
            </Text>
            {user.groups.map((group) => (
              <TouchableOpacity
                key={group._id}
                style={styles.groupCard}
                onPress={() =>
                  navigation.navigate("GroupDetail", { groupId: group._id })
                }
              >
                <View style={styles.groupAccent} />
                <LinearGradient
                  colors={[colors.primary, colors.secondary || "#7B68EE"]}
                  style={styles.groupIconContainer}
                >
                  <Text style={styles.groupIconText}>
                    {group.name?.charAt(0).toUpperCase() || "G"}
                  </Text>
                </LinearGradient>
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  {group.description && (
                    <Text style={styles.groupDescription} numberOfLines={1}>
                      {group.description}
                    </Text>
                  )}
                  <View style={styles.groupMetaRow}>
                    <View style={styles.groupMetaBadge}>
                      <Ionicons
                        name="people"
                        size={12}
                        color={colors.primary}
                      />
                      <Text style={styles.groupMembers}>
                        {group.memberCount} members
                      </Text>
                    </View>
                    <View style={styles.groupCategoryBadge}>
                      <Text style={styles.groupCategoryText}>
                        {group.category}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.arrowCircle}>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={colors.primary}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Events */}
        {user.eventsAttending && user.eventsAttending.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Attending Events ({user.eventsAttending.length})
            </Text>
            {user.eventsAttending.map((event) => (
              <TouchableOpacity
                key={event._id}
                style={styles.eventCard}
                onPress={() =>
                  navigation.navigate("EventDetails", { eventId: event._id })
                }
              >
                <View style={styles.eventAccent} />
                <View
                  style={[
                    styles.eventIconContainer,
                    { backgroundColor: colors.primary + "15" },
                  ]}
                >
                  <Ionicons name="calendar" size={28} color={colors.primary} />
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventMetaRow}>
                    <Ionicons
                      name="location"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.eventDetails}>{event.location}</Text>
                  </View>
                  <View style={styles.eventMetaRow}>
                    <Ionicons
                      name="time"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.eventDetails}>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{event.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  backButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  backButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileHeaderGradient: {
    paddingBottom: spacing.xxl,
    marginBottom: -spacing.xl,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfoContainer: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: spacing.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.surface,
    ...shadows.lg,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.surface,
    ...shadows.lg,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  onlineBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.surface,
  },
  name: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  email: {
    fontSize: typography.fontSize.md,
    color: colors.surface,
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  memberSince: {
    fontSize: typography.fontSize.sm,
    color: colors.surface,
    fontWeight: typography.fontWeight.medium,
  },
  actionButtonsContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.xl,
    ...shadows.lg,
  },
  chatButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  bioCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  bioText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.md,
  },
  statGradient: {
    padding: spacing.lg,
    alignItems: "center",
  },
  statIconBox: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  statNumber: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    ...shadows.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    overflow: "hidden",
  },
  groupAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
  },
  groupIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    ...shadows.sm,
  },
  groupIconText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  groupDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  groupMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  groupMetaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  groupMembers: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  groupCategoryBadge: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  groupCategoryText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    ...shadows.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    overflow: "hidden",
  },
  eventAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
  },
  eventIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  eventMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  eventDetails: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  categoryBadge: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  categoryText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});
