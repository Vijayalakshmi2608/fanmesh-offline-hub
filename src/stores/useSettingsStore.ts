import { create } from "zustand";
import { SettingsState } from "@/types";

interface SettingsStore extends SettingsState {
  updateSetting: <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => void;
  toggleDarkMode: () => void;
  updateAccessibility: (
    setting: keyof SettingsState["accessibility"],
    value: boolean
  ) => void;
  resetSettings: () => void;
}

const defaultSettings: SettingsState = {
  darkMode: true,
  language: "English",
  downloadsEnabled: false,
  offlineMode: true,
  accessibility: {
    reducedMotion: false,
    highContrast: false,
  },
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...defaultSettings,

  updateSetting: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),

  toggleDarkMode: () =>
    set((state) => ({
      darkMode: !state.darkMode,
    })),

  updateAccessibility: (setting, value) =>
    set((state) => ({
      accessibility: {
        ...state.accessibility,
        [setting]: value,
      },
    })),

  resetSettings: () => set(defaultSettings),
}));

// Selectors
export const selectDarkMode = (state: SettingsStore) => state.darkMode;
export const selectLanguage = (state: SettingsStore) => state.language;
export const selectDownloadsEnabled = (state: SettingsStore) =>
  state.downloadsEnabled;
export const selectOfflineMode = (state: SettingsStore) =>
  state.offlineMode;
export const selectAccessibility = (state: SettingsStore) =>
  state.accessibility;
export const selectReducedMotion = (state: SettingsStore) =>
  state.accessibility.reducedMotion;
export const selectHighContrast = (state: SettingsStore) =>
  state.accessibility.highContrast;
