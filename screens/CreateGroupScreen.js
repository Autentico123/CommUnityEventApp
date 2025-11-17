import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useGroups } from "../context/GroupContext";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

const CATEGORIES = [
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

export default function CreateGroupScreen() {
  const navigation = useNavigation();
  const { createGroup } = useGroups();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return;
    }

    if (name.length < 3) {
      Alert.alert("Error", "Group name must be at least 3 characters");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please enter a group description");
      return;
    }

    setLoading(true);
    const groupData = {
      name: name.trim(),
      description: description.trim(),
      category,
      isPrivate,
    };

    const newGroup = await createGroup(groupData);
    setLoading(false);

    if (newGroup) {
      navigation.navigate("GroupDetail", { groupId: newGroup._id });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
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
            <Text style={styles.headerTitle}>Create Group</Text>
            <Text style={styles.headerSubtitle}>Build your community</Text>
          </View>
          <View style={{ width: 40 }} />
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Ionicons name="text" size={20} color={colors.primary} />
              <Text style={styles.label}>Group Name *</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter group name"
                value={name}
                onChangeText={setName}
                maxLength={100}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <Text style={styles.charCount}>{name.length}/100</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Ionicons name="document-text" size={20} color={colors.primary} />
              <Text style={styles.label}>Description *</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What is this group about?"
                value={description}
                onChangeText={setDescription}
                maxLength={500}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Ionicons name="apps" size={20} color={colors.primary} />
              <Text style={styles.label}>Category *</Text>
            </View>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === cat && styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.label}>Privacy</Text>
            </View>
            <View style={styles.privacyCard}>
              <View style={styles.privacyRow}>
                <View style={styles.privacyIconContainer}>
                  <Ionicons
                    name={isPrivate ? "lock-closed" : "globe"}
                    size={24}
                    color={isPrivate ? colors.primary : "#4ECDC4"}
                  />
                </View>
                <View style={styles.privacyInfo}>
                  <Text style={styles.privacyLabel}>Private Group</Text>
                  <Text style={styles.privacyDescription}>
                    {isPrivate
                      ? "Only members can see posts and content"
                      : "Anyone can see posts and content"}
                  </Text>
                </View>
                <Switch
                  value={isPrivate}
                  onValueChange={setIsPrivate}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.createButtonContainer}
            onPress={handleCreate}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                loading
                  ? [colors.primary + "80", colors.primary + "80"]
                  : [colors.primary, colors.primary + "dd"]
              }
              style={styles.createButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={colors.surface}
              />
              <Text style={styles.createButtonText}>
                {loading ? "Creating..." : "Create Group"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.surface,
    opacity: 0.9,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  inputContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border + "20",
  },
  input: {
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  textArea: {
    height: 100,
    paddingTop: spacing.md,
  },
  charCount: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "right",
    marginTop: spacing.xs,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border + "40",
    ...shadows.sm,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.md,
  },
  categoryButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  categoryButtonTextActive: {
    color: colors.surface,
  },
  privacyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border + "20",
  },
  privacyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  privacyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  privacyInfo: {
    flex: 1,
  },
  privacyLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  createButtonContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.lg,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.md + 2,
  },
  createButtonText: {
    color: colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  bottomSpacing: {
    height: spacing.xl * 3,
  },
});
