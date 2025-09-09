import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: "streak" | "activity" | "mood" | "time" | "special";
  requirement: {
    type: "streak" | "activity_count" | "mood_entries" | "time_spent" | "special";
    target: number;
    timeframe?: "daily" | "weekly" | "monthly" | "all_time";
  };
  reward: {
    type: "badge" | "points" | "unlock";
    value: string | number;
  };
  unlockedAt?: number;
  isUnlocked: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  type: "daily" | "weekly" | "monthly";
  startDate: string;
  endDate: string;
  requirements: {
    activities?: number;
    streak?: number;
    categories?: string[];
    mood_entries?: number;
  };
  reward: {
    type: "badge" | "points" | "unlock";
    value: string | number;
  };
  progress: number;
  isCompleted: boolean;
  isActive: boolean;
}

export interface UserStats {
  totalActivitiesCompleted: number;
  totalTimeSpent: number; // in minutes
  longestStreak: number;
  currentStreak: number;
  totalMoodEntries: number;
  favoriteCategory: string;
  totalPoints: number;
  level: number;
  experiencePoints: number;
  joinDate: string;
}

interface GamificationState {
  achievements: Achievement[];
  badges: Badge[];
  challenges: Challenge[];
  userStats: UserStats;
  recentUnlocks: Achievement[];
}

interface GamificationActions {
  initializeAchievements: () => void;
  checkAchievements: (activityCompleted?: boolean, moodLogged?: boolean) => Achievement[];
  unlockAchievement: (achievementId: string) => void;
  earnBadge: (badgeId: string) => void;
  updateUserStats: (stats: Partial<UserStats>) => void;
  addExperience: (points: number) => void;
  createDailyChallenges: () => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  completeChallenge: (challengeId: string) => void;
  getActiveAchievements: () => Achievement[];
  getUnlockedBadges: () => Badge[];
  getActiveChallenges: () => Challenge[];
  getUserLevel: () => { level: number; progress: number; nextLevelXP: number };
  clearRecentUnlocks: () => void;
}

const defaultAchievements: Achievement[] = [
  {
    id: "first_activity",
    title: "First Steps",
    description: "Complete your first wellness activity",
    icon: "footsteps",
    color: "#10B981",
    category: "activity",
    requirement: { type: "activity_count", target: 1 },
    reward: { type: "points", value: 50 },
    isUnlocked: false
  },
  {
    id: "streak_3",
    title: "Getting Started",
    description: "Maintain a 3-day streak",
    icon: "flame",
    color: "#F59E0B",
    category: "streak",
    requirement: { type: "streak", target: 3 },
    reward: { type: "badge", value: "consistent_beginner" },
    isUnlocked: false
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "trophy",
    color: "#EF4444",
    category: "streak",
    requirement: { type: "streak", target: 7 },
    reward: { type: "badge", value: "week_warrior" },
    isUnlocked: false
  },
  {
    id: "streak_30",
    title: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "star",
    color: "#8B5CF6",
    category: "streak",
    requirement: { type: "streak", target: 30 },
    reward: { type: "badge", value: "monthly_master" },
    isUnlocked: false
  },
  {
    id: "activities_10",
    title: "Explorer",
    description: "Complete 10 different activities",
    icon: "compass",
    color: "#06B6D4",
    category: "activity",
    requirement: { type: "activity_count", target: 10 },
    reward: { type: "points", value: 200 },
    isUnlocked: false
  },
  {
    id: "activities_50",
    title: "Wellness Enthusiast",
    description: "Complete 50 activities",
    icon: "heart",
    color: "#EC4899",
    category: "activity",
    requirement: { type: "activity_count", target: 50 },
    reward: { type: "badge", value: "wellness_enthusiast" },
    isUnlocked: false
  },
  {
    id: "mood_tracker_7",
    title: "Mood Tracker",
    description: "Log your mood for 7 consecutive days",
    icon: "happy",
    color: "#84CC16",
    category: "mood",
    requirement: { type: "mood_entries", target: 7, timeframe: "weekly" },
    reward: { type: "badge", value: "mood_tracker" },
    isUnlocked: false
  },
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Complete 5 morning activities",
    icon: "sunny",
    color: "#FBBF24",
    category: "time",
    requirement: { type: "special", target: 5 },
    reward: { type: "badge", value: "early_bird" },
    isUnlocked: false
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Complete 5 evening activities",
    icon: "moon",
    color: "#6366F1",
    category: "time",
    requirement: { type: "special", target: 5 },
    reward: { type: "badge", value: "night_owl" },
    isUnlocked: false
  },
  {
    id: "zen_master",
    title: "Zen Master",
    description: "Complete 20 meditation activities",
    icon: "leaf",
    color: "#059669",
    category: "special",
    requirement: { type: "special", target: 20 },
    reward: { type: "badge", value: "zen_master" },
    isUnlocked: false
  }
];

const defaultBadges: Badge[] = [
  {
    id: "consistent_beginner",
    title: "Consistent Beginner",
    description: "Started building healthy habits",
    icon: "ribbon",
    color: "#10B981",
    rarity: "common"
  },
  {
    id: "week_warrior",
    title: "Week Warrior",
    description: "Conquered a full week of wellness",
    icon: "shield",
    color: "#EF4444",
    rarity: "rare"
  },
  {
    id: "monthly_master",
    title: "Monthly Master",
    description: "Achieved a month of consistent practice",
    icon: "medal",
    color: "#8B5CF6",
    rarity: "epic"
  },
  {
    id: "wellness_enthusiast",
    title: "Wellness Enthusiast",
    description: "Dedicated to personal growth",
    icon: "heart-circle",
    color: "#EC4899",
    rarity: "rare"
  },
  {
    id: "mood_tracker",
    title: "Mood Tracker",
    description: "Mindful of emotional well-being",
    icon: "analytics",
    color: "#84CC16",
    rarity: "common"
  },
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Starts the day with intention",
    icon: "sunrise",
    color: "#FBBF24",
    rarity: "common"
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Ends the day with peace",
    icon: "moon-outline",
    color: "#6366F1",
    rarity: "common"
  },
  {
    id: "zen_master",
    title: "Zen Master",
    description: "Achieved inner peace through practice",
    icon: "flower-outline",
    color: "#059669",
    rarity: "legendary"
  }
];

const initialState: GamificationState = {
  achievements: defaultAchievements,
  badges: defaultBadges,
  challenges: [],
  userStats: {
    totalActivitiesCompleted: 0,
    totalTimeSpent: 0,
    longestStreak: 0,
    currentStreak: 0,
    totalMoodEntries: 0,
    favoriteCategory: "",
    totalPoints: 0,
    level: 1,
    experiencePoints: 0,
    joinDate: new Date().toISOString()
  },
  recentUnlocks: []
};

export const useGamificationStore = create<GamificationState & GamificationActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      initializeAchievements: () => {
        const currentAchievements = get().achievements;
        if (currentAchievements.length === 0) {
          set({ achievements: defaultAchievements, badges: defaultBadges });
        }
      },

      checkAchievements: (activityCompleted = false, moodLogged = false): Achievement[] => {
        const state = get();
        const newUnlocks: Achievement[] = [];

        state.achievements.forEach(achievement => {
          if (achievement.isUnlocked) return;

          let shouldUnlock = false;

          switch (achievement.requirement.type) {
            case "activity_count":
              shouldUnlock = state.userStats.totalActivitiesCompleted >= achievement.requirement.target;
              break;
            case "streak":
              shouldUnlock = state.userStats.currentStreak >= achievement.requirement.target;
              break;
            case "mood_entries":
              shouldUnlock = state.userStats.totalMoodEntries >= achievement.requirement.target;
              break;
            case "time_spent":
              shouldUnlock = state.userStats.totalTimeSpent >= achievement.requirement.target;
              break;
          }

          if (shouldUnlock) {
            get().unlockAchievement(achievement.id);
            newUnlocks.push(achievement);
          }
        });

        return newUnlocks;
      },

      unlockAchievement: (achievementId: string) => {
        set(state => ({
          achievements: state.achievements.map(achievement =>
            achievement.id === achievementId
              ? { ...achievement, isUnlocked: true, unlockedAt: Date.now() }
              : achievement
          ),
          recentUnlocks: [
            ...state.recentUnlocks,
            state.achievements.find(a => a.id === achievementId)!
          ]
        }));

        // Award points or badges
        const achievement = get().achievements.find(a => a.id === achievementId);
        if (achievement?.reward.type === "points") {
          get().addExperience(achievement.reward.value as number);
        } else if (achievement?.reward.type === "badge") {
          get().earnBadge(achievement.reward.value as string);
        }
      },

      earnBadge: (badgeId: string) => {
        set(state => ({
          badges: state.badges.map(badge =>
            badge.id === badgeId
              ? { ...badge, earnedAt: Date.now() }
              : badge
          )
        }));
      },

      updateUserStats: (stats: Partial<UserStats>) => {
        set(state => ({
          userStats: { ...state.userStats, ...stats }
        }));
      },

      addExperience: (points: number) => {
        set(state => {
          const newXP = state.userStats.experiencePoints + points;
          const newLevel = Math.floor(newXP / 1000) + 1; // 1000 XP per level
          
          return {
            userStats: {
              ...state.userStats,
              experiencePoints: newXP,
              totalPoints: state.userStats.totalPoints + points,
              level: newLevel
            }
          };
        });
      },

      createDailyChallenges: () => {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const dailyChallenges: Challenge[] = [
          {
            id: `daily_${today}_activities`,
            title: "Daily Wellness",
            description: "Complete 3 activities today",
            icon: "checkmark-circle",
            color: "#10B981",
            type: "daily",
            startDate: today,
            endDate: tomorrow.toISOString().split('T')[0],
            requirements: { activities: 3 },
            reward: { type: "points", value: 100 },
            progress: 0,
            isCompleted: false,
            isActive: true
          },
          {
            id: `daily_${today}_mood`,
            title: "Mood Check-in",
            description: "Log your mood today",
            icon: "heart",
            color: "#EC4899",
            type: "daily",
            startDate: today,
            endDate: tomorrow.toISOString().split('T')[0],
            requirements: { mood_entries: 1 },
            reward: { type: "points", value: 50 },
            progress: 0,
            isCompleted: false,
            isActive: true
          }
        ];

        set(state => ({
          challenges: [
            ...state.challenges.filter(c => c.type !== "daily" || c.startDate !== today),
            ...dailyChallenges
          ]
        }));
      },

      updateChallengeProgress: (challengeId: string, progress: number) => {
        set(state => ({
          challenges: state.challenges.map(challenge =>
            challenge.id === challengeId
              ? { ...challenge, progress }
              : challenge
          )
        }));
      },

      completeChallenge: (challengeId: string) => {
        const challenge = get().challenges.find(c => c.id === challengeId);
        if (challenge && challenge.reward.type === "points") {
          get().addExperience(challenge.reward.value as number);
        }

        set(state => ({
          challenges: state.challenges.map(c =>
            c.id === challengeId
              ? { ...c, isCompleted: true, isActive: false }
              : c
          )
        }));
      },

      getActiveAchievements: () => {
        return get().achievements.filter(a => !a.isUnlocked);
      },

      getUnlockedBadges: () => {
        return get().badges.filter(b => b.earnedAt);
      },

      getActiveChallenges: () => {
        return get().challenges.filter(c => c.isActive && !c.isCompleted);
      },

      getUserLevel: () => {
        const { level, experiencePoints } = get().userStats;
        const currentLevelXP = (level - 1) * 1000;
        const nextLevelXP = level * 1000;
        const progress = ((experiencePoints - currentLevelXP) / 1000) * 100;
        
        return {
          level,
          progress: Math.min(progress, 100),
          nextLevelXP
        };
      },

      clearRecentUnlocks: () => {
        set({ recentUnlocks: [] });
      }
    }),
    {
      name: "gamification-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);