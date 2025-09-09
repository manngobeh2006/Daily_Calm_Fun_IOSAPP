import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5 scale
  note: string;
  activities: string[];
  timestamp: number;
}

export interface MoodInsights {
  averageMood: number;
  totalEntries: number;
  happyDays: number;
  currentStreak: number;
  longestStreak: number;
  moodTrend: "improving" | "declining" | "stable";
}

interface MoodState {
  entries: MoodEntry[];
  currentMood: number | null;
  todayEntry: MoodEntry | null;
}

interface MoodActions {
  addMoodEntry: (mood: number, note: string, activities?: string[]) => void;
  updateTodayMood: (mood: number, note: string) => void;
  deleteMoodEntry: (entryId: string) => void;
  getMoodInsights: () => MoodInsights;
  getMoodHistory: (days: number) => MoodEntry[];
  getTodayMood: () => MoodEntry | null;
  exportMoodData: () => string;
  clearAllData: () => void;
}

const initialState: MoodState = {
  entries: [],
  currentMood: null,
  todayEntry: null,
};

export const useMoodStore = create<MoodState & MoodActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      addMoodEntry: (mood: number, note: string, activities: string[] = []) => {
        const today = new Date().toISOString().split('T')[0];
        const existingTodayEntry = get().entries.find(entry => entry.date === today);
        
        if (existingTodayEntry) {
          // Update existing entry for today
          set({
            entries: get().entries.map(entry =>
              entry.id === existingTodayEntry.id
                ? { ...entry, mood, note, activities, timestamp: Date.now() }
                : entry
            ),
            currentMood: mood,
            todayEntry: { ...existingTodayEntry, mood, note, activities, timestamp: Date.now() }
          });
        } else {
          // Create new entry
          const newEntry: MoodEntry = {
            id: Date.now().toString(),
            date: today,
            mood,
            note,
            activities,
            timestamp: Date.now(),
          };
          
          set({
            entries: [newEntry, ...get().entries],
            currentMood: mood,
            todayEntry: newEntry,
          });
        }
      },

      updateTodayMood: (mood: number, note: string) => {
        get().addMoodEntry(mood, note);
      },

      deleteMoodEntry: (entryId: string) => {
        const entries = get().entries.filter(entry => entry.id !== entryId);
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = entries.find(entry => entry.date === today) || null;
        
        set({
          entries,
          todayEntry,
          currentMood: todayEntry?.mood || null,
        });
      },

      getMoodInsights: (): MoodInsights => {
        const entries = get().entries;
        
        if (entries.length === 0) {
          return {
            averageMood: 0,
            totalEntries: 0,
            happyDays: 0,
            currentStreak: 0,
            longestStreak: 0,
            moodTrend: "stable",
          };
        }

        const averageMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
        const happyDays = entries.filter(entry => entry.mood >= 4).length;
        
        // Calculate streaks (consecutive days with mood >= 4)
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        
        const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        for (let i = 0; i < sortedEntries.length; i++) {
          if (sortedEntries[i].mood >= 4) {
            tempStreak++;
            if (i === 0) currentStreak = tempStreak;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 0;
            if (i === 0) currentStreak = 0;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        // Calculate trend (last 7 days vs previous 7 days)
        let moodTrend: "improving" | "declining" | "stable" = "stable";
        if (entries.length >= 14) {
          const recent7 = entries.slice(0, 7);
          const previous7 = entries.slice(7, 14);
          const recentAvg = recent7.reduce((sum, entry) => sum + entry.mood, 0) / 7;
          const previousAvg = previous7.reduce((sum, entry) => sum + entry.mood, 0) / 7;
          
          if (recentAvg > previousAvg + 0.3) moodTrend = "improving";
          else if (recentAvg < previousAvg - 0.3) moodTrend = "declining";
        }

        return {
          averageMood: Math.round(averageMood * 10) / 10,
          totalEntries: entries.length,
          happyDays,
          currentStreak,
          longestStreak,
          moodTrend,
        };
      },

      getMoodHistory: (days: number) => {
        const entries = get().entries;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return entries.filter(entry => 
          new Date(entry.date) >= cutoffDate
        ).slice(0, days);
      },

      getTodayMood: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().entries.find(entry => entry.date === today) || null;
      },

      exportMoodData: () => {
        const entries = get().entries;
        const insights = get().getMoodInsights();
        
        const exportData = {
          entries,
          insights,
          exportDate: new Date().toISOString(),
          totalEntries: entries.length,
        };
        
        return JSON.stringify(exportData, null, 2);
      },

      clearAllData: () => {
        set(initialState);
      },
    }),
    {
      name: "mood-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);