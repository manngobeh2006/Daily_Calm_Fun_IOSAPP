import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from "react-native-reanimated";
import { FeedbackUtils } from "../utils/feedbackUtils";

import { Activity } from "../state/activitiesStore";

interface ActivityCardProps {
  activity: Activity;
  isLocked: boolean;
  onPress: () => void;
}

export default function ActivityCard({ activity, isLocked, onPress }: ActivityCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withTiming(0.8);
    FeedbackUtils.cardPress();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1);
  };

  const handlePress = () => {
    FeedbackUtils.buttonPress();
    onPress();
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
      case "relax": return "#3B82F6";
      case "learn": return "#10B981";
      case "create": return "#F59E0B";
      default: return "#6B7280";
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "relax": return "bg-blue-100";
      case "learn": return "bg-green-100";
      case "create": return "bg-orange-100";
      default: return "bg-gray-100";
    }
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        className={`rounded-2xl p-6 ${
          isLocked ? "bg-gray-100" : "bg-white border border-gray-200"
        } ${activity.completed ? "opacity-60" : ""}`}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <View className={`w-10 h-10 ${getBgColor(activity.type)} rounded-full items-center justify-center mr-3`}>
              <Ionicons 
                name={getActivityIcon(activity.type) as keyof typeof Ionicons.glyphMap} 
                size={20} 
                color={isLocked ? "#9CA3AF" : getActivityColor(activity.type)} 
              />
            </View>
            
            <View className="flex-1">
              <Text className={`text-lg font-semibold ${isLocked ? "text-gray-500" : "text-gray-900"}`}>
                {activity.title}
              </Text>
              <Text className={`text-sm capitalize ${isLocked ? "text-gray-400" : "text-gray-600"}`}>
                {activity.type}
              </Text>
            </View>
          </View>
          
          <Text className={`${isLocked ? "text-gray-400" : "text-gray-600"} leading-relaxed`}>
            {activity.description}
          </Text>
        </View>
        
        <View className="ml-4">
          {activity.completed ? (
            <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </View>
          ) : isLocked ? (
            <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center">
              <Ionicons name="lock-closed" size={16} color="#6B7280" />
            </View>
          ) : (
            <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center">
              <Ionicons name="chevron-forward" size={16} color="#8B5CF6" />
            </View>
          )}
        </View>
      </View>
      
      {activity.premium_only && (
        <View className="flex-row items-center mt-3">
          <Ionicons name="diamond" size={14} color="#8B5CF6" />
          <Text className="text-purple-600 text-sm font-medium ml-1">Premium</Text>
        </View>
      )}
      </Pressable>
    </Animated.View>
  );
}