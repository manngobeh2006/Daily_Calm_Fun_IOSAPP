import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Achievement, Badge } from "../state/gamificationStore";

interface AchievementCardProps {
  achievement: Achievement;
  onPress?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onPress }) => {
  const progressPercentage = achievement.isUnlocked ? 100 : 0; // Simplified for now

  return (
    <Pressable
      className={`bg-white rounded-2xl p-4 shadow-sm border ${
        achievement.isUnlocked ? 'border-green-200' : 'border-gray-200'
      } mb-3`}
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <View 
          className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
            achievement.isUnlocked ? 'bg-green-100' : 'bg-gray-100'
          }`}
        >
          <Ionicons 
            name={achievement.icon as any} 
            size={24} 
            color={achievement.isUnlocked ? achievement.color : "#9CA3AF"} 
          />
        </View>
        
        <View className="flex-1">
          <Text className={`font-semibold text-base ${
            achievement.isUnlocked ? 'text-gray-900' : 'text-gray-600'
          }`}>
            {achievement.title}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            {achievement.description}
          </Text>
          
          {!achievement.isUnlocked && (
            <View className="mt-2">
              <View className="bg-gray-200 rounded-full h-2">
                <View 
                  className="bg-purple-500 rounded-full h-2"
                  style={{ width: `${progressPercentage}%` }}
                />
              </View>
              <Text className="text-gray-400 text-xs mt-1">
                Progress: {progressPercentage}%
              </Text>
            </View>
          )}
        </View>
        
        {achievement.isUnlocked && (
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-700 text-xs font-medium">Unlocked</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

interface BadgeCardProps {
  badge: Badge;
  isEarned: boolean;
  onPress?: () => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isEarned, onPress }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "#10B981";
      case "rare": return "#3B82F6";
      case "epic": return "#8B5CF6";
      case "legendary": return "#F59E0B";
      default: return "#6B7280";
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case "common": return "#ECFDF5";
      case "rare": return "#EFF6FF";
      case "epic": return "#F3E8FF";
      case "legendary": return "#FFFBEB";
      default: return "#F9FAFB";
    }
  };

  return (
    <Pressable
      className={`bg-white rounded-2xl p-4 shadow-sm border ${
        isEarned ? 'border-purple-200' : 'border-gray-200'
      } items-center`}
      style={{ width: 140 }}
      onPress={onPress}
    >
      <View 
        className={`w-16 h-16 rounded-full items-center justify-center mb-3 ${
          isEarned ? '' : 'opacity-40'
        }`}
        style={{ backgroundColor: getRarityBg(badge.rarity) }}
      >
        <Ionicons 
          name={badge.icon as any} 
          size={32} 
          color={isEarned ? getRarityColor(badge.rarity) : "#9CA3AF"} 
        />
      </View>
      
      <Text className={`font-semibold text-sm text-center ${
        isEarned ? 'text-gray-900' : 'text-gray-500'
      }`}>
        {badge.title}
      </Text>
      
      <View 
        className="px-2 py-1 rounded-full mt-2"
        style={{ backgroundColor: getRarityBg(badge.rarity) }}
      >
        <Text 
          className="text-xs font-medium capitalize"
          style={{ color: getRarityColor(badge.rarity) }}
        >
          {badge.rarity}
        </Text>
      </View>
      
      {isEarned && badge.earnedAt && (
        <Text className="text-gray-400 text-xs mt-1">
          {new Date(badge.earnedAt).toLocaleDateString()}
        </Text>
      )}
    </Pressable>
  );
};

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
  backgroundColor?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ 
  progress, 
  size, 
  strokeWidth, 
  color, 
  backgroundColor = "#E5E7EB" 
}) => {

  return (
    <View 
      style={{ 
        width: size, 
        height: size, 
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* Background circle */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: backgroundColor,
          position: 'absolute'
        }}
      />
      
      {/* Progress circle - simplified version */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: 'transparent',
          borderTopColor: color,
          transform: [{ rotate: `${(progress / 100) * 360 - 90}deg` }],
          position: 'absolute'
        }}
      />
      
      {/* Center content */}
      <Text style={{ fontSize: 12, fontWeight: 'bold', color: color }}>
        {Math.round(progress)}%
      </Text>
    </View>
  );
};