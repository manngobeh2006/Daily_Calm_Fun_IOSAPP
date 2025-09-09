import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useUserStore } from "../../state/userStore";

export default function UpgradeScreen() {
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  const handleStartTrial = () => {
    // This will be implemented with RevenueCat later
    completeOnboarding();
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-8">
        <View className="items-center mt-12 mb-8">
          <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="diamond" size={40} color="#8B5CF6" />
          </View>
          
          <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
            Want more? 💜{"\n"}Unlock the full experience
          </Text>
          
          <Text className="text-lg text-gray-600 text-center leading-relaxed mb-8">
            Premium gives you 365+ extra activities, Relaxation Library, and more.
          </Text>
        </View>

        <View className="bg-purple-50 rounded-2xl p-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Premium includes:</Text>
          
          <View className="space-y-3">
            {[
              "6-9 daily activities instead of 3",
              "Relaxation Library with meditations",
              "Advanced drawing tools & brush packs",
              "Mood tracker with PDF export",
              "Custom activity focus mode",
              "Offline access & ad-free experience"
            ].map((feature, index) => (
              <View key={index} className="flex-row items-center space-x-3">
                <Ionicons name="checkmark-circle" size={20} color="#8B5CF6" />
                <Text className="text-gray-700 flex-1">{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="space-y-4 pb-8">
          <Pressable
            className="bg-purple-600 py-4 px-8 rounded-2xl items-center active:bg-purple-700"
            onPress={handleStartTrial}
          >
            <Text className="text-white text-lg font-semibold">Start Free Trial →</Text>
            <Text className="text-purple-200 text-sm mt-1">7 days free, then $1.99/month</Text>
          </Pressable>

          <Pressable
            className="py-4 px-8 items-center"
            onPress={handleSkip}
          >
            <Text className="text-gray-500 text-base">Continue with Free Plan</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}