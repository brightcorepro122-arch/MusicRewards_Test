// MusicRewards App - Simple version without Expo Router
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, AppRegistry } from 'react-native';

// Simple theme colors
const THEME = {
  colors: {
    background: '#1a1a1a',
    primary: '#7553DB',
    secondary: '#34CB76',
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
    },
    border: '#333333',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fonts: {
    sizes: {
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
};

// Simple screens
const HomeScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => (
  <ScrollView style={styles.container}>
    <Text style={styles.header}>🎵 MusicRewards App</Text>
    <Text style={styles.subtitle}>
      React Native Technical Assessment
    </Text>

    <View style={styles.testSection}>
      <Text style={styles.testTitle}>Test Navigation</Text>
      <TouchableOpacity style={styles.testButton} onPress={() => onNavigate('player')}>
        <Text style={styles.testButtonText}>Go to Player Modal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.testButton} onPress={() => onNavigate('profile')}>
        <Text style={styles.testButtonText}>Go to Profile</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.statusSection}>
      <Text style={styles.statusText}>✅ App loaded successfully!</Text>
      <Text style={styles.statusText}>✅ Navigation working!</Text>
      <Text style={styles.statusText}>✅ No casting errors!</Text>
    </View>
  </ScrollView>
);

const ProfileScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => (
  <ScrollView style={styles.container}>
    <Text style={styles.header}>👤 Profile Screen</Text>
    <Text style={styles.subtitle}>
      This is a simplified profile screen for testing navigation.
    </Text>

    <View style={styles.testSection}>
      <Text style={styles.testTitle}>Test Navigation</Text>
      <TouchableOpacity style={styles.testButton} onPress={() => onNavigate('home')}>
        <Text style={styles.testButtonText}>Go to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.testButton} onPress={() => onNavigate('player')}>
        <Text style={styles.testButtonText}>Go to Player Modal</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.statusSection}>
      <Text style={styles.statusText}>✅ Profile screen loaded!</Text>
      <Text style={styles.statusText}>✅ Navigation working!</Text>
    </View>
  </ScrollView>
);

const PlayerScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.header}>🎵 Player Modal</Text>
      <Text style={styles.subtitle}>
        This is a simplified player modal for testing navigation.
      </Text>

      <View style={styles.testSection}>
        <Text style={styles.testTitle}>Test Navigation</Text>
        <TouchableOpacity style={styles.testButton} onPress={() => onNavigate('home')}>
          <Text style={styles.testButtonText}>Go Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.testButton} onPress={() => onNavigate('profile')}>
          <Text style={styles.testButtonText}>Go to Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusSection}>
        <Text style={styles.statusText}>✅ Player modal loaded!</Text>
        <Text style={styles.statusText}>✅ Navigation working!</Text>
      </View>
    </View>
  </SafeAreaView>
);

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  const navigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'profile':
        return <ProfileScreen onNavigate={navigate} />;
      case 'player':
        return <PlayerScreen onNavigate={navigate} />;
      default:
        return <HomeScreen onNavigate={navigate} />;
    }
  };

  return (
    <SafeAreaView style={styles.appContainer}>
      {renderScreen()}
    </SafeAreaView>
  );
}

// Register the main component with AppRegistry
AppRegistry.registerComponent('main', () => App);

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.lg,
  },
  content: {
    flex: 1,
    padding: THEME.spacing.lg,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
  },
  testSection: {
    marginVertical: THEME.spacing.xl,
    alignItems: 'center',
  },
  testTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
  },
  testButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.sm,
    minWidth: 200,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '600',
  },
  statusSection: {
    marginTop: THEME.spacing.xl,
    alignItems: 'center',
  },
  statusText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.secondary,
    marginBottom: THEME.spacing.xs,
  },
});