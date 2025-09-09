import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Alert, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMoodStore, MoodInsights } from "../state/moodStore";
import PersonalizationEngine from "../utils/personalizationEngine";

export default function MoodTrackerScreen() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [selectedTab, setSelectedTab] = useState<"today" | "insights" | "history">("today");
  
  const {
    entries,
    addMoodEntry,
    getMoodInsights,
    getMoodHistory,
    getTodayMood,
    exportMoodData,
  } = useMoodStore();

  const todayMood = getTodayMood();
  const insights = getMoodInsights();
  const recentHistory = getMoodHistory(30); // Last 30 days
  const { width } = Dimensions.get("window");
  const personalizationEngine = PersonalizationEngine.getInstance();

  useEffect(() => {
    // Load today's mood if it exists
    if (todayMood) {
      setSelectedMood(todayMood.mood);
      setMoodNote(todayMood.note);
    }
  }, [todayMood]);

  const moods = [
    { value: 1, emoji: "😢", label: "Very Sad", color: "bg-red-100" },
    { value: 2, emoji: "😔", label: "Sad", color: "bg-orange-100" },
    { value: 3, emoji: "😐", label: "Neutral", color: "bg-yellow-100" },
    { value: 4, emoji: "😊", label: "Happy", color: "bg-green-100" },
    { value: 5, emoji: "😄", label: "Very Happy", color: "bg-purple-100" },
  ];

  const handleSaveMood = () => {
    if (selectedMood) {
      addMoodEntry(selectedMood, moodNote);
      
      // Update personalization engine with mood data
      const currentHour = new Date().getHours();
      const timeOfDay = currentHour < 12 ? "morning" : currentHour < 17 ? "afternoon" : "evening";
      
      // This would typically record mood patterns for better recommendations
      personalizationEngine.recordMoodActivity(selectedMood, "mood_tracking");
      
      Alert.alert(
        "Mood Saved! 💜",
        "Your mood has been recorded. Keep tracking to see your patterns!",
        [{ text: "OK" }]
      );
    }
  };

  const getMoodColor = (mood: number): string => {
    const colors = {
      1: "#EF4444", // red
      2: "#F97316", // orange  
      3: "#EAB308", // yellow
      4: "#22C55E", // green
      5: "#8B5CF6"  // purple
    };
    return colors[mood as keyof typeof colors] || "#6B7280";
  };

  const getWeeklyMoodChart = () => {
    const last7Days = getMoodHistory(7);
    const maxMood = 5;
    
    return last7Days.map((entry, index) => {
      const height = (entry.mood / maxMood) * 100;
      const color = getMoodColor(entry.mood);
      
      return (
        <View key={entry.id} className="items-center flex-1">
          <View 
            className="bg-gray-200 rounded-t-lg mb-2"
            style={{ 
              height: 80, 
              width: (width - 80) / 7 - 8,
              justifyContent: 'flex-end'
            }}
          >
            <View 
              className="rounded-t-lg"
              style={{ 
                height: `${height}%`, 
                backgroundColor: color,
                minHeight: 8
              }}
            />
          </View>
          <Text className="text-xs text-gray-600">
            {new Date(entry.date).toLocaleDateString('en', { weekday: 'short' })}
          </Text>
        </View>
      );
    });
  };

  const handleExportData = () => {
    try {
      const exportedData = exportMoodData();
      Alert.alert(
        "Export Ready",
        "Your mood data has been prepared for export. In a real app, this would be saved to your device or shared.",
        [{ text: "OK" }]
      );
      console.log("Exported mood data:", exportedData);
    } catch (error) {
      Alert.alert("Export Failed", "Could not export mood data.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={["#EC4899", "#8B5CF6"]}
          className="px-6 pt-4 pb-8 rounded-b-3xl"
        >
          <Text className="text-white text-2xl font-bold mb-4">Mood Tracker</Text>
          <Text className="text-white/90">Track your emotional well-being journey</Text>
        </LinearGradient>

        <View className="px-6 mt-6">
          {/* Tab Navigation */}
          <View className="flex-row bg-white rounded-2xl p-1 mb-6 shadow-sm">
            {[
              { key: "today", label: "Today", icon: "today" },
              { key: "insights", label: "Insights", icon: "analytics" },
              { key: "history", label: "History", icon: "time" }
            ].map((tab) => (
              <Pressable
                key={tab.key}
                className={`flex-1 py-3 px-4 rounded-xl flex-row items-center justify-center ${
                  selectedTab === tab.key ? "bg-pink-600" : ""
                }`}
                onPress={() => setSelectedTab(tab.key as any)}
              >
                <Ionicons 
                  name={tab.icon as any} 
                  size={16} 
                  color={selectedTab === tab.key ? "white" : "#6B7280"} 
                  style={{ marginRight: 4 }}
                />
                <Text className={`font-medium text-sm ${
                  selectedTab === tab.key ? "text-white" : "text-gray-600"
                }`}>
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Today Tab */}
          {selectedTab === "today" && (
            <>
              {/* Today's Mood Entry */}
              <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
                <Text className="text-lg font-semibold text-gray-900 mb-4">
                  How are you feeling today?
                </Text>
                
                <View className="flex-row justify-between mb-6">
                  {moods.map((mood) => (
                    <Pressable
                      key={mood.value}
                      className={`w-16 h-16 rounded-full items-center justify-center ${
                        selectedMood === mood.value ? mood.color + " border-2 border-pink-500" : "bg-gray-100"
                      }`}
                      onPress={() => setSelectedMood(mood.value)}
                    >
                      <Text className="text-2xl">{mood.emoji}</Text>
                    </Pressable>
                  ))}
                </View>
                
                {selectedMood && (
                  <View>
                    <Text className="text-gray-800 font-medium mb-3">
                      {moods.find(m => m.value === selectedMood)?.label}
                    </Text>
                    
                    <TextInput
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4"
                      placeholder="Add a note about your mood (optional)"
                      placeholderTextColor="#9CA3AF"
                      multiline
                      value={moodNote}
                      onChangeText={setMoodNote}
                    />
                    
                    <Pressable
                      className="bg-pink-600 py-3 px-6 rounded-xl items-center"
                      onPress={handleSaveMood}
                    >
                      <Text className="text-white font-semibold">Save Mood</Text>
                    </Pressable>
                  </View>
                )}
              </View>

              {/* Quick Mood Insights */}
              {entries.length > 0 && (
                <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <Text className="text-lg font-semibold text-gray-900 mb-4">This Week</Text>
                  
                  <View className="flex-row items-end justify-between mb-4" style={{ height: 100 }}>
                    {getWeeklyMoodChart()}
                  </View>
                  
                  <Text className="text-gray-600 text-center text-sm">
                    Your mood pattern over the last 7 days
                  </Text>
                </View>
              )}
            </>
          )}

          {/* Insights Tab */}
          {selectedTab === "insights" && entries.length > 0 && (
            <>
              {/* Mood Statistics */}
              <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
                <Text className="text-lg font-semibold text-gray-900 mb-4">Your Mood Insights</Text>
                
                <View className="flex-row flex-wrap justify-between">
                  <View className="items-center mb-4" style={{ width: (width - 80) / 3 }}>
                    <Text className="text-2xl font-bold text-pink-600">{insights.averageMood}</Text>
                    <Text className="text-gray-600 text-sm text-center">Average Mood</Text>
                  </View>
                  
                  <View className="items-center mb-4" style={{ width: (width - 80) / 3 }}>
                    <Text className="text-2xl font-bold text-green-600">{insights.totalEntries}</Text>
                    <Text className="text-gray-600 text-sm text-center">Days Tracked</Text>
                  </View>
                  
                  <View className="items-center mb-4" style={{ width: (width - 80) / 3 }}>
                    <Text className="text-2xl font-bold text-blue-600">{insights.happyDays}</Text>
                    <Text className="text-gray-600 text-sm text-center">Happy Days</Text>
                  </View>

                  <View className="items-center mb-4" style={{ width: (width - 80) / 3 }}>
                    <Text className="text-2xl font-bold text-orange-600">{insights.currentStreak}</Text>
                    <Text className="text-gray-600 text-sm text-center">Current Streak</Text>
                  </View>
                  
                  <View className="items-center mb-4" style={{ width: (width - 80) / 3 }}>
                    <Text className="text-2xl font-bold text-purple-600">{insights.longestStreak}</Text>
                    <Text className="text-gray-600 text-sm text-center">Best Streak</Text>
                  </View>
                  
                  <View className="items-center mb-4" style={{ width: (width - 80) / 3 }}>
                    <View className={`px-3 py-1 rounded-full ${
                      insights.moodTrend === "improving" ? "bg-green-100" :
                      insights.moodTrend === "declining" ? "bg-red-100" : "bg-gray-100"
                    }`}>
                      <Text className={`text-sm font-medium ${
                        insights.moodTrend === "improving" ? "text-green-800" :
                        insights.moodTrend === "declining" ? "text-red-800" : "text-gray-800"
                      }`}>
                        {insights.moodTrend === "improving" ? "📈" :
                         insights.moodTrend === "declining" ? "📉" : "➡️"}
                      </Text>
                    </View>
                    <Text className="text-gray-600 text-sm text-center mt-1">Trend</Text>
                  </View>
                </View>
              </View>

              {/* Mood Patterns */}
              <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
                <Text className="text-lg font-semibold text-gray-900 mb-4">Mood Patterns</Text>
                
                <View className="space-y-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-700">Most common mood</Text>
                    <View className="flex-row items-center">
                      <Text className="text-2xl mr-2">
                        {moods.find(m => m.value === Math.round(insights.averageMood))?.emoji}
                      </Text>
                      <Text className="text-gray-900 font-medium">
                        {moods.find(m => m.value === Math.round(insights.averageMood))?.label}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-700">Happy day percentage</Text>
                    <Text className="text-gray-900 font-medium">
                      {Math.round((insights.happyDays / insights.totalEntries) * 100)}%
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-700">Tracking consistency</Text>
                    <Text className="text-gray-900 font-medium">
                      {insights.currentStreak > 7 ? "Excellent" : 
                       insights.currentStreak > 3 ? "Good" : "Getting started"}
                    </Text>
                  </View>
                </View>
              </View>

              <Pressable 
                className="bg-pink-600 py-3 px-6 rounded-xl items-center mb-6"
                onPress={handleExportData}
              >
                <Text className="text-white font-semibold">Export Detailed Report</Text>
              </Pressable>
            </>
          )}

          {/* History Tab */}
          {selectedTab === "history" && (
            <View className="mb-8">
              <Text className="text-lg font-semibold text-gray-900 mb-4">Mood History</Text>
              
              <View className="space-y-3">
                {entries.slice(0, 20).map((entry) => {
                  const mood = moods.find(m => m.value === entry.mood);
                  return (
                    <View key={entry.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center">
                          <Text className="text-2xl mr-3">{mood?.emoji}</Text>
                          <View>
                            <Text className="font-semibold text-gray-900">{mood?.label}</Text>
                            <Text className="text-gray-600 text-sm">
                              {new Date(entry.date).toLocaleDateString('en', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </Text>
                          </View>
                        </View>
                        <View 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getMoodColor(entry.mood) }}
                        />
                      </View>
                      
                      {entry.note && (
                        <Text className="text-gray-700 mt-2 italic">"{entry.note}"</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Empty State */}
          {entries.length === 0 && (
            <View className="items-center py-12">
              <Ionicons name="heart-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 text-lg mt-4">Start tracking your mood</Text>
              <Text className="text-gray-400 text-center mt-2">
                Select how you're feeling today to begin your mood journey
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}