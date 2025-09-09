import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useActivitiesStore, Activity } from "../state/activitiesStore";
import { useUserStore } from "../state/userStore";

type FilterType = "all" | "completed" | "in-progress" | "relax" | "learn" | "create";

interface ExtendedActivity extends Activity {
  completed: boolean;
  started: boolean;
  dayNumber: number;
  date: string;
}

export default function ActivityLibraryScreen() {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const {
    dailyActivities,
    completedActivities,
    startedActivities,
  } = useActivitiesStore();
  
  const isPremium = useUserStore((state) => state.isPremium);

  // Get all activities from all days
  const allActivities: ExtendedActivity[] = dailyActivities.flatMap(day => 
    day.activities.map(activity => ({
      ...activity,
      completed: completedActivities.includes(activity.id),
      started: startedActivities.includes(activity.id),
      dayNumber: day.day,
      date: day.date,
    }))
  );

  // Filter activities based on selected filter and search query
  const filteredActivities = allActivities.filter(activity => {
    if (!isPremium && activity.premium_only) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        activity.title.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        activity.type.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }
    
    // Type filter
    switch (selectedFilter) {
      case "completed":
        return activity.completed;
      case "in-progress":
        return activity.started && !activity.completed;
      case "relax":
      case "learn":
      case "create":
        return activity.type === selectedFilter;
      default:
        return true;
    }
  });

  const filters = [
    { key: "all", label: "All", icon: "grid" },
    { key: "completed", label: "Completed", icon: "checkmark-circle" },
    { key: "in-progress", label: "In Progress", icon: "time" },
    { key: "relax", label: "Relax", icon: "leaf" },
    { key: "learn", label: "Learn", icon: "bulb" },
    { key: "create", label: "Create", icon: "brush" },
  ];

  const getActivityStats = () => {
    const completed = allActivities.filter(a => a.completed).length;
    const total = allActivities.filter(a => !a.premium_only || isPremium).length;
    const byType = {
      relax: allActivities.filter(a => a.type === "relax" && a.completed).length,
      learn: allActivities.filter(a => a.type === "learn" && a.completed).length,
      create: allActivities.filter(a => a.type === "create" && a.completed).length,
    };
    
    return { completed, total, byType };
  };

  const stats = getActivityStats();

  const handleActivityPress = (activity: ExtendedActivity) => {
    const anyNav = navigation as any;
    anyNav.navigate("ActivityDetail", { activity });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "relax": return "leaf";
      case "learn": return "bulb";
      case "create": return "brush";
      default: return "ellipse";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "relax": return "blue";
      case "learn": return "green";
      case "create": return "orange";
      default: return "gray";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-4">
        <Text className="text-2xl font-bold text-gray-900 mb-6">Activity Library</Text>
        
        {/* Stats Overview */}
        <View className="bg-purple-50 rounded-2xl p-6 mb-6">
          <Text className="text-lg font-semibold text-purple-900 mb-4">Your Progress</Text>
          
          <View className="flex-row justify-between mb-4">
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-600">{stats.completed}</Text>
              <Text className="text-purple-700 text-sm">Completed</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-600">{stats.total}</Text>
              <Text className="text-gray-600 text-sm">Total Available</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </Text>
              <Text className="text-green-700 text-sm">Completion</Text>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-lg font-bold text-blue-600">{stats.byType.relax}</Text>
              <Text className="text-blue-700 text-xs">Relax</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-lg font-bold text-green-600">{stats.byType.learn}</Text>
              <Text className="text-green-700 text-xs">Learn</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-lg font-bold text-orange-600">{stats.byType.create}</Text>
              <Text className="text-orange-700 text-xs">Create</Text>
            </View>
          </View>
        </View>
        
        {/* Search Bar */}
        <View className="mb-4">
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="Search activities..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          <View className="flex-row space-x-3">
            {filters.map((filter) => (
              <Pressable
                key={filter.key}
                className={`px-4 py-2 rounded-full flex-row items-center space-x-2 ${
                  selectedFilter === filter.key 
                    ? "bg-purple-600" 
                    : "bg-gray-100"
                }`}
                onPress={() => setSelectedFilter(filter.key as FilterType)}
              >
                <Ionicons 
                  name={filter.icon as keyof typeof Ionicons.glyphMap} 
                  size={16} 
                  color={selectedFilter === filter.key ? "#FFFFFF" : "#6B7280"} 
                />
                <Text className={`font-medium ${
                  selectedFilter === filter.key ? "text-white" : "text-gray-600"
                }`}>
                  {filter.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-6">
        <View className="space-y-4 pb-8">
          {filteredActivities.length === 0 ? (
            <View className="items-center py-12">
              <Ionicons name="library-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 text-lg mt-4">No activities found</Text>
              <Text className="text-gray-400 text-center mt-2">
                {selectedFilter === "completed" 
                  ? "Complete some activities to see them here"
                  : "Try adjusting your filters"
                }
              </Text>
            </View>
          ) : (
            filteredActivities.map((activity) => (
              <Pressable
                key={activity.id}
                className="bg-white border border-gray-200 rounded-2xl p-6"
                onPress={() => handleActivityPress(activity)}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <View className={`w-10 h-10 bg-${getActivityColor(activity.type)}-100 rounded-full items-center justify-center mr-3`}>
                        <Ionicons 
                          name={getActivityIcon(activity.type)} 
                          size={20} 
                          color={
                            activity.type === "relax" ? "#3B82F6" :
                            activity.type === "learn" ? "#10B981" : "#F59E0B"
                          } 
                        />
                      </View>
                      
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-900">
                          {activity.title}
                        </Text>
                        <View className="flex-row items-center">
                          <Text className="text-sm text-gray-600 capitalize mr-2">
                            {activity.type}
                          </Text>
                          {activity.premium_only && (
                            <View className="bg-purple-100 px-2 py-1 rounded-full">
                              <Text className="text-purple-700 text-xs font-medium">Premium</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                    
                    <Text className="text-gray-600 leading-relaxed mb-3">
                      {activity.description}
                    </Text>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-500 text-sm">
                        Day {activity.dayNumber} • {activity.date}
                      </Text>
                      
                      <View className="flex-row items-center">
                        {activity.completed ? (
                          <View className="flex-row items-center">
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            <Text className="text-green-600 text-sm font-medium ml-1">Completed</Text>
                          </View>
                        ) : activity.started ? (
                          <View className="flex-row items-center">
                            <Ionicons name="time" size={16} color="#F59E0B" />
                            <Text className="text-orange-600 text-sm font-medium ml-1">In Progress</Text>
                          </View>
                        ) : (
                          <View className="flex-row items-center">
                            <Ionicons name="play-circle" size={16} color="#8B5CF6" />
                            <Text className="text-purple-600 text-sm font-medium ml-1">Start</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}