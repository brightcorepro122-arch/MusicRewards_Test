// ThemeStore - Zustand store for theme management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeStore {
  // State
  themeMode: ThemeMode;
  isDark: boolean;

  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      themeMode: 'dark',
      isDark: true,

      // Actions
      setThemeMode: (mode) => {
        const isDark = mode === 'dark' || (mode === 'auto' && true); // For now, auto defaults to dark
        set({ themeMode: mode, isDark });
      },

      toggleTheme: () => {
        const { themeMode } = get();
        const newMode = themeMode === 'dark' ? 'light' : 'dark';
        const isDark = newMode === 'dark';
        set({ themeMode: newMode, isDark });
      },
    }),
    {
      name: 'theme-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selectors for efficient re-renders
export const selectThemeMode = (state: ThemeStore) => state.themeMode;
export const selectIsDark = (state: ThemeStore) => state.isDark;
export const selectSetThemeMode = (state: ThemeStore) => state.setThemeMode;
export const selectToggleTheme = (state: ThemeStore) => state.toggleTheme;
