// SettingsStore - Zustand store for app settings and preferences
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface SettingsStore {
  // State
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  autoPlayNext: boolean;
  volume: number;
  language: string;
  soundEffectsEnabled: boolean;

  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  toggleNotifications: () => void;
  toggleHapticFeedback: () => void;
  toggleAutoPlayNext: () => void;
  setVolume: (volume: number) => void;
  setLanguage: (language: string) => void;
  toggleSoundEffects: () => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // Initial state
      themeMode: 'dark',
      notificationsEnabled: true,
      hapticFeedbackEnabled: true,
      autoPlayNext: false,
      volume: 0.8,
      language: 'en',
      soundEffectsEnabled: true,

      // Actions
      setThemeMode: (mode) => set({ themeMode: mode }),
      
      toggleNotifications: () => set((state) => ({
        notificationsEnabled: !state.notificationsEnabled,
      })),
      
      toggleHapticFeedback: () => set((state) => ({
        hapticFeedbackEnabled: !state.hapticFeedbackEnabled,
      })),
      
      toggleAutoPlayNext: () => set((state) => ({
        autoPlayNext: !state.autoPlayNext,
      })),
      
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      
      setLanguage: (language) => set({ language }),
      
      toggleSoundEffects: () => set((state) => ({
        soundEffectsEnabled: !state.soundEffectsEnabled,
      })),
      
      resetSettings: () => set({
        themeMode: 'dark',
        notificationsEnabled: true,
        hapticFeedbackEnabled: true,
        autoPlayNext: false,
        volume: 0.8,
        language: 'en',
        soundEffectsEnabled: true,
      }),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selectors
export const selectThemeMode = (state: SettingsStore) => state.themeMode;
export const selectNotificationsEnabled = (state: SettingsStore) => state.notificationsEnabled;
export const selectHapticFeedbackEnabled = (state: SettingsStore) => state.hapticFeedbackEnabled;
export const selectAutoPlayNext = (state: SettingsStore) => state.autoPlayNext;
export const selectVolume = (state: SettingsStore) => state.volume;
export const selectLanguage = (state: SettingsStore) => state.language;
export const selectSoundEffectsEnabled = (state: SettingsStore) => state.soundEffectsEnabled;
export const selectSetThemeMode = (state: SettingsStore) => state.setThemeMode;
export const selectToggleNotifications = (state: SettingsStore) => state.toggleNotifications;
export const selectToggleHapticFeedback = (state: SettingsStore) => state.toggleHapticFeedback;
export const selectToggleAutoPlayNext = (state: SettingsStore) => state.toggleAutoPlayNext;
export const selectSetVolume = (state: SettingsStore) => state.setVolume;
export const selectSetLanguage = (state: SettingsStore) => state.setLanguage;
export const selectToggleSoundEffects = (state: SettingsStore) => state.toggleSoundEffects;
export const selectResetSettings = (state: SettingsStore) => state.resetSettings;
