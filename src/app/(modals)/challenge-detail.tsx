// Challenge detail modal - Individual challenge view with completion tracking
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { GlassCard, GlassButton } from '../../components/ui/GlassCard';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { useChallenges } from '../../hooks/useChallenges';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';

export default function ChallengeDetailModal() {
  const { challengeId } = useLocalSearchParams<{ challengeId: string }>();
  const { challenges, completedChallenges, completeChallenge, loading } = useChallenges();
  const { play, currentTrack, isPlaying } = useMusicPlayer();

  // Find the challenge
  const challenge = challenges.find(c => c.id === challengeId);
  const isCompleted = challenge ? completedChallenges.includes(challenge.id) : false;
  const isCurrentTrack = currentTrack?.id === challengeId;

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return THEME.colors.secondary;
      case 'medium': return THEME.colors.accent;
      case 'hard': return THEME.colors.primary;
      default: return THEME.colors.text.secondary;
    }
  };

  const handlePlayChallenge = async () => {
    if (!challenge) return;
    
    try {
      await play(challenge);
      // Navigate to player modal after starting playback
      router.push('/(modals)/player');
    } catch (error) {
      Alert.alert('Playback Error', 'Failed to start playback. Please try again.');
    }
  };

  const handleCompleteChallenge = async () => {
    if (!challenge) return;
    
    try {
      await completeChallenge(challenge.id);
      Alert.alert(
        'Challenge Completed!', 
        `You earned ${challenge.points} points!`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to complete challenge. Please try again.');
    }
  };

  if (!challenge) {
    return (
      <SafeAreaView style={styles.container}>
        <GlassCard style={styles.errorCard}>
          <Text style={styles.errorText}>Challenge not found</Text>
          <GlassButton
            title="Go Back"
            onPress={() => router.back()}
            variant="primary"
          />
        </GlassCard>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.artist}>{challenge.artist}</Text>
        </View>

        {/* Challenge Info */}
        <GlassCard style={styles.infoCard}>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{formatDuration(challenge.duration)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Points</Text>
              <Text style={[styles.infoValue, { color: THEME.colors.accent }]}>
                {challenge.points}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Difficulty</Text>
              <View style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(challenge.difficulty) }
              ]}>
                <Text style={styles.difficultyText}>
                  {challenge.difficulty.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Description */}
        <GlassCard style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{challenge.description}</Text>
        </GlassCard>

        {/* Progress */}
        <GlassCard style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${challenge.progress}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(challenge.progress)}% Complete
            </Text>
          </View>
        </GlassCard>

        {/* Status */}
        <GlassCard style={styles.statusCard}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusContainer}>
            <Text style={[
              styles.statusText,
              { color: isCompleted ? THEME.colors.secondary : THEME.colors.accent }
            ]}>
              {isCompleted ? '✅ Completed' : isCurrentTrack && isPlaying ? '🎧 Playing' : '⏳ Not Started'}
            </Text>
            {challenge.completedAt && (
              <Text style={styles.completedAt}>
                Completed on {new Date(challenge.completedAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        </GlassCard>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          {!isCompleted && (
            <GlassButton
              title={isCurrentTrack && isPlaying ? "Playing..." : "Play Challenge"}
              onPress={handlePlayChallenge}
              variant="primary"
              style={styles.actionButton}
              disabled={loading}
            />
          )}
          
          {!isCompleted && challenge.progress >= 90 && (
            <GlassButton
              title="Mark as Complete"
              onPress={handleCompleteChallenge}
              variant="secondary"
              style={styles.actionButton}
              loading={loading}
            />
          )}
          
          <GlassButton
            title="Go Back"
            onPress={() => router.back()}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollView: {
    flex: 1,
    padding: THEME.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  title: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: THEME.spacing.xs,
  },
  artist: {
    fontSize: THEME.fonts.sizes.lg,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: THEME.spacing.md,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.tertiary,
    marginBottom: THEME.spacing.xs,
  },
  infoValue: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '600',
    color: THEME.colors.text.primary,
  },
  difficultyBadge: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.sm,
  },
  difficultyText: {
    fontSize: THEME.fonts.sizes.xs,
    fontWeight: 'bold',
    color: THEME.colors.background,
  },
  descriptionCard: {
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
  },
  description: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    lineHeight: 24,
  },
  progressCard: {
    marginBottom: THEME.spacing.md,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: THEME.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
  },
  statusCard: {
    marginBottom: THEME.spacing.lg,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.xs,
  },
  completedAt: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.tertiary,
  },
  actionsContainer: {
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.xl,
  },
  actionButton: {
    marginBottom: THEME.spacing.sm,
  },
  errorCard: {
    margin: THEME.spacing.xl,
    alignItems: 'center',
  },
  errorText: {
    fontSize: THEME.fonts.sizes.lg,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.lg,
    textAlign: 'center',
  },
});

