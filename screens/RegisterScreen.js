import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors, typography } from "../theme";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      await register(name.trim(), email.toLowerCase().trim(), password);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter your name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors({ ...errors, name: null });
              }}
              autoCapitalize="words"
              editable={!loading}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: null });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: null });
              }}
              secureTextEntry
              editable={!loading}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[
                styles.input,
                errors.confirmPassword && styles.inputError,
              ]}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors({ ...errors, confirmPassword: null });
              }}
              secureTextEntry
              editable={!loading}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default RegisterScreen;
