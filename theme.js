// Theme configuration for CommUnity Event App

export const colors = {
  // Primary colors
  primary: "#6C63FF", // Purple - main brand color
  primaryDark: "#5548E8", // Darker purple for pressed states
  primaryLight: "#8C85FF", // Lighter purple for highlights

  // Secondary colors
  secondary: "#FF6584", // Pink/Coral - accent color
  secondaryDark: "#E8546D",
  secondaryLight: "#FF8BA0",

  // Neutral colors
  background: "#F8F9FA", // Light gray background
  surface: "#FFFFFF", // White for cards/surfaces
  text: "#2D3436", // Dark gray for text
  textSecondary: "#636E72", // Medium gray for secondary text
  textLight: "#B2BEC3", // Light gray for disabled/placeholder

  // Semantic colors
  success: "#00B894", // Green for success states
  error: "#D63031", // Red for errors
  warning: "#FDCB6E", // Yellow for warnings
  info: "#74B9FF", // Blue for info

  // UI elements
  border: "#DFE6E9", // Light gray for borders
  divider: "#ECEFF1", // Very light gray for dividers
  shadow: "#000000", // Black for shadows (use with opacity)
  overlay: "#000000", // Black for overlays (use with opacity)

  // Tab bar
  tabActive: "#6C63FF", // Active tab color
  tabInactive: "#95A5A6", // Inactive tab color
};

export const typography = {
  // Font families (React Native default fonts)
  fontFamily: {
    regular: "System",
    medium: "System",
    bold: "System",
    light: "System",
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },

  // Font weights
  fontWeight: {
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};
