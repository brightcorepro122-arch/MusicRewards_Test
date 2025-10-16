// usePointsCounter hook - Real-time points tracking during playback
import { useState, useCallback, useRef, useEffect } from 'react';
import type { PointsCounterConfig, UsePointsCounterReturn } from '../types';

export const usePointsCounter = (): UsePointsCounterReturn => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [progress, setProgress] = useState({ position: 0, duration: 0 });
  const [isActive, setIsActive] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const configRef = useRef<PointsCounterConfig | null>(null);

  const startCounting = useCallback((config: PointsCounterConfig) => {
    configRef.current = config;
    setCurrentPoints(0);
    setPointsEarned(0);
    setIsActive(true);
    
    console.log('Starting points counter with config:', config);
  }, []);

  const stopCounting = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    console.log('Stopped points counter');
  }, []);

  const resetProgress = useCallback(() => {
    setCurrentPoints(0);
    setPointsEarned(0);
    setProgress({ position: 0, duration: 0 });
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const updateProgress = useCallback((position: number, duration: number) => {
    setProgress({ position, duration });
  }, []);

  // Points calculation effect
  useEffect(() => {
    if (isActive && configRef.current && progress.duration > 0) {
      const { pointsPerSecond, maxPoints } = configRef.current;
      const progressPercent = (progress.position / progress.duration) * 100;
      const calculatedPoints = Math.min(
        Math.floor(progress.position * pointsPerSecond),
        maxPoints
      );
      
      setCurrentPoints(calculatedPoints);
      setPointsEarned(calculatedPoints);
    }
  }, [isActive, progress]);

  return {
    currentPoints,
    pointsEarned,
    progress: progress.duration > 0 ? (progress.position / progress.duration) * 100 : 0,
    isActive,
    startCounting,
    stopCounting,
    resetProgress,
    updateProgress,
  };
};