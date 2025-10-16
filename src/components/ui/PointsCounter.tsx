// PointsCounter component - Real-time points display
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { GlassCard } from './GlassCard';
import { THEME } from '../../constants/theme';

interface PointsCounterProps {
  currentPoints: number;
  pointsEarned: number;
  progress: number;
  isActive: boolean;
  style?: any;
}

export const PointsCounter: React.FC<PointsCounterProps> = ({
  currentPoints,
  pointsEarned,
  progress,
  isActive,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive && pointsEarned > 0) {
      // Animate the points counter
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: pointsEarned,
          duration: 500,
          useNativeDriver: false,
        }),
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
        ]),
      ]).start();
    }
  }, [pointsEarned, isActive, animatedValue, scaleValue]);

  return (
    <GlassCard style={[styles.container, style]}>
      <View style={styles.content}>
        <Text style={styles.label}>Points Earned</Text>
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <Animated.Text style={styles.points}>
            {animatedValue._value.toFixed(0)}
          </Animated.Text>
        </Animated.View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
        {isActive && (
          <Text style={styles.activeText}>🎵 Earning points...</Text>
        )}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.lg,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.sm,
  },
  points: {
    fontSize: THEME.fonts.sizes.xxxl,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.secondary,
    marginBottom: THEME.spacing.md,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: THEME.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: THEME.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.secondary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.muted,
  },
  activeText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.primary,
    marginTop: THEME.spacing.sm,
    fontWeight: THEME.fonts.weights.medium,
  },
});
