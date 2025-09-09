import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserState {
  hasCompletedOnboarding: boolean;
  isPremium: boolean;
  subscriptionType: "monthly" | "yearly" | "lifetime" | null;
  trialEndDate: Date | null;
  userId: string;
  name: string;
  preferences: {
    dailyReminderTime: string;
    notificationsEnabled: boolean;
    soundEnabled: boolean;
    soundEffectsEnabled: boolean;
    activitySoundSettings: {
      [activityId: string]: {
        popSoundEnabled?: boolean;
        soundEffectsEnabled?: boolean;
      };
    };
  };
}

interface UserActions {
  completeOnboarding: () => void;
  setPremiumStatus: (isPremium: boolean, type?: "monthly" | "yearly" | "lifetime") => void;
  setTrialEndDate: (date: Date | null) => void;
  updatePreferences: (preferences: Partial<UserState["preferences"]>) => void;
  setUserName: (name: string) => void;
  resetUser: () => void;
  updateActivitySoundSetting: (activityId: string, setting: string, value: boolean) => void;
  getActivitySoundSetting: (activityId: string, setting: string, defaultValue?: boolean) => boolean;
}

const initialState: UserState = {
  hasCompletedOnboarding: false,
  isPremium: false,
  subscriptionType: null,
  trialEndDate: null,
  userId: Math.random().toString(36).substring(2, 11),
  name: "",
  preferences: {
    dailyReminderTime: "09:00",
    notificationsEnabled: true,
    soundEnabled: true,
    soundEffectsEnabled: true,
    activitySoundSettings: {},
  },
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setPremiumStatus: (isPremium: boolean, type?: "monthly" | "yearly" | "lifetime") =>
        set({ isPremium, subscriptionType: isPremium ? type || null : null }),
      setTrialEndDate: (date: Date | null) => set({ trialEndDate: date }),
      updatePreferences: (preferences: Partial<UserState["preferences"]>) =>
        set({ preferences: { ...get().preferences, ...preferences } }),
      setUserName: (name: string) => set({ name }),
      resetUser: () => set(initialState),
      updateActivitySoundSetting: (activityId: string, setting: string, value: boolean) => {
        const state = get();
        const activitySettings = state.preferences.activitySoundSettings[activityId] || {};
        set({
          preferences: {
            ...state.preferences,
            activitySoundSettings: {
              ...state.preferences.activitySoundSettings,
              [activityId]: {
                ...activitySettings,
                [setting]: value,
              },
            },
          },
        });
      },
      getActivitySoundSetting: (activityId: string, setting: string, defaultValue: boolean = true) => {
        const state = get();
        const activitySettings = state.preferences.activitySoundSettings[activityId];
        if (!activitySettings || activitySettings[setting as keyof typeof activitySettings] === undefined) {
          return defaultValue;
        }
        return activitySettings[setting as keyof typeof activitySettings] as boolean;
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);