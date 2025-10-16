// Offline indicator component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { THEME } from '../../constants/theme';

export const OfflineIndicator: React.FC = () => {
  const { isConnected, isInternetReachable } = useNetworkStatus();

  if (isConnected && isInternetReachable) {
    return null;
  }

  return (
    <View style={styles.container}>
      <GlassCard style={styles.indicator}>
        <View style={styles.content}>
          <Text style={styles.icon}>📡</Text>
          <Text style={styles.text}>
            {!isConnected ? 'No Connection' : 'Limited Connectivity'}
          </Text>
        </View>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: THEME.spacing.md,
    right: THEME.spacing.md,
    zIndex: 999,
  },
  indicator: {
    padding: THEME.spacing.sm,
    backgroundColor: 'rgba(255, 107, 107, 0.9)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
    marginRight: THEME.spacing.xs,
  },
  text: {
    fontSize: THEME.fonts.sizes.sm,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});



