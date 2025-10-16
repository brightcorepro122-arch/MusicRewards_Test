// Web-specific version of the app without audio player
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { GlassCard, GlassButton } from '../components/ui/GlassCard';
import { useMusicStore, selectChallenges } from '../stores/musicStore';
import { useUserStore, selectTotalPoints, selectCompletedChallenges } from '../stores/userStore';
import { THEME } from '../constants/theme';
import type { MusicChallenge } from '../types';

export default function WebApp() {
  const challenges = useMusicStore(selectChallenges);
  const totalPoints = useUserStore(selectTotalPoints);
  const completedChallenges = useUserStore(selectCompletedChallenges);

  const handlePlayChallenge = (challenge: MusicChallenge) => {
    alert(`Web version: Would play "${challenge.title}" by ${challenge.artist}\n\nNote: Audio playback is limited in web browsers. For full functionality, please use the mobile app with Expo Go.`);
  };

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

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎵 MusicRewards</Text>
        <Text style={styles.subtitle}>React Native Technical Assessment</Text>
        <View style={styles.webNotice}>
          <Text style={styles.webNoticeText}>
            🌐 Web Version - For full audio functionality, use the mobile app with Expo Go
          </Text>
        </View>
      </View>

      {/* Stats Overview */}
      <GlassCard style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedChallenges.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{challenges.length}</Text>
            <Text style={styles.statLabel}>Total Challenges</Text>
          </View>
        </View>
      </GlassCard>

      {/* Challenges List */}
      <GlassCard style={styles.challengesCard}>
        <Text style={styles.sectionTitle}>Music Challenges</Text>
        {challenges.map((challenge) => {
          const isCompleted = completedChallenges.includes(challenge.id);
          return (
            <View key={challenge.id} style={styles.challengeItem}>
              <View style={styles.challengeHeader}>
                <View style={styles.challengeInfo}>
                  <Text style={styles.challengeTitle}>{challenge.title}</Text>
                  <Text style={styles.challengeArtist}>{challenge.artist}</Text>
                </View>
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(challenge.difficulty) }
                ]}>
                  <Text style={styles.difficultyText}>
                    {challenge.difficulty.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.challengeDescription}>{challenge.description}</Text>
              
              <View style={styles.challengeDetails}>
                <Text style={styles.challengeDetail}>Duration: {formatDuration(challenge.duration)}</Text>
                <Text style={styles.challengeDetail}>Points: {challenge.points}</Text>
                <Text style={styles.challengeDetail}>Progress: {Math.round(challenge.progress)}%</Text>
              </View>

              {challenge.progress > 0 && (
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${challenge.progress}%` }
                    ]} 
                  />
                </View>
              )}

              <GlassButton
                title={isCompleted ? 'Completed ✓' : 'Play Challenge (Web Demo)'}
                onPress={() => handlePlayChallenge(challenge)}
                variant={isCompleted ? 'secondary' : 'primary'}
                style={styles.playButton}
              />
            </View>
          );
        })}
      </GlassCard>

      {/* Mobile App Instructions */}
      <GlassCard style={styles.instructionsCard}>
        <Text style={styles.sectionTitle}>📱 For Full Experience</Text>
        <Text style={styles.instructionText}>
          To test the complete app with audio playback, points earning, and all features:
        </Text>
        <View style={styles.instructionSteps}>
          <Text style={styles.instructionStep}>1. Install Expo Go on your phone</Text>
          <Text style={styles.instructionStep}>2. Scan the QR code from the terminal</Text>
          <Text style={styles.instructionStep}>3. Enjoy full audio functionality!</Text>
        </View>
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    alignItems: 'center',
    padding: THEME.spacing.lg,
    paddingTop: THEME.spacing.xl,
  },
  title: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
  },
  subtitle: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  webNotice: {
    backgroundColor: 'rgba(117, 83, 219, 0.1)',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(117, 83, 219, 0.3)',
  },
  webNoticeText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.primary,
    textAlign: 'center',
  },
  statsCard: {
    margin: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  sectionTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.accent,
    marginBottom: THEME.spacing.xs,
  },
  statLabel: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  challengesCard: {
    margin: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  challengeItem: {
    marginBottom: THEME.spacing.lg,
    paddingBottom: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.sm,
  },
  challengeInfo: {
    flex: 1,
    marginRight: THEME.spacing.sm,
  },
  challengeTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs,
  },
  challengeArtist: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
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
  challengeDescription: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.tertiary,
    lineHeight: 20,
    marginBottom: THEME.spacing.md,
  },
  challengeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.md,
  },
  challengeDetail: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: THEME.spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: 2,
  },
  playButton: {
    marginTop: THEME.spacing.sm,
  },
  instructionsCard: {
    margin: THEME.spacing.md,
    marginBottom: THEME.spacing.xl,
  },
  instructionText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
  },
  instructionSteps: {
    alignItems: 'flex-start',
  },
  instructionStep: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
    paddingLeft: THEME.spacing.md,
  },
});

