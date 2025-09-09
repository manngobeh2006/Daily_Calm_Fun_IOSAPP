import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeInLeft, 
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  interpolate,
  SlideInRight,
  SlideInLeft,
  ZoomIn
} from "react-native-reanimated";

import { useActivitiesStore } from "../state/activitiesStore";
import { ExpandedActivity, activityCategories } from "../data/expandedActivities";
import RelaxActivity from "../components/activities/RelaxActivity";
import LearnActivity from "../components/activities/LearnActivity";
import CreateActivity from "../components/activities/CreateActivity";
import { FeedbackUtils } from "../utils/feedbackUtils";

export default function ActivityDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [isCompleted, setIsCompleted] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  
  // Animation values
  const completionScale = useSharedValue(0);
  const motivationOpacity = useSharedValue(0);
  const progressValue = useSharedValue(0);
  const { } = Dimensions.get("window");

  const completionStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: completionScale.value }],
    };
  });

  const motivationStyle = useAnimatedStyle(() => {
    return {
      opacity: motivationOpacity.value,
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(progressValue.value, [0, 1], [0, 100])}%`,
    };
  });
  
  const completeActivity = useActivitiesStore((state) => state.completeActivity);
  const startActivity = useActivitiesStore((state) => state.startActivity);
  
  // Get activity from route params
  const activity: ExpandedActivity = (route.params as any)?.activity || {
    id: "sample",
    type: "relax",
    category: "breathing",
    title: "Sample Activity",
    description: "This is a sample activity",
    difficulty: "beginner",
    duration: 5,
    premium_only: false,
    tags: ["sample"],
    instructions: ["This is a sample instruction"],
    benefits: ["Sample benefit"],
    content: {
      instructions: "Sample instructions",
      duration: "5 minutes"
    }
  };

  const safeGoBack = () => {
    const anyNav = navigation as any;
    if (anyNav?.canGoBack && anyNav.canGoBack()) {
      anyNav.goBack ? anyNav.goBack() : navigation.goBack();
    } else if (anyNav?.navigate) {
      anyNav.navigate("MainTabs", { screen: "Activities" });
    }
  };

  const handleComplete = () => {
    completeActivity(activity.id);
    setIsCompleted(true);
    
    // Haptic and sound feedback
    FeedbackUtils.activityComplete();
    
    // Animate completion
    completionScale.value = withSequence(
      withSpring(1.2, { duration: 300 }),
      withSpring(1, { duration: 300 })
    );
    
    // Show motivational message
    setShowMotivation(true);
    motivationOpacity.value = withTiming(1, { duration: 500 });
    
    setTimeout(safeGoBack, 2000);
  };

  useEffect(() => {
    startActivity(activity.id);
    
    // Animate progress bar on mount
    progressValue.value = withTiming(1, { duration: 1000 });
  }, [activity.id]);

  const getAnimationSource = (category: string) => {
    switch (category) {
      case "breathing":
        return require("../../assets/animations/breathing.json");
      case "meditation":
        return require("../../assets/animations/meditation.json");
      case "anxiety_relief":
        return require("../../assets/animations/heart.json");
      case "focus_boost":
        return require("../../assets/animations/focus.json");
      case "sleep_preparation":
        return require("../../assets/animations/sleep.json");
      case "gratitude":
        return require("../../assets/animations/gratitude.json");
      default:
        return require("../../assets/animations/breathing.json");
    }
  };

  const getActivityContent = () => {
    switch (activity.type) {
      case "relax":
        return (
          <RelaxActivity 
            content={activity.content} 
            activity={activity}
            onComplete={handleComplete}
          />
        );
        
      case "learn":
        return (
          <LearnActivity 
            content={activity.content} 
            activity={activity}
            onComplete={handleComplete}
          />
        );
        
      case "create":
        return (
          <CreateActivity 
            content={activity.content} 
            activity={activity}
            onComplete={handleComplete}
          />
        );
        
      default:
        return null;
    }
  };

  if (isCompleted) {
    const motivationalMessages = [
      "Amazing work! You're building healthy habits! 💪",
      "You're on fire! Keep this momentum going! 🔥",
      "Fantastic! Your wellness journey is inspiring! ✨",
      "Incredible dedication! You're doing great! 🌟",
      "Outstanding! Your future self will thank you! 🙏"
    ];
    
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    
    return (
      <SafeAreaView className="flex-1 bg-gradient-to-br from-green-50 to-blue-50">
        <View className="flex-1 items-center justify-center px-8">
          <Animated.View 
            className="w-32 h-32 bg-green-100 rounded-full items-center justify-center mb-8"
            style={completionStyle}
            entering={ZoomIn.duration(600)}
          >
            <Ionicons name="checkmark" size={64} color="#10B981" />
          </Animated.View>
          
          <Animated.View entering={FadeInUp.delay(300).duration(600)}>
            <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
              Well Done! 🎉
            </Text>
          </Animated.View>
          
          <Animated.View entering={FadeInUp.delay(500).duration(600)}>
            <Text className="text-gray-600 text-center leading-relaxed mb-6">
              You have completed today's {activity.type} activity. 
              Keep up the great work on your wellness journey!
            </Text>
          </Animated.View>
          
          {showMotivation && (
            <Animated.View style={motivationStyle} entering={FadeInLeft.delay(700).duration(600)}>
              <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-green-100">
                <Text className="text-green-700 text-center font-medium">
                  {randomMessage}
                </Text>
              </View>
            </Animated.View>
          )}
          
          <Animated.View entering={SlideInRight.delay(900).duration(600)}>
            <Pressable 
              className="bg-purple-600 py-3 px-8 rounded-xl"
              onPress={safeGoBack}
            >
              <Text className="text-white font-semibold text-center">Back to Activities</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  const category = activityCategories.find(cat => cat.id === activity.category);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <Animated.View entering={FadeInDown.duration(800)}>
          <LinearGradient
            colors={[category?.color || "#8B5CF6", category?.color + "80" || "#8B5CF680"]}
            className="px-6 pt-4 pb-8 rounded-b-3xl"
          >
          <Pressable 
            className="self-start mb-4"
            onPress={safeGoBack}
          >
            <View className="bg-white/20 w-10 h-10 rounded-full items-center justify-center">
              <Ionicons name="chevron-back" size={24} color="white" />
            </View>
          </Pressable>

          <View className="flex-row items-center mb-4">
            <View 
              className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <Ionicons 
                name={category?.icon as any || "leaf"} 
                size={32} 
                color="white" 
              />
            </View>
            
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold">{activity.title}</Text>
              <Text className="text-white/90 text-base capitalize">{category?.name || activity.category}</Text>
            </View>
          </View>

          {/* Activity Meta Info */}
          <View className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <View className="flex-row items-center justify-between">
              <View className="items-center">
                <Text className="text-white/80 text-sm">Duration</Text>
                <Text className="text-white font-bold">{activity.duration} min</Text>
              </View>
              <View className="items-center">
                <Text className="text-white/80 text-sm">Level</Text>
                <Text className="text-white font-bold capitalize">{activity.difficulty}</Text>
              </View>
              <View className="items-center">
                <Text className="text-white/80 text-sm">Type</Text>
                <Text className="text-white font-bold capitalize">{activity.type}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        </Animated.View>

        <View className="px-6 mt-6">
          {/* Description */}
          <Animated.View 
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
            entering={FadeInRight.delay(200).duration(600)}
          >
            <Text className="text-gray-900 font-bold text-lg mb-3">About This Activity</Text>
            <Text className="text-gray-700 leading-relaxed mb-4">
              {activity.description}
            </Text>
            
            {/* Progress indicator */}
            <View className="bg-gray-200 rounded-full h-1 mb-4">
              <Animated.View 
                className="bg-purple-600 rounded-full h-1"
                style={progressStyle}
              />
            </View>
            
            {/* Tags */}
            {activity.tags && activity.tags.length > 0 && (
              <View className="flex-row flex-wrap">
                {activity.tags.map((tag, index) => (
                  <View key={index} className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2">
                    <Text className="text-gray-600 text-sm capitalize">{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </Animated.View>

          {/* Benefits */}
          {activity.benefits && activity.benefits.length > 0 && (
            <Animated.View 
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
              entering={SlideInLeft.delay(400).duration(600)}
            >
              <Text className="text-gray-900 font-bold text-lg mb-3">Benefits</Text>
              {activity.benefits.map((benefit, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <View className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  <Text className="text-gray-700 flex-1">{benefit}</Text>
                </View>
              ))}
            </Animated.View>
          )}

          {/* Instructions */}
          {activity.instructions && activity.instructions.length > 0 && (
            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <View className="flex-row items-center mb-3">
                <Text className="text-gray-900 font-bold text-lg flex-1">Instructions</Text>
                <LottieView
                  source={getAnimationSource(activity.category)}
                  autoPlay
                  loop
                  style={{ width: 40, height: 40 }}
                />
              </View>
              {activity.instructions.map((instruction, index) => (
                <View key={index} className="flex-row items-start mb-3">
                  <View className="bg-purple-100 w-6 h-6 rounded-full items-center justify-center mr-3 mt-0.5">
                    <Text className="text-purple-700 text-sm font-bold">{index + 1}</Text>
                  </View>
                  <Text className="text-gray-700 flex-1 leading-relaxed">{instruction}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Activity Content */}
        <View className="px-6">
          {getActivityContent()}
        </View>

        <View className="pb-8" />
      </ScrollView>
    </SafeAreaView>
  );
}