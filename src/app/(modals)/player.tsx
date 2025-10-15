// Player modal - Full-screen audio player (Expo Router modal)
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  PanGestureHandler,
  State
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler as PanGH } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { GlassCard, GlassButton } from '../../components/ui/GlassCard';
import { AudioVisualizer } from '../../components/ui/AudioVisualizer';
import { ConfettiAnimation } from '../../components/ui/ConfettiAnimation';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { usePointsCounter } from '../../hooks/usePointsCounter';
import { useToast } from '../../hooks/useToast';
import { THEME } from '../../constants/theme';

export default function PlayerModal() {
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSpeedControls, setShowSpeedControls] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const { 
    currentTrack, 
    isPlaying, 
    currentPosition, 
    duration, 
    play, 
    pause, 
    resume, 
    seekTo,
    loading,
    error 
  } = useMusicPlayer();

  const { showSuccess, showError } = useToast();

  const {
    currentPoints,
    pointsEarned,
    progress: pointsProgress,
    isActive: pointsActive,
    startCounting,
    stopCounting,
  } = usePointsCounter();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (!duration || duration === 0) return 0;
    return (currentPosition / duration) * 100;
  };

  const handleSeek = (percentage: number) => {
    if (duration) {
      const newPosition = (percentage / 100) * duration;
      seekTo(newPosition);
    }
  };

  const handlePlayPause = async () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (isPlaying) {
      pause();
      stopCounting();
    } else {
      if (currentTrack) {
        resume();
        // Start points counting when resuming
        startCounting({
          totalPoints: currentTrack.points,
          durationSeconds: currentTrack.duration,
          challengeId: currentTrack.id,
        });
      }
    }
  };

  const handleSpeedChange = (speed: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPlaybackSpeed(speed);
    // Note: TrackPlayer doesn't support speed control in this version
    // This is a UI enhancement for future implementation
  };

  const handleSwipeDown = (event: any) => {
    if (event.nativeEvent.translationY > 100) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.back();
    }
  };

  // Start points counting when track starts playing
  React.useEffect(() => {
    if (currentTrack && isPlaying && !pointsActive) {
      startCounting({
        totalPoints: currentTrack.points,
        durationSeconds: currentTrack.duration,
        challengeId: currentTrack.id,
      });
    }
  }, [currentTrack, isPlaying, pointsActive, startCounting]);

  // Trigger confetti when points are earned
  React.useEffect(() => {
    if (currentPoints > 0 && currentPoints % 50 === 0) {
      setShowConfetti(true);
      showSuccess(`🎉 Earned ${currentPoints} points!`);
    }
  }, [currentPoints, showSuccess]);

  // Show error toast
  React.useEffect(() => {
    if (error) {
      showError(`Playback Error: ${error}`);
    }
  }, [error, showError]);

  if (error) {
    Alert.alert('Playback Error', error);
  }

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <GlassCard style={styles.noTrackCard}>
          <Text style={styles.noTrackText}>No track selected</Text>
          <Text style={styles.noTrackSubtext}>
            Go back and select a challenge to start playing music
          </Text>
        </GlassCard>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGH onGestureEvent={handleSwipeDown}>
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Track Info */}
        <GlassCard style={styles.trackInfoCard}>
          <Text style={styles.trackTitle}>{currentTrack.title}</Text>
          <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
          <Text style={styles.trackDescription}>{currentTrack.description}</Text>
          
          {/* Audio Visualizer */}
          <AudioVisualizer 
            isPlaying={isPlaying} 
            intensity={isPlaying ? 0.7 : 0.1}
          />
          
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsLabel}>Challenge Points</Text>
            <Text style={styles.pointsValue}>{currentTrack.points}</Text>
          </View>

          {/* Live Points Counter */}
          {pointsActive && (
            <View style={styles.livePointsContainer}>
              <Text style={styles.livePointsLabel}>Points Earned</Text>
              <Text style={styles.livePointsValue}>{currentPoints}</Text>
              <Text style={styles.livePointsProgress}>
                {Math.round(pointsProgress)}% of track complete
              </Text>
            </View>
          )}
        </GlassCard>

        {/* Progress Section */}
        <GlassCard style={styles.progressCard}>
          <Text style={styles.progressLabel}>Listening Progress</Text>
          
          {/* Progress Bar */}
          <TouchableOpacity 
            style={styles.progressTrack}
            onPress={(event) => {
              const { locationX, width } = event.nativeEvent as any;
              const percentage = (locationX / width) * 100;
              handleSeek(percentage);
            }}
          >
            <View style={styles.progressBackground}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${getProgress()}%` }
                ]} 
              />
            </View>
          </TouchableOpacity>

          {/* Time Display */}
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          {/* Progress Percentage */}
          <Text style={styles.progressPercentage}>
            {Math.round(getProgress())}% Complete
          </Text>
        </GlassCard>

        {/* Controls */}
        <GlassCard style={styles.controlsCard}>
          <View style={styles.controlsRow}>
            <GlassButton
              title="⏪ -10s"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleSeek(Math.max(0, getProgress() - (10 / duration) * 100));
              }}
              variant="secondary"
              style={styles.controlButton}
            />
            
            <GlassButton
              title={loading ? "..." : isPlaying ? "⏸️ Pause" : "▶️ Play"}
              onPress={handlePlayPause}
              variant="primary"
              style={styles.mainControlButton}
              loading={loading}
            />
            
            <GlassButton
              title="⏩ +10s"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleSeek(Math.min(100, getProgress() + (10 / duration) * 100));
              }}
              variant="secondary"
              style={styles.controlButton}
            />
          </View>

          {/* Playback Speed Controls */}
          <View style={styles.speedControlsContainer}>
            <TouchableOpacity 
              style={styles.speedToggle}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowSpeedControls(!showSpeedControls);
              }}
            >
              <Text style={styles.speedToggleText}>
                Speed: {playbackSpeed}x {showSpeedControls ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            
            {showSpeedControls && (
              <View style={styles.speedButtons}>
                {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
                  <TouchableOpacity
                    key={speed}
                    style={[
                      styles.speedButton,
                      playbackSpeed === speed && styles.speedButtonActive
                    ]}
                    onPress={() => handleSpeedChange(speed)}
                  >
                    <Text style={[
                      styles.speedButtonText,
                      playbackSpeed === speed && styles.speedButtonTextActive
                    ]}>
                      {speed}x
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </GlassCard>

        {/* Challenge Progress */}
        <GlassCard style={styles.challengeCard}>
          <Text style={styles.challengeLabel}>Challenge Status</Text>
          <View style={styles.challengeInfo}>
            <Text style={[
              styles.challengeStatus,
              { color: currentTrack.completed ? THEME.colors.secondary : THEME.colors.accent }
            ]}>
              {currentTrack.completed ? '✅ Completed' : '🎧 In Progress'}
            </Text>
            <Text style={styles.challengeProgress}>
              {Math.round(currentTrack.progress)}% of challenge complete
            </Text>
          </View>
        </GlassCard>
          </ScrollView>
        </SafeAreaView>
      </PanGH>
      
      {/* Confetti Animation */}
      <ConfettiAnimation
        visible={showConfetti}
        onComplete={() => setShowConfetti(false)}
        duration={2000}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    flex: 1,
    padding: THEME.spacing.lg,
    justifyContent: 'space-between',
  },
  noTrackCard: {
    margin: THEME.spacing.xl,
    alignItems: 'center',
  },
  noTrackText: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
  },
  noTrackSubtext: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
  trackInfoCard: {
    alignItems: 'center',
  },
  trackTitle: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: THEME.spacing.xs,
  },
  trackArtist: {
    fontSize: THEME.fonts.sizes.lg,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.md,
  },
  trackDescription: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.tertiary,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
  },
  pointsContainer: {
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  pointsValue: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.accent,
  },
  livePointsContainer: {
    alignItems: 'center',
    marginTop: THEME.spacing.lg,
    padding: THEME.spacing.md,
    backgroundColor: 'rgba(252, 190, 37, 0.1)',
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(252, 190, 37, 0.3)',
  },
  livePointsLabel: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.xs,
  },
  livePointsValue: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.accent,
    marginBottom: THEME.spacing.xs,
  },
  livePointsProgress: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.tertiary,
  },
  progressCard: {
    // Card styling handled by GlassCard
  },
  progressLabel: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '600',
    color: THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  progressTrack: {
    marginBottom: THEME.spacing.md,
  },
  progressBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.sm,
  },
  timeText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  progressPercentage: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.accent,
    textAlign: 'center',
  },
  controlsCard: {
    // Card styling handled by GlassCard
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlButton: {
    flex: 0.25,
    marginHorizontal: THEME.spacing.xs,
  },
  mainControlButton: {
    flex: 0.4,
    marginHorizontal: THEME.spacing.xs,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: THEME.fonts.sizes.sm,
    textAlign: 'center',
    marginTop: THEME.spacing.md,
  },
  challengeCard: {
    // Card styling handled by GlassCard
  },
  challengeLabel: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '600',
    color: THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  challengeInfo: {
    alignItems: 'center',
  },
  challengeStatus: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.xs,
  },
  challengeProgress: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  speedControlsContainer: {
    marginTop: THEME.spacing.md,
    alignItems: 'center',
  },
  speedToggle: {
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: THEME.spacing.sm,
  },
  speedToggleText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.primary,
    fontWeight: '600',
  },
  speedButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: THEME.spacing.xs,
  },
  speedButton: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  speedButtonActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  speedButtonText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.primary,
    fontWeight: '500',
  },
  speedButtonTextActive: {
    color: '#FFFFFF',
  },
});