import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  FadeInDown,
  ZoomIn,
  ZoomOut
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityMinigame } from "../data/expandedActivities";

interface GameStats {
  totalStimuli: number;
  correctResponses: number;
  incorrectResponses: number;
  missedTargets: number;
  falseAlarms: number;
  averageReactionTime: number;
  bestStreak: number;
  accuracy: number;
  score: number;
}

interface GoNoGoGameProps {
  config: ActivityMinigame;
  onComplete: (stats: GameStats) => void;
  className?: string;
}

export default function GoNoGoGame({ config, onComplete, className = "" }: GoNoGoGameProps) {
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");
  const [currentSymbol, setCurrentSymbol] = useState<string>("");
  const [isTarget, setIsTarget] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(config.durationMs / 1000);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [stats, setStats] = useState<GameStats>({
    totalStimuli: 0,
    correctResponses: 0,
    incorrectResponses: 0,
    missedTargets: 0,
    falseAlarms: 0,
    averageReactionTime: 0,
    bestStreak: 0,
    accuracy: 0,
    score: 0,
  });

  const stimulusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const gameTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stimulusStartTimeRef = useRef<number>(0);
  const reactionTimesRef = useRef<number[]>([]);
  const symbolScale = useSharedValue(0);
  const { width } = Dimensions.get("window");

  const symbolStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: symbolScale.value }],
    };
  });

  useEffect(() => {
    return () => {
      if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
      if (gameTimeoutRef.current) clearTimeout(gameTimeoutRef.current);
    };
  }, []);

  const startGame = () => {
    setGameState("playing");
    setTimeRemaining(config.durationMs / 1000);
    setStats({
      totalStimuli: 0,
      correctResponses: 0,
      incorrectResponses: 0,
      missedTargets: 0,
      falseAlarms: 0,
      averageReactionTime: 0,
      bestStreak: 0,
      accuracy: 0,
      score: 0,
    });
    setCurrentStreak(0);
    reactionTimesRef.current = [];

    // Start game timer
    gameTimeoutRef.current = setTimeout(() => {
      endGame();
    }, config.durationMs);

    // Start first stimulus
    scheduleNextStimulus();

    // Update countdown timer
    const countdownInterval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const scheduleNextStimulus = () => {
    const delay = config.stimulusMs + Math.random() * 200 - 100; // Add some randomness
    
    stimulusTimeoutRef.current = setTimeout(() => {
      showStimulus();
    }, delay);
  };

  const showStimulus = () => {
    const isTargetStimulus = Math.random() < 0.3; // 30% chance of target
    const symbol = isTargetStimulus 
      ? config.targetSymbol 
      : config.nonTargetSymbols[Math.floor(Math.random() * config.nonTargetSymbols.length)];

    setCurrentSymbol(symbol);
    setIsTarget(isTargetStimulus);
    stimulusStartTimeRef.current = Date.now();

    // Animate symbol appearance
    symbolScale.value = withSpring(1, { duration: 200 });

    // Hide stimulus after 1 second if no response
    setTimeout(() => {
      if (gameState === "playing") {
        handleMissedStimulus();
      }
    }, 1000);
  };

  const handleMissedStimulus = () => {
    if (isTarget) {
      setStats(prev => ({
        ...prev,
        totalStimuli: prev.totalStimuli + 1,
        missedTargets: prev.missedTargets + 1,
      }));
      setCurrentStreak(0);
    } else {
      setStats(prev => ({
        ...prev,
        totalStimuli: prev.totalStimuli + 1,
        correctResponses: prev.correctResponses + 1,
      }));
      setCurrentStreak(prev => prev + 1);
    }

    hideStimulus();
  };

  const handleTap = () => {
    if (gameState !== "playing" || !currentSymbol) return;

    const reactionTime = Date.now() - stimulusStartTimeRef.current;
    reactionTimesRef.current.push(reactionTime);

    if (isTarget) {
      // Correct response to target
      setStats(prev => ({
        ...prev,
        totalStimuli: prev.totalStimuli + 1,
        correctResponses: prev.correctResponses + 1,
      }));
      setCurrentStreak(prev => prev + 1);
    } else {
      // False alarm (tapped non-target)
      setStats(prev => ({
        ...prev,
        totalStimuli: prev.totalStimuli + 1,
        falseAlarms: prev.falseAlarms + 1,
      }));
      setCurrentStreak(0);
    }

    hideStimulus();
  };

  const hideStimulus = () => {
    symbolScale.value = withTiming(0, { duration: 150 });
    
    setTimeout(() => {
      setCurrentSymbol("");
      setIsTarget(false);
      
      if (gameState === "playing") {
        scheduleNextStimulus();
      }
    }, 150);
  };

  const endGame = () => {
    setGameState("finished");
    
    if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
    if (gameTimeoutRef.current) clearTimeout(gameTimeoutRef.current);

    // Calculate final stats
    const finalStats = { ...stats };
    const totalResponses = finalStats.correctResponses + finalStats.incorrectResponses + finalStats.missedTargets + finalStats.falseAlarms;
    
    if (totalResponses > 0) {
      finalStats.accuracy = (finalStats.correctResponses / totalResponses) * 100;
      finalStats.score = Math.round(finalStats.accuracy * (currentStreak / 10 + 1));
    }
    
    if (reactionTimesRef.current.length > 0) {
      finalStats.averageReactionTime = Math.round(
        reactionTimesRef.current.reduce((sum, time) => sum + time, 0) / reactionTimesRef.current.length
      );
    }
    
    finalStats.bestStreak = Math.max(finalStats.bestStreak, currentStreak);
    
    setStats(finalStats);
    saveGameStats(finalStats);
    onComplete(finalStats);
  };

  const saveGameStats = async (gameStats: GameStats) => {
    try {
      const existingStats = await AsyncStorage.getItem("attention_training_stats");
      const allStats = existingStats ? JSON.parse(existingStats) : [];
      
      allStats.push({
        ...gameStats,
        timestamp: new Date().toISOString(),
      });
      
      // Keep only last 50 games
      if (allStats.length > 50) {
        allStats.splice(0, allStats.length - 50);
      }
      
      await AsyncStorage.setItem("attention_training_stats", JSON.stringify(allStats));
    } catch (error) {
      console.error("Failed to save game stats:", error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (gameState === "ready") {
    return (
      <Animated.View 
        className={`bg-yellow-50 rounded-2xl p-6 ${className}`}
        entering={FadeInDown.duration(600)}
      >
        <View className="items-center">
          <View className="w-16 h-16 bg-yellow-100 rounded-full items-center justify-center mb-4">
            <Text className="text-3xl">{config.targetSymbol}</Text>
          </View>
          
          <Text className="text-xl font-bold text-yellow-900 mb-2">
            Attention Training Game
          </Text>
          
          <Text className="text-yellow-800 text-center mb-6 leading-relaxed">
            Tap only when you see the {config.targetSymbol} symbol. 
            Ignore all other symbols. Stay focused!
          </Text>
          
          <View className="bg-yellow-100 rounded-xl p-4 mb-6 w-full">
            <Text className="text-yellow-900 font-semibold mb-2">Instructions:</Text>
            <Text className="text-yellow-800 text-sm">
              • Tap the screen when you see: {config.targetSymbol}
            </Text>
            <Text className="text-yellow-800 text-sm">
              • Do NOT tap for: {config.nonTargetSymbols.join(", ")}
            </Text>
            <Text className="text-yellow-800 text-sm">
              • Game duration: {config.durationMs / 1000} seconds
            </Text>
          </View>
          
          <Pressable
            className="bg-yellow-600 py-4 px-8 rounded-xl"
            onPress={startGame}
          >
            <Text className="text-white font-semibold text-lg">Start Game</Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  }

  if (gameState === "playing") {
    return (
      <Pressable 
        className={`bg-gray-900 rounded-2xl p-6 min-h-[400px] items-center justify-center ${className}`}
        onPress={handleTap}
      >
        <View className="absolute top-6 left-6 right-6 flex-row justify-between items-center">
          <Text className="text-white font-semibold">
            Time: {formatTime(timeRemaining)}
          </Text>
          <Text className="text-white font-semibold">
            Streak: {currentStreak}
          </Text>
        </View>
        
        <View className="flex-1 items-center justify-center">
          {currentSymbol && (
            <Animated.View 
              style={[symbolStyle, { width: width * 0.3, height: width * 0.3 }]}
              className="items-center justify-center"
              entering={ZoomIn.duration(200)}
              exiting={ZoomOut.duration(150)}
            >
              <Text className="text-white text-8xl font-bold">
                {currentSymbol}
              </Text>
            </Animated.View>
          )}
        </View>
        
        <Text className="text-gray-400 text-center text-sm">
          Tap when you see {config.targetSymbol}
        </Text>
      </Pressable>
    );
  }

  // Finished state
  return (
    <Animated.View 
      className={`bg-green-50 rounded-2xl p-6 ${className}`}
      entering={FadeInDown.duration(600)}
    >
      <View className="items-center mb-6">
        <Ionicons name="trophy" size={48} color="#059669" />
        <Text className="text-2xl font-bold text-green-900 mt-2">
          Game Complete!
        </Text>
      </View>
      
      <View className="space-y-3">
        <View className="flex-row justify-between items-center bg-white rounded-xl p-3">
          <Text className="text-gray-700 font-medium">Accuracy</Text>
          <Text className="text-green-600 font-bold">
            {stats.accuracy.toFixed(1)}%
          </Text>
        </View>
        
        <View className="flex-row justify-between items-center bg-white rounded-xl p-3">
          <Text className="text-gray-700 font-medium">Score</Text>
          <Text className="text-green-600 font-bold">{stats.score}</Text>
        </View>
        
        <View className="flex-row justify-between items-center bg-white rounded-xl p-3">
          <Text className="text-gray-700 font-medium">Best Streak</Text>
          <Text className="text-green-600 font-bold">{stats.bestStreak}</Text>
        </View>
        
        <View className="flex-row justify-between items-center bg-white rounded-xl p-3">
          <Text className="text-gray-700 font-medium">Avg Reaction Time</Text>
          <Text className="text-green-600 font-bold">
            {stats.averageReactionTime}ms
          </Text>
        </View>
        
        <View className="flex-row justify-between items-center bg-white rounded-xl p-3">
          <Text className="text-gray-700 font-medium">Total Stimuli</Text>
          <Text className="text-green-600 font-bold">{stats.totalStimuli}</Text>
        </View>
      </View>
      
      <Pressable
        className="bg-green-600 py-3 px-6 rounded-xl mt-6"
        onPress={() => setGameState("ready")}
      >
        <Text className="text-white font-semibold text-center">Play Again</Text>
      </Pressable>
    </Animated.View>
  );
}