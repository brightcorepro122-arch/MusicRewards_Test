// useMusicPlayer hook - Integrates react-native-track-player with Zustand
import { useCallback, useEffect, useState } from 'react';
import { useMusicStore, selectCurrentTrack, selectIsPlaying } from '../stores/musicStore';
import { useUserStore } from '../stores/userStore';
import type { MusicChallenge, UseMusicPlayerReturn } from '../types';

// Conditional imports for TrackPlayer (only works in development builds, not Expo Go)
let TrackPlayer: any = null;
let State: any = null;
let usePlaybackState: any = null;
let useProgress: any = null;
let Event: any = null;
let useTrackPlayerEvents: any = null;

// Check if we're in Expo Go environment
const isExpoGo = typeof __DEV__ !== 'undefined' && __DEV__;

if (!isExpoGo) {
  try {
    const trackPlayerModule = require('react-native-track-player');
    TrackPlayer = trackPlayerModule.default;
    State = trackPlayerModule.State;
    usePlaybackState = trackPlayerModule.usePlaybackState;
    useProgress = trackPlayerModule.useProgress;
    Event = trackPlayerModule.Event;
    useTrackPlayerEvents = trackPlayerModule.useTrackPlayerEvents;
  } catch (error) {
    console.log('TrackPlayer hooks not available - using mock implementations');
  }
} else {
  console.log('TrackPlayer hooks disabled in Expo Go - using mock implementations');
}

export const useMusicPlayer = (): UseMusicPlayerReturn => {
  // TrackPlayer hooks (with fallbacks for Expo Go)
  const playbackState = usePlaybackState ? usePlaybackState() : { state: 1 }; // State.Paused = 1
  const progress = useProgress ? useProgress() : { position: 0, duration: 0 };
  
  // Local state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Zustand store selectors
  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const setCurrentTrack = useMusicStore((state) => state.setCurrentTrack);
  const setIsPlaying = useMusicStore((state) => state.setIsPlaying);
  const setCurrentPosition = useMusicStore((state) => state.setCurrentPosition);
  const updateProgress = useMusicStore((state) => state.updateProgress);
  const markChallengeComplete = useMusicStore((state) => state.markChallengeComplete);
  const addPoints = useUserStore((state) => state.addPoints);
  const completeChallenge = useUserStore((state) => state.completeChallenge);

  // Track playback state changes
  useEffect(() => {
    if (!TrackPlayer || !State) return; // Skip if TrackPlayer not available
    
    // Some versions of usePlaybackState may return an object, so extract value if needed
    let stateValue: any = playbackState;
    if (typeof playbackState === 'object' && playbackState !== null && 'state' in playbackState) {
      stateValue = playbackState.state;
    }
    const isCurrentlyPlaying = stateValue === State.Playing;
    if (isCurrentlyPlaying !== isPlaying) {
      setIsPlaying(isCurrentlyPlaying);
    }
  }, [playbackState, isPlaying, setIsPlaying]);

  // Update position and calculate progress/points
  useEffect(() => {
    if (currentTrack && progress.position > 0) {
      setCurrentPosition(progress.position);
      
      // Calculate progress percentage
      const progressPercentage = (progress.position / progress.duration) * 100;
      updateProgress(currentTrack.id, progressPercentage);
      
      // Check if track is completed (90% threshold to account for small timing issues)
      if (progressPercentage >= 90 && !currentTrack.completed) {
        markChallengeComplete(currentTrack.id);
        completeChallenge(currentTrack.id);
        addPoints(currentTrack.points);
      }
    }
  }, [progress.position, progress.duration, currentTrack, setCurrentPosition, updateProgress, markChallengeComplete, completeChallenge, addPoints]);

  // Handle track player events (only if TrackPlayer is available)
  if (useTrackPlayerEvents && Event) {
    useTrackPlayerEvents([Event.PlaybackError], (event) => {
      if (event.type === Event.PlaybackError) {
        setError(`Playback error: ${event.message}`);
        setLoading(false);
      }
    });
  }

  const play = useCallback(async (track: MusicChallenge) => {
    if (!TrackPlayer) {
      console.log('TrackPlayer not available - simulating play');
      setCurrentTrack(track);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Reset and add new track
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: track.id,
        url: track.audioUrl,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
      });
      
      // Start playback
      await TrackPlayer.play();
      setCurrentTrack(track);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Playback failed';
      setError(errorMessage);
      console.error('TrackPlayer error:', err);
    } finally {
      setLoading(false);
    }
  }, [setCurrentTrack]);

  const pause = useCallback(async () => {
    if (!TrackPlayer) return;
    try {
      await TrackPlayer.pause();
    } catch (err) {
      console.error('Pause error:', err);
    }
  }, []);

  const seekTo = useCallback(async (seconds: number) => {
    if (!TrackPlayer) return;
    try {
      await TrackPlayer.seekTo(seconds);
    } catch (err) {
      console.error('Seek error:', err);
    }
  }, []);

  const resume = useCallback(async () => {
    if (!TrackPlayer) return;
    try {
      await TrackPlayer.play();
    } catch (err) {
      console.error('Resume error:', err);
    }
  }, []);

  // Extract value for isPlaying return as well
  let stateValue: any = playbackState;
  if (typeof playbackState === 'object' && playbackState !== null && 'state' in playbackState) {
    stateValue = playbackState.state;
  }
  
  return {
    isPlaying: State ? stateValue === State.Playing : false,
    currentTrack,
    currentPosition: progress.position,
    duration: progress.duration,
    play,
    pause,
    seekTo,
    resume,
    loading,
    error,
  };
};