import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Platform,
  StatusBar,
  RefreshControl,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../theme";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function PeopleScreen({ navigation }) {
  const { user } = useAuth();
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  useEffect(() => {
    fetchRecommendations();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchUsers();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/recommendations");
      setRecommendedUsers(response.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      setSearching(true);
      const response = await api.get(`/users/search?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setSearching(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecommendations();
    setRefreshing(false);
  };

  const handleUserPress = (userId) => {
    navigation.navigate("UserProfile", { userId });
  };

  const renderUserCardList = ({ item }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => handleUserPress(item._id)}
      activeOpacity={0.7}
    >
      <View style={styles.userAvatar}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
        ) : (
          <LinearGradient
            colors={[colors.primary, colors.primary + "dd"]}
            style={styles.avatarPlaceholder}
          >
            <Text style={styles.avatarText}>{item.name?.charAt(0) || "?"}</Text>
          </LinearGradient>
        )}
        <View style={styles.onlineBadge} />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        {item.bio && (
          <Text style={styles.userBio} numberOfLines={2}>
            {item.bio}
          </Text>
        )}
        {item.email && (
          <Text style={styles.userEmail} numberOfLines={1}>
            {item.email}
          </Text>
        )}
      </View>
      <TouchableOpacity 
        style={styles.connectButton}
        onPress={(e) => {
          e.stopPropagation();
          navigation.navigate("Chat", { userId: item._id, userName: item.name });
        }}
      >
        <Ionicons name="chatbubble" size={20} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderUserCardGrid = ({ item }) => (
    <TouchableOpacity
      style={styles.gridCard}
      onPress={() => handleUserPress(item._id)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[colors.primary + "15", colors.primary + "05"]}
        style={styles.gridCardInner}
      >
        <View style={styles.gridAvatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.gridAvatar} />
          ) : (
            <LinearGradient
              colors={[colors.primary, colors.primary + "dd"]}
              style={styles.gridAvatarPlaceholder}
            >
              <Text style={styles.gridAvatarText}>
                {item.name?.charAt(0) || "?"}
              </Text>
            </LinearGradient>
          )}
          <View style={styles.gridOnlineBadge} />
        </View>
        <Text style={styles.gridUserName} numberOfLines={1}>
          {item.name}
        </Text>
        {item.bio && (
          <Text style={styles.gridUserBio} numberOfLines={2}>
            {item.bio}
          </Text>
        )}
        <TouchableOpacity 
          style={styles.gridConnectButton}
          onPress={(e) => {
            e.stopPropagation();
            navigation.navigate("Chat", { userId: item._id, userName: item.name });
          }}
        >
          <Ionicons name="chatbubble" size={16} color={colors.surface} />
          <Text style={styles.gridConnectText}>Chat</Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderUserCard = viewMode === "grid" ? renderUserCardGrid : renderUserCardList;

  const displayUsers =
    searchQuery.trim().length >= 2 ? searchResults : recommendedUsers;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primary + "ee"]}
        style={[
          styles.header,
          {
            paddingTop:
              Platform.OS === "android"
                ? StatusBar.currentHeight + spacing.md
                : spacing.xl,
          },
        ]}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.surface} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Discover People</Text>
            <Text style={styles.headerSubtitle}>
              {recommendedUsers.length} people to connect with
            </Text>
          </View>
          <TouchableOpacity
            style={styles.viewToggle}
            onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            <Ionicons
              name={viewMode === "grid" ? "list" : "grid"}
              size={24}
              color={colors.surface}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Finding people for you...</Text>
        </View>
      ) : (
        <>
          {/* Section Title */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery.trim().length >= 2
                ? `Search Results (${searchResults.length})`
                : `Recommended for You`}
            </Text>
          </View>

          {/* Users List */}
          <FlatList
            data={displayUsers}
            keyExtractor={(item) => item._id}
            renderItem={renderUserCard}
            numColumns={viewMode === "grid" ? 2 : 1}
            key={viewMode}
            columnWrapperStyle={viewMode === "grid" ? styles.gridRow : null}
            contentContainerStyle={[
              styles.listContainer,
              viewMode === "grid" && styles.gridContainer,
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <LinearGradient
                  colors={[colors.primary + "15", colors.primary + "05"]}
                  style={styles.emptyIconContainer}
                >
                  <Ionicons
                    name={searchQuery.trim().length >= 2 ? "search" : "people"}
                    size={48}
                    color={colors.primary}
                  />
                </LinearGradient>
                <Text style={styles.emptyText}>
                  {searchQuery.trim().length >= 2
                    ? "No users found"
                    : "No recommendations yet"}
                </Text>
                <Text style={styles.emptySubtext}>
                  {searchQuery.trim().length >= 2
                    ? "Try a different search term"
                    : "Join events and groups to get personalized recommendations"}
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
    marginTop: spacing.xs,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: "700",
    color: colors.surface,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.surface + "dd",
  },
  viewToggle: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  clearButton: {
    padding: spacing.xs,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 0,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: "600",
    color: colors.text,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
    paddingTop: spacing.md,
  },
  gridContainer: {
    paddingHorizontal: spacing.xs,
  },
  gridRow: {
    justifyContent: "space-between",
  },
  // List View Styles
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  userAvatar: {
    marginRight: spacing.md,
    position: "relative",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary + "20",
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: typography.fontSize.xl,
    fontWeight: "700",
    color: colors.surface,
  },
  onlineBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4ECDC4",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.md,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  userBio: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  connectButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary + "15",
    borderRadius: 20,
  },
  // Grid View Styles
  gridCard: {
    width: "48%",
    marginBottom: spacing.xs,
  },
  gridCardInner: {
    padding: spacing.md,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border + "40",
  },
  gridAvatarContainer: {
    position: "relative",
    marginBottom: spacing.sm,
  },
  gridAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: colors.surface,
  },
  gridAvatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  gridAvatarText: {
    fontSize: typography.fontSize.xxl,
    fontWeight: "700",
    color: colors.surface,
  },
  gridOnlineBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4ECDC4",
    borderWidth: 3,
    borderColor: colors.surface,
  },
  gridUserName: {
    fontSize: typography.fontSize.md,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 4,
  },
  gridUserBio: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  gridConnectButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginTop: spacing.xs,
  },
  gridConnectText: {
    fontSize: typography.fontSize.xs,
    fontWeight: "600",
    color: colors.surface,
    marginLeft: 4,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  loadingText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: "600",
    color: colors.text,
    marginTop: spacing.md,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "center",
    lineHeight: 20,
  },
});
