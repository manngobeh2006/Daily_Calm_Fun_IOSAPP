import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SpinWheelProps {
  onSpin: (reward: string) => void;
  canSpin: boolean;
}

export default function SpinWheel({ onSpin, canSpin }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastReward, setLastReward] = useState<string | null>(null);

  const rewards = [
    "Extra Activity Unlock",
    "New Brush Pack",
    "Bonus Meditation",
    "Special Badge",
    "Mood Sticker Pack",
    "Premium Wallpaper",
  ];

  const handleSpin = () => {
    if (!canSpin || isSpinning) return;
    
    setIsSpinning(true);
    
    // Simulate spinning animation
    setTimeout(() => {
      const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
      setLastReward(randomReward);
      setIsSpinning(false);
      onSpin(randomReward);
    }, 2000);
  };

  return (
    <View className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 items-center">
      <Text className="text-white text-lg font-semibold mb-4">
        🎡 Daily Spin Wheel
      </Text>
      
      <View className="w-32 h-32 bg-white rounded-full items-center justify-center mb-4 relative">
        <View className={`w-28 h-28 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full items-center justify-center ${
          isSpinning ? "animate-spin" : ""
        }`}>
          <Ionicons name="diamond" size={32} color="#FFFFFF" />
        </View>
        
        {/* Pointer */}
        <View className="absolute top-2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-purple-600" />
      </View>

      {lastReward && !isSpinning && (
        <View className="bg-white/20 rounded-xl p-3 mb-4">
          <Text className="text-white font-medium text-center">
            🎉 You won: {lastReward}!
          </Text>
        </View>
      )}

      <Pressable
        className={`py-3 px-6 rounded-xl ${
          canSpin && !isSpinning ? "bg-white" : "bg-white/50"
        }`}
        onPress={handleSpin}
        disabled={!canSpin || isSpinning}
      >
        <Text className={`font-semibold ${
          canSpin && !isSpinning ? "text-purple-600" : "text-purple-400"
        }`}>
          {isSpinning ? "Spinning..." : canSpin ? "Spin Now!" : "Come back tomorrow"}
        </Text>
      </Pressable>
    </View>
  );
}