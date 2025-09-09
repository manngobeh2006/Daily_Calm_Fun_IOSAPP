import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { generateFreshAffirmation } from "../../api/content-generator";
import GoNoGoGame from "../GoNoGoGame";
import StepList from "../StepList";
import { ExpandedActivity } from "../../data/expandedActivities";

interface LearnActivityProps {
  content: any;
  activity?: ExpandedActivity;
  onComplete: () => void;
}

export default function LearnActivity({ content, activity, onComplete }: LearnActivityProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState(content?.affirmation || "I am strong, calm, and creative");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [, setCurrentStepIndex] = useState(0);

  // Check for specific activity types
  const hasMinigame = activity?.minigame;
  const isStepBasedActivity = activity?.steps && activity.steps.length > 0;
  const hasAnimation = activity?.animation;

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
  };

  const handleRefreshAffirmation = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const newAffirmation = await generateFreshAffirmation();
      setCurrentAffirmation(newAffirmation);
    } catch (error) {
      console.log("Could not refresh affirmation");
    } finally {
      setIsRefreshing(false);
    }
  };

  const isCorrect = selectedAnswer === content?.quiz?.correct;

  // Handle mini-game completion
  const handleMinigameComplete = (stats: any) => {
    console.log("Game completed with stats:", stats);
    onComplete();
  };

  // Attention Training Mini-game
  if (hasMinigame && activity?.minigame) {
    return (
      <View className="bg-yellow-50 rounded-2xl p-6">
        <GoNoGoGame 
          config={activity.minigame}
          onComplete={handleMinigameComplete}
        />
      </View>
    );
  }

  // Step-based learning activities
  if (isStepBasedActivity && activity?.steps) {
    return (
      <View className="bg-purple-50 rounded-2xl p-6">
        {hasAnimation && (
          <View className="items-center mb-6">
            <LottieView
              source={require("../../../assets/anim/attention_training.json")}
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

  if (content?.quiz && showQuiz) {
    return (
      <View className="bg-green-50 rounded-2xl p-6">
        <Text className="text-lg font-semibold text-green-900 mb-4 text-center">
          🧠 Quick Quiz
        </Text>
        
        <Text className="text-green-800 text-center mb-6 text-lg">
          {content.quiz.question}
        </Text>

        <View className="space-y-3 mb-6">
          {content.quiz.options.map((option: string, index: number) => (
            <Pressable
              key={index}
              className={`p-4 rounded-xl border-2 ${
                selectedAnswer === index
                  ? showResult
                    ? index === content.quiz.correct
                      ? "border-green-500 bg-green-100"
                      : "border-red-500 bg-red-100"
                    : "border-green-500 bg-green-100"
                  : "border-green-200 bg-white"
              }`}
              onPress={() => handleQuizAnswer(index)}
              disabled={showResult}
            >
              <Text className={`text-center font-medium ${
                selectedAnswer === index && showResult
                  ? index === content.quiz.correct
                    ? "text-green-800"
                    : "text-red-800"
                  : "text-green-800"
              }`}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        {showResult && (
          <View className="items-center">
            <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${
              isCorrect ? "bg-green-500" : "bg-orange-500"
            }`}>
              <Ionicons 
                name={isCorrect ? "checkmark" : "bulb"} 
                size={32} 
                color="#FFFFFF" 
              />
            </View>
            
            <Text className="text-green-800 font-medium text-center mb-4">
              {isCorrect ? "Correct! 🎉" : "Good try! 💡"}
            </Text>
            
            <Pressable
              className="bg-green-600 py-3 px-6 rounded-xl"
              onPress={onComplete}
            >
              <Text className="text-white font-semibold">Complete Activity</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  return (
    <View className="bg-green-50 rounded-2xl p-6">
      <Text className="text-lg font-semibold text-green-900 mb-4 text-center">
        💚 {content?.fact ? "Amazing Fact" : "Daily Affirmation"}
      </Text>
      
      <View className="bg-white rounded-xl p-6 border border-green-200 mb-6">
        <Text className="text-xl text-green-800 text-center font-medium leading-relaxed">
          {content?.fact || currentAffirmation}
        </Text>
        
        {content?.affirmation && !content?.fact && (
          <Pressable
            className="mt-4 flex-row items-center justify-center"
            onPress={handleRefreshAffirmation}
            disabled={isRefreshing}
          >
            <Ionicons 
              name="refresh" 
              size={16} 
              color={isRefreshing ? "#9CA3AF" : "#059669"} 
            />
            <Text className={`ml-2 text-sm font-medium ${
              isRefreshing ? "text-gray-400" : "text-green-600"
            }`}>
              {isRefreshing ? "Getting new affirmation..." : "New affirmation"}
            </Text>
          </Pressable>
        )}
      </View>

      {content?.explanation && (
        <View className="bg-green-100 rounded-xl p-4 mb-6">
          <Text className="text-green-800 text-center">
            {content.explanation}
          </Text>
        </View>
      )}
      
      <Text className="text-green-700 text-center mb-6">
        {content?.instructions || "Take a moment to reflect on these words"}
      </Text>

      <View className="items-center space-y-4">
        {content?.quiz && !showQuiz && (
          <Pressable
            className="bg-green-600 py-3 px-6 rounded-xl mb-2"
            onPress={() => setShowQuiz(true)}
          >
            <Text className="text-white font-semibold">Test Your Knowledge</Text>
          </Pressable>
        )}
        
        <Pressable
          className="bg-green-600 py-3 px-6 rounded-xl"
          onPress={onComplete}
        >
          <Text className="text-white font-semibold">Complete Activity</Text>
        </Pressable>
      </View>
    </View>
  );
}