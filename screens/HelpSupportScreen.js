// screens/HelpSupportScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HelpSupportScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🆘 Help & Support</Text>
      <Text style={styles.text}>Questions? Contact our support team.</Text>

      <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL("mailto:support@example.com")}>
        <Text style={styles.contactText}>Email Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.back, { marginTop: 16 }]} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={18} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  text: { color: "#666", marginBottom: 16, textAlign: "center" },
  contactButton: { backgroundColor: "#7a5a2a", padding: 12, borderRadius: 8 },
  contactText: { color: "#fff", fontWeight: "700" },
  back: { flexDirection: "row", alignItems: "center", backgroundColor: "#7a5a2a", padding: 10, borderRadius: 8 },
  backText: { color: "#fff", marginLeft: 8, fontWeight: "700" },
});
