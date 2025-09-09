import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  unlocked: boolean;
  requirement?: string;
}

interface BadgeCardProps {
  badge: Badge;
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <View 
      className={`flex-row items-center p-4 rounded-xl ${
        badge.unlocked ? "bg-purple-50 border border-purple-200" : "bg-gray-50"
      }`}
    >
      <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
        badge.unlocked ? "bg-purple-100" : "bg-gray-200"
      }`}>
        <Ionicons 
          name={badge.icon} 
          size={24} 
          color={badge.unlocked ? "#8B5CF6" : "#9CA3AF"} 
        />
      </View>
      
      <View className="flex-1">
        <Text className={`font-semibold ${badge.unlocked ? "text-gray-900" : "text-gray-500"}`}>
          {badge.name}
        </Text>
        <Text className={`text-sm ${badge.unlocked ? "text-gray-600" : "text-gray-400"}`}>
          {badge.description}
        </Text>
        {badge.requirement && !badge.unlocked && (
          <Text className="text-xs text-gray-400 mt-1">
            {badge.requirement}
          </Text>
        )}
      </View>
      
      {badge.unlocked && (
        <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center">
          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
        </View>
      )}
    </View>
  );
}