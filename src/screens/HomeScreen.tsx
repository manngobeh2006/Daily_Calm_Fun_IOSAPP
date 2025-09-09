import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeInLeft, 
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate
} from "react-native-reanimated";

import { useUserStore } from "../state/userStore";
import { useActivitiesStore } from "../state/activitiesStore";
import { useMoodStore } from "../state/moodStore";
import SpinWheel from "../components/SpinWheel";

export default function HomeScreen() {
  const navigation = useNavigation();
  const userName = useUserStore((state) => state.name);
  const isPremium = useUserStore((state) => state.isPremium);
  const currentStreak = useActivitiesStore((state) => state.currentStreak);
  const getCompletedTodayCount = useActivitiesStore((state) => state.getCompletedTodayCount);
  const getTodayMood = useMoodStore((state) => state.getTodayMood);
  
  const [todaysFocus, setTodaysFocus] = useState("");
  const [recommendedActivity, setRecommendedActivity] = useState<any>(null);
  
  const completedToday = getCompletedTodayCount();
  const maxDailyActivities = isPremium ? 9 : 3;
  const todayMood = getTodayMood();
  const { width } = Dimensions.get("window");

  // Animation values
  const progressValue = useSharedValue(0);
  const streakScale = useSharedValue(1);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(progressValue.value, [0, 1], [0, (completedToday / maxDailyActivities) * 100])}%`,
    };
  });

  const streakStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: streakScale.value }],
    };
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getTodaysFocus = () => {
    const focuses = [
      "Find moments of peace in your day",
      "Practice gratitude for small joys", 
      "Take three deep breaths when stressed",
      "Notice the beauty around you",
      "Be kind to yourself today",
      "Embrace the present moment",
      "Let go of what you cannot control"
    ];
    return focuses[new Date().getDay()];
  };

  const getRecommendedActivity = () => {
    const hour = new Date().getHours();
    const moodLevel = todayMood?.mood;
    
    if (hour < 10) {
      return { title: "Morning Energy Boost", type: "energize", icon: "sunny", color: "#F59E0B" };
    } else if (hour > 20) {
      return { title: "Evening Wind Down", type: "relax", icon: "moon", color: "#6366F1" };
    } else if (moodLevel && moodLevel <= 2) {
      return { title: "Quick Stress Relief", type: "sos", icon: "heart", color: "#EF4444" };
    } else if (moodLevel && moodLevel === 3) {
      return { title: "Energy Restoration", type: "energize", icon: "flash", color: "#10B981" };
    } else {
      return { title: "Mindful Moment", type: "mindfulness", icon: "leaf", color: "#8B5CF6" };
    }
  };

  useEffect(() => {
    setTodaysFocus(getTodaysFocus());
    setRecommendedActivity(getRecommendedActivity());
    
    // Animate progress bar
    progressValue.value = withTiming(1, { duration: 1000 });
    
    // Animate streak when it changes
    if (currentStreak > 0) {
      streakScale.value = withSpring(1.1, { duration: 300 });
      setTimeout(() => {
        streakScale.value = withSpring(1, { duration: 300 });
      }, 300);
    }
  }, [todayMood, currentStreak, completedToday]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with Gradient Background */}
        <Animated.View entering={FadeInDown.duration(800)}>
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            className="px-6 pt-4 pb-8 rounded-b-3xl"
          >
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold">
                {getGreeting()}{userName ? `, ${userName}` : ""}!
              </Text>
              <Text className="text-white/80 mt-1 text-base">
                {todaysFocus}
              </Text>
            </View>
            
            {!isPremium && (
              <Pressable
                className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm"
                onPress={() => navigation.navigate("Premium" as never)}
              >
                <Text className="text-white font-semibold">✨ Premium</Text>
              </Pressable>
            )}
          </View>

          {/* Streak & Progress Combined */}
          <View className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <View className="flex-row items-center justify-between mb-3">
              <Animated.View className="flex-row items-center" style={streakStyle}>
                <Text className="text-white text-lg font-bold mr-2">🔥 {currentStreak}</Text>
                <Text className="text-white/90 font-medium">day streak</Text>
              </Animated.View>
              <Text className="text-white/90 font-medium">
                {completedToday}/{maxDailyActivities} today
              </Text>
            </View>
            
            <View className="bg-white/20 rounded-full h-2">
              <Animated.View 
                className="bg-white rounded-full h-2"
                style={progressStyle}
              />
            </View>
          </View>
        </LinearGradient>
        </Animated.View>

        <View className="px-6 mt-6">
          {/* Today's Recommended Activity */}
          {recommendedActivity && (
            <Animated.View className="mb-6" entering={FadeInUp.delay(200).duration(600)}>
              <Text className="text-lg font-bold text-gray-900 mb-3">Recommended for You</Text>
              <Pressable 
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                onPress={() => navigation.navigate("Activities" as never)}
              >
                <View className="flex-row items-center">
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: recommendedActivity.color + "20" }}
                  >
                    <Ionicons 
                      name={recommendedActivity.icon as any} 
                      size={24} 
                      color={recommendedActivity.color} 
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold text-base">
                      {recommendedActivity.title}
                    </Text>
                    <Text className="text-gray-600 text-sm mt-1">
                      Perfect for your current mood and time of day
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </Pressable>
            </Animated.View>
          )}

          {/* Quick Actions Grid */}
          <Animated.View className="mb-6" entering={FadeInUp.delay(400).duration(600)}>
            <Text className="text-lg font-bold text-gray-900 mb-3">Quick Actions</Text>
            
            <View className="flex-row flex-wrap justify-between">
              <Animated.View entering={FadeInLeft.delay(500).duration(500)}>
                <Pressable 
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3"
                  style={{ width: (width - 48 - 12) / 2 }}
                  onPress={() => navigation.navigate("Activities" as never)}
                >
                <View className="bg-blue-50 w-12 h-12 rounded-full items-center justify-center mb-3">
                  <Ionicons name="leaf" size={24} color="#3B82F6" />
                </View>
                  <Text className="text-gray-900 font-semibold">Relax</Text>
                  <Text className="text-gray-600 text-sm mt-1">Breathing & calm</Text>
                </Pressable>
              </Animated.View>
              
              <Animated.View entering={FadeInRight.delay(600).duration(500)}>
                <Pressable 
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3"
                  style={{ width: (width - 48 - 12) / 2 }}
                  onPress={() => navigation.navigate("Activities" as never)}
                >
                <View className="bg-green-50 w-12 h-12 rounded-full items-center justify-center mb-3">
                  <Ionicons name="bulb" size={24} color="#10B981" />
                </View>
                  <Text className="text-gray-900 font-semibold">Learn</Text>
                  <Text className="text-gray-600 text-sm mt-1">Facts & wisdom</Text>
                </Pressable>
              </Animated.View>
              
              <Animated.View entering={FadeInLeft.delay(700).duration(500)}>
                <Pressable 
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3"
                  style={{ width: (width - 48 - 12) / 2 }}
                  onPress={() => navigation.navigate("Activities" as never)}
                >
                <View className="bg-orange-50 w-12 h-12 rounded-full items-center justify-center mb-3">
                  <Ionicons name="brush" size={24} color="#F59E0B" />
                </View>
                  <Text className="text-gray-900 font-semibold">Create</Text>
                  <Text className="text-gray-600 text-sm mt-1">Art & expression</Text>
                </Pressable>
              </Animated.View>

              {/* SOS Quick Relief */}
              <Animated.View entering={FadeInRight.delay(800).duration(500)}>
                <Pressable 
                  className="bg-red-50 rounded-2xl p-4 shadow-sm border border-red-100 mb-3"
                  style={{ width: (width - 48 - 12) / 2 }}
                  onPress={() => navigation.navigate("Activities" as never)}
                >
                <View className="bg-red-100 w-12 h-12 rounded-full items-center justify-center mb-3">
                  <Ionicons name="heart" size={24} color="#EF4444" />
                </View>
                  <Text className="text-gray-900 font-semibold">SOS Relief</Text>
                  <Text className="text-gray-600 text-sm mt-1">Quick calm</Text>
                </Pressable>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Premium Features */}
          {isPremium && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">Premium Features</Text>
              <View className="flex-row space-x-3">
                <Pressable 
                  className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                  onPress={() => navigation.navigate("ActivityLibrary" as never)}
                >
                  <View className="bg-purple-50 w-12 h-12 rounded-full items-center justify-center mb-3">
                    <Ionicons name="library" size={24} color="#8B5CF6" />
                  </View>
                  <Text className="text-gray-900 font-semibold">Library</Text>
                  <Text className="text-gray-600 text-sm mt-1">Full collection</Text>
                </Pressable>
                
                <Pressable 
                  className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                  onPress={() => navigation.navigate("MoodTracker" as never)}
                >
                  <View className="bg-pink-50 w-12 h-12 rounded-full items-center justify-center mb-3">
                    <Ionicons name="heart" size={24} color="#EC4899" />
                  </View>
                  <Text className="text-gray-900 font-semibold">Mood</Text>
                  <Text className="text-gray-600 text-sm mt-1">Track & insights</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Continue Button */}
          {completedToday < maxDailyActivities ? (
            <Pressable
              className="bg-gradient-to-r from-purple-600 to-pink-600 py-4 px-6 rounded-2xl items-center mb-6 shadow-lg"
              onPress={() => navigation.navigate("Activities" as never)}
            >
              <Text className="text-white font-bold text-lg">Continue Your Journey</Text>
              <Text className="text-white/90 text-sm mt-1">
                {maxDailyActivities - completedToday} activities remaining
              </Text>
            </Pressable>
          ) : (
            <View className="bg-green-50 rounded-2xl p-6 items-center mb-6 border border-green-100">
              <Text className="text-green-700 font-bold text-lg">🎉 Amazing Work!</Text>
              <Text className="text-green-600 text-center mt-2">
                You've completed all your activities for today. Come back tomorrow for new challenges!
              </Text>
            </View>
          )}

          {/* Premium Spin Wheel */}
          {isPremium && completedToday >= 3 && (
            <View className="mb-8">
              <SpinWheel 
                canSpin={true} 
                onSpin={(reward) => {
                  console.log("Spin reward:", reward);
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}