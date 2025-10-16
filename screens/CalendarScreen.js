// screens/CalendarScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CalendarScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Calendar</Text>
      <Text style={styles.text}>Your schedule will be shown here.</Text>

      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={18} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  text: { color: "#666", marginBottom: 20, textAlign: "center" },
  back: { flexDirection: "row", alignItems: "center", backgroundColor: "#7a5a2a", padding: 10, borderRadius: 8 },
  backText: { color: "#fff", marginLeft: 8, fontWeight: "700" },
});
