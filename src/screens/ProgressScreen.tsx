import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeInLeft, 
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  SlideInRight,
  SlideInLeft
} from "react-native-reanimated";

import { useActivitiesStore } from "../state/activitiesStore";
import { useUserStore } from "../state/userStore";
import { useGamificationStore } from "../state/gamificationStore";
import { AchievementCard, BadgeCard, ProgressRing } from "../components/AchievementCard";

export default function ProgressScreen() {
  const [selectedTab, setSelectedTab] = useState<"overview" | "achievements" | "badges">("overview");
  
  // Animation values
  const progressValue = useSharedValue(0);
  const levelProgressValue = useSharedValue(0);
  const statsScale = useSharedValue(0.8);
  
  const currentStreak = useActivitiesStore((state) => state.currentStreak);
  const totalActivitiesCompleted = useActivitiesStore((state) => state.totalActivitiesCompleted);
  const isPremium = useUserStore((state) => state.isPremium);
  
  const userStats = useGamificationStore((state) => state.userStats);
  const achievements = useGamificationStore((state) => state.achievements);
  const badges = useGamificationStore((state) => state.badges);
  const getUnlockedBadges = useGamificationStore((state) => state.getUnlockedBadges);
  const getUserLevel = useGamificationStore((state) => state.getUserLevel);
  const initializeAchievements = useGamificationStore((state) => state.initializeAchievements);
  
  const { width } = Dimensions.get("window");
  const levelInfo = getUserLevel();
  const unlockedBadges = getUnlockedBadges();
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);

  const levelProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(levelProgressValue.value, [0, 1], [0, levelInfo.progress])}%`,
    };
  });

  const statsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: statsScale.value }],
    };
  });

  useEffect(() => {
    initializeAchievements();
    
    // Animate progress bars
    levelProgressValue.value = withTiming(1, { duration: 1200 });
    
    // Animate stats cards
    statsScale.value = withSpring(1, { duration: 800 });
  }, []);

  const stats = [
    { label: "Level", value: levelInfo.level.toString(), icon: "star", color: "#8B5CF6", bg: "#F3E8FF" },
    { label: "Current Streak", value: `${currentStreak}`, icon: "flame", color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Total Activities", value: totalActivitiesCompleted.toString(), icon: "checkmark-circle", color: "#10B981", bg: "#ECFDF5" },
    { label: "Badges Earned", value: unlockedBadges.length.toString(), icon: "medal", color: "#EC4899", bg: "#FDF2F8" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with Level Progress */}
        <Animated.View entering={FadeInDown.duration(800)}>
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            className="px-6 pt-4 pb-8 rounded-b-3xl"
          >
            <Text className="text-white text-2xl font-bold mb-6">Your Progress</Text>
            
            {/* Level Card */}
            <View className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-white text-3xl font-bold">Level {levelInfo.level}</Text>
                  <Text className="text-white/80">Wellness Explorer</Text>
                </View>
                <View className="items-center">
                  <ProgressRing 
                    progress={levelInfo.progress} 
                    size={60} 
                    strokeWidth={6} 
                    color="#FFFFFF" 
                    backgroundColor="rgba(255,255,255,0.3)"
                  />
                </View>
              </View>
              
              <View className="bg-white/20 rounded-full h-2 mb-2">
                <Animated.View 
                  className="bg-white rounded-full h-2"
                  style={levelProgressStyle}
                />
              </View>
              <Text className="text-white/80 text-sm">
                {userStats.experiencePoints} / {levelInfo.nextLevelXP} XP
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <View className="px-6 mt-6">
          {/* Tab Navigation */}
          <Animated.View className="flex-row bg-white rounded-2xl p-1 mb-6 shadow-sm" entering={FadeInUp.delay(200).duration(600)}>
            {[
              { key: "overview", label: "Overview" },
              { key: "achievements", label: "Achievements" },
              { key: "badges", label: "Badges" }
            ].map((tab) => (
              <Pressable
                key={tab.key}
                className={`flex-1 py-3 px-4 rounded-xl ${
                  selectedTab === tab.key ? "bg-purple-600" : ""
                }`}
                onPress={() => setSelectedTab(tab.key as any)}
              >
                <Text className={`text-center font-medium ${
                  selectedTab === tab.key ? "text-white" : "text-gray-600"
                }`}>
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </Animated.View>

          {/* Overview Tab */}
          {selectedTab === "overview" && (
            <>
              {/* Stats Grid */}
              <Animated.View className="flex-row flex-wrap justify-between mb-6" style={statsStyle}>
                {stats.map((stat, index) => (
                  <Animated.View 
                    key={index} 
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4" 
                    style={{ width: (width - 48 - 12) / 2 }}
                    entering={SlideInLeft.delay(400 + index * 100).duration(500)}
                  >
                    <View 
                      className="w-12 h-12 rounded-full items-center justify-center mb-3"
                      style={{ backgroundColor: stat.bg }}
                    >
                      <Ionicons 
                        name={stat.icon as keyof typeof Ionicons.glyphMap} 
                        size={24} 
                        color={stat.color} 
                      />
                    </View>
                    <Text className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</Text>
                    <Text className="text-gray-600 text-sm">{stat.label}</Text>
                  </Animated.View>
                ))}
              </Animated.View>

              {/* Recent Achievements */}
              <Animated.View className="mb-6" entering={FadeInLeft.delay(600).duration(600)}>
                <Text className="text-lg font-bold text-gray-900 mb-3">Recent Achievements</Text>
                {unlockedAchievements.slice(0, 3).map((achievement, index) => (
                  <Animated.View key={achievement.id} entering={SlideInRight.delay(700 + index * 100).duration(500)}>
                    <AchievementCard achievement={achievement} />
                  </Animated.View>
                ))}
                {unlockedAchievements.length === 0 && (
                  <Animated.View 
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 items-center"
                    entering={FadeInUp.delay(700).duration(500)}
                  >
                    <Ionicons name="trophy-outline" size={48} color="#9CA3AF" />
                    <Text className="text-gray-500 text-center mt-2">
                      Complete activities to unlock achievements!
                    </Text>
                  </Animated.View>
                )}
              </Animated.View>

              {/* Recent Badges */}
              <Animated.View className="mb-6" entering={FadeInRight.delay(800).duration(600)}>
                <Text className="text-lg font-bold text-gray-900 mb-3">Recent Badges</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row space-x-3">
                    {unlockedBadges.slice(0, 5).map((badge, index) => (
                      <Animated.View key={badge.id} entering={SlideInLeft.delay(900 + index * 50).duration(400)}>
                        <BadgeCard badge={badge} isEarned={true} />
                      </Animated.View>
                    ))}
                    {unlockedBadges.length === 0 && (
                      <Animated.View 
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 items-center" 
                        style={{ width: 200 }}
                        entering={FadeInUp.delay(900).duration(500)}
                      >
                        <Ionicons name="medal-outline" size={48} color="#9CA3AF" />
                        <Text className="text-gray-500 text-center mt-2">
                          Earn your first badge!
                        </Text>
                      </Animated.View>
                    )}
                  </View>
                </ScrollView>
              </Animated.View>
            </>
          )}

          {/* Achievements Tab */}
          {selectedTab === "achievements" && (
            <Animated.View className="mb-6" entering={FadeInUp.duration(600)}>
              <Text className="text-lg font-bold text-gray-900 mb-3">All Achievements</Text>
              {achievements.map((achievement, index) => (
                <Animated.View key={achievement.id} entering={SlideInRight.delay(index * 100).duration(500)}>
                  <AchievementCard achievement={achievement} />
                </Animated.View>
              ))}
            </Animated.View>
          )}

          {/* Badges Tab */}
          {selectedTab === "badges" && (
            <Animated.View className="mb-6" entering={FadeInUp.duration(600)}>
              <Text className="text-lg font-bold text-gray-900 mb-3">Badge Collection</Text>
              <View className="flex-row flex-wrap justify-between">
                {badges.map((badge, index) => (
                  <Animated.View key={badge.id} className="mb-4" entering={SlideInLeft.delay(index * 50).duration(400)}>
                    <BadgeCard 
                      badge={badge} 
                      isEarned={!!badge.earnedAt} 
                    />
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Premium Upsell */}
          {!isPremium && (
            <Animated.View entering={FadeInUp.delay(1000).duration(600)}>
              <LinearGradient
                colors={["#8B5CF6", "#EC4899"]}
                className="rounded-2xl p-6 mb-8"
              >
                <Text className="text-white text-lg font-semibold mb-2">
                  ✨ Unlock Premium Progress
                </Text>
                <Text className="text-white/90 mb-4">
                  Get advanced analytics, exclusive badges, and detailed insights into your wellness journey.
                </Text>
                <Pressable className="bg-white py-3 px-6 rounded-xl">
                  <Text className="text-purple-600 font-semibold text-center">Upgrade Now</Text>
                </Pressable>
              </LinearGradient>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}