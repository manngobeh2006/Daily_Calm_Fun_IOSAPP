import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeInLeft, 
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  SlideInRight,
  SlideInLeft
} from "react-native-reanimated";

import { RootStackParamList } from "../types/navigation";

import { useUserStore } from "../state/userStore";
import { useActivitiesStore } from "../state/activitiesStore";
import { useMoodStore } from "../state/moodStore";
import { activityCategories, expandedActivities, getRecommendedActivities, ExpandedActivity } from "../data/expandedActivities";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ActivitiesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [recommendedActivities, setRecommendedActivities] = useState<ExpandedActivity[]>([]);
  
  // Animation values
  const progressValue = useSharedValue(0);
  const filterScale = useSharedValue(1);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(progressValue.value, [0, 1], [0, (completedToday / maxFreeActivities) * 100])}%`,
    };
  });
  
  const isPremium = useUserStore((state) => state.isPremium);
  const getCompletedTodayCount = useActivitiesStore((state) => state.getCompletedTodayCount);
  const getTodayMood = useMoodStore((state) => state.getTodayMood);
  
  const completedToday = getCompletedTodayCount();
  const maxFreeActivities = 3;
  const todayMood = getTodayMood();
  const { width } = Dimensions.get("window");

  // Get current time of day
  const getTimeOfDay = (): "morning" | "afternoon" | "evening" => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };

  // Filter expanded activities based on selections
  const getFilteredActivities = (): ExpandedActivity[] => {
    let filtered = [...expandedActivities];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(activity => activity.category === selectedCategory);
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(activity => activity.difficulty === selectedDifficulty);
    }

    // Filter by premium status
    if (!isPremium) {
      filtered = filtered.filter(activity => !activity.premium_only);
    }

    return filtered;
  };

  const filteredActivities = getFilteredActivities();

  // Generate recommendations on component mount
  useEffect(() => {
    const recommendations = getRecommendedActivities(
      todayMood?.mood,
      getTimeOfDay(),
      15 // Max 15 minutes for recommendations
    );
    setRecommendedActivities(recommendations);
    
    // Animate progress bar
    progressValue.value = withTiming(1, { duration: 1000 });
  }, [todayMood, completedToday]);



  const handleActivityPress = (activity: ExpandedActivity) => {
    if (activity.premium_only && !isPremium) {
      navigation.navigate("Premium" as never);
      return;
    }
    
    if (!isPremium && completedToday >= maxFreeActivities) {
      navigation.navigate("Premium" as never);
      return;
    }
    
    const parentNav: any = (navigation as any).getParent ? (navigation as any).getParent() : null;
    if (parentNav?.navigate) {
      parentNav.navigate("ActivityDetail", { activity });
    } else {
      navigation.navigate("ActivityDetail", { activity });
    }
  };

  const categoryFilters = [
    { key: "all", label: "All", icon: "grid" },
    { key: "breathing", label: "Breathing", icon: "leaf" },
    { key: "meditation", label: "Meditation", icon: "flower" },
    { key: "anxiety_relief", label: "SOS", icon: "heart" },
    { key: "focus_boost", label: "Focus", icon: "eye" },
    { key: "energy_builder", label: "Energy", icon: "flash" },
    { key: "sleep_preparation", label: "Sleep", icon: "moon" },
    { key: "gratitude", label: "Gratitude", icon: "heart-circle" },
  ];

  const difficultyFilters = [
    { key: "all", label: "All Levels" },
    { key: "beginner", label: "Beginner" },
    { key: "intermediate", label: "Intermediate" },
    { key: "advanced", label: "Advanced" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View className="px-6 pt-4 pb-2" entering={FadeInDown.duration(600)}>
          <Text className="text-2xl font-bold text-gray-900 mb-2">Wellness Activities</Text>
          <Text className="text-gray-600">Choose activities that match your current needs</Text>
        </Animated.View>

        {/* Recommended Activities */}
        {recommendedActivities.length > 0 && (
          <Animated.View className="px-6 mb-6" entering={FadeInUp.delay(200).duration(600)}>
            <Text className="text-lg font-bold text-gray-900 mb-3">Recommended for You</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-3">
                {recommendedActivities.slice(0, 3).map((activity, index) => (
                  <Animated.View key={activity.id} entering={SlideInRight.delay(300 + index * 100).duration(500)}>
                    <Pressable
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                      style={{ width: width * 0.7 }}
                      onPress={() => handleActivityPress(activity)}
                    >
                    <View className="flex-row items-center mb-3">
                      <View 
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: activityCategories.find(cat => cat.id === activity.category)?.backgroundColor || "#F3F4F6" }}
                      >
                        <Ionicons 
                          name={activityCategories.find(cat => cat.id === activity.category)?.icon as any || "leaf"} 
                          size={20} 
                          color={activityCategories.find(cat => cat.id === activity.category)?.color || "#6B7280"} 
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-900 font-semibold text-sm">{activity.title}</Text>
                        <Text className="text-gray-600 text-xs">{activity.duration} min • {activity.difficulty}</Text>
                      </View>
                      {activity.premium_only && !isPremium && (
                        <View className="bg-purple-100 px-2 py-1 rounded-full">
                          <Text className="text-purple-700 text-xs font-medium">Premium</Text>
                        </View>
                      )}
                    </View>
                      <Text className="text-gray-700 text-sm">{activity.description}</Text>
                    </Pressable>
                  </Animated.View>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        )}

        {/* Category Filter */}
        <Animated.View className="px-6 mb-4" entering={FadeInLeft.delay(400).duration(600)}>
          <Text className="text-lg font-bold text-gray-900 mb-3">Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {categoryFilters.map((filter, index) => (
                <Animated.View key={filter.key} entering={SlideInLeft.delay(500 + index * 50).duration(400)}>
                  <Pressable
                    className={`px-4 py-2 rounded-full flex-row items-center space-x-2 ${
                      selectedCategory === filter.key 
                        ? "bg-purple-600" 
                        : "bg-white border border-gray-200"
                    }`}
                    onPress={() => setSelectedCategory(filter.key)}
                  >
                  <Ionicons 
                    name={filter.icon as keyof typeof Ionicons.glyphMap} 
                    size={16} 
                    color={selectedCategory === filter.key ? "#FFFFFF" : "#6B7280"} 
                  />
                    <Text className={`font-medium ${
                      selectedCategory === filter.key ? "text-white" : "text-gray-600"
                    }`}>
                      {filter.label}
                    </Text>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Difficulty Filter */}
        <Animated.View className="px-6 mb-6" entering={FadeInRight.delay(600).duration(600)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {difficultyFilters.map((filter, index) => (
                <Animated.View key={filter.key} entering={SlideInRight.delay(700 + index * 50).duration(400)}>
                  <Pressable
                    className={`px-3 py-1 rounded-full ${
                      selectedDifficulty === filter.key 
                        ? "bg-gray-900" 
                        : "bg-gray-200"
                    }`}
                    onPress={() => setSelectedDifficulty(filter.key)}
                  >
                    <Text className={`text-sm font-medium ${
                      selectedDifficulty === filter.key ? "text-white" : "text-gray-600"
                    }`}>
                      {filter.label}
                    </Text>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Progress Indicator */}
        {!isPremium && (
          <View className="px-6 mb-6">
            <View className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-purple-900 font-semibold">Free Daily Limit</Text>
                <Text className="text-purple-700 font-bold">{completedToday}/{maxFreeActivities}</Text>
              </View>
              <View className="bg-purple-200 rounded-full h-2">
                <Animated.View 
                  className="bg-purple-600 rounded-full h-2"
                  style={progressStyle}
                />
              </View>
              {completedToday >= maxFreeActivities && (
                <Text className="text-purple-700 text-sm mt-2">
                  ✨ Upgrade to Premium for unlimited activities and advanced features!
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Activities Grid */}
        <View className="px-6 pb-8">
          <View className="flex-row flex-wrap justify-between">
            {filteredActivities.map((activity) => {
              const isLocked = activity.premium_only && !isPremium;
              const isFreeLimitReached = !isPremium && completedToday >= maxFreeActivities;
              const shouldShowLock = isLocked || isFreeLimitReached;
              const category = activityCategories.find(cat => cat.id === activity.category);
              
              return (
                <Pressable
                  key={activity.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 ${shouldShowLock ? 'opacity-60' : ''}`}
                  style={{ width: (width - 48 - 12) / 2 }}
                  onPress={() => handleActivityPress(activity)}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View 
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: category?.backgroundColor || "#F3F4F6" }}
                    >
                      <Ionicons 
                        name={category?.icon as any || "leaf"} 
                        size={20} 
                        color={category?.color || "#6B7280"} 
                      />
                    </View>
                    {shouldShowLock && (
                      <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
                    )}
                  </View>
                  
                  <Text className="text-gray-900 font-semibold text-sm mb-1">{activity.title}</Text>
                  <Text className="text-gray-600 text-xs mb-2">{activity.description}</Text>
                  
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-500 text-xs">{activity.duration} min</Text>
                    <View className={`px-2 py-1 rounded-full ${
                      activity.difficulty === 'beginner' ? 'bg-green-100' :
                      activity.difficulty === 'intermediate' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Text className={`text-xs font-medium ${
                        activity.difficulty === 'beginner' ? 'text-green-700' :
                        activity.difficulty === 'intermediate' ? 'text-yellow-700' : 'text-red-700'
                      }`}>
                        {activity.difficulty}
                      </Text>
                    </View>
                  </View>
                  
                  {activity.premium_only && !isPremium && (
                    <View className="mt-2 bg-purple-100 px-2 py-1 rounded-full self-start">
                      <Text className="text-purple-700 text-xs font-medium">Premium</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <View className="items-center py-12 px-6">
            <Ionicons name="search-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-4 text-center">No activities found</Text>
            <Text className="text-gray-400 text-center mt-2">
              Try adjusting your filters or upgrade to Premium for more options
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}