// PointsCounter component - Visual points counter with animation
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { GlassCard } from './GlassCard';
import { THEME } from '../../constants/theme';

interface PointsCounterProps {
  currentPoints: number;
  totalPoints: number;
  progress: number; // 0-100
  isActive: boolean;
  style?: any;
}

export const PointsCounter: React.FC<PointsCounterProps> = ({
  currentPoints,
  totalPoints,
  progress,
  isActive,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  // Animate points when they change
  useEffect(() => {
    if (isActive && currentPoints > 0) {
      // Scale animation for points earned
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentPoints, isActive, scaleValue]);

  // Animate progress bar
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedValue]);

  const progressWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <GlassCard style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Points Earned</Text>
        <Animated.View style={[styles.pointsContainer, { transform: [{ scale: scaleValue }] }]}>
          <Text style={styles.currentPoints}>{currentPoints}</Text>
          <Text style={styles.totalPoints}>/{totalPoints}</Text>
        </Animated.View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: progressWidth }
            ]}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>

      {isActive && (
        <View style={styles.statusContainer}>
          <View style={styles.statusIndicator} />
          <Text style={styles.statusText}>Earning points...</Text>
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.lg,
    marginVertical: THEME.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '600',
    color: THEME.colors.text.primary,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentPoints: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.accent,
  },
  totalPoints: {
    fontSize: THEME.fonts.sizes.lg,
    color: THEME.colors.text.secondary,
    marginLeft: 2,
  },
  progressSection: {
    marginBottom: THEME.spacing.sm,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: THEME.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: 3,
  },
  progressText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    textAlign: 'right',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.secondary,
    marginRight: THEME.spacing.xs,
  },
  statusText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    fontStyle: 'italic',
  },
});
