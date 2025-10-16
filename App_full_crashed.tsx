// MusicRewards App - Complete implementation with all features
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, AppRegistry } from 'react-native';
import { GlassCard, GlassButton } from './src/components/ui/GlassCard';
import { ChallengeList } from './src/components/challenge/ChallengeList';
import { PointsCounter } from './src/components/ui/PointsCounter';
import { AudioVisualizer } from './src/components/ui/AudioVisualizer';
import { useMusicPlayer } from './src/hooks/useMusicPlayer';
import { usePointsCounter } from './src/hooks/usePointsCounter';
import { useMusicStore, selectChallenges, selectChallengeProgress, selectLoadChallenges } from './src/stores/musicStore';
import { useUserStore, selectTotalPoints, selectLevel, selectStreak, selectUpdateStreak } from './src/stores/userStore';
import { THEME } from './src/constants/theme';
import type { MusicChallenge } from './src/types';

// Audio setup for expo-av (works in Expo Go)
let Audio: any = null;

try {
  Audio = require('expo-av').Audio;
  console.log('expo-av loaded successfully - audio features enabled');
} catch (error) {
  console.log('expo-av not available - audio features disabled');
}

// Home Screen Component
const HomeScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const challenges = useMusicStore(selectChallenges);
  const challengeProgress = useMusicStore(selectChallengeProgress);
  const loadChallenges = useMusicStore(selectLoadChallenges);
  const { play, loading } = useMusicPlayer();
  const { startCounting } = usePointsCounter();

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const handlePlayChallenge = async (challenge: MusicChallenge) => {
    try {
      await play(challenge);
      startCounting({
        pointsPerSecond: challenge.points / challenge.duration,
        maxPoints: challenge.points,
        challengeId: challenge.id,
      });
      onNavigate('player');
    } catch (error) {
      console.error('Failed to play challenge:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎵 MusicRewards</Text>
        <Text style={styles.subtitle}>Earn points by listening to music!</Text>
      </View>

      <ChallengeList
        challenges={challenges}
        onPlayChallenge={handlePlayChallenge}
        challengeProgress={challengeProgress}
        refreshing={loading}
        onRefresh={loadChallenges}
      />
    </View>
  );
};

// Player Screen Component
const PlayerScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const { currentTrack, isPlaying, currentPosition, duration, pause, resume, seekTo, loading, error } = useMusicPlayer();
  const { currentPoints, pointsEarned, progress, isActive } = usePointsCounter();
  const [showConfetti, setShowConfetti] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (event: any) => {
    const { locationX } = event.nativeEvent;
    const progressBarWidth = 300; // Approximate width
    const progress = locationX / progressBarWidth;
    const newPosition = progress * duration;
    seekTo(newPosition);
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  useEffect(() => {
    if (currentTrack?.completed && !showConfetti) {
      setShowConfetti(true);
    }
  }, [currentTrack?.completed, showConfetti]);

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.noTrackText}>No track selected</Text>
          <GlassButton
            title="Back to Challenges"
            onPress={() => onNavigate('home')}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {showConfetti && (
        <View style={styles.confettiContainer}>
          <Text style={styles.confettiText}>🎉 Challenge Complete! 🎉</Text>
        </View>
      )}
      
      <View style={styles.playerContainer}>
        <View style={styles.playerHeader}>
          <GlassButton
            title="← Back"
            onPress={() => onNavigate('home')}
            variant="secondary"
            size="sm"
          />
          <Text style={styles.playerTitle}>Now Playing</Text>
        </View>

        <GlassCard style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{currentTrack.title}</Text>
          <Text style={styles.trackArtist}>by {currentTrack.artist}</Text>
          <Text style={styles.trackDescription}>{currentTrack.description}</Text>
        </GlassCard>

        <AudioVisualizer isPlaying={isPlaying} />

        <PointsCounter
          currentPoints={currentPoints}
          pointsEarned={pointsEarned}
          progress={progress}
          isActive={isActive}
          style={styles.pointsCounter}
        />

        <View style={styles.controls}>
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
            <TouchableOpacity style={styles.progressBar} onPress={handleSeek}>
              <View style={styles.progressTrack}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${duration > 0 ? (currentPosition / duration) * 100 : 0}%` }
                  ]} 
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          <View style={styles.playControls}>
            <GlassButton
              title={isPlaying ? '⏸️ Pause' : '▶️ Play'}
              onPress={isPlaying ? pause : resume}
              loading={loading}
              variant="primary"
              size="lg"
            />
          </View>
        </View>

        {error && (
          <GlassCard style={styles.errorCard}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </GlassCard>
        )}
      </View>
    </SafeAreaView>
  );
};

// Profile Screen Component
const ProfileScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const totalPoints = useUserStore(selectTotalPoints);
  const level = useUserStore(selectLevel);
  const streak = useUserStore(selectStreak);
  const updateStreak = useUserStore(selectUpdateStreak);
  const challenges = useMusicStore(selectChallenges);
  const completedChallenges = challenges.filter(c => c.completed);

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 Profile</Text>
        <Text style={styles.subtitle}>Your music journey</Text>
      </View>

      <ScrollView style={styles.profileContent} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalPoints}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Level {level}</Text>
              <Text style={styles.statLabel}>Current Level</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedChallenges.length}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard style={styles.achievementsCard}>
          <Text style={styles.achievementsTitle}>🏆 Achievements</Text>
          <View style={styles.achievementsList}>
            {completedChallenges.map((challenge) => (
              <View key={challenge.id} style={styles.achievementItem}>
                <Text style={styles.achievementText}>✅ {challenge.title}</Text>
                <Text style={styles.achievementPoints}>+{challenge.points} pts</Text>
              </View>
            ))}
            {completedChallenges.length === 0 && (
              <Text style={styles.noAchievementsText}>Complete challenges to earn achievements!</Text>
            )}
          </View>
        </GlassCard>

        <View style={styles.actions}>
          <GlassButton
            title="🎵 Browse Challenges"
            onPress={() => onNavigate('home')}
            variant="primary"
            style={styles.actionButton}
          />
          <GlassButton
            title="🎮 Play Music"
            onPress={() => onNavigate('player')}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

// Main App Component
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
  },
  profileContent: {
    flex: 1,
  },
  header: {
    padding: THEME.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: THEME.fonts.sizes.xxxl,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
  },
  subtitle: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  noTrackText: {
    fontSize: THEME.fonts.sizes.lg,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.lg,
    textAlign: 'center',
  },
  playerContainer: {
    flex: 1,
    padding: THEME.spacing.lg,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  playerTitle: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.text.primary,
    marginLeft: THEME.spacing.md,
  },
  trackInfo: {
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    alignItems: 'center',
  },
  trackTitle: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
  },
  trackArtist: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.sm,
  },
  trackDescription: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  pointsCounter: {
    marginVertical: THEME.spacing.lg,
  },
  controls: {
    marginTop: THEME.spacing.xl,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  timeText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
    marginHorizontal: THEME.spacing.md,
  },
  progressTrack: {
    height: 4,
    backgroundColor: THEME.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
    borderRadius: 2,
  },
  playControls: {
    alignItems: 'center',
  },
  errorCard: {
    marginTop: THEME.spacing.lg,
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.error + '20',
  },
  errorText: {
    color: THEME.colors.error,
    textAlign: 'center',
  },
  statsCard: {
    margin: THEME.spacing.lg,
    padding: THEME.spacing.lg,
  },
  statsTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  statValue: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.xs,
  },
  statLabel: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
  achievementsCard: {
    margin: THEME.spacing.lg,
    padding: THEME.spacing.lg,
  },
  achievementsTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
  },
  achievementsList: {
    minHeight: 100,
  },
  achievementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  achievementText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.primary,
    flex: 1,
  },
  achievementPoints: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.secondary,
    fontWeight: THEME.fonts.weights.semibold,
  },
  noAchievementsText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: THEME.spacing.lg,
  },
  actions: {
    padding: THEME.spacing.lg,
  },
  actionButton: {
    marginBottom: THEME.spacing.md,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
  },
  confettiText: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.secondary,
    textAlign: 'center',
  },
});