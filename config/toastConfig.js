import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius, shadows } from "../theme";

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View style={styles.successToast}>
      <View style={styles.toastIconContainer}>
        <Ionicons name="checkmark-circle" size={32} color={colors.surface} />
      </View>
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
      </View>
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View style={styles.errorToast}>
      <View style={[styles.toastIconContainer, styles.errorIconContainer]}>
        <Ionicons name="close-circle" size={32} color={colors.surface} />
      </View>
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
      </View>
    </View>
  ),
  info: ({ text1, text2 }) => (
    <View style={styles.infoToast}>
      <View style={[styles.toastIconContainer, styles.infoIconContainer]}>
        <Ionicons name="information-circle" size={32} color={colors.surface} />
      </View>
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  successToast: {
    width: "90%",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.lg,
    elevation: 8,
    borderLeftWidth: 6,
    borderLeftColor: "#4CAF50",
  },
  errorToast: {
    width: "90%",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.lg,
    elevation: 8,
    borderLeftWidth: 6,
    borderLeftColor: "#F44336",
  },
  infoToast: {
    width: "90%",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.lg,
    elevation: 8,
    borderLeftWidth: 6,
    borderLeftColor: colors.primary,
  },
  toastIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  errorIconContainer: {
    backgroundColor: "#F44336",
  },
  infoIconContainer: {
    backgroundColor: colors.primary,
  },
  toastContent: {
    flex: 1,
  },
  toastTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  toastMessage: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
