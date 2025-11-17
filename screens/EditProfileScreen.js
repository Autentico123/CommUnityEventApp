import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";
import { useAuth } from "../context/AuthContext";

const { width } = Dimensions.get("window");

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });

  const [selectedImage, setSelectedImage] = useState(user?.avatar || null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const avatarScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animateAvatar = () => {
    Animated.sequence([
      Animated.timing(avatarScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(avatarScale, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload profile pictures."
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        await uploadAvatarToBackend(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera permissions to take photos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        await uploadAvatarToBackend(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const uploadAvatarToBackend = async (uri) => {
    try {
      setUploadingImage(true);

      // Create form data
      const formData = new FormData();
      
      // Get file extension from URI
      const uriParts = uri.split('.');
      const fileExtension = uriParts[uriParts.length - 1];
      const fileName = `avatar-${Date.now()}.${fileExtension}`;
      
      // For React Native, the file object needs to be structured this way
      const fileToUpload = {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        name: fileName,
        type: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
      };
      
      // Append the avatar file
      formData.append('avatar', fileToUpload);

      // Get auth token from storage
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        Alert.alert("Authentication Required", "Please log in to upload avatar.");
        return;
      }

      // Upload to backend
      const { API_URL } = require('../config/apiConfig');
      const uploadUrl = `${API_URL}/users/upload-avatar`;
      console.log('Uploading avatar to:', uploadUrl);
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Avatar upload response status:', response.status);
      
      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Avatar upload failed:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Avatar upload response data:', data);

      if (data.success) {
        // Store the backend URL
        const fullAvatarUrl = `${API_URL.replace('/api', '')}${data.avatarUrl}`;
        setSelectedImage(fullAvatarUrl);
        setFormData({ ...formData, avatar: fullAvatarUrl });
        
        Alert.alert("Success", "Avatar uploaded successfully!");
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      Alert.alert("Upload Failed", "Could not upload avatar. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageOptions = () => {
    animateAvatar();
    Alert.alert(
      "Profile Photo",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: takePhoto,
        },
        {
          text: "Choose from Library",
          onPress: pickImage,
        },
        {
          text: "Remove Photo",
          onPress: () => {
            setSelectedImage(null);
            setFormData({ ...formData, avatar: "" });
          },
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (formData.bio && formData.bio.length > 200) {
      newErrors.bio = "Bio must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    // Include avatar if image was selected
    const updatedData = {
      ...formData,
      avatar: selectedImage || formData.avatar, // Use selected image or keep existing
    };

    const result = await updateProfile(updatedData);
    setIsSaving(false);

    if (result.success) {
      navigation.goBack();
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Animated Gradient Header */}
      <LinearGradient
        colors={[colors.primary, colors.primary + "dd", colors.primary + "99"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleCancel}
            disabled={isSaving}
          >
            <View style={styles.headerIconContainer}>
              <Ionicons name="close" size={24} color={colors.surface} />
            </View>
          </TouchableOpacity>
          <Animated.Text
            style={[
              styles.headerTitle,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            Edit Profile
          </Animated.Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSave}
            disabled={isSaving}
          >
            <View style={styles.headerIconContainer}>
              {isSaving ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Ionicons name="checkmark" size={24} color={colors.surface} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Avatar Section in Header */}
        <Animated.View
          style={[
            styles.avatarSection,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Animated.View
            style={[
              styles.avatarContainer,
              { transform: [{ scale: avatarScale }] },
            ]}
          >
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                {selectedImage || formData.avatar ? (
                  <Image
                    source={{ uri: selectedImage || formData.avatar }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <>
                    {formData.name ? (
                      <Text style={styles.avatarText}>
                        {formData.name.charAt(0).toUpperCase()}
                      </Text>
                    ) : (
                      <Ionicons name="person" size={50} color={colors.primary} />
                    )}
                  </>
                )}
              </View>
              <TouchableOpacity
                style={styles.changeAvatarButton}
                onPress={handleImageOptions}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <ActivityIndicator size="small" color={colors.surface} />
                ) : (
                  <Ionicons name="camera" size={20} color={colors.surface} />
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
          <Text style={styles.avatarHint}>Tap camera to change photo</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Form Fields */}
        <Animated.View
          style={[
            styles.formSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <Text style={styles.requiredBadge}>Required</Text>
            </View>
            <View
              style={[
                styles.inputContainer,
                focusedField === "name" && styles.inputContainerFocused,
                errors.name && styles.inputContainerError,
              ]}
            >
              <View style={styles.inputIconWrapper}>
                <Ionicons
                  name="person-outline"
                  size={22}
                  color={focusedField === "name" ? colors.primary : colors.textSecondary}
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textSecondary}
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  if (errors.name) {
                    setErrors({ ...errors, name: null });
                  }
                }}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                editable={!isSaving}
              />
              {formData.name.length > 0 && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.success}
                  style={styles.validIcon}
                />
              )}
            </View>
            {errors.name && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={14} color={colors.error} />
                <Text style={styles.errorText}>{errors.name}</Text>
              </View>
            )}
          </View>

          {/* Email Field (Read-only) */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <View style={styles.lockedBadge}>
                <Ionicons name="lock-closed" size={10} color={colors.surface} />
                <Text style={styles.lockedBadgeText}>Locked</Text>
              </View>
            </View>
            <View style={[styles.inputContainer, styles.inputDisabled]}>
              <View style={styles.inputIconWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={22}
                  color={colors.textSecondary}
                />
              </View>
              <TextInput
                style={[styles.input, styles.inputTextDisabled]}
                value={user?.email}
                editable={false}
              />
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={colors.textSecondary}
              />
            </View>
            <View style={styles.hintContainer}>
              <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.fieldHint}>
                Email cannot be changed for security reasons
              </Text>
            </View>
          </View>

          {/* Bio Field */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>About You</Text>
              <Text style={styles.optionalBadge}>Optional</Text>
            </View>
            <View
              style={[
                styles.inputContainer,
                styles.textAreaContainer,
                focusedField === "bio" && styles.inputContainerFocused,
                errors.bio && styles.inputContainerError,
              ]}
            >
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Share something interesting about yourself... Your hobbies, interests, or what you're passionate about 🌟"
                placeholderTextColor={colors.textSecondary}
                value={formData.bio}
                onChangeText={(text) => {
                  setFormData({ ...formData, bio: text });
                  if (errors.bio) {
                    setErrors({ ...errors, bio: null });
                  }
                }}
                onFocus={() => setFocusedField("bio")}
                onBlur={() => setFocusedField(null)}
                multiline
                numberOfLines={4}
                maxLength={200}
                editable={!isSaving}
              />
            </View>
            <View style={styles.bioFooter}>
              {errors.bio ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color={colors.error} />
                  <Text style={styles.errorText}>{errors.bio}</Text>
                </View>
              ) : (
                <View style={styles.hintContainer}>
                  <Ionicons name="sparkles" size={14} color={colors.textSecondary} />
                  <Text style={styles.fieldHint}>Make it memorable!</Text>
                </View>
              )}
              <View
                style={[
                  styles.charCountBadge,
                  formData.bio.length > 180 && styles.charCountWarning,
                ]}
              >
                <Text
                  style={[
                    styles.charCount,
                    formData.bio.length > 180 && styles.charCountWarningText,
                  ]}
                >
                  {formData.bio.length}/200
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Account Stats */}
        <Animated.View
          style={[
            styles.statsSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="stats-chart" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Your Activity</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={[colors.primary + "20", colors.primary + "10"]}
                style={styles.statGradient}
              >
                <Ionicons name="calendar" size={24} color={colors.primary} />
                <Text style={styles.statValue}>{user?.eventsCreated?.length || 0}</Text>
                <Text style={styles.statLabel}>Created</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={[colors.success + "20", colors.success + "10"]}
                style={styles.statGradient}
              >
                <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                <Text style={styles.statValue}>{user?.eventsAttending?.length || 0}</Text>
                <Text style={styles.statLabel}>Attending</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={[colors.warning + "20", colors.warning + "10"]}
                style={styles.statGradient}
              >
                <Ionicons name="bookmark" size={24} color={colors.warning} />
                <Text style={styles.statValue}>{user?.savedEvents?.length || 0}</Text>
                <Text style={styles.statLabel}>Saved</Text>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.memberSinceCard}>
            <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.memberSinceText}>
              Member since{" "}
              <Text style={styles.memberSinceDate}>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </Text>
            </Text>
          </View>
        </Animated.View>

        {/* Quick Tips */}
        <Animated.View
          style={[
            styles.tipsSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <LinearGradient
            colors={[colors.primary + "15", colors.primary + "05"]}
            style={styles.tipsCard}
          >
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb" size={20} color={colors.primary} />
              <Text style={styles.tipsTitle}>Profile Tips</Text>
            </View>
            <View style={styles.tipRow}>
              <Ionicons name="camera" size={16} color={colors.textSecondary} />
              <Text style={styles.tipText}>Use a clear profile photo for better recognition</Text>
            </View>
            <View style={styles.tipRow}>
              <Ionicons name="text" size={16} color={colors.textSecondary} />
              <Text style={styles.tipText}>Write an engaging bio to connect with others</Text>
            </View>
            <View style={styles.tipRow}>
              <Ionicons name="shield-checkmark" size={16} color={colors.textSecondary} />
              <Text style={styles.tipText}>Keep your profile updated and active</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>

      {/* Save Button (Fixed at bottom on mobile) */}
      {Platform.OS !== "web" && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.surface} />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.surface}
                />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradientHeader: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 50,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitle: {
    ...typography.h3,
    color: colors.surface,
    fontWeight: "700",
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === "ios" ? 120 : 100,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: spacing.lg,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: colors.surface,
    ...shadows.large,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "bold",
    color: colors.primary,
  },
  changeAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.surface,
    ...shadows.medium,
  },
  avatarHint: {
    ...typography.caption,
    color: colors.surface,
    marginTop: spacing.sm,
    fontWeight: "500",
  },
  formSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  fieldContainer: {
    marginBottom: spacing.xl,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  fieldLabel: {
    ...typography.body,
    fontWeight: "600",
    color: colors.text,
    fontSize: 15,
  },
  requiredBadge: {
    ...typography.caption,
    color: colors.error,
    backgroundColor: colors.error + "15",
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: "600",
  },
  optionalBadge: {
    ...typography.caption,
    color: colors.textSecondary,
    backgroundColor: colors.textSecondary + "15",
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: "600",
  },
  lockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.textSecondary + "20",
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lockedBadgeText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 56,
    ...shadows.small,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    ...shadows.medium,
  },
  inputContainerError: {
    borderColor: colors.error,
    backgroundColor: colors.error + "08",
  },
  inputDisabled: {
    backgroundColor: colors.background,
    opacity: 0.7,
  },
  inputIconWrapper: {
    marginRight: spacing.sm,
    width: 24,
    alignItems: "center",
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.sm,
    fontSize: 15,
  },
  inputTextDisabled: {
    color: colors.textSecondary,
  },
  validIcon: {
    marginLeft: spacing.xs,
  },
  textAreaContainer: {
    alignItems: "flex-start",
    minHeight: 120,
    paddingVertical: spacing.md,
  },
  textArea: {
    textAlignVertical: "top",
    paddingTop: 0,
    lineHeight: 22,
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: spacing.xs,
  },
  fieldHint: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    fontSize: 12,
    fontWeight: "500",
  },
  bioFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  charCountBadge: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  charCountWarning: {
    backgroundColor: colors.warning + "20",
  },
  charCount: {
    ...typography.caption,
    color: colors.primary,
    fontSize: 11,
    fontWeight: "600",
  },
  charCountWarningText: {
    color: colors.warning,
  },
  statsSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    fontWeight: "700",
    color: colors.text,
    fontSize: 18,
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.small,
  },
  statGradient: {
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  statValue: {
    ...typography.h2,
    fontWeight: "700",
    color: colors.text,
    marginVertical: spacing.xs,
    fontSize: 28,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  memberSinceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  memberSinceText: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
  },
  memberSinceDate: {
    fontWeight: "600",
    color: colors.text,
  },
  tipsSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  tipsCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  tipsTitle: {
    ...typography.body,
    fontWeight: "700",
    color: colors.primary,
    fontSize: 16,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tipText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.large,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    minHeight: 56,
    ...shadows.medium,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    ...typography.body,
    fontWeight: "700",
    color: colors.surface,
    marginLeft: spacing.sm,
    fontSize: 16,
  },
});
