import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ValueScreen() {
  const navigation = useNavigation();

  const features = [
    {
      icon: "leaf-outline" as keyof typeof Ionicons.glyphMap,
      title: "Relax with calming puzzles",
      description: "Unwind with soothing bubble pop and breathing exercises",
    },
    {
      icon: "bulb-outline" as keyof typeof Ionicons.glyphMap,
      title: "Learn with daily facts & affirmations",
      description: "Discover something new and boost your confidence daily",
    },
    {
      icon: "brush-outline" as keyof typeof Ionicons.glyphMap,
      title: "Create with art & journaling prompts",
      description: "Express yourself through drawing and thoughtful writing",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-8">
        <View className="items-center mt-12 mb-8">
          <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
            Get 3 fun activities{"\n"}every day ✨
          </Text>
        </View>

        <View className="space-y-6 mb-12">
          {features.map((feature, index) => (
            <View key={index} className="flex-row items-start space-x-4">
              <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
                <Ionicons name={feature.icon} size={24} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                  {feature.title}
                </Text>
                <Text className="text-gray-600 leading-relaxed">
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="pb-8">
          <Pressable
            className="bg-purple-600 py-4 px-8 rounded-2xl items-center active:bg-purple-700"
            onPress={() => navigation.navigate("Upgrade" as never)}
          >
            <Text className="text-white text-lg font-semibold">Show Me!</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}