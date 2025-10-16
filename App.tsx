// Simple test version of MusicRewards App
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, AppRegistry } from 'react-native';
import { useMusicStore, selectChallenges, selectLoadChallenges } from './src/stores/musicStore';
import { useMusicPlayer } from './src/hooks/useMusicPlayer';
import { usePointsCounter } from './src/hooks/usePointsCounter';
import { THEME } from './src/constants/theme';
import type { MusicChallenge } from './src/types';

// Simple App Component
function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const challenges = useMusicStore(selectChallenges);
  const loadChallenges = useMusicStore(selectLoadChallenges);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const navigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  const HomeScreen = () => {
    const { play, loading } = useMusicPlayer();
    const { currentPoints, pointsEarned, progress, isActive, startCounting } = usePointsCounter();

    const handlePlayChallenge = async (challenge: MusicChallenge) => {
      try {
        console.log('Playing challenge:', challenge.title);
        console.log('About to call play function');
        const result = await play(challenge);
        console.log('Play function completed:', result);
        startCounting({
          pointsPerSecond: challenge.points / challenge.duration,
          maxPoints: challenge.points,
          challengeId: challenge.id,
        });
        navigate('player');
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
        
        <View style={styles.challengesContainer}>
          <Text style={styles.sectionTitle}>Available Challenges:</Text>
          {challenges.map((challenge) => (
            <View key={challenge.id} style={styles.challengeCard}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeArtist}>by {challenge.artist}</Text>
              <Text style={styles.challengePoints}>+{challenge.points} points</Text>
              <TouchableOpacity 
                style={[styles.playButton, loading && styles.playButtonDisabled]}
                onPress={() => handlePlayChallenge(challenge)}
                disabled={loading}
              >
                <Text style={styles.playButtonText}>
                  {loading ? '⏳ Loading...' : '▶️ Play'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const PlayerScreen = () => {
    const { currentTrack, isPlaying, currentPosition, duration, pause, resume, seekTo, loading, error } = useMusicPlayer();
    const { currentPoints, pointsEarned, progress, isActive } = usePointsCounter();

    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigate('home')} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🎵 Player</Text>
        </View>
        
        <View style={styles.playerContent}>
          <Text style={styles.playerText}>Audio Player</Text>
          <Text style={styles.playerText}>Track: {currentTrack?.title || 'None'}</Text>
          <Text style={styles.playerText}>Playing: {isPlaying ? 'Yes' : 'No'}</Text>
          <Text style={styles.playerText}>Position: {formatTime(currentPosition)}</Text>
          <Text style={styles.playerText}>Duration: {formatTime(duration)}</Text>
          <Text style={styles.playerText}>Points: {currentPoints}</Text>
          <Text style={styles.playerText}>Earned: +{pointsEarned}</Text>
          <Text style={styles.playerText}>Progress: {Math.round(progress)}%</Text>
          <Text style={styles.playerText}>Active: {isActive ? 'Yes' : 'No'}</Text>
          {error && <Text style={styles.errorText}>Error: {error}</Text>}
        </View>
      </View>
    );
  };

  const ProfileScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 Profile</Text>
        <Text style={styles.subtitle}>Your music journey</Text>
      </View>
      
      <View style={styles.profileContent}>
        <Text style={styles.profileText}>Total Points: 0</Text>
        <Text style={styles.profileText}>Level: 1</Text>
        <Text style={styles.profileText}>Streak: 0 days</Text>
      </View>
    </View>
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case 'profile':
        return <ProfileScreen />;
      case 'player':
        return <PlayerScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.appContainer}>
      {renderScreen()}
      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={[styles.navButton, currentScreen === 'home' && styles.navButtonActive]}
          onPress={() => navigate('home')}
        >
          <Text style={[styles.navButtonText, currentScreen === 'home' && styles.navButtonTextActive]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, currentScreen === 'profile' && styles.navButtonActive]}
          onPress={() => navigate('profile')}
        >
          <Text style={[styles.navButtonText, currentScreen === 'profile' && styles.navButtonTextActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Register the main component
AppRegistry.registerComponent('main', () => App);

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
    padding: THEME.spacing.md,
  },
  header: {
    padding: THEME.spacing.lg,
    alignItems: 'center',
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
  },
  challengesContainer: {
    flex: 1,
    padding: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
  },
  challengeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
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
    marginBottom: THEME.spacing.xs,
  },
  challengePoints: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.secondary,
    marginBottom: THEME.spacing.sm,
  },
  playButton: {
    backgroundColor: THEME.colors.primary,
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    alignItems: 'center',
  },
  playButtonText: {
    color: THEME.colors.text.primary,
    fontWeight: 'bold',
  },
  backButton: {
    padding: THEME.spacing.sm,
  },
  backButtonText: {
    color: THEME.colors.primary,
    fontSize: THEME.fonts.sizes.md,
  },
  playerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  playerText: {
    fontSize: THEME.fonts.sizes.lg,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
  },
  profileContent: {
    flex: 1,
    padding: THEME.spacing.lg,
  },
  profileText: {
    fontSize: THEME.fonts.sizes.lg,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    backgroundColor: THEME.colors.background,
  },
  navButton: {
    flex: 1,
    padding: THEME.spacing.sm,
    alignItems: 'center',
    marginHorizontal: THEME.spacing.xs,
  },
  navButtonActive: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.sm,
  },
  navButtonText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
  },
  navButtonTextActive: {
    color: THEME.colors.text.primary,
    fontWeight: 'bold',
  },
  playButtonDisabled: {
    opacity: 0.6,
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  trackTitle: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
  },
  trackArtist: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
  },
  trackDescription: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: THEME.spacing.lg,
  },
  timeText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: THEME.colors.border,
    borderRadius: 2,
    marginHorizontal: THEME.spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
    borderRadius: 2,
  },
  pointsContainer: {
    alignItems: 'center',
    marginVertical: THEME.spacing.lg,
  },
  pointsText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.secondary,
    marginBottom: THEME.spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: THEME.spacing.lg,
  },
  controlButton: {
    backgroundColor: THEME.colors.border,
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    minWidth: 60,
    alignItems: 'center',
  },
  controlButtonText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.fonts.sizes.sm,
  },
  playPauseButton: {
    backgroundColor: THEME.colors.primary,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.full,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButtonText: {
    fontSize: THEME.fonts.sizes.xl,
  },
  noTrackText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 76, 76, 0.1)',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.sm,
    marginTop: THEME.spacing.lg,
  },
  errorText: {
    color: THEME.colors.error,
    textAlign: 'center',
  },
});

export default App;
