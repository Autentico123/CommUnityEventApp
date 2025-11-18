import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

export default function AboutUsScreen({ navigation }) {
  const teamData = {
    leader: {
      name: "Team Leader",
      role: "Project Leader",
      avatar: null, // Use: require('../assets/leader.jpg')
      email: "leader@communityevent.com",
    },
    members: [
      {
        name: "Name 1", // e replace ang name 1 to "Imong name"

        avatar: null, // Use: require('../assets/member1.jpg')
      },
      {
        name: "Name 2",

        avatar: null, // Use: require('../assets/member2.jpg')
      },
      {
        name: "Name 3",

        avatar: null, // Use: require('../assets/member3.jpg')
      },
      {
        name: "Name 4",

        avatar: null, // Use: require('../assets/member4.jpg')
      },
      {
        name: "Name 5",

        avatar: null, // Use: require('../assets/member5.jpg')
      },
      {
        name: "Name 6",

        avatar: null, // Use: require('../assets/member6.jpg')
      },
      {
        name: "Name 7",

        avatar: null, // Use: require('../assets/member7.jpg')
      },
      {
        name: "Name 8",

        avatar: null, // Use: require('../assets/member8.jpg')
      },
      {
        name: "Name 9",

        avatar: null, // Use: require('../assets/member9.jpg')
      },
    ],
    instructor: {
      name: "Jay Ian F. Camelotes",
      title: "Project Instructor",
      avatar: null, // Use: require('../assets/instructor.jpg')
    },
  };

  const renderAvatar = (name, isLeader = false, avatarImage = null) => {
    const initial = name.charAt(0).toUpperCase();
    return (
      <View style={[styles.avatar, isLeader && styles.leaderAvatar]}>
        {avatarImage ? (
          <>
            <Image source={avatarImage} style={styles.avatarImage} />
            {isLeader && (
              <View style={styles.leaderBadge}>
                <Ionicons name="star" size={12} color="#FFD700" />
              </View>
            )}
          </>
        ) : (
          <>
            <LinearGradient
              colors={
                isLeader
                  ? [colors.secondary, colors.primary]
                  : [colors.primary + "80", colors.primary + "40"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}
            >
              <Text
                style={[styles.avatarText, isLeader && styles.leaderAvatarText]}
              >
                {initial}
              </Text>
            </LinearGradient>
            {isLeader && (
              <View style={styles.leaderBadge}>
                <Ionicons name="star" size={12} color="#FFD700" />
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerDecor1} />
        <View style={styles.headerDecor2} />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.surface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Description */}
        <View style={styles.descriptionCardWrapper}>
          <LinearGradient
            colors={[colors.primary + "30", colors.secondary + "30"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.descriptionCardBorder}
          >
            <View style={styles.descriptionCard}>
              <View style={styles.appIconContainer}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.appIcon}
                >
                  <Ionicons name="people" size={45} color={colors.surface} />
                </LinearGradient>
                <View style={styles.iconGlow} />
              </View>
              <Text style={styles.appName}>CommUnity Event</Text>
              <View style={styles.taglineContainer}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.taglineGradient}
                >
                  <Text style={styles.appTagline}>
                    Connecting Communities, Creating Memories
                  </Text>
                </LinearGradient>
              </View>
              <Text style={styles.description}>
                CommUnity Event is a platform designed to bring people together
                through local events and community activities. We believe in the
                power of connection and the importance of building strong,
                vibrant communities.
              </Text>
              <View style={styles.featureHighlights}>
                <View style={styles.highlightItem}>
                  <Ionicons name="calendar" size={20} color={colors.primary} />
                  <Text style={styles.highlightText}>Event{"\n"}Planning</Text>
                </View>
                <View style={styles.highlightItem}>
                  <Ionicons
                    name="location"
                    size={20}
                    color={colors.secondary}
                  />
                  <Text style={styles.highlightText}>Local{"\n"}Discovery</Text>
                </View>
                <View style={styles.highlightItem}>
                  <Ionicons name="people" size={20} color={colors.primary} />
                  <Text style={styles.highlightText}>Social{"\n"}Connect</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Team Leader Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="shield-checkmark"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.sectionTitle}>Project Leader</Text>
          </View>
          <View style={styles.leaderCardWrapper}>
            <LinearGradient
              colors={[colors.primary + "40", colors.secondary + "40"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.leaderCardBorder}
            >
              <View style={styles.leaderCard}>
                <LinearGradient
                  colors={[colors.primary + "08", colors.secondary + "08"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.leaderCardBackground}
                />
                <View style={styles.leaderAvatarWrapper}>
                  {renderAvatar(
                    teamData.leader.name,
                    true,
                    teamData.leader.avatar
                  )}
                  <View style={styles.avatarGlow} />
                </View>
                <Text style={styles.leaderName}>{teamData.leader.name}</Text>
                <View style={styles.leaderRoleBadge}>
                  <LinearGradient
                    colors={[colors.primary, colors.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.roleBadgeGradient}
                  >
                    <Ionicons
                      name="shield-checkmark"
                      size={12}
                      color={colors.surface}
                    />
                    <Text style={styles.leaderRole}>
                      {teamData.leader.role}
                    </Text>
                  </LinearGradient>
                </View>
                <View style={styles.leaderContact}>
                  <View style={styles.contactIconWrapper}>
                    <Ionicons name="mail" size={14} color={colors.primary} />
                  </View>
                  <Text style={styles.leaderEmail}>
                    {teamData.leader.email}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Team Members Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Development Team</Text>
          </View>
          <View style={styles.membersGrid}>
            {teamData.members.map((member, index) => (
              <View key={index} style={styles.memberCardWrapper}>
                <LinearGradient
                  colors={[
                    colors.primary + "15",
                    colors.secondary + "15",
                    colors.primary + "10",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.memberCardGradient}
                >
                  <View style={styles.memberCard}>
                    <View style={styles.memberAvatarWrapper}>
                      {renderAvatar(member.name, false, member.avatar)}
                      <View style={styles.memberBadge}>
                        <Text style={styles.memberNumber}>{index + 1}</Text>
                      </View>
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName} numberOfLines={1}>
                        {member.name}
                      </Text>
                      <View style={styles.memberLabelWrapper}>
                        <Ionicons
                          name="person"
                          size={10}
                          color={colors.textSecondary}
                        />
                        <Text style={styles.memberLabel}>Member</Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={colors.border}
                    />
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
        </View>

        {/* Instructor Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Course Instructor</Text>
          </View>
          <View style={styles.instructorCardWrapper}>
            <LinearGradient
              colors={[
                colors.primary + "50",
                colors.secondary + "50",
                colors.primary + "50",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.instructorCardBorder}
            >
              <View style={styles.instructorCard}>
                <View style={styles.instructorBadge}>
                  <Ionicons name="medal" size={16} color="#FFD700" />
                </View>
                {teamData.instructor.avatar ? (
                  <View style={styles.instructorAvatarWrapper}>
                    <Image
                      source={teamData.instructor.avatar}
                      style={styles.instructorAvatar}
                    />
                    <View style={styles.instructorAvatarGlow} />
                  </View>
                ) : (
                  <View style={styles.instructorAvatarWrapper}>
                    <LinearGradient
                      colors={[colors.primary, colors.secondary]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.instructorIconContainer}
                    >
                      <Ionicons
                        name="school"
                        size={36}
                        color={colors.surface}
                      />
                    </LinearGradient>
                    <View style={styles.instructorAvatarGlow} />
                  </View>
                )}
                <Text style={styles.instructorName}>
                  {teamData.instructor.name}
                </Text>
                <View style={styles.instructorTitleBadge}>
                  <LinearGradient
                    colors={[colors.secondary, colors.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.instructorTitleGradient}
                  >
                    <Ionicons name="star" size={12} color={colors.surface} />
                    <Text style={styles.instructorTitle}>
                      {teamData.instructor.title}
                    </Text>
                  </LinearGradient>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="code-slash" size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Released</Text>
              <Text style={styles.infoValue}>November 2025</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="heart" size={20} color={colors.secondary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Made with</Text>
              <Text style={styles.infoValue}>React Native & MongoDB</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 CommUnity Event. All rights reserved.
          </Text>
          <Text style={styles.footerSubtext}>
            Building communities, one event at a time.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    justifyContent: "space-between",
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
    position: "relative",
    overflow: "hidden",
  },
  headerDecor1: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.1)",
    top: -30,
    right: -20,
  },
  headerDecor2: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -10,
    left: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
    zIndex: 1,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  descriptionCardWrapper: {
    marginBottom: spacing.lg,
  },
  descriptionCardBorder: {
    borderRadius: borderRadius.xl + 2,
    padding: 2,
    ...shadows.lg,
  },
  descriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: "center",
  },
  taglineContainer: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  taglineGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  appIconContainer: {
    marginBottom: spacing.md,
    position: "relative",
  },
  appIcon: {
    width: 90,
    height: 90,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.lg,
  },
  iconGlow: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: colors.primary,
    opacity: 0.2,
    top: 0,
    left: 0,
  },
  appName: {
    fontSize: typography.fontSize.xxl + 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
    letterSpacing: 0.5,
    textAlign: "center",
    width: "100%",
  },
  appTagline: {
    fontSize: typography.fontSize.sm,
    color: colors.surface,
    fontWeight: typography.fontWeight.bold,
    textAlign: "center",
  },
  featureHighlights: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.xs,
  },
  highlightItem: {
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    maxWidth: "31%",
    justifyContent: "center",
  },
  highlightText: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
    fontWeight: typography.fontWeight.bold,
    textAlign: "center",
    flexWrap: "wrap",
    width: "100%",
    lineHeight: typography.fontSize.xs * 1.4,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: typography.fontSize.base * 1.5,
    width: "100%",
    paddingHorizontal: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    flex: 1,
  },
  leaderCardWrapper: {
    marginBottom: spacing.md,
  },
  leaderCardBorder: {
    borderRadius: borderRadius.xl + 2,
    padding: 3,
    ...shadows.lg,
  },
  leaderCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  leaderCardBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  leaderAvatarWrapper: {
    position: "relative",
    marginBottom: spacing.md,
  },
  avatarGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    opacity: 0.15,
    top: -10,
    left: -10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.md,
    position: "relative",
  },
  leaderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.surface,
    ...shadows.lg,
    overflow: "hidden",
  },
  avatarGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
  },
  leaderAvatarText: {
    fontSize: 40,
  },
  leaderBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.surface,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  leaderName: {
    fontSize: typography.fontSize.xl + 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
    textAlign: "center",
    width: "100%",
  },
  leaderRoleBadge: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.full,
    overflow: "hidden",
    ...shadows.sm,
  },
  roleBadgeGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  leaderRole: {
    fontSize: typography.fontSize.sm,
    color: colors.surface,
    fontWeight: typography.fontWeight.bold,
    textAlign: "center",
  },
  leaderContact: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  contactIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  leaderEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
    flexShrink: 1,
  },
  membersGrid: {
    flexDirection: "column",
    gap: spacing.md,
  },
  memberCardWrapper: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.sm,
  },
  memberCardGradient: {
    borderRadius: borderRadius.lg,
  },
  memberCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    margin: 1,
  },
  memberAvatarWrapper: {
    position: "relative",
    marginRight: spacing.md,
  },
  memberBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  memberNumber: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface,
  },
  memberName: {
    fontSize: typography.fontSize.base + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs / 2,
    textAlign: "left",
    flexShrink: 1,
  },
  memberInfo: {
    flex: 1,
  },
  memberLabelWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs / 2,
  },
  memberLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
    textAlign: "left",
  },
  memberRole: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: typography.fontSize.xs * 1.3,
  },
  infoSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
    textAlign: "left",
  },
  infoValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    textAlign: "left",
    flexShrink: 1,
  },
  instructorCardWrapper: {
    position: "relative",
  },
  instructorCardBorder: {
    borderRadius: borderRadius.xl + 2,
    padding: 3,
    ...shadows.lg,
  },
  instructorCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: "center",
    position: "relative",
  },
  instructorBadge: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.xs,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  instructorAvatarWrapper: {
    position: "relative",
    marginBottom: spacing.md,
  },
  instructorIconContainer: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  instructorAvatar: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
  },
  instructorAvatarGlow: {
    position: "absolute",
    width: 95,
    height: 95,
    borderRadius: 47.5,
    backgroundColor: colors.secondary,
    opacity: 0.2,
    top: -5,
    left: -5,
    zIndex: -1,
  },
  instructorName: {
    fontSize: typography.fontSize.xl + 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  instructorTitleBadge: {
    borderRadius: borderRadius.full,
    overflow: "hidden",
    ...shadows.sm,
  },
  instructorTitleGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  instructorTitle: {
    fontSize: typography.fontSize.sm,
    color: colors.surface,
    fontWeight: typography.fontWeight.bold,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  footerSubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
    fontStyle: "italic",
    textAlign: "center",
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});
