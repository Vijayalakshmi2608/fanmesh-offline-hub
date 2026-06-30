import { create } from "zustand";
import { Theme, UserProfile, NotificationSettings } from "@/types";
import { CURRENT_USER } from "@/mock";

interface UserStore {
  profile: UserProfile;
  notificationSettings: NotificationSettings;
  theme: Theme;
  language: string;

  updateProfile: (profile: Partial<UserProfile>) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: string) => void;
  toggleNotifications: (type: keyof NotificationSettings) => void;
  setOnlineStatus: (online: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: {
    id: "user-1",
    name: CURRENT_USER.name,
    username: CURRENT_USER.username,
    country: CURRENT_USER.country,
    flag: CURRENT_USER.flag,
    favouriteTeam: CURRENT_USER.team,
    avatar: CURRENT_USER.avatar,
    preferredLanguage: CURRENT_USER.language,
    online: true,
  },
  notificationSettings: {
    emergencyAlerts: true,
    chatMessages: true,
    marketplaceOffers: true,
    walletActivity: false,
  },
  theme: "dark",
  language: CURRENT_USER.language,

  updateProfile: (updates) =>
    set((state) => ({
      profile: { ...state.profile, ...updates },
    })),

  setTheme: (theme) => set({ theme }),

  setLanguage: (language) => set({ language }),

  toggleNotifications: (type) =>
    set((state) => ({
      notificationSettings: {
        ...state.notificationSettings,
        [type]: !state.notificationSettings[type],
      },
    })),

  setOnlineStatus: (online) =>
    set((state) => ({
      profile: { ...state.profile, online },
    })),
}));

// Selectors for better performance (selector pattern)
export const selectUserProfile = (state: UserStore) => state.profile;
export const selectNotificationSettings = (state: UserStore) =>
  state.notificationSettings;
export const selectTheme = (state: UserStore) => state.theme;
export const selectLanguage = (state: UserStore) => state.language;
