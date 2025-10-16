// context/ThemeContext.js
import React, { createContext, useState, useContext, useMemo } from "react";
import { colors as baseColors } from "../theme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const colors = useMemo(() => {
    if (isDarkMode) {
      return {
        ...baseColors,
        background: "#0f1115",
        text: "#ffffff",
        surface: "#1a1a1f",
        textSecondary: "#bdbdbd",
        textLight: "#9a9a9a",
        border: "#27272a",
        primaryLight: baseColors.primary + "30",
        cardDark: "#151516",
        shadow: "#000000",
      };
    }
    return {
      ...baseColors,
      textLight: baseColors.textLight || "#999",
      cardDark: "#f5f5f5",
      shadow: "#000",
    };
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
