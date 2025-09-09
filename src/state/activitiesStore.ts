import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sampleDailyActivities, getCurrentDayNumber } from "../data/sampleActivities";

export interface ActivityHistory {
  activityId: string;
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // in seconds
  sessionCount: number;
}

export interface Activity {
  id: string;
  type: "relax" | "learn" | "create";
  title: string;
  description: string;
  premium_only: boolean;
  completed?: boolean;
  completedAt?: Date;
  content?: any; // Specific content based on activity type
}

export interface DailyActivities {
  day: number;
  date: string;
  activities: Activity[];
}

interface ActivitiesState {
  currentDay: number;
  dailyActivities: DailyActivities[];
  completedActivities: string[];
  activityHistory: ActivityHistory[];
  startedActivities: string[]; // Activities that have been started but not completed
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  badges: string[];
  totalActivitiesCompleted: number;
}

interface ActivitiesActions {
  loadDailyActivities: (day: number) => void;
  startActivity: (activityId: string) => void;
  completeActivity: (activityId: string) => void;
  getActivityHistory: (activityId: string) => ActivityHistory | null;
  getActivityStats: () => {
    totalStarted: number;
    totalCompleted: number;
    averageSessionTime: number;
    favoriteType: string;
  };
  updateStreak: () => void;
  addBadge: (badgeId: string) => void;
  resetProgress: () => void;
  getCurrentDayActivities: () => Activity[];
  getCompletedTodayCount: () => number;
}

const initialState: ActivitiesState = {
  currentDay: getCurrentDayNumber(),
  dailyActivities: sampleDailyActivities,
  completedActivities: [],
  activityHistory: [],
  startedActivities: [],
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  badges: [],
  totalActivitiesCompleted: 0,
};

export const useActivitiesStore = create<ActivitiesState & ActivitiesActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      loadDailyActivities: (day: number) => {
        const state = get();
        const existingDay = state.dailyActivities.find(d => d.day === day);
        
        if (!existingDay) {
          // Generate content for this day if not exists
          import("../api/content-generator").then(({ generateDailyActivities }) => {
            generateDailyActivities(day).then(dailyContent => {
              set({
                currentDay: day,
                dailyActivities: [...state.dailyActivities, dailyContent]
              });
            });
          });
        } else {
          set({ currentDay: day });
        }
      },
      startActivity: (activityId: string) => {
        const state = get();
        
        if (!state.startedActivities.includes(activityId)) {
          const newHistory: ActivityHistory = {
            activityId,
            startedAt: new Date(),
            sessionCount: 1,
          };
          
          set({
            startedActivities: [...state.startedActivities, activityId],
            activityHistory: [...state.activityHistory, newHistory],
          });
        } else {
          // Update session count for existing activity
          set({
            activityHistory: state.activityHistory.map(history =>
              history.activityId === activityId
                ? { ...history, sessionCount: history.sessionCount + 1 }
                : history
            ),
          });
        }
      },

      completeActivity: (activityId: string) => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        
        if (!state.completedActivities.includes(activityId)) {
          const newCompletedActivities = [...state.completedActivities, activityId];
          const newTotalCompleted = state.totalActivitiesCompleted + 1;
          
          // Update activity history
          const existingHistory = state.activityHistory.find(h => h.activityId === activityId);
          let newHistory = [...state.activityHistory];
          
          if (existingHistory) {
            newHistory = newHistory.map(h => 
              h.activityId === activityId 
                ? { ...h, completedAt: new Date(), sessionCount: h.sessionCount + 1 }
                : h
            );
          } else {
            newHistory.push({
              activityId,
              startedAt: new Date(),
              completedAt: new Date(),
              sessionCount: 1
            });
          }
          
          // Mark activity as completed in daily activities
          const updatedDailyActivities = state.dailyActivities.map(day => ({
            ...day,
            activities: day.activities.map(activity => 
              activity.id === activityId 
                ? { ...activity, completed: true, completedAt: new Date() }
                : activity
            )
          }));
          
          set({
            completedActivities: newCompletedActivities,
            totalActivitiesCompleted: newTotalCompleted,
            activityHistory: newHistory,
            dailyActivities: updatedDailyActivities,
            lastActivityDate: today
          });
          
          // Update streak after completing activity
          get().updateStreak();
          
          // Integrate with gamification system
          try {
            import("./gamificationStore").then(({ useGamificationStore }) => {
              const gamificationStore = useGamificationStore.getState();
              
              // Update user stats
              gamificationStore.updateUserStats({
                totalActivitiesCompleted: newTotalCompleted,
                currentStreak: state.currentStreak
              });
              
              // Add experience points
              gamificationStore.addExperience(25); // Base XP for completing activity
              
              // Check for new achievements
              gamificationStore.checkAchievements(true, false);
            });
          } catch (error) {
            console.log("Gamification integration error:", error);
          }
        }
      },

      getActivityHistory: (activityId: string) => {
        const state = get();
        return state.activityHistory.find(history => history.activityId === activityId) || null;
      },

      getActivityStats: () => {
        const state = get();
        const history = state.activityHistory;
        
        const totalStarted = state.startedActivities.length;
        const totalCompleted = state.completedActivities.length;
        
        const completedHistory = history.filter(h => h.completedAt);
        const averageSessionTime = completedHistory.length > 0
          ? completedHistory.reduce((sum, h) => sum + (h.duration || 0), 0) / completedHistory.length
          : 0;

        // Find favorite activity type
        const typeCount: Record<string, number> = {};
        state.dailyActivities.forEach(day => {
          day.activities.forEach(activity => {
            if (state.completedActivities.includes(activity.id)) {
              typeCount[activity.type] = (typeCount[activity.type] || 0) + 1;
            }
          });
        });

        const favoriteType = Object.entries(typeCount).reduce((a, b) => 
          typeCount[a[0]] > typeCount[b[0]] ? a : b, ["relax", 0]
        )[0];

        return {
          totalStarted,
          totalCompleted,
          averageSessionTime: Math.round(averageSessionTime),
          favoriteType,
        };
      },
      updateStreak: () => {
        const state = get();
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
        
        if (state.lastActivityDate === today) {
          return; // Already updated today
        }
        
        let newStreak = state.currentStreak;
        
        if (state.lastActivityDate === yesterday) {
          newStreak += 1;
        } else if (state.lastActivityDate !== today) {
          newStreak = 1;
        }
        
        set({
          currentStreak: newStreak,
          longestStreak: Math.max(state.longestStreak, newStreak),
        });
        
        // Check for badge milestones
        if (newStreak === 7 && !state.badges.includes("week_warrior")) {
          get().addBadge("week_warrior");
        } else if (newStreak === 30 && !state.badges.includes("month_master")) {
          get().addBadge("month_master");
        } else if (newStreak === 100 && !state.badges.includes("century_champion")) {
          get().addBadge("century_champion");
        }
      },
      addBadge: (badgeId: string) => {
        const state = get();
        if (!state.badges.includes(badgeId)) {
          set({ badges: [...state.badges, badgeId] });
        }
      },
      resetProgress: () => set(initialState),
      getCurrentDayActivities: () => {
        const state = get();
        const todayActivities = state.dailyActivities.find(
          (day) => day.day === state.currentDay
        );
        return todayActivities?.activities || [];
      },
      getCompletedTodayCount: () => {
        const state = get();
        const today = new Date().toDateString();
        return state.completedActivities.filter(id => 
          id.startsWith(today)
        ).length;
      },
    }),
    {
      name: "activities-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);