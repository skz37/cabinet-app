import AsyncStorage from '@react-native-async-storage/async-storage';
import { Uniwind } from 'uniwind';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** clair / sombre / système */
export type ThemePreference = 'light' | 'dark' | 'system';

type SettingsState = {
  themePreference: ThemePreference;
  /** Bienvenue is shown once, on first launch (F07). */
  hasSeenOnboarding: boolean;
  setThemePreference: (preference: ThemePreference) => void;
  markOnboardingSeen: () => void;
};

/** Device preferences. Not patient data, so they survive logout. */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themePreference: 'system',
      hasSeenOnboarding: false,
      setThemePreference: (preference) => {
        Uniwind.setTheme(preference);
        set({ themePreference: preference });
      },
      markOnboardingSeen: () => set({ hasSeenOnboarding: true }),
    }),
    {
      name: 'mediflow-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ themePreference, hasSeenOnboarding }) => ({
        themePreference,
        hasSeenOnboarding,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) Uniwind.setTheme(state.themePreference);
      },
    }
  )
);
