import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useUserStore } from "../state/userStore";
import { subscriptionPlans, purchaseSubscription } from "../api/subscription-service";

export default function PremiumScreen() {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly" | "lifetime">("yearly");
  const [isLoading, setIsLoading] = useState(false);
  const setPremiumStatus = useUserStore((state) => state.setPremiumStatus);
  const setTrialEndDate = useUserStore((state) => state.setTrialEndDate);

  const freeFeatures = [
    "3 daily activities",
    "Streak tracker",
    "Basic tools",
  ];

  const premiumFeatures = [
    "Unlimited daily activities",
    "15+ activity categories with advanced techniques",
    "Premium soundscapes & audio library",
    "Advanced mood analytics & insights",
    "Personalized AI recommendations",
    "Achievement system & badges",
    "Detailed progress tracking",
    "Export wellness reports",
    "Offline access to all content",
    "Ad-free experience",
    "Priority customer support",
    "Early access to new features"
  ];

  const handleStartTrial = async () => {
    setIsLoading(true);
    
    try {
      const result = await purchaseSubscription(selectedPlan);
      
      if (result.success) {
        setPremiumStatus(true, selectedPlan);
        if (result.trialEndDate) {
          setTrialEndDate(result.trialEndDate);
        }
        navigation.goBack();
      } else {
        Alert.alert("Purchase Failed", result.error || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to process purchase");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        <View className="items-center mt-8 mb-8">
          <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="diamond" size={40} color="#8B5CF6" />
          </View>
          
          <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
            ✨ Unlock Your Best Self
          </Text>
          <Text className="text-xl font-semibold text-purple-600 text-center">
            Go Premium ✨
          </Text>
        </View>

        {/* Plan Comparison */}
        <View className="mb-8">
          <View className="flex-row mb-6">
            <View className="flex-1 mr-2">
              <View className="bg-gray-50 rounded-2xl p-6">
                <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Free Plan
                </Text>
                <Text className="text-center text-gray-600 mb-4">Always Free</Text>
                
                <View className="space-y-3">
                  {freeFeatures.map((feature, index) => (
                    <View key={index} className="flex-row items-center">
                      <Ionicons name="checkmark" size={16} color="#10B981" />
                      <Text className="text-gray-700 ml-2 text-sm">{feature}</Text>
                    </View>
                  ))}
                  
                  <View className="flex-row items-center">
                    <Ionicons name="close" size={16} color="#EF4444" />
                    <Text className="text-gray-500 ml-2 text-sm">Relaxation Library</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="close" size={16} color="#EF4444" />
                    <Text className="text-gray-500 ml-2 text-sm">Extra puzzles</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="close" size={16} color="#EF4444" />
                    <Text className="text-gray-500 ml-2 text-sm">Custom Mode</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-gray-500 ml-6 text-sm">Ads included</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-1 ml-2">
              <View className="bg-gradient-to-b from-purple-500 to-purple-600 rounded-2xl p-6 border-2 border-purple-400">
                <Text className="text-lg font-semibold text-white mb-4 text-center">
                  Premium Plan
                </Text>
                <Text className="text-center text-purple-100 mb-4">7 Days Free</Text>
                
                <View className="space-y-3">
                  {premiumFeatures.map((feature, index) => (
                    <View key={index} className="flex-row items-center">
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      <Text className="text-white ml-2 text-sm">{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Plan Selection */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Choose Your Plan
          </Text>
          
          <View className="space-y-3">
            {subscriptionPlans.map((plan) => (
              <Pressable
                key={plan.id}
                className={`border-2 rounded-2xl p-4 ${
                  selectedPlan === plan.id 
                    ? "border-purple-500 bg-purple-50" 
                    : "border-gray-200 bg-white"
                }`}
                onPress={() => setSelectedPlan(plan.id as any)}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-lg font-semibold text-gray-900">
                        {plan.title}
                      </Text>
                      {plan.popular && (
                        <View className="bg-purple-500 px-2 py-1 rounded-full ml-2">
                          <Text className="text-white text-xs font-medium">Popular</Text>
                        </View>
                      )}
                    </View>
                    
                    <View className="flex-row items-baseline mt-1">
                      <Text className="text-2xl font-bold text-gray-900">{plan.price}</Text>
                      <Text className="text-gray-600 ml-1">{plan.period}</Text>
                    </View>
                    
                    {plan.savings && (
                      <Text className="text-green-600 text-sm font-medium mt-1">
                        {plan.savings}
                      </Text>
                    )}
                  </View>
                  
                  <View className={`w-6 h-6 rounded-full border-2 ${
                    selectedPlan === plan.id 
                      ? "border-purple-500 bg-purple-500" 
                      : "border-gray-300"
                  } items-center justify-center`}>
                    {selectedPlan === plan.id && (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* CTA Button */}
        <View className="pb-8">
          <Pressable
            className="bg-purple-600 py-4 px-8 rounded-2xl items-center active:bg-purple-700"
            onPress={handleStartTrial}
          >
            <Text className="text-white text-lg font-semibold">
              {isLoading ? "Processing..." : "💜 Start Premium — 7 Days Free Trial"}
            </Text>
            <Text className="text-purple-200 text-sm mt-1">
              Cancel anytime • No commitment
            </Text>
          </Pressable>
          
          <Text className="text-gray-500 text-xs text-center mt-4 leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy. 
            Subscription automatically renews unless cancelled.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}