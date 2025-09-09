import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { AudioPlayer, SoundscapePicker } from "../AudioPlayer";
import { useUserStore } from "../../state/userStore";
import AudioManager from "../../utils/audioManager";

interface MeditationActivityProps {
  content: any;
  onComplete: () => void;
}

export default function MeditationActivity({ content, onComplete }: MeditationActivityProps) {
  const [currentPhase, setCurrentPhase] = useState<"intro" | "soundscape" | "meditation" | "complete">("intro");
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes default
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathingCount, setBreathingCount] = useState(4);
  const [selectedSoundscape, setSelectedSoundscape] = useState<string>("ocean_waves");
  const [isPlaying, setIsPlaying] = useState(false);
  
  const isPremium = useUserStore((state) => state.isPremium);

  useEffect(() => {
    if (content?.duration) {
      const minutes = parseInt(content.duration.match(/\d+/)?.[0] || "5");
      setTimeRemaining(minutes * 60);
    }
  }, [content]);

  useEffect(() => {
    if (!isPlaying || currentPhase !== "meditation") return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setCurrentPhase("complete");
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, currentPhase]);

  useEffect(() => {
    if (!isPlaying || currentPhase !== "meditation") return;

    const breathingTimer = setInterval(() => {
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

    return () => clearInterval(breathingTimer);
  }, [isPlaying, currentPhase, breathingPhase]);

  const startMeditation = () => {
    setIsPlaying(true);
    setCurrentPhase("meditation");
  };

  const pauseMeditation = () => {
    setIsPlaying(false);
  };

  const resumeMeditation = () => {
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

  if (currentPhase === "complete") {
    return (
      <View style={{ backgroundColor: "#F3E8FF", borderRadius: 16, padding: 24 }}>
        <View style={{ alignItems: "center" }}>
          <View style={{ width: 80, height: 80, backgroundColor: "#E9D5FF", borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <Ionicons name="sparkles" size={40} color="#8B5CF6" />
          </View>
          
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#4C1D95", textAlign: "center", marginBottom: 16 }}>
            ✨ Meditation Complete
          </Text>
          
          <Text style={{ color: "#5B21B6", textAlign: "center", marginBottom: 24, lineHeight: 22 }}>
            You have completed your guided meditation. Take a moment to notice how you feel.
          </Text>
          
          <Pressable
            style={{ backgroundColor: "#7C3AED", paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12 }}
            onPress={onComplete}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>Complete Activity</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (currentPhase === "soundscape") {
    return (
      <View style={{ gap: 24 }}>
        <SoundscapePicker
          onSelect={setSelectedSoundscape}
          isPremium={isPremium}
          selectedId={selectedSoundscape}
        />
        
        <View style={{ flexDirection: "row", gap: 16 }}>
          <Pressable
            style={{ flex: 1, backgroundColor: "#E5E7EB", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" }}
            onPress={() => setCurrentPhase("intro")}
          >
            <Text style={{ color: "#374151", fontWeight: "600" }}>Back</Text>
          </Pressable>
          
          <Pressable
            style={{ flex: 1, backgroundColor: "#7C3AED", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" }}
            onPress={startMeditation}
            disabled={!selectedSoundscape}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Start Meditation</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (currentPhase === "meditation") {
    const am = AudioManager.getInstance();
    const isTrack = am.getAvailableTracks().some((t) => t.id === selectedSoundscape);
    const isSoundscape = am.getAvailableSoundscapes().some((s) => s.id === selectedSoundscape);
    
    return (
      <View style={{ gap: 24 }}>
        {/* Audio Player */}
        <AudioPlayer
          trackId={isTrack ? selectedSoundscape : undefined}
          soundscapeId={isSoundscape ? selectedSoundscape : undefined}
          autoPlay={true}
          showTimer={true}
          timerMinutes={Math.ceil(timeRemaining / 60)}
          onComplete={() => setCurrentPhase("complete")}
        />
        
        {/* Breathing Guide */}
        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 24, shadowColor: "#000000", shadowOpacity: 0.05, shadowRadius: 8, borderWidth: 1, borderColor: "#F3F4F6" }}>
          <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Breathing Guide
          </Text>
          
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <View className="relative w-32 h-32 items-center justify-center mb-4">
              <LottieView
                source={require("../../../assets/animations/breathing.json")}
                autoPlay
                loop
                style={{ width: 120, height: 120, position: "absolute" }}
              />
              <View className={`w-20 h-20 ${getBreathingColor()} rounded-full items-center justify-center z-10`}>
                <Text className="text-white text-xl font-bold">{breathingCount}</Text>
              </View>
            </View>
            <Text className="text-gray-700 font-semibold text-lg">{getBreathingInstruction()}</Text>
            <Text className="text-gray-600 text-center mt-2">
              {content?.instructions || "Follow the breathing rhythm and let your mind rest"}
            </Text>
          </View>

          {/* Controls */}
          <View className="flex-row justify-center space-x-4">
            <Pressable
              style={{ backgroundColor: "#7C3AED", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, flexDirection: "row", alignItems: "center" }}
              onPress={isPlaying ? pauseMeditation : resumeMeditation}
            >
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={20} 
                color="#FFFFFF" 
              />
              <Text style={{ color: "#FFFFFF", fontWeight: "600", marginLeft: 8 }}>
                {isPlaying ? "Pause" : "Resume"}
              </Text>
            </Pressable>
            
            <Pressable
              style={{ backgroundColor: "#E5E7EB", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 }}
              onPress={() => setCurrentPhase("complete")}
            >
              <Text style={{ color: "#374151", fontWeight: "600" }}>End Early</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-purple-50 rounded-2xl p-6">
      <Text className="text-lg font-semibold text-purple-900 mb-4 text-center">
        🌟 {content?.title || "Guided Meditation"}
      </Text>
      
      <View className="bg-white rounded-xl p-6 border border-purple-200 mb-6">
        <Text className="text-purple-800 text-center mb-4 leading-relaxed">
          {content?.description || "Find a comfortable position and prepare for a peaceful meditation journey."}
        </Text>
        
        <View className="items-center mb-4">
          <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-3">
            <Ionicons name="time" size={24} color="#8B5CF6" />
          </View>
          <Text className="text-purple-700 font-medium">
            Duration: {formatTime(timeRemaining)}
          </Text>
        </View>
      </View>
      
      <Text className="text-purple-700 text-center mb-6">
        {content?.instructions || "This meditation will guide you through breathing exercises with calming background sounds."}
      </Text>

      <View className="items-center space-y-4">
        <Pressable
          className="bg-purple-600 py-4 px-8 rounded-xl"
          onPress={() => setCurrentPhase("soundscape")}
        >
          <Text className="text-white font-semibold text-lg">🎵 Choose Soundscape</Text>
        </Pressable>
        
        <Pressable
          className="bg-purple-200 py-3 px-6 rounded-xl"
          onPress={startMeditation}
        >
          <Text className="text-purple-800 font-semibold">Start Without Sound</Text>
        </Pressable>
        
        <Text className="text-purple-500 text-sm text-center">
          Find a quiet space and make yourself comfortable
        </Text>
      </View>
    </View>
  );
}