import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AboutScreen = ({ navigation }) => {
  const openGitHub = () => {
    Linking.openURL('https://github.com/Autentico123/CommUnityEventApp');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="information-circle" size={80} color="#9333EA" />
        <Text style={styles.title}>About CommUnity</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What is CommUnity?</Text>
        <Text style={styles.description}>
          CommUnity is an event-sharing platform where users can create,
          discover, and share community or school activities. It promotes
          participation and collaboration within local or academic communities.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <View style={styles.featureItem}>
          <Ionicons name="calendar" size={24} color="#9333EA" />
          <Text style={styles.featureText}>
            Browse and discover upcoming events
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="add-circle" size={24} color="#9333EA" />
          <Text style={styles.featureText}>Create and share your own events</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="heart" size={24} color="#EC4899" />
          <Text style={styles.featureText}>Save favorite events</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="notifications" size={24} color="#9333EA" />
          <Text style={styles.featureText}>Get event reminders</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="share-social" size={24} color="#EC4899" />
          <Text style={styles.featureText}>Share events with friends</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="people" size={24} color="#9333EA" />
          <Text style={styles.featureText}>
            Connect through shared interests
          </Text>
        </View>
      </View>

      {/* Tech Stack */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Built With</Text>
        <View style={styles.techItem}>
          <Text style={styles.techText}>⚛️ React Native</Text>
        </View>
        <View style={styles.techItem}>
          <Text style={styles.techText}>📱 Expo</Text>
        </View>
        <View style={styles.techItem}>
          <Text style={styles.techText}>🟢 Node.js & Express</Text>
        </View>
        <View style={styles.techItem}>
          <Text style={styles.techText}>🍃 MongoDB</Text>
        </View>
      </View>

      {/* Mission */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.description}>
          To encourage community engagement by making it easy for people to
          discover, create, and participate in local events that matter to them.
        </Text>
      </View>

      {/* GitHub Link */}
      <TouchableOpacity style={styles.githubButton} onPress={openGitHub}>
        <Ionicons name="logo-github" size={24} color="#fff" />
        <Text style={styles.githubText}>View on GitHub</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Built with ❤️ by the CommUnity Team
        </Text>
        <Text style={styles.footerText}>© 2024 CommUnity</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
  },
  version: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
    flex: 1,
  },
  techItem: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  techText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  githubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  githubText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});

export default AboutScreen;
