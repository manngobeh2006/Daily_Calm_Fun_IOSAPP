import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-purple-50 to-white">
      <View className="flex-1 justify-center items-center px-8">
        <View className="items-center mb-12">
          <View className="w-24 h-24 bg-purple-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="heart" size={48} color="#8B5CF6" />
          </View>
          
          <Text className="text-4xl font-bold text-gray-900 text-center mb-4">
            Welcome to{"\n"}Daily Calm & Fun!
          </Text>
          
          <Text className="text-lg text-gray-600 text-center leading-relaxed">
            A daily space to relax, learn, and create — just for you.
          </Text>
        </View>

        <View className="w-full">
          <Pressable
            className="bg-purple-600 py-4 px-8 rounded-2xl items-center active:bg-purple-700"
            onPress={() => navigation.navigate("Value" as never)}
          >
            <Text className="text-white text-lg font-semibold">Next →</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}