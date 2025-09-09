import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeInLeft, 
  SlideInRight,
  useSharedValue,
  useAnimatedStyle
} from "react-native-reanimated";

import { useUserStore } from "../state/userStore";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const user = useUserStore();
  const [, setShowProfileModal] = useState(false);
  const [, setShowTimeModal] = useState(false);
  
  // Animation values
  const cardScale = useSharedValue(1);
  
  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: cardScale.value }],
    };
  });

  const handleProfilePress = () => {
    setShowProfileModal(true);
  };

  const handleTimePress = () => {
    setShowTimeModal(true);
  };

  const handleHelpPress = () => {
    Alert.alert(
      "Help & Support",
      "Need help? Contact us at support@dailycalm.app or visit our FAQ section.",
      [{ text: "OK" }]
    );
  };

  const handlePrivacyPress = () => {
    Alert.alert(
      "Privacy Policy",
      "Your privacy is important to us. We collect minimal data and never share personal information with third parties.",
      [{ text: "OK" }]
    );
  };
  
  const settingsItems = [
    {
      title: "Account",
      items: [
        {
          icon: "person-outline" as keyof typeof Ionicons.glyphMap,
          label: "Profile",
          value: user.name || "Set your name",
          onPress: handleProfilePress,
        },
        {
          icon: "diamond-outline" as keyof typeof Ionicons.glyphMap,
          label: "Subscription",
          value: user.isPremium ? "Premium Active" : "Free Plan",
          onPress: () => navigation.navigate("Premium" as never),
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: "notifications-outline" as keyof typeof Ionicons.glyphMap,
          label: "Daily Reminders",
          value: user.preferences.notificationsEnabled,
          type: "switch" as const,
          onToggle: (value: boolean) => user.updatePreferences({ notificationsEnabled: value }),
        },
        {
          icon: "time-outline" as keyof typeof Ionicons.glyphMap,
          label: "Reminder Time",
          value: user.preferences.dailyReminderTime,
          onPress: handleTimePress,
        },
      ],
    },
    {
      title: "App Settings",
      items: [
        {
          icon: "volume-medium-outline" as keyof typeof Ionicons.glyphMap,
          label: "Sound Effects",
          value: user.preferences.soundEnabled,
          type: "switch" as const,
          onToggle: (value: boolean) => user.updatePreferences({ soundEnabled: value }),
        },
        {
          icon: "musical-notes-outline" as keyof typeof Ionicons.glyphMap,
          label: "Activity Sound Effects",
          value: user.preferences.soundEffectsEnabled,
          type: "switch" as const,
          onToggle: (value: boolean) => user.updatePreferences({ soundEffectsEnabled: value }),
        },
        {
          icon: "help-circle-outline" as keyof typeof Ionicons.glyphMap,
          label: "Help & Support",
          value: "",
          onPress: handleHelpPress,
        },
        {
          icon: "shield-outline" as keyof typeof Ionicons.glyphMap,
          label: "Privacy Policy",
          value: "",
          onPress: handlePrivacyPress,
        },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-6 pt-4 pb-8">
          <Animated.View entering={FadeInDown.duration(600)}>
            <Text className="text-2xl font-bold text-gray-900 mb-8">Settings</Text>
          </Animated.View>

          {settingsItems.map((section, sectionIndex) => (
            <Animated.View 
              key={sectionIndex} 
              className="mb-8"
              entering={FadeInUp.delay(200 + sectionIndex * 100).duration(600)}
            >
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                {section.title}
              </Text>
              
              <Animated.View 
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                style={cardStyle}
              >
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    <Pressable
                      className="flex-row items-center justify-between p-4 active:bg-gray-100"
                      onPress={item.onPress}
                      disabled={item.type === "switch"}
                    >
                      <View className="flex-row items-center flex-1">
                        <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center mr-4">
                          <Ionicons name={item.icon} size={20} color="#6B7280" />
                        </View>
                        
                        <View className="flex-1">
                          <Text className="text-gray-900 font-medium">{item.label}</Text>
                          {item.type !== "switch" && (
                            <Text className="text-gray-500 text-sm mt-1">{item.value}</Text>
                          )}
                        </View>
                      </View>
                      
                      {item.type === "switch" ? (
                        <Switch
                          value={item.value as boolean}
                          onValueChange={item.onToggle}
                          trackColor={{ false: "#D1D5DB", true: "#C4B5FD" }}
                          thumbColor={item.value ? "#8B5CF6" : "#F3F4F6"}
                        />
                      ) : (
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                      )}
                    </Pressable>
                    
                    {itemIndex < section.items.length - 1 && (
                      <View className="h-px bg-gray-200 ml-14" />
                    )}
                  </View>
                ))}
              </Animated.View>
            </Animated.View>
          ))}

          {/* Premium Upsell */}
          {!user.isPremium && (
            <Animated.View entering={FadeInLeft.delay(600).duration(600)}>
              <LinearGradient
                colors={["#8B5CF6", "#EC4899"]}
                className="rounded-2xl p-6 mb-8"
              >
                <View className="flex-row items-center mb-4">
                  <Ionicons name="diamond" size={24} color="#FFFFFF" />
                  <Text className="text-white text-lg font-semibold ml-2">
                    Upgrade to Premium
                  </Text>
                </View>
                
                <Text className="text-purple-100 mb-4">
                  Unlock unlimited activities, advanced features, and remove ads.
                </Text>
                
                <Pressable 
                  className="bg-white py-3 px-6 rounded-xl"
                  onPress={() => navigation.navigate("Premium" as never)}
                >
                  <Text className="text-purple-600 font-semibold text-center">
                    Start 7-Day Free Trial
                  </Text>
                </Pressable>
              </LinearGradient>
            </Animated.View>
          )}

          {/* App Info */}
          <Animated.View 
            className="items-center pt-8 border-t border-gray-200"
            entering={SlideInRight.delay(800).duration(600)}
          >
            <Text className="text-gray-500 text-sm">Daily Calm & Fun v1.0.0</Text>
            <Text className="text-gray-400 text-xs mt-1">Made with 💜 for your wellbeing</Text>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}