import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useGroups } from "../context/GroupContext";
import { useAuth } from "../context/AuthContext";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

const CATEGORIES = [
  "All",
  "Sports",
  "Technology",
  "Arts & Culture",
  "Education",
  "Business",
  "Health & Wellness",
  "Community Service",
  "Entertainment",
  "Food & Dining",
  "Travel",
  "Other",
];

export default function GroupsScreen() {
  const navigation = useNavigation();
  const { groups, myGroups, fetchGroups, fetchMyGroups, loading } = useGroups();
  const { isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("all"); // 'all' or 'my'
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadGroups();
  }, [selectedCategory, searchQuery]);

  const loadGroups = () => {
    const filters = {
      category: selectedCategory !== "All" ? selectedCategory : undefined,
      search: searchQuery || undefined,
    };
    fetchGroups(filters);
    if (isAuthenticated) {
      fetchMyGroups();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroups();
    setRefreshing(false);
  };

  const displayedGroups = activeTab === "my" ? myGroups : groups;

  const renderGroupCard = ({ item }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => navigation.navigate("GroupDetail", { groupId: item._id })}
      activeOpacity={0.7}
    >
      <View style={styles.cardAccent} />
      <View style={styles.groupHeader}>
        <LinearGradient
          colors={[colors.primary, colors.secondary || "#7B68EE"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.groupAvatar}
        >
          <Text style={styles.groupAvatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </LinearGradient>
        <View style={styles.groupInfo}>
          <View style={styles.groupNameRow}>
            <Text style={styles.groupName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          <View style={styles.categoryPrivacyRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{item.category}</Text>
            </View>
            {item.isPrivate && (
              <View style={styles.privateBadge}>
                <Ionicons name="lock-closed" size={10} color={colors.surface} />
                <Text style={styles.privateBadgeText}>Private</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <Text style={styles.groupDescription} numberOfLines={2}>
        {item.description || "No description available"}
      </Text>

      <View style={styles.groupFooter}>
        <View style={styles.groupStats}>
          <View style={styles.statBadge}>
            <Ionicons name="people" size={16} color={colors.primary} />
            <Text style={styles.statText}>{item.memberCount} members</Text>
          </View>
          <View style={styles.statBadge}>
            <Ionicons name="chatbubbles" size={16} color="#4ECDC4" />
            <Text style={styles.statText}>{item.postCount} posts</Text>
          </View>
        </View>
        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={20} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[colors.primary, colors.primary + "dd"]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Groups</Text>
            <Text style={styles.headerSubtitle}>
              Join communities that inspire you
            </Text>
          </View>
          {isAuthenticated && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate("CreateGroup")}
            >
              <Ionicons name="add-circle" size={32} color={colors.surface} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={displayedGroups}
        renderItem={renderGroupCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryContainer}
            >
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category &&
                        styles.categoryTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {isAuthenticated && (
              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === "all" && styles.tabActive]}
                  onPress={() => setActiveTab("all")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "all" && styles.tabTextActive,
                    ]}
                  >
                    All Groups
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === "my" && styles.tabActive]}
                  onPress={() => setActiveTab("my")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "my" && styles.tabTextActive,
                    ]}
                  >
                    My Groups ({myGroups.length})
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="people-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>
              {activeTab === "my"
                ? "You haven't joined any groups yet"
                : "No groups found"}
            </Text>
            {isAuthenticated && activeTab === "my" && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setActiveTab("all")}
              >
                <Text style={styles.emptyButtonText}>Browse Groups</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + spacing.md
        : spacing.xl + spacing.lg,
    ...shadows.md,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.surface,
    opacity: 0.9,
  },
  createButton: {
    padding: spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border + "20",
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  categoryScroll: {
    maxHeight: 50,
  },
  categoryContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  categoryTextActive: {
    color: colors.surface,
  },
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: borderRadius.md,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.surface,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
  },
  groupCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.border + "15",
    overflow: "hidden",
  },
  cardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  groupAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    ...shadows.sm,
  },
  groupAvatarText: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
  },
  groupInfo: {
    flex: 1,
    justifyContent: "center",
  },
  groupNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  categoryPrivacyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  categoryBadge: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.md,
  },
  categoryBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  groupName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    flex: 1,
  },
  privateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.textSecondary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.md,
  },
  privateBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.surface,
    fontWeight: typography.fontWeight.bold,
  },
  groupDescription: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  groupFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.md,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border + "20",
  },
  groupStats: {
    flexDirection: "row",
    gap: spacing.sm,
    flex: 1,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  statText: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: "center",
  },
  emptyButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  emptyButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
});
