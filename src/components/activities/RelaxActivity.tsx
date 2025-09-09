import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import LottieView from "lottie-react-native";
import MeditationActivity from "./MeditationActivity";
import StepList from "../StepList";
import KeyboardAwareContainer from "../KeyboardAwareContainer";
import SoundEffectsManager from "../../utils/soundEffectsManager";
import { useUserStore } from "../../state/userStore";
import { ExpandedActivity } from "../../data/expandedActivities";

interface RelaxActivityProps {
  content: any;
  activity?: ExpandedActivity;
  onComplete: () => void;
}

export default function RelaxActivity({ content, activity, onComplete }: RelaxActivityProps) {
  const userStore = useUserStore();
  const [bubbles, setBubbles] = useState<{ id: number; popped: boolean }[]>([]);
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathingCount, setBreathingCount] = useState(4);
  const [groundingInputs, setGroundingInputs] = useState<{[key: string]: string}>({});
  const [journalText, setJournalText] = useState("");
  const [, setCurrentStepIndex] = useState(0);

  // Check if this should be a meditation activity
  const isMeditation = content?.title?.toLowerCase().includes("meditation") || 
                      content?.title?.toLowerCase().includes("starry") ||
                      content?.backgroundMusic ||
                      content?.duration && parseInt(content.duration) >= 5;

  // Check for specific activity types
  const isGroundingActivity = activity?.fields && activity.fields.length > 0;
  const isStepBasedActivity = activity?.steps && activity.steps.length > 0;
  const hasAnimation = activity?.animation;
  const showBreathingGuide = activity?.showBreathingGuide !== false;

  useEffect(() => {
    // Initialize bubbles for bubble pop activities
    if (!isGroundingActivity && !isStepBasedActivity) {
      const initialBubbles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        popped: false,
      }));
      setBubbles(initialBubbles);
    }

    // Initialize grounding inputs
    if (isGroundingActivity && activity?.fields) {
      const inputs: {[key: string]: string} = {};
      activity.fields.forEach(field => {
        inputs[field] = "";
      });
      setGroundingInputs(inputs);
    }

    // Breathing timer (only if breathing guide is enabled)
    let interval: NodeJS.Timeout;
    if (showBreathingGuide) {
      interval = setInterval(() => {
        setBreathingCount((prev) => {
          if (prev <= 1) {
            setBreathingPhase((phase) => {
              if (phase === "inhale") return "hold";
              if (phase === "hold") return "exhale";
              return "inhale";
            });
            return breathingPhase === "exhale" ? 6 : 4;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGroundingActivity, isStepBasedActivity, activity?.fields, showBreathingGuide, breathingPhase]);

  const handleBubblePop = async (id: number) => {
    // Play haptic feedback
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log("Could not play haptic feedback");
    }

    // Play sound effect if enabled
    if (activity?.soundEffects?.popOnBubble) {
      const globalSfxEnabled = userStore.preferences.soundEffectsEnabled;
      const activitySfxEnabled = userStore.getActivitySoundSetting(activity.id, "popSoundEnabled", true);
      
      if (globalSfxEnabled && activitySfxEnabled) {
        const sfxManager = SoundEffectsManager.getInstance();
        await sfxManager.playSound("pop");
      }
    }

    setBubbles((prev) =>
      prev.map((bubble) =>
        bubble.id === id ? { ...bubble, popped: true } : bubble
      )
    );
  };

  const handleGroundingInputChange = (field: string, value: string) => {
    setGroundingInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getFieldLabel = (field: string): string => {
    const fieldLabels: {[key: string]: string} = {
      see5: "5 things you can see",
      feel4: "4 things you can touch",
      hear3: "3 things you can hear",
      smell2: "2 things you can smell",
      taste1: "1 thing you can taste"
    };
    return fieldLabels[field] || field;
  };

  const allBubblesPopped = bubbles.every((bubble) => bubble.popped);
  const allGroundingFieldsFilled = isGroundingActivity && activity?.fields ? 
    activity.fields.every(field => groundingInputs[field]?.trim().length > 0) : false;
  const journalComplete = activity?.journal ? 
    journalText.trim().split(/\s+/).filter(word => word.length > 0).length >= (activity.journal.minWords || 5) : false;

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
    }
  };

  const getBreathingColor = () => {
    switch (breathingPhase) {
      case "inhale":
        return "bg-blue-500";
      case "hold":
        return "bg-purple-500";
      case "exhale":
        return "bg-green-500";
    }
  };

  const getAnimationSource = (animationPath?: string) => {
    if (!animationPath) return require("../../../assets/anim/pmr.json");
    
    if (animationPath.includes("pmr")) return require("../../../assets/anim/pmr.json");
    if (animationPath.includes("body_scan")) return require("../../../assets/anim/body_scan.json");
    if (animationPath.includes("energizing_breath")) return require("../../../assets/anim/energizing_breath.json");
    if (animationPath.includes("panic_sos")) return require("../../../assets/anim/panic_sos.json");
    if (animationPath.includes("quick_reset")) return require("../../../assets/anim/quick_reset.json");
    if (animationPath.includes("box_breathing")) return require("../../../assets/anim/box_breathing.json");
    
    return require("../../../assets/anim/pmr.json");
  };

  // Use meditation component for meditation activities
  if (isMeditation) {
    return <MeditationActivity content={content} onComplete={onComplete} />;
  }

  // Grounding 5-4-3-2-1 Activity
  if (isGroundingActivity && activity?.fields) {
    return (
      <KeyboardAwareContainer className="bg-green-50 rounded-2xl p-6">
        <Text className="text-lg font-semibold text-green-900 mb-4 text-center">
          🌱 5-4-3-2-1 Grounding
        </Text>
        
        <Text className="text-green-800 mb-6 text-center">
          Use your senses to ground yourself in the present moment
        </Text>

        <View className="space-y-4 mb-6">
          {activity.fields.map((field) => (
            <View key={field} className="bg-white rounded-xl p-4 border border-green-200">
              <Text className="text-green-900 font-medium mb-2">
                {getFieldLabel(field)}
              </Text>
              <TextInput
                className="text-gray-800 min-h-[40px] p-2 bg-gray-50 rounded-lg"
                placeholder={`List ${getFieldLabel(field).toLowerCase()}...`}
                placeholderTextColor="#6B7280"
                multiline
                value={groundingInputs[field] || ""}
                onChangeText={(text) => handleGroundingInputChange(field, text)}
              />
            </View>
          ))}
        </View>

        {allGroundingFieldsFilled && (
          <View className="items-center">
            <Text className="text-green-800 font-medium mb-4">
              🎉 Great! You're grounded in the present moment.
            </Text>
            <Pressable
              className="bg-green-600 py-3 px-6 rounded-xl"
              onPress={onComplete}
            >
              <Text className="text-white font-semibold">Complete Activity</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAwareContainer>
    );
  }

  // Step-based activities (PMR, Body Scan, etc.)
  if (isStepBasedActivity && activity?.steps) {
    return (
      <View className="bg-purple-50 rounded-2xl p-6">
        {hasAnimation && (
          <View className="items-center mb-6">
            <LottieView
              source={getAnimationSource(activity.animation)}
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

  // Journal + Animation activities (Quick Anxiety Reset)
  if (activity?.journal) {
    const wordCount = journalText.trim().split(/\s+/).filter(word => word.length > 0).length;
    const minWords = activity.journal.minWords || 5;

    return (
      <KeyboardAwareContainer className="bg-orange-50 rounded-2xl p-6">
        {hasAnimation && (
          <View className="items-center mb-6">
            <LottieView
              source={getAnimationSource(activity.animation)}
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
          </View>
        )}

        <Text className="text-lg font-semibold text-orange-900 mb-4 text-center">
          ✨ Reflection Journal
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
          />
        </View>

        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-orange-600 text-sm">
            Words: {wordCount}/{minWords}
          </Text>
          {journalComplete && (
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text className="text-green-600 text-sm ml-1">Ready to complete!</Text>
            </View>
          )}
        </View>

        <Pressable
          className={`py-3 px-6 rounded-xl items-center ${
            journalComplete ? "bg-orange-600" : "bg-gray-300"
          }`}
          onPress={onComplete}
          disabled={!journalComplete}
        >
          <Text className={`font-semibold ${journalComplete ? "text-white" : "text-gray-500"}`}>
            Complete Activity
          </Text>
        </Pressable>
      </KeyboardAwareContainer>
    );
  }

  // Default bubble pop activity
  return (
    <View className="bg-blue-50 rounded-2xl p-6">
      <Text className="text-lg font-semibold text-blue-900 mb-4 text-center">
        🫧 Bubble Pop Calm
      </Text>
      
      <Text className="text-blue-800 mb-6 text-center">
        {content?.instructions || "Tap bubbles slowly while taking deep breaths"}
      </Text>

      {/* Sound Effects Toggle */}
      {activity?.soundEffects?.popOnBubble && (
        <View className="flex-row items-center justify-center mb-4">
          <Text className="text-blue-700 mr-2">Pop sound:</Text>
          <Pressable
            className={`w-12 h-6 rounded-full ${
              userStore.getActivitySoundSetting(activity.id, "popSoundEnabled", true) 
                ? "bg-blue-600" : "bg-gray-300"
            }`}
            onPress={() => {
              const currentSetting = userStore.getActivitySoundSetting(activity.id, "popSoundEnabled", true);
              userStore.updateActivitySoundSetting(activity.id, "popSoundEnabled", !currentSetting);
            }}
          >
            <View className={`w-5 h-5 bg-white rounded-full mt-0.5 ${
              userStore.getActivitySoundSetting(activity.id, "popSoundEnabled", true) 
                ? "ml-6" : "ml-0.5"
            }`} />
          </Pressable>
        </View>
      )}

      {/* Breathing Guide */}
      {showBreathingGuide && (
        <View className="items-center mb-6">
          <View className={`w-20 h-20 ${getBreathingColor()} rounded-full items-center justify-center mb-2`}>
            <Text className="text-white text-lg font-bold">{breathingCount}</Text>
          </View>
          <Text className="text-blue-700 font-medium">{getBreathingInstruction()}</Text>
        </View>
      )}

      {/* Bubbles Grid */}
      <View className="flex-row flex-wrap justify-center mb-6">
        {bubbles.map((bubble) => (
          <Pressable
            key={bubble.id}
            className={`w-12 h-12 rounded-full items-center justify-center m-1 ${
              bubble.popped ? "bg-blue-200 opacity-30" : "bg-blue-300"
            }`}
            onPress={() => handleBubblePop(bubble.id)}
            disabled={bubble.popped}
          >
            {!bubble.popped && <Text className="text-blue-600 text-lg">🫧</Text>}
          </Pressable>
        ))}
      </View>

      {allBubblesPopped && (
        <View className="items-center">
          <Text className="text-blue-800 font-medium mb-4">
            🎉 Well done! You've found your calm.
          </Text>
          <Pressable
            className="bg-blue-600 py-3 px-6 rounded-xl"
            onPress={onComplete}
          >
            <Text className="text-white font-semibold">Complete Activity</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}