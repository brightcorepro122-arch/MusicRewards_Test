// useMusicPlayer hook - Integrates expo-av with Zustand
import { useCallback, useEffect, useState, useRef } from 'react';
import { useMusicStore, selectCurrentTrack, selectIsPlaying, selectSetCurrentPosition, selectSetIsPlaying, selectUpdateProgress, selectMarkChallengeComplete } from '../stores/musicStore';
import { useUserStore, selectAddPoints, selectCompleteChallenge } from '../stores/userStore';
import type { MusicChallenge, UseMusicPlayerReturn } from '../types';
import { Audio } from 'expo-av';
import { usePointsCounter } from './usePointsCounter';

export const useMusicPlayer = (): UseMusicPlayerReturn => {
  // Zustand store selectors
  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const setCurrentTrack = useMusicStore((state) => state.setCurrentTrack);
  const setIsPlaying = useMusicStore(selectSetIsPlaying);
  const setCurrentPosition = useMusicStore(selectSetCurrentPosition);
  const updateMusicStoreProgress = useMusicStore(selectUpdateProgress);
  const markChallengeComplete = useMusicStore(selectMarkChallengeComplete);
  const addPoints = useUserStore(selectAddPoints);
  const completeChallenge = useUserStore(selectCompleteChallenge);

  // Local state for expo-av
  const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null);
  const [currentPositionLocal, setCurrentPositionLocal] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use Points Counter hook
  const { updateProgress: updatePointsCounterProgress } = usePointsCounter();

  // Load and unload sound object
  useEffect(() => {
    return soundObject
      ? () => {
          console.log('Unloading Sound');
          soundObject.unloadAsync();
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      : undefined;
  }, [soundObject]);

  // Update progress interval
  useEffect(() => {
    if (isPlaying && soundObject) {
      intervalRef.current = setInterval(async () => {
        try {
          const status = await soundObject.getStatusAsync();
          console.log('Audio status update:', {
            isLoaded: status.isLoaded,
            isPlaying: status.isPlaying,
            positionMillis: status.positionMillis,
            durationMillis: status.durationMillis
          });
          
          if (status.isLoaded) {
            const positionSeconds = status.positionMillis / 1000;
            const durationSeconds = status.durationMillis ? status.durationMillis / 1000 : 0;
            const progressPercent = status.durationMillis ? (status.positionMillis / status.durationMillis) * 100 : 0;

            console.log('Updating progress:', {
              positionSeconds,
              durationSeconds,
              progressPercent
            });

            setCurrentPositionLocal(positionSeconds);
            setDuration(durationSeconds);
            setCurrentPosition(positionSeconds); // Update Zustand
            updateMusicStoreProgress(currentTrack!.id, progressPercent); // Update music store progress
            updatePointsCounterProgress(positionSeconds, durationSeconds); // Update points counter progress

            // Check for completion (90% threshold)
            if (currentTrack && status.durationMillis && status.positionMillis / status.durationMillis >= 0.9 && !currentTrack.completed) {
              markChallengeComplete(currentTrack.id);
              completeChallenge(currentTrack.id);
              addPoints(currentTrack.points);
              setIsPlaying(false);
              await soundObject.stopAsync();
            }
          }
        } catch (err) {
          console.error('Progress update error:', err);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, soundObject, currentTrack, setCurrentPosition, updateMusicStoreProgress, markChallengeComplete, completeChallenge, addPoints, setIsPlaying, updatePointsCounterProgress]);

  const play = useCallback(async (track: MusicChallenge) => {
    try {
      console.log('Starting to play track:', track.title);
      setLoading(true);
      setError(null);
      
      // Unload previous sound if exists
      if (soundObject) {
        console.log('Unloading previous sound');
        await soundObject.unloadAsync();
      }

      // Create new sound object
      console.log('Creating new sound object for:', track.audioUrl);
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { shouldPlay: true }
      );
      
      console.log('Sound created, setting state');
      setSoundObject(sound);
      setCurrentTrack(track);
      setIsPlaying(true);
      
      // Get initial status
      const status = await sound.getStatusAsync();
      console.log('Initial audio status:', {
        isLoaded: status.isLoaded,
        isPlaying: status.isPlaying,
        positionMillis: status.positionMillis,
        durationMillis: status.durationMillis
      });
      
      if (status.isLoaded) {
        setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
        setCurrentPositionLocal(status.positionMillis / 1000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Playback failed';
      setError(errorMessage);
      console.error('Audio playback error:', err);
      setIsPlaying(false);
    } finally {
      setLoading(false);
    }
  }, [soundObject, setCurrentTrack, setIsPlaying]);

  const pause = useCallback(async () => {
    try {
      if (soundObject) {
        await soundObject.pauseAsync();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error('Pause error:', err);
    }
  }, [soundObject, setIsPlaying]);

  const resume = useCallback(async () => {
    try {
      if (soundObject) {
        await soundObject.playAsync();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Resume error:', err);
    }
  }, [soundObject, setIsPlaying]);

  const seekTo = useCallback(async (seconds: number) => {
    try {
      if (soundObject) {
        await soundObject.setPositionAsync(seconds * 1000);
        setCurrentPositionLocal(seconds);
        setCurrentPosition(seconds);
      }
    } catch (err) {
      console.error('Seek error:', err);
    }
  }, [soundObject, setCurrentPosition]);

  return {
    isPlaying,
    currentTrack,
    currentPosition: currentPositionLocal,
    duration,
    play,
    pause,
    seekTo,
    resume,
    loading,
    error,
  };
};