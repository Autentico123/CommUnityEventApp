import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { authAPI } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from storage on app start
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("authToken");
      const storedUser = await AsyncStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);

        // Verify token is still valid and get fresh user data
        try {
          const response = await authAPI.getCurrentUser(storedToken);
          if (response.success) {
            setUser(response.user);
            await AsyncStorage.setItem("user", JSON.stringify(response.user));
          }
        } catch (error) {
          console.error("Error refreshing user data:", error);
          // Token invalid, logout
          await logout();
        }
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.register({ name, email, password });

      if (response.success) {
        const { token: newToken, user: newUser } = response;

        // Save to storage
        await AsyncStorage.setItem("authToken", newToken);
        await AsyncStorage.setItem("user", JSON.stringify(newUser));

        // Update state
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);

        Toast.show({
          type: "success",
          text1: "Welcome!",
          text2: "Your account has been created successfully.",
        });

        return { success: true };
      } else {
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: response.message || "Could not create account.",
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error registering:", error);
      Toast.show({
        type: "error",
        text1: "Registration Error",
        text2: error.message || "An error occurred during registration.",
      });
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });

      if (response.success) {
        const { token: newToken, user: newUser } = response;

        // Save to storage
        await AsyncStorage.setItem("authToken", newToken);
        await AsyncStorage.setItem("user", JSON.stringify(newUser));

        // Update state
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);

        Toast.show({
          type: "success",
          text1: "Welcome Back!",
          text2: `Logged in as ${newUser.name}`,
        });

        return { success: true };
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: response.message || "Invalid credentials.",
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: error.message || "An error occurred during login.",
      });
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      // Clear storage
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");

      // Clear state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);

      Toast.show({
        type: "info",
        text1: "Logged Out",
        text2: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.updateProfile(token, userData);

      if (response.success) {
        const updatedUser = response.user;

        // Update storage
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

        // Update state
        setUser(updatedUser);

        Toast.show({
          type: "success",
          text1: "Profile Updated",
          text2: "Your profile has been updated successfully.",
        });

        return { success: true };
      } else {
        Toast.show({
          type: "error",
          text1: "Update Failed",
          text2: response.message || "Could not update profile.",
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Toast.show({
        type: "error",
        text1: "Update Error",
        text2: error.message || "An error occurred during update.",
      });
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      const response = await authAPI.changePassword(token, {
        currentPassword,
        newPassword,
      });

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Password Changed",
          text2: "Your password has been updated successfully.",
        });

        return { success: true };
      } else {
        Toast.show({
          type: "error",
          text1: "Change Failed",
          text2: response.message || "Could not change password.",
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Toast.show({
        type: "error",
        text1: "Password Error",
        text2: error.message || "An error occurred during password change.",
      });
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    refreshUser: loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
