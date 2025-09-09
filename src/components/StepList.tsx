import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  FadeInRight,
  FadeInLeft
} from "react-native-reanimated";
import { ActivityStep } from "../data/expandedActivities";

interface StepListProps {
  steps: ActivityStep[];
  autoAdvance?: boolean;
  onStepChange?: (stepIndex: number) => void;
  onComplete?: () => void;
  className?: string;
}

export default function StepList({
  steps,
  autoAdvance = true,
  onStepChange,
  onComplete,
  className = "",
}: StepListProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const progressValue = useSharedValue(0);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressValue.value}%`,
    };
  });

  useEffect(() => {
    if (currentStepIndex < steps.length) {
      const currentStep = steps[currentStepIndex];
      setTimeRemaining(currentStep.duration || 30);
      onStepChange?.(currentStepIndex);
    }
  }, [currentStepIndex, steps, onStepChange]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeRemaining > 0 && autoAdvance) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleNextStep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeRemaining, autoAdvance]);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      const currentStep = steps[currentStepIndex];
      const totalDuration = currentStep?.duration || 30;
      const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;
      progressValue.value = withTiming(progress, { duration: 1000 });
    }
  }, [timeRemaining, isPlaying, currentStepIndex, steps, progressValue]);

  const handlePlay = () => {
    setIsPlaying(true);
    if (currentStepIndex >= steps.length) {
      handleReplay();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      progressValue.value = 0;
    } else {
      setIsPlaying(false);
      onComplete?.();
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      progressValue.value = 0;
    }
  };

  const handleReplay = () => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
    progressValue.value = 0;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentStep = steps[currentStepIndex];
  const isCompleted = currentStepIndex >= steps.length;

  return (
    <View className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-gray-900">
          Step-by-Step Guide
        </Text>
        <View className="flex-row items-center space-x-2">
          <Pressable
            className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
            onPress={handlePreviousStep}
            disabled={currentStepIndex === 0}
          >
            <Ionicons 
              name="chevron-back" 
              size={16} 
              color={currentStepIndex === 0 ? "#9CA3AF" : "#374151"} 
            />
          </Pressable>
          
          <Pressable
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isPlaying ? "bg-orange-100" : "bg-green-100"
            }`}
            onPress={isPlaying ? handlePause : handlePlay}
          >
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={20} 
              color={isPlaying ? "#EA580C" : "#059669"} 
            />
          </Pressable>
          
          <Pressable
            className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
            onPress={handleNextStep}
            disabled={currentStepIndex >= steps.length - 1}
          >
            <Ionicons 
              name="chevron-forward" 
              size={16} 
              color={currentStepIndex >= steps.length - 1 ? "#9CA3AF" : "#374151"} 
            />
          </Pressable>
          
          <Pressable
            className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center"
            onPress={handleReplay}
          >
            <Ionicons name="refresh" size={16} color="#2563EB" />
          </Pressable>
        </View>
      </View>

      {!isCompleted && currentStep && (
        <Animated.View entering={FadeInRight.duration(400)}>
          <View className="bg-blue-50 rounded-xl p-4 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-blue-900 font-semibold">
                Step {currentStepIndex + 1} of {steps.length}
              </Text>
              {autoAdvance && timeRemaining > 0 && (
                <Text className="text-blue-700 text-sm">
                  {formatTime(timeRemaining)}
                </Text>
              )}
            </View>
            
            <Text className="text-blue-800 text-lg font-medium mb-2">
              {currentStep.label}
            </Text>
            
            {currentStep.instruction && (
              <Text className="text-blue-700 text-sm">
                {currentStep.instruction}
              </Text>
            )}
            
            {autoAdvance && (
              <View className="bg-blue-200 rounded-full h-1 mt-3">
                <Animated.View 
                  className="bg-blue-600 rounded-full h-1"
                  style={progressStyle}
                />
              </View>
            )}
          </View>
        </Animated.View>
      )}

      {isCompleted && (
        <Animated.View 
          className="bg-green-50 rounded-xl p-4 mb-4 items-center"
          entering={FadeInLeft.duration(600)}
        >
          <Ionicons name="checkmark-circle" size={48} color="#059669" />
          <Text className="text-green-900 font-semibold text-lg mt-2">
            All Steps Complete!
          </Text>
          <Text className="text-green-700 text-center mt-1">
            Great job following through with the entire sequence.
          </Text>
        </Animated.View>
      )}

      <View className="space-y-2">
        {steps.map((step, index) => (
          <Pressable
            key={index}
            className={`flex-row items-center p-3 rounded-xl ${
              index === currentStepIndex
                ? "bg-blue-100 border border-blue-200"
                : index < currentStepIndex
                ? "bg-green-50 border border-green-200"
                : "bg-gray-50 border border-gray-200"
            }`}
            onPress={() => {
              setCurrentStepIndex(index);
              setIsPlaying(false);
              progressValue.value = 0;
            }}
          >
            <View
              className={`w-6 h-6 rounded-full items-center justify-center mr-3 ${
                index === currentStepIndex
                  ? "bg-blue-600"
                  : index < currentStepIndex
                  ? "bg-green-600"
                  : "bg-gray-300"
              }`}
            >
              {index < currentStepIndex ? (
                <Ionicons name="checkmark" size={14} color="white" />
              ) : (
                <Text
                  className={`text-xs font-bold ${
                    index === currentStepIndex ? "text-white" : "text-gray-600"
                  }`}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            
            <View className="flex-1">
              <Text
                className={`font-medium ${
                  index === currentStepIndex
                    ? "text-blue-900"
                    : index < currentStepIndex
                    ? "text-green-900"
                    : "text-gray-700"
                }`}
              >
                {step.label}
              </Text>
              {step.duration && (
                <Text
                  className={`text-xs ${
                    index === currentStepIndex
                      ? "text-blue-600"
                      : index < currentStepIndex
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {formatTime(step.duration)}
                </Text>
              )}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}