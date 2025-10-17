// Enhanced MusicRewards App with Bonus Features
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, AppRegistry, ScrollView, Alert } from 'react-native';
import { useMusicStore, selectChallenges, selectLoadChallenges } from './src/stores/musicStore';
import { useUserStore, selectTotalPoints, selectLevel, selectStreak, selectAddPoints, selectUpdateStreak } from './src/stores/userStore';
import { useAchievementsStore, selectAchievements, selectUnlockedAchievements, selectCheckAchievements } from './src/stores/achievementsStore';
import { useDailyChallengesStore, selectDailyChallenges, selectGenerateDailyChallenges, selectUpdateChallengeProgress, selectCompleteChallenge } from './src/stores/dailyChallengesStore';
import { useSettingsStore, selectThemeMode, selectSetThemeMode } from './src/stores/settingsStore';
import { useMusicPlayer } from './src/hooks/useMusicPlayer';
import { usePointsCounter } from './src/hooks/usePointsCounter';
import { AnimatedVisualizer } from './src/components/ui/AnimatedVisualizer';
import { OfflineIndicator } from './src/components/ui/OfflineIndicator';
import { ShareButton } from './src/components/ui/ShareButton';
import { THEME } from './src/constants/theme';
import type { MusicChallenge } from './src/types';

// Enhanced App Component with Bonus Features
function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const challenges = useMusicStore(selectChallenges);
  const loadChallenges = useMusicStore(selectLoadChallenges);
  
  // User store
  const totalPoints = useUserStore(selectTotalPoints);
  const level = useUserStore(selectLevel);
  const streak = useUserStore(selectStreak);
  const addPoints = useUserStore(selectAddPoints);
  const updateStreak = useUserStore(selectUpdateStreak);
  
  // Achievements store
  const achievements = useAchievementsStore(selectAchievements);
  const unlockedAchievements = useAchievementsStore(selectUnlockedAchievements);
  const checkAchievements = useAchievementsStore(selectCheckAchievements);
  
  // Daily challenges store
  const dailyChallenges = useDailyChallengesStore(selectDailyChallenges);
  const generateDailyChallenges = useDailyChallengesStore(selectGenerateDailyChallenges);
  const updateChallengeProgress = useDailyChallengesStore(selectUpdateChallengeProgress);
  const completeChallenge = useDailyChallengesStore(selectCompleteChallenge);
  
  // Settings store
  const themeMode = useSettingsStore(selectThemeMode);
  const setThemeMode = useSettingsStore(selectSetThemeMode);
  
  // Move audio and points management to App level to persist across navigation
  const { play, pause, resume, seekTo, stop, isPlaying, currentTrack, currentPosition, duration, loading, error } = useMusicPlayer();
  const { currentPoints, pointsEarned, progress, isActive, startCounting, stopCounting, resetProgress } = usePointsCounter();

  useEffect(() => {
    loadChallenges();
    generateDailyChallenges();
  }, [loadChallenges, generateDailyChallenges]);

  // Check achievements when points or progress changes
  useEffect(() => {
    const completedChallengesCount = challenges.filter(c => c.completed).length;
    const totalListeningTime = currentPosition; // Simplified for demo
    
    checkAchievements({
      totalPoints,
      completedChallenges: completedChallengesCount,
      streak,
      totalListeningTime,
    });
  }, [totalPoints, challenges, streak, currentPosition, checkAchievements]);

  // Update daily challenge progress
  useEffect(() => {
    if (isActive && currentPosition > 0) {
      // Update listening duration challenges
      dailyChallenges.forEach(challenge => {
        if (challenge.challengeType === 'listen_duration' && !challenge.completed) {
          updateChallengeProgress(challenge.id, currentPosition);
          
          // Check if daily challenge is completed
          if (currentPosition >= challenge.requirement) {
            completeChallenge(challenge.id);
            Alert.alert(
              'Daily Challenge Completed! 🎉',
              `You earned ${challenge.reward} bonus points!`,
              [{ text: 'Awesome!' }]
            );
          }
        }
      });
    }
  }, [currentPosition, isActive, dailyChallenges, updateChallengeProgress, completeChallenge]);

  // Handle music challenge completion
  useEffect(() => {
    if (progress >= 90 && isActive) {
      // Music challenge is 90% complete, mark as completed
      if (currentTrack) {
        // This would typically update the music store to mark challenge as completed
        console.log('Challenge completed:', currentTrack.title);
        
        // Update daily challenge progress for "complete_challenges" type
        dailyChallenges.forEach(dailyChallenge => {
          if (dailyChallenge.challengeType === 'complete_challenges' && !dailyChallenge.completed) {
            const newProgress = dailyChallenge.progress + 1;
            updateChallengeProgress(dailyChallenge.id, newProgress);
            
            // Check if daily challenge is completed
            if (newProgress >= dailyChallenge.requirement) {
              completeChallenge(dailyChallenge.id);
              Alert.alert(
                'Daily Challenge Completed! 🎉',
                `You earned ${dailyChallenge.reward} bonus points!`,
                [{ text: 'Awesome!' }]
              );
            }
          }
        });
      }
    }
  }, [progress, isActive, currentTrack, dailyChallenges, updateChallengeProgress, completeChallenge]);

  const navigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handlePlayChallenge = async (challenge: MusicChallenge) => {
    try {
      console.log('Playing challenge:', challenge.title);
      console.log('About to call play function');
      
      // Stop any currently playing audio before starting new one
      if (isPlaying) {
        console.log('Stopping current audio before playing new challenge');
        await stop();
        stopCounting();
      }
      
      const result = await play(challenge);
      console.log('Play function completed:', result);
      startCounting({
        pointsPerSecond: challenge.points / challenge.duration,
        maxPoints: challenge.points,
        challengeId: challenge.id,
      });
      
      // Update streak when starting a challenge
      updateStreak();
      
      // Update daily challenge progress for "complete_challenges" type
      dailyChallenges.forEach(dailyChallenge => {
        if (dailyChallenge.challengeType === 'complete_challenges' && !dailyChallenge.completed) {
          const newProgress = dailyChallenge.progress + 1;
          updateChallengeProgress(dailyChallenge.id, newProgress);
          
          // Check if daily challenge is completed
          if (newProgress >= dailyChallenge.requirement) {
            completeChallenge(dailyChallenge.id);
            Alert.alert(
              'Daily Challenge Completed! 🎉',
              `You earned ${dailyChallenge.reward} bonus points!`,
              [{ text: 'Awesome!' }]
            );
          }
        }
      });
      
      navigate('player');
    } catch (error) {
      console.error('Failed to play challenge:', error);
    }
  };

  const handlePointsEarned = (points: number) => {
    addPoints(points);
    
    // Update daily challenge progress for points
    dailyChallenges.forEach(challenge => {
      if (challenge.challengeType === 'earn_points' && !challenge.completed) {
        updateChallengeProgress(challenge.id, totalPoints + points);
      }
    });
  };

  const HomeScreen = () => {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🎵 MusicRewards</Text>
          <Text style={styles.subtitle}>Earn points by listening to music!</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>Level {level}</Text>
            <Text style={styles.statText}>{totalPoints} points</Text>
            <Text style={styles.statText}>🔥 {streak} day streak</Text>
          </View>
        </View>

        {/* Daily Challenges Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Daily Challenges</Text>
          {dailyChallenges.length > 0 ? (
            dailyChallenges.map((challenge) => (
              <View key={challenge.id} style={[styles.dailyChallengeCard, challenge.completed && styles.completedCard]}>
                <Text style={styles.dailyChallengeIcon}>{challenge.icon}</Text>
                <View style={styles.dailyChallengeContent}>
                  <Text style={styles.dailyChallengeTitle}>{challenge.title}</Text>
                  <Text style={styles.dailyChallengeDesc}>{challenge.description}</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${(challenge.progress / challenge.requirement) * 100}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {challenge.progress}/{challenge.requirement}
                    </Text>
                  </View>
                </View>
                <View style={styles.dailyChallengeActions}>
                  <Text style={styles.dailyChallengeReward}>+{challenge.reward}</Text>
                  {challenge.challengeType === 'complete_challenges' && (
                    <TouchableOpacity 
                      style={[styles.dailyPlayButton, challenge.completed && styles.dailyPlayButtonCompleted]}
                      onPress={() => {
                        // Navigate to music challenges to complete this daily challenge
                        Alert.alert(
                          'Complete Daily Challenge',
                          'Play any music challenge to progress this daily challenge!',
                          [{ text: 'OK' }]
                        );
                      }}
                    >
                      <Text style={styles.dailyPlayButtonText}>
                        {challenge.completed ? '✅ Done' : '🎵 Play'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noChallengesText}>No daily challenges available</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎵 Music Challenges</Text>
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
      </ScrollView>
    );
  };

  const PlayerScreen = () => {
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
          {/* Track Info */}
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>{currentTrack?.title || 'No Track'}</Text>
            <Text style={styles.trackArtist}>by {currentTrack?.artist || 'Unknown Artist'}</Text>
            <Text style={styles.trackDescription}>{currentTrack?.description}</Text>
          </View>

          {/* Animated Visualizer */}
          <AnimatedVisualizer 
            isPlaying={isPlaying} 
            intensity={isPlaying ? 0.8 : 0.1}
            height={120}
          />

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${duration > 0 ? (currentPosition / duration) * 100 : 0}%` }
                ]} 
              />
            </View>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          {/* Points Counter */}
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsText}>Points Earned</Text>
            <Text style={styles.pointsValue}>+{pointsEarned}</Text>
            <Text style={styles.progressText}>Progress: {Math.round(progress)}%</Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={() => seekTo(Math.max(0, currentPosition - 15))}>
              <Text style={styles.controlButtonText}>⏪ 15s</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.playPauseButton} 
              onPress={isPlaying ? pause : resume}
            >
              <Text style={styles.playPauseButtonText}>
                {isPlaying ? '⏸️' : '▶️'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={() => seekTo(Math.min(duration, currentPosition + 15))}>
              <Text style={styles.controlButtonText}>15s ⏩</Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error: {error}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const ProfileScreen = () => {
    const unlockedCount = unlockedAchievements.length;
    const totalAchievements = achievements.length;
    const completedChallenges = challenges.filter(c => c.completed).length;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>👤 Profile</Text>
          <Text style={styles.subtitle}>Your music journey</Text>
        </View>
        
        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Achievements ({unlockedCount}/{totalAchievements})</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementCard, 
                  achievement.unlocked && styles.unlockedAchievement
                ]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementPoints}>+{achievement.points}</Text>
                {achievement.unlocked && (
                  <ShareButton 
                    message={`I just unlocked "${achievement.title}" achievement in MusicRewards! ${achievement.description}`}
                    style={styles.shareButton}
                    textStyle={styles.shareButtonText}
                  />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Progress</Text>
          <View style={styles.progressCard}>
            <Text style={styles.progressText}>Challenges Completed: {completedChallenges}/{challenges.length}</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(completedChallenges / challenges.length) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Settings</Text>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              const newTheme = themeMode === 'dark' ? 'light' : 'dark';
              setThemeMode(newTheme);
            }}
          >
            <Text style={styles.settingText}>Theme: {themeMode === 'dark' ? '🌙 Dark' : '☀️ Light'}</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

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
      <OfflineIndicator position="top" />
      {renderScreen()}
      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={[styles.navButton, currentScreen === 'home' && styles.navButtonActive]}
          onPress={() => navigate('home')}
        >
          <Text style={[styles.navButtonText, currentScreen === 'home' && styles.navButtonTextActive]}>
            🏠 Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, currentScreen === 'profile' && styles.navButtonActive]}
          onPress={() => navigate('profile')}
        >
          <Text style={[styles.navButtonText, currentScreen === 'profile' && styles.navButtonTextActive]}>
            👤 Profile
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
  // New styles for bonus features
  section: {
    marginBottom: THEME.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: THEME.spacing.sm,
  },
  statText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    fontWeight: '600',
  },
  dailyChallengeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: THEME.colors.success,
  },
  dailyChallengeIcon: {
    fontSize: 24,
    marginRight: THEME.spacing.sm,
  },
  dailyChallengeContent: {
    flex: 1,
  },
  dailyChallengeTitle: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs,
  },
  dailyChallengeDesc: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.xs,
  },
  dailyChallengeReward: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.secondary,
    fontWeight: 'bold',
  },
  dailyChallengeActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: 80,
  },
  dailyPlayButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.sm,
    marginTop: THEME.spacing.xs,
  },
  dailyPlayButtonCompleted: {
    backgroundColor: THEME.colors.success,
  },
  dailyPlayButtonText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.fonts.sizes.xs,
    fontWeight: '600',
  },
  noChallengesText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  pointsValue: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.secondary,
    marginBottom: THEME.spacing.xs,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: THEME.spacing.lg,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: THEME.spacing.xs,
  },
  statNumber: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.xs,
  },
  statLabel: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    alignItems: 'center',
    width: '48%',
    marginBottom: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  unlockedAchievement: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderColor: THEME.colors.warning,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: THEME.spacing.xs,
  },
  achievementTitle: {
    fontSize: THEME.fonts.sizes.sm,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: THEME.spacing.xs,
  },
  achievementPoints: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.secondary,
    marginBottom: THEME.spacing.xs,
  },
  shareButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.xs,
  },
  shareButtonText: {
    fontSize: THEME.fonts.sizes.xs,
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  settingItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  settingText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.primary,
  },
  settingArrow: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
  },
});

export default App;
