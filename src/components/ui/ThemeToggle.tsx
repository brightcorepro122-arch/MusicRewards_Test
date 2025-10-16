// Theme toggle component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassCard } from './GlassCard';
import { useThemeStore, selectThemeMode } from '../../stores/themeStore';
import { THEME } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

export const ThemeToggle: React.FC = () => {
  const themeMode = useThemeStore(selectThemeMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  const getThemeIcon = () => {
    return themeMode === 'dark' ? '🌙' : '☀️';
  };

  const getThemeText = () => {
    return themeMode === 'dark' ? 'Dark Mode' : 'Light Mode';
  };

  return (
    <TouchableOpacity onPress={handleToggle} style={styles.container}>
      <GlassCard style={styles.toggleCard}>
        <View style={styles.content}>
          <Text style={styles.icon}>{getThemeIcon()}</Text>
          <Text style={styles.text}>{getThemeText()}</Text>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: THEME.spacing.sm,
  },
  toggleCard: {
    padding: THEME.spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: THEME.spacing.sm,
  },
  text: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.primary,
    fontWeight: '600',
  },
});



