import React, { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import KeyboardAwareContainer from "../KeyboardAwareContainer";
import StepList from "../StepList";
import { ExpandedActivity } from "../../data/expandedActivities";

interface CreateActivityProps {
  content: any;
  activity?: ExpandedActivity;
  onComplete: () => void;
}

export default function CreateActivity({ content, activity, onComplete }: CreateActivityProps) {
  const [journalText, setJournalText] = useState("");
  const [selectedTool, setSelectedTool] = useState(0);
  const [, setCurrentStepIndex] = useState(0);

  // Check for specific activity types
  const isStepBasedActivity = activity?.steps && activity.steps.length > 0;
  const hasAnimation = activity?.animation;
  const hasJournal = activity?.journal;

  const isJournaling = !content?.tools || hasJournal;
  const minWords = activity?.journal?.minWords || 10;
  const wordCount = journalText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const canComplete = isJournaling ? wordCount >= minWords : true;

  // Step-based create activities (Afternoon Energy Revival)
  if (isStepBasedActivity && activity?.steps) {
    return (
      <View className="bg-orange-50 rounded-2xl p-6">
        {hasAnimation && (
          <View className="items-center mb-6">
            <LottieView
              source={require("../../../assets/anim/afternoon_energy.json")}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
          </View>
        )}

        <StepList
          steps={activity.steps}
          onStepChange={setCurrentStepIndex}
          onComplete={onComplete}
        />
      </View>
    );
  }

  // Enhanced journaling with animation
  if (hasJournal && activity?.journal) {
    return (
      <KeyboardAwareContainer className="bg-orange-50 rounded-2xl p-6">
        {hasAnimation && (
          <View className="items-center mb-6">
            <LottieView
              source={require("../../../assets/anim/quick_reset.json")}
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
          </View>
        )}

        <Text className="text-lg font-semibold text-orange-900 mb-4 text-center">
          ✨ {content?.title || "Journal Prompt"}
        </Text>
        
        <View className="bg-white rounded-xl p-4 border border-orange-200 mb-4">
          <Text className="text-lg text-orange-800 mb-4 text-center">
            "{activity.journal.placeholder}"
          </Text>
        </View>

        <View className="bg-white rounded-xl border border-orange-200 mb-4">
          <TextInput
            className="p-4 text-gray-800 min-h-[120px]"
            placeholder="Start writing here..."
            placeholderTextColor="#D97706"
            multiline
            textAlignVertical="top"
            value={journalText}
            onChangeText={setJournalText}
            scrollEnabled={false}
          />
        </View>

        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-orange-600 text-sm">
            Words: {wordCount}/{minWords}
          </Text>
          {canComplete && (
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text className="text-green-600 text-sm ml-1">Ready to complete!</Text>
            </View>
          )}
        </View>

        <Pressable
          className={`py-3 px-6 rounded-xl items-center ${
            canComplete ? "bg-orange-600" : "bg-gray-300"
          }`}
          onPress={onComplete}
          disabled={!canComplete}
        >
          <Text className={`font-semibold ${canComplete ? "text-white" : "text-gray-500"}`}>
            Complete Activity
          </Text>
        </Pressable>
      </KeyboardAwareContainer>
    );
  }

  if (isJournaling) {
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-orange-50 rounded-2xl p-6">
            <Text className="text-lg font-semibold text-orange-900 mb-4 text-center">
              ✨ {content?.title || "Journal Prompt"}
            </Text>
            
            <View className="bg-white rounded-xl p-4 border border-orange-200 mb-4">
              <Text className="text-lg text-orange-800 mb-4 text-center">
                "{content?.prompt || "Write about something that made you happy today"}"
              </Text>
            </View>

            <View className="bg-white rounded-xl border border-orange-200 mb-4">
              <TextInput
                className="p-4 text-gray-800 min-h-[120px]"
                placeholder="Start writing here..."
                placeholderTextColor="#D97706"
                multiline
                textAlignVertical="top"
                value={journalText}
                onChangeText={setJournalText}
                scrollEnabled={false}
              />
            </View>

            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-orange-600 text-sm">
                Words: {wordCount}/{minWords}
              </Text>
              {canComplete && (
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text className="text-green-600 text-sm ml-1">Ready to complete!</Text>
                </View>
              )}
            </View>

            <Pressable
              className={`py-3 px-6 rounded-xl items-center ${
                canComplete ? "bg-orange-600" : "bg-gray-300"
              }`}
              onPress={onComplete}
              disabled={!canComplete}
            >
              <Text className={`font-semibold ${canComplete ? "text-white" : "text-gray-500"}`}>
                Complete Activity
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Drawing Activity
  return (
    <View className="bg-orange-50 rounded-2xl p-6">
      <Text className="text-lg font-semibold text-orange-900 mb-4 text-center">
        🎨 Drawing Challenge
      </Text>
      
      <Text className="text-orange-800 mb-4 text-center">
        {content?.prompt || "Express your creativity!"}
      </Text>

      {content?.inspiration && (
        <View className="bg-orange-100 rounded-xl p-4 mb-4">
          <Text className="text-orange-800 text-center text-sm">
            💡 {content.inspiration}
          </Text>
        </View>
      )}

      {/* Tool Selection */}
      {content?.tools && (
        <View className="mb-6">
          <Text className="text-orange-800 font-medium mb-3">Choose your tool:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {content.tools.map((tool: string, index: number) => (
                <Pressable
                  key={index}
                  className={`px-4 py-2 rounded-full border-2 ${
                    selectedTool === index
                      ? "border-orange-500 bg-orange-100"
                      : "border-orange-200 bg-white"
                  }`}
                  onPress={() => setSelectedTool(index)}
                >
                  <Text className={`font-medium ${
                    selectedTool === index ? "text-orange-800" : "text-orange-600"
                  }`}>
                    {tool}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Drawing Canvas Placeholder */}
      <View className="bg-white rounded-xl border-2 border-dashed border-orange-300 h-48 items-center justify-center mb-6">
        <Ionicons name="brush-outline" size={48} color="#D97706" />
        <Text className="text-orange-600 mt-2">Drawing canvas coming soon!</Text>
        <Text className="text-orange-500 text-sm">Tap to start creating</Text>
      </View>

      <Pressable
        className="bg-orange-600 py-3 px-6 rounded-xl items-center"
        onPress={onComplete}
      >
        <Text className="text-white font-semibold">Complete Activity</Text>
      </Pressable>
    </View>
  );
}