// Web-compatible version of useMusicPlayer hook
import { useCallback, useEffect, useState } from 'react';
import { useMusicStore, selectCurrentTrack, selectIsPlaying } from '../stores/musicStore';
import { useUserStore } from '../stores/userStore';
import type { MusicChallenge, UseMusicPlayerReturn } from '../types';

export const useMusicPlayer = (): UseMusicPlayerReturn => {
  // Local state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Zustand store selectors
  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const setCurrentTrack = useMusicStore((state) => state.setCurrentTrack);
  const setIsPlaying = useMusicStore((state) => state.setIsPlaying);
  const setCurrentPositionStore = useMusicStore((state) => state.setCurrentPosition);
  const updateProgress = useMusicStore((state) => state.updateProgress);
  const markChallengeComplete = useMusicStore((state) => state.markChallengeComplete);
  const addPoints = useUserStore((state) => state.addPoints);
  const completeChallenge = useUserStore((state) => state.completeChallenge);

  // Update position and calculate progress/points
  useEffect(() => {
    if (currentTrack && currentPosition > 0) {
      setCurrentPositionStore(currentPosition);
      
      // Calculate progress percentage
      const progressPercentage = (currentPosition / duration) * 100;
      updateProgress(currentTrack.id, progressPercentage);
      
      // Check if track is completed (90% threshold to account for small timing issues)
      if (progressPercentage >= 90 && !currentTrack.completed) {
        markChallengeComplete(currentTrack.id);
        completeChallenge(currentTrack.id);
        addPoints(currentTrack.points);
      }
    }
  }, [currentPosition, duration, currentTrack, setCurrentPositionStore, updateProgress, markChallengeComplete, completeChallenge, addPoints]);

  const play = useCallback(async (track: MusicChallenge) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create new audio element
      const audio = new Audio(track.audioUrl);
      setAudioElement(audio);
      
      // Set up event listeners
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentPosition(audio.currentTime);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentPosition(0);
      });
      
      audio.addEventListener('error', (e) => {
        setError('Failed to load audio');
        setLoading(false);
      });
      
      // Start playback
      await audio.play();
      setCurrentTrack(track);
      setIsPlaying(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Playback failed';
      setError(errorMessage);
      console.error('Audio playback error:', err);
    } finally {
      setLoading(false);
    }
  }, [setCurrentTrack, setIsPlaying]);

  const pause = useCallback(async () => {
    try {
      if (audioElement) {
        audioElement.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error('Pause error:', err);
    }
  }, [audioElement, setIsPlaying]);

  const seekTo = useCallback(async (seconds: number) => {
    try {
      if (audioElement) {
        audioElement.currentTime = seconds;
        setCurrentPosition(seconds);
      }
    } catch (err) {
      console.error('Seek error:', err);
    }
  }, [audioElement, setCurrentPosition]);

  const resume = useCallback(async () => {
    try {
      if (audioElement) {
        await audioElement.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Resume error:', err);
    }
  }, [audioElement, setIsPlaying]);

  return {
    isPlaying,
    currentTrack,
    currentPosition,
    duration,
    play,
    pause,
    seekTo,
    resume,
    loading,
    error,
  };
};
