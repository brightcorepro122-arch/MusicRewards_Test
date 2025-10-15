// usePointsCounter hook - Real-time points tracking during audio playback
import { useCallback, useEffect, useState, useRef } from 'react';
import { useProgress } from 'react-native-track-player';
import type { PointsCounterConfig, UsePointsCounterReturn } from '../types';

export const usePointsCounter = (): UsePointsCounterReturn => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [config, setConfig] = useState<PointsCounterConfig | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const progress = useProgress();
  
  const startCounting = useCallback((newConfig: PointsCounterConfig) => {
    setConfig(newConfig);
    setIsActive(true);
    setCurrentPoints(0);
    setPointsEarned(0);
  }, []);
  
  const stopCounting = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);
  
  const resetProgress = useCallback(() => {
    setCurrentPoints(0);
    setPointsEarned(0);
  }, []);
  
  // Calculate points based on audio progress
  useEffect(() => {
    if (!isActive || !config || !progress.duration || progress.duration === 0) return;
    
    const progressPercentage = (progress.position / progress.duration) * 100;
    const earnedPoints = Math.floor((progressPercentage / 100) * config.totalPoints);
    
    // Only update if we've earned more points
    if (earnedPoints > pointsEarned) {
      setPointsEarned(earnedPoints);
      setCurrentPoints(earnedPoints);
    }
  }, [progress.position, progress.duration, isActive, config, pointsEarned]);
  
  // Auto-stop when track completes
  useEffect(() => {
    if (isActive && config && progress.duration > 0) {
      const progressPercentage = (progress.position / progress.duration) * 100;
      if (progressPercentage >= 100) {
        stopCounting();
      }
    }
  }, [progress.position, progress.duration, isActive, config, stopCounting]);
  
  return {
    currentPoints,
    pointsEarned,
    progress: config && progress.duration > 0 ? (progress.position / progress.duration) * 100 : 0,
    isActive,
    startCounting,
    stopCounting,
    resetProgress,
  };
};
