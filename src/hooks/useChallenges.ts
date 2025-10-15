// useChallenges hook - Challenge management and completion tracking
import { useCallback, useState } from 'react';
import { useMusicStore, selectChallenges } from '../stores/musicStore';
import { useUserStore, selectCompletedChallenges } from '../stores/userStore';
import type { UseChallengesReturn } from '../types';

export const useChallenges = (): UseChallengesReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Store selectors
  const challenges = useMusicStore(selectChallenges);
  const completedChallenges = useUserStore(selectCompletedChallenges);
  const loadChallenges = useMusicStore((state) => state.loadChallenges);
  const markChallengeComplete = useMusicStore((state) => state.markChallengeComplete);
  const completeChallenge = useUserStore((state) => state.completeChallenge);
  const addPoints = useUserStore((state) => state.addPoints);

  const refreshChallenges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      loadChallenges();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh challenges');
    } finally {
      setLoading(false);
    }
  }, [loadChallenges]);

  const completeChallengeAction = useCallback(async (challengeId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Find the challenge to get points
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // Mark as complete in music store
      markChallengeComplete(challengeId);
      
      // Add to completed challenges in user store
      completeChallenge(challengeId);
      
      // Add points
      addPoints(challenge.points);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete challenge');
    } finally {
      setLoading(false);
    }
  }, [challenges, markChallengeComplete, completeChallenge, addPoints]);

  return {
    challenges,
    completedChallenges,
    loading,
    error,
    refreshChallenges,
    completeChallenge: completeChallengeAction,
  };
};
