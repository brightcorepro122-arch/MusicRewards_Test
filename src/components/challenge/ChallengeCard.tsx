// ChallengeCard component - Individual challenge display
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassCard, GlassButton } from '../ui/GlassCard';
import { THEME } from '../../constants/theme';
import type { ChallengeCardProps } from '../../types';

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onPlay,
  progress = 0,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return THEME.colors.success;
      case 'Medium':
        return THEME.colors.warning;
      case 'Hard':
        return THEME.colors.error;
      default:
        return THEME.colors.text.secondary;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.artist}>by {challenge.artist}</Text>
        </View>
        <View style={styles.metaContainer}>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
            <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
          </View>
          <Text style={styles.points}>+{challenge.points} pts</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>{challenge.description}</Text>
        <View style={styles.details}>
          <Text style={styles.detailText}>Duration: {formatDuration(challenge.duration)}</Text>
          <Text style={styles.detailText}>Category: {challenge.category}</Text>
        </View>
      </View>

      {progress > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}% complete</Text>
        </View>
      )}

      <View style={styles.actions}>
        <GlassButton
          title={challenge.completed ? 'Completed ✓' : 'Play Challenge'}
          onPress={() => onPlay(challenge)}
          disabled={challenge.completed}
          variant={challenge.completed ? 'success' : 'primary'}
          style={styles.playButton}
        />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: THEME.spacing.md,
    padding: THEME.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: THEME.spacing.md,
  },
  title: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs,
  },
  artist: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
  },
  metaContainer: {
    alignItems: 'flex-end',
  },
  difficultyBadge: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: THEME.spacing.xs,
  },
  difficultyText: {
    fontSize: THEME.fonts.sizes.xs,
    fontWeight: THEME.fonts.weights.semibold,
    color: THEME.colors.text.primary,
  },
  points: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.secondary,
  },
  content: {
    marginBottom: THEME.spacing.md,
  },
  description: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    lineHeight: 20,
    marginBottom: THEME.spacing.sm,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.text.muted,
  },
  progressContainer: {
    marginBottom: THEME.spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: THEME.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: THEME.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.secondary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.text.muted,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  playButton: {
    flex: 1,
  },
});
