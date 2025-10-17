// DailyChallengesStore - Zustand store for daily challenges
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MusicChallenge } from '../types';

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  challengeType: 'listen_duration' | 'complete_challenges' | 'earn_points' | 'streak';
  requirement: number;
  reward: number;
  progress: number;
  completed: boolean;
  date: string; // YYYY-MM-DD format
  icon: string;
}

interface DailyChallengesStore {
  // State
  dailyChallenges: DailyChallenge[];
  lastUpdateDate: string | null;
  totalDailyRewards: number;

  // Actions
  generateDailyChallenges: () => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  completeChallenge: (challengeId: string) => void;
  resetDailyChallenges: () => void;
}

// Challenge templates
const CHALLENGE_TEMPLATES = [
  {
    title: 'Morning Melody',
    description: 'Listen to music for 5 minutes',
    challengeType: 'listen_duration' as const,
    requirement: 300, // 5 minutes
    reward: 25,
    icon: '🌅',
  },
  {
    title: 'Challenge Hunter',
    description: 'Complete 2 music challenges',
    challengeType: 'complete_challenges' as const,
    requirement: 2,
    reward: 50,
    icon: '🎯',
  },
  {
    title: 'Point Collector',
    description: 'Earn 100 points today',
    challengeType: 'earn_points' as const,
    requirement: 100,
    reward: 30,
    icon: '💰',
  },
  {
    title: 'Music Marathon',
    description: 'Listen to music for 15 minutes',
    challengeType: 'listen_duration' as const,
    requirement: 900, // 15 minutes
    reward: 75,
    icon: '🏃‍♂️',
  },
  {
    title: 'Streak Keeper',
    description: 'Maintain your listening streak',
    challengeType: 'streak' as const,
    requirement: 1,
    reward: 20,
    icon: '🔥',
  },
  {
    title: 'Challenge Master',
    description: 'Complete 3 music challenges',
    challengeType: 'complete_challenges' as const,
    requirement: 3,
    reward: 100,
    icon: '👑',
  },
];

export const useDailyChallengesStore = create<DailyChallengesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      dailyChallenges: [],
      lastUpdateDate: null,
      totalDailyRewards: 0,

      // Actions
      generateDailyChallenges: () => {
        const today = new Date().toDateString();
        const { lastUpdateDate, dailyChallenges } = get();

        // Only generate new challenges if it's a new day
        if (lastUpdateDate === today) {
          return;
        }

        // Select 3 random challenges for today
        const shuffled = [...CHALLENGE_TEMPLATES].sort(() => 0.5 - Math.random());
        const selectedChallenges = shuffled.slice(0, 3);

        const newChallenges: DailyChallenge[] = selectedChallenges.map((template, index) => ({
          id: `daily_${Date.now()}_${index}`,
          title: template.title,
          description: template.description,
          challengeType: template.challengeType,
          requirement: template.requirement,
          reward: template.reward,
          progress: 0,
          completed: false,
          date: today,
          icon: template.icon,
        }));

        set({
          dailyChallenges: newChallenges,
          lastUpdateDate: today,
        });
      },

      updateChallengeProgress: (challengeId, progress) => {
        const { dailyChallenges } = get();
        const today = new Date().toDateString();

        const updatedChallenges = dailyChallenges.map((challenge) => {
          if (challenge.id === challengeId && challenge.date === today) {
            const newProgress = Math.min(progress, challenge.requirement);
            const completed = newProgress >= challenge.requirement && !challenge.completed;
            
            return {
              ...challenge,
              progress: newProgress,
              completed,
            };
          }
          return challenge;
        });

        set({ dailyChallenges: updatedChallenges });
      },

      completeChallenge: (challengeId) => {
        const { dailyChallenges, totalDailyRewards } = get();
        const today = new Date().toDateString();

        const updatedChallenges = dailyChallenges.map((challenge) => {
          if (challenge.id === challengeId && challenge.date === today && !challenge.completed) {
            return {
              ...challenge,
              completed: true,
              progress: challenge.requirement,
            };
          }
          return challenge;
        });

        const completedChallenge = dailyChallenges.find(
          c => c.id === challengeId && c.date === today
        );

        if (completedChallenge) {
          set({
            dailyChallenges: updatedChallenges,
            totalDailyRewards: totalDailyRewards + completedChallenge.reward,
          });
        }
      },

      resetDailyChallenges: () => {
        set({
          dailyChallenges: [],
          lastUpdateDate: null,
          totalDailyRewards: 0,
        });
      },
    }),
    {
      name: 'daily-challenges-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selectors
export const selectDailyChallenges = (state: DailyChallengesStore) => state.dailyChallenges;
export const selectTotalDailyRewards = (state: DailyChallengesStore) => state.totalDailyRewards;
export const selectGenerateDailyChallenges = (state: DailyChallengesStore) => state.generateDailyChallenges;
export const selectUpdateChallengeProgress = (state: DailyChallengesStore) => state.updateChallengeProgress;
export const selectCompleteChallenge = (state: DailyChallengesStore) => state.completeChallenge;
