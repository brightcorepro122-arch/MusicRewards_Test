// AchievementsStore - Zustand store for achievements and badges
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  category: 'listening' | 'streak' | 'points' | 'challenges' | 'special';
  requirement: number;
  unlocked: boolean;
  unlockedAt?: string;
}

interface AchievementsStore {
  // State
  achievements: Achievement[];
  unlockedAchievements: string[];
  totalAchievementPoints: number;

  // Actions
  checkAchievements: (stats: {
    totalPoints: number;
    completedChallenges: number;
    streak: number;
    totalListeningTime: number;
  }) => void;
  unlockAchievement: (achievementId: string) => void;
  resetAchievements: () => void;
}

// Predefined achievements
const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Listening achievements
  {
    id: 'first_listen',
    title: 'First Steps',
    description: 'Complete your first music challenge',
    icon: '🎵',
    points: 10,
    category: 'listening',
    requirement: 1,
    unlocked: false,
  },
  {
    id: 'music_lover',
    title: 'Music Lover',
    description: 'Complete 5 music challenges',
    icon: '❤️',
    points: 50,
    category: 'listening',
    requirement: 5,
    unlocked: false,
  },
  {
    id: 'music_master',
    title: 'Music Master',
    description: 'Complete 10 music challenges',
    icon: '👑',
    points: 100,
    category: 'listening',
    requirement: 10,
    unlocked: false,
  },
  {
    id: 'marathon_listener',
    title: 'Marathon Listener',
    description: 'Listen to music for 30 minutes total',
    icon: '🏃‍♂️',
    points: 75,
    category: 'listening',
    requirement: 1800, // 30 minutes in seconds
    unlocked: false,
  },

  // Points achievements
  {
    id: 'point_collector',
    title: 'Point Collector',
    description: 'Earn 100 points',
    icon: '💰',
    points: 25,
    category: 'points',
    requirement: 100,
    unlocked: false,
  },
  {
    id: 'point_master',
    title: 'Point Master',
    description: 'Earn 500 points',
    icon: '💎',
    points: 100,
    category: 'points',
    requirement: 500,
    unlocked: false,
  },
  {
    id: 'point_legend',
    title: 'Point Legend',
    description: 'Earn 1000 points',
    icon: '🌟',
    points: 200,
    category: 'points',
    requirement: 1000,
    unlocked: false,
  },

  // Streak achievements
  {
    id: 'daily_listener',
    title: 'Daily Listener',
    description: 'Listen to music for 3 days in a row',
    icon: '📅',
    points: 30,
    category: 'streak',
    requirement: 3,
    unlocked: false,
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Listen to music for 7 days in a row',
    icon: '⚔️',
    points: 75,
    category: 'streak',
    requirement: 7,
    unlocked: false,
  },
  {
    id: 'streak_champion',
    title: 'Streak Champion',
    description: 'Listen to music for 30 days in a row',
    icon: '🏆',
    points: 200,
    category: 'streak',
    requirement: 30,
    unlocked: false,
  },

  // Special achievements
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a challenge before 8 AM',
    icon: '🌅',
    points: 25,
    category: 'special',
    requirement: 1,
    unlocked: false,
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a challenge after 10 PM',
    icon: '🦉',
    points: 25,
    category: 'special',
    requirement: 1,
    unlocked: false,
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete 3 challenges in one day',
    icon: '⚡',
    points: 50,
    category: 'special',
    requirement: 3,
    unlocked: false,
  },
];

export const useAchievementsStore = create<AchievementsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      achievements: INITIAL_ACHIEVEMENTS,
      unlockedAchievements: [],
      totalAchievementPoints: 0,

      // Actions
      checkAchievements: (stats) => {
        const { achievements, unlockedAchievements } = get();
        const newUnlocked: string[] = [];
        let newTotalPoints = 0;

        const updatedAchievements = achievements.map((achievement) => {
          if (achievement.unlocked) {
            newTotalPoints += achievement.points;
            return achievement;
          }

          let shouldUnlock = false;

          switch (achievement.category) {
            case 'listening':
              if (achievement.id === 'first_listen' || achievement.id === 'music_lover' || achievement.id === 'music_master') {
                shouldUnlock = stats.completedChallenges >= achievement.requirement;
              } else if (achievement.id === 'marathon_listener') {
                shouldUnlock = stats.totalListeningTime >= achievement.requirement;
              }
              break;
            case 'points':
              shouldUnlock = stats.totalPoints >= achievement.requirement;
              break;
            case 'streak':
              shouldUnlock = stats.streak >= achievement.requirement;
              break;
            case 'special':
              // Special achievements are handled separately
              break;
          }

          if (shouldUnlock) {
            newUnlocked.push(achievement.id);
            newTotalPoints += achievement.points;
            return {
              ...achievement,
              unlocked: true,
              unlockedAt: new Date().toISOString(),
            };
          }

          return achievement;
        });

        if (newUnlocked.length > 0) {
          set({
            achievements: updatedAchievements,
            unlockedAchievements: [...unlockedAchievements, ...newUnlocked],
            totalAchievementPoints: newTotalPoints,
          });
        }
      },

      unlockAchievement: (achievementId) => {
        const { achievements, unlockedAchievements, totalAchievementPoints } = get();
        
        if (unlockedAchievements.includes(achievementId)) {
          return; // Already unlocked
        }

        const achievement = achievements.find(a => a.id === achievementId);
        if (!achievement) return;

        const updatedAchievements = achievements.map(a =>
          a.id === achievementId
            ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
            : a
        );

        set({
          achievements: updatedAchievements,
          unlockedAchievements: [...unlockedAchievements, achievementId],
          totalAchievementPoints: totalAchievementPoints + achievement.points,
        });
      },

      resetAchievements: () => {
        set({
          achievements: INITIAL_ACHIEVEMENTS,
          unlockedAchievements: [],
          totalAchievementPoints: 0,
        });
      },
    }),
    {
      name: 'achievements-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selectors
export const selectAchievements = (state: AchievementsStore) => state.achievements;
export const selectUnlockedAchievements = (state: AchievementsStore) => state.unlockedAchievements;
export const selectTotalAchievementPoints = (state: AchievementsStore) => state.totalAchievementPoints;
export const selectCheckAchievements = (state: AchievementsStore) => state.checkAchievements;
export const selectUnlockAchievement = (state: AchievementsStore) => state.unlockAchievement;
