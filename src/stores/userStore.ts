// UserStore - Zustand store for user progress and points
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserStore {
  // State
  totalPoints: number;
  completedChallenges: string[];
  level: number;
  streak: number;
  lastPlayDate: string | null;

  // Actions
  addPoints: (points: number) => void;
  completeChallenge: (challengeId: string) => void;
  resetProgress: () => void;
  updateStreak: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      totalPoints: 0,
      completedChallenges: [],
      level: 1,
      streak: 0,
      lastPlayDate: null,

      // Actions
      addPoints: (points) => {
        const { totalPoints, level } = get();
        const newTotalPoints = totalPoints + points;
        const newLevel = Math.floor(newTotalPoints / 1000) + 1; // Level up every 1000 points
        
        set({
          totalPoints: newTotalPoints,
          level: newLevel,
        });
      },

      completeChallenge: (challengeId) => {
        const { completedChallenges } = get();
        if (!completedChallenges.includes(challengeId)) {
          set({
            completedChallenges: [...completedChallenges, challengeId],
          });
        }
      },

      resetProgress: () => {
        set({
          totalPoints: 0,
          completedChallenges: [],
          level: 1,
          streak: 0,
          lastPlayDate: null,
        });
      },

      updateStreak: () => {
        const { lastPlayDate, streak } = get();
        const today = new Date().toDateString();
        
        if (lastPlayDate === today) {
          // Already played today, no change
          return;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        if (lastPlayDate === yesterdayString) {
          // Consecutive day, increment streak
          set({ streak: streak + 1, lastPlayDate: today });
        } else {
          // Streak broken, reset to 1
          set({ streak: 1, lastPlayDate: today });
        }
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selectors for efficient re-renders
export const selectTotalPoints = (state: UserStore) => state.totalPoints;
export const selectCompletedChallenges = (state: UserStore) => state.completedChallenges;
export const selectLevel = (state: UserStore) => state.level;
export const selectStreak = (state: UserStore) => state.streak;
export const selectAddPoints = (state: UserStore) => state.addPoints;
export const selectCompleteChallenge = (state: UserStore) => state.completeChallenge;
export const selectResetProgress = (state: UserStore) => state.resetProgress;
export const selectUpdateStreak = (state: UserStore) => state.updateStreak;
