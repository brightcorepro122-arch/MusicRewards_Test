// MusicStore - Zustand store for music challenges and playback state
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MusicChallenge } from '../types';

interface MusicStore {
  // State
  challenges: MusicChallenge[];
  currentTrack: MusicChallenge | null;
  isPlaying: boolean;
  currentPosition: number;
  challengeProgress: Record<string, number>; // challengeId -> progress percentage

  // Actions
  loadChallenges: () => void;
  setCurrentTrack: (track: MusicChallenge | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentPosition: (position: number) => void;
  updateProgress: (challengeId: string, progress: number) => void;
  markChallengeComplete: (challengeId: string) => void;
  resetStore: () => void;
}

// Sample music challenges data
const SAMPLE_CHALLENGES: MusicChallenge[] = [
  {
    id: '1',
    title: 'Classical Masterpiece',
    artist: 'Beethoven',
    duration: 180,
    points: 50,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    completed: false,
    description: 'Listen to this beautiful classical piece and earn points!',
    difficulty: 'Easy',
    category: 'Classical',
  },
  {
    id: '2',
    title: 'Jazz Vibes',
    artist: 'Miles Davis',
    duration: 240,
    points: 75,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    completed: false,
    description: 'Smooth jazz to relax and earn rewards.',
    difficulty: 'Medium',
    category: 'Jazz',
  },
  {
    id: '3',
    title: 'Electronic Beats',
    artist: 'Deadmau5',
    duration: 300,
    points: 100,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    completed: false,
    description: 'High-energy electronic music for maximum points!',
    difficulty: 'Hard',
    category: 'Electronic',
  },
  {
    id: '4',
    title: 'Acoustic Serenade',
    artist: 'Ed Sheeran',
    duration: 210,
    points: 60,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    completed: false,
    description: 'Beautiful acoustic guitar melodies.',
    difficulty: 'Easy',
    category: 'Acoustic',
  },
  {
    id: '5',
    title: 'Rock Anthem',
    artist: 'Queen',
    duration: 270,
    points: 80,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    completed: false,
    description: 'Epic rock song to get you pumped up!',
    difficulty: 'Medium',
    category: 'Rock',
  },
];

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      // Initial state
      challenges: SAMPLE_CHALLENGES,
      currentTrack: null,
      isPlaying: false,
      currentPosition: 0,
      challengeProgress: {},

      // Actions
      loadChallenges: () => {
        set({ challenges: SAMPLE_CHALLENGES });
      },

      setCurrentTrack: (track) => {
        set({ currentTrack: track });
      },

      setIsPlaying: (playing) => {
        set({ isPlaying: playing });
      },

      setCurrentPosition: (position) => {
        set({ currentPosition: position });
      },

      updateProgress: (challengeId, progress) => {
        const { challengeProgress } = get();
        set({
          challengeProgress: {
            ...challengeProgress,
            [challengeId]: Math.min(100, Math.max(0, progress)),
          },
        });
      },

      markChallengeComplete: (challengeId) => {
        const { challenges } = get();
        const updatedChallenges = challenges.map((challenge) =>
          challenge.id === challengeId
            ? { ...challenge, completed: true }
            : challenge
        );
        set({ challenges: updatedChallenges });
      },

      resetStore: () => {
        set({
          challenges: SAMPLE_CHALLENGES,
          currentTrack: null,
          isPlaying: false,
          currentPosition: 0,
          challengeProgress: {},
        });
      },
    }),
    {
      name: 'music-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        challenges: state.challenges,
        challengeProgress: state.challengeProgress,
      }),
    }
  )
);

// Selectors for efficient re-renders
export const selectChallenges = (state: MusicStore) => state.challenges;
export const selectCurrentTrack = (state: MusicStore) => state.currentTrack;
export const selectIsPlaying = (state: MusicStore) => state.isPlaying;
export const selectCurrentPosition = (state: MusicStore) => state.currentPosition;
export const selectChallengeProgress = (state: MusicStore) => state.challengeProgress;
export const selectSetCurrentTrack = (state: MusicStore) => state.setCurrentTrack;
export const selectSetIsPlaying = (state: MusicStore) => state.setIsPlaying;
export const selectSetCurrentPosition = (state: MusicStore) => state.setCurrentPosition;
export const selectUpdateProgress = (state: MusicStore) => state.updateProgress;
export const selectMarkChallengeComplete = (state: MusicStore) => state.markChallengeComplete;
export const selectLoadChallenges = (state: MusicStore) => state.loadChallenges;
