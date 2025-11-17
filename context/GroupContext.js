import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import Toast from "react-native-toast-message";
import * as api from "../utils/api";

const GroupContext = createContext();

export const useGroups = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroups must be used within a GroupProvider");
  }
  return context;
};

export const GroupProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all groups
  const fetchGroups = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await api.getGroups(filters);
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load groups",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's groups
  const fetchMyGroups = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const userId = user._id || user.id;
      if (!userId) return;

      const allGroups = await api.getGroups();

      const userGroups = allGroups.filter((group) => {
        if (!Array.isArray(group.members)) return false;

        return group.members.some((member) => {
          // Handle both string IDs and populated objects
          const memberId =
            typeof member === "string" ? member : member._id || member.id;
          return memberId === userId || String(memberId) === String(userId);
        });
      });

      setMyGroups(userGroups);
    } catch (error) {
      console.error("Error fetching my groups:", error);
    }
  };

  // Fetch single group
  const fetchGroup = async (groupId) => {
    setLoading(true);
    try {
      const data = await api.getGroup(groupId);
      setSelectedGroup(data);
      return data;
    } catch (error) {
      console.error("Error fetching group:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load group details",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create group
  const createGroup = async (groupData) => {
    try {
      const newGroup = await api.createGroup(groupData);
      setGroups([newGroup, ...groups]);
      setMyGroups([newGroup, ...myGroups]);
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Group created successfully",
      });
      return newGroup;
    } catch (error) {
      console.error("Error creating group:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to create group",
      });
      return null;
    }
  };

  // Update group
  const updateGroup = async (groupId, groupData) => {
    try {
      const updatedGroup = await api.updateGroup(groupId, groupData);
      setGroups(groups.map((g) => (g._id === groupId ? updatedGroup : g)));
      setMyGroups(myGroups.map((g) => (g._id === groupId ? updatedGroup : g)));
      if (selectedGroup?._id === groupId) {
        setSelectedGroup(updatedGroup);
      }
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Group updated successfully",
      });
      return updatedGroup;
    } catch (error) {
      console.error("Error updating group:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update group",
      });
      return null;
    }
  };

  // Delete group
  const deleteGroup = async (groupId) => {
    try {
      await api.deleteGroup(groupId);
      setGroups(groups.filter((g) => g._id !== groupId));
      setMyGroups(myGroups.filter((g) => g._id !== groupId));
      if (selectedGroup?._id === groupId) {
        setSelectedGroup(null);
      }
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Group deleted successfully",
      });
      return true;
    } catch (error) {
      console.error("Error deleting group:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete group",
      });
      return false;
    }
  };

  // Join group
  const joinGroup = async (groupId) => {
    try {
      await api.joinGroup(groupId);
      await fetchGroup(groupId);
      await fetchMyGroups();
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Joined group successfully",
      });
      return true;
    } catch (error) {
      console.error("Error joining group:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to join group",
      });
      return false;
    }
  };

  // Leave group
  const leaveGroup = async (groupId) => {
    try {
      await api.leaveGroup(groupId);
      await fetchGroup(groupId);
      await fetchMyGroups();
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Left group successfully",
      });
      return true;
    } catch (error) {
      console.error("Error leaving group:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to leave group",
      });
      return false;
    }
  };

  // Fetch posts
  const fetchPosts = async (groupId) => {
    setLoading(true);
    try {
      const data = await api.getGroupPosts(groupId);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load posts",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create post
  const createPost = async (groupId, postData) => {
    try {
      const newPost = await api.createPost(groupId, postData);
      setPosts([newPost, ...posts]);
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Post created successfully",
      });
      return newPost;
    } catch (error) {
      console.error("Error creating post:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create post",
      });
      return null;
    }
  };

  // Delete post
  const deletePost = async (postId) => {
    try {
      await api.deletePost(postId);
      setPosts(posts.filter((p) => p._id !== postId));
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Post deleted successfully",
      });
      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete post",
      });
      return false;
    }
  };

  // Like post
  const likePost = async (postId) => {
    try {
      const result = await api.likePost(postId);
      setPosts(
        posts.map((post) =>
          post._id === postId
            ? { ...post, likeCount: result.likeCount, liked: result.liked }
            : post
        )
      );
      return result;
    } catch (error) {
      console.error("Error liking post:", error);
      return null;
    }
  };

  // Load initial data
  useEffect(() => {
    fetchGroups();
    if (isAuthenticated) {
      fetchMyGroups();
    }
  }, [isAuthenticated]);

  const value = {
    groups,
    myGroups,
    selectedGroup,
    posts,
    loading,
    fetchGroups,
    fetchMyGroups,
    fetchGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    fetchPosts,
    createPost,
    deletePost,
    likePost,
    setSelectedGroup,
  };

  return (
    <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
  );
};
