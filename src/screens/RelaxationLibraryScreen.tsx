import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeInLeft, 
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolate
} from "react-native-reanimated";
import { Audio } from "expo-av";

interface MediaItem {
  id: string;
  title: string;
  duration: string;
  type: "meditation" | "story" | "music";
  description: string;
  audioFile?: string;
}

export default function RelaxationLibraryScreen() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "meditation" | "story" | "music">("all");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Animation values
  const pulseValue = useSharedValue(1);
  const progressValue = useSharedValue(0);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseValue.value }],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(progressValue.value, [0, 1], [0, 100])}%`,
    };
  });

  const mediaItems: MediaItem[] = [
    {
      id: "meditation_1",
      title: "Morning Mindfulness",
      duration: "10 min",
      type: "meditation",
      description: "Start your day with peaceful awareness",
      audioFile: "meditation.json",
    },
    {
      id: "meditation_2",
      title: "Body Scan Relaxation",
      duration: "15 min",
      type: "meditation",
      description: "Release tension from head to toe",
    },
    {
      id: "story_1",
      title: "The Peaceful Garden",
      duration: "12 min",
      type: "story",
      description: "A soothing bedtime story for all ages",
    },
    {
      id: "story_2",
      title: "Starlight Dreams",
      duration: "8 min",
      type: "story",
      description: "Journey through a magical night sky",
    },
    {
      id: "music_1",
      title: "Ocean Waves",
      duration: "30 min",
      type: "music",
      description: "Gentle sounds of the sea",
      audioFile: "ocean.m4a",
    },
    {
      id: "music_2",
      title: "Forest Sounds",
      duration: "45 min",
      type: "music",
      description: "Birds and rustling leaves",
      audioFile: "forest.m4a",
    },
  ];

  const filteredItems = mediaItems.filter(item => 
    selectedCategory === "all" || item.type === selectedCategory
  );

  const categories = [
    { key: "all", label: "All", icon: "grid" },
    { key: "meditation", label: "Meditations", icon: "leaf" },
    { key: "story", label: "Stories", icon: "book" },
    { key: "music", label: "Music", icon: "musical-notes" },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meditation": return "purple";
      case "story": return "blue";
      case "music": return "green";
      default: return "gray";
    }
  };

  const handlePlay = async (itemId: string) => {
    try {
      setIsLoading(true);
      
      if (playingId === itemId) {
        // Pause current audio
        if (sound) {
          await sound.pauseAsync();
        }
        setPlayingId(null);
        pulseValue.value = withTiming(1);
      } else {
        // Stop previous audio if playing
        if (sound) {
          await sound.unloadAsync();
          setSound(null);
        }
        
        // Find the item and load its audio
        const item = mediaItems.find(i => i.id === itemId);
        if (item?.audioFile) {
          let audioSource;
          
          // Map audio files to actual assets
          switch (item.audioFile) {
            case "ocean.m4a":
              audioSource = require("../../assets/audio/ocean.m4a");
              break;
            case "forest.m4a":
              audioSource = require("../../assets/audio/forest.m4a");
              break;
            default:
              // For meditation/story items without actual audio files, simulate
              audioSource = require("../../assets/audio/bowls.m4a");
          }
          
          const { sound: newSound } = await Audio.Sound.createAsync(audioSource);
          setSound(newSound);
          
          // Set up playback status update
          newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded) {
              setCurrentPosition(status.positionMillis || 0);
              setDuration(status.durationMillis || 0);
              
              if (status.positionMillis && status.durationMillis) {
                progressValue.value = withTiming(status.positionMillis / status.durationMillis);
              }
              
              if (status.didJustFinish) {
                setPlayingId(null);
                pulseValue.value = withTiming(1);
              }
            }
          });
          
          await newSound.playAsync();
          setPlayingId(itemId);
          
          // Start pulse animation
          pulseValue.value = withRepeat(
            withTiming(1.1, { duration: 1000 }),
            -1,
            true
          );
        }
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Animated.View className="px-6 pt-4" entering={FadeInDown.duration(600)}>
        <Text className="text-2xl font-bold text-gray-900 mb-6">Relaxation Library</Text>
        
        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          <View className="flex-row space-x-3">
            {categories.map((category) => (
              <Pressable
                key={category.key}
                className={`px-4 py-2 rounded-full flex-row items-center space-x-2 ${
                  selectedCategory === category.key 
                    ? "bg-purple-600" 
                    : "bg-gray-100"
                }`}
                onPress={() => setSelectedCategory(category.key as any)}
              >
                <Ionicons 
                  name={category.icon as keyof typeof Ionicons.glyphMap} 
                  size={16} 
                  color={selectedCategory === category.key ? "#FFFFFF" : "#6B7280"} 
                />
                <Text className={`font-medium ${
                  selectedCategory === category.key ? "text-white" : "text-gray-600"
                }`}>
                  {category.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      <ScrollView className="flex-1 px-6">
        <View className="space-y-4 pb-8">
          {filteredItems.map((item, index) => (
            <Animated.View 
              key={item.id} 
              className="bg-white border border-gray-200 rounded-2xl p-6"
              entering={FadeInUp.delay(index * 100).duration(500)}
            >
              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <View className={`w-10 h-10 bg-${getTypeColor(item.type)}-100 rounded-full items-center justify-center mr-3`}>
                      <Ionicons 
                        name={
                          item.type === "meditation" ? "leaf" :
                          item.type === "story" ? "book" : "musical-notes"
                        } 
                        size={20} 
                        color={
                          item.type === "meditation" ? "#8B5CF6" :
                          item.type === "story" ? "#3B82F6" : "#10B981"
                        } 
                      />
                    </View>
                    
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </Text>
                      <Text className="text-sm text-gray-600 capitalize">
                        {item.type} • {item.duration}
                      </Text>
                    </View>
                  </View>
                  
                  <Text className="text-gray-600 leading-relaxed">
                    {item.description}
                  </Text>
                </View>
                
                <Animated.View style={playingId === item.id ? pulseStyle : {}}>
                  <Pressable
                    className={`w-12 h-12 rounded-full items-center justify-center ml-4 ${
                      playingId === item.id ? "bg-red-100" : "bg-purple-100"
                    }`}
                    onPress={() => handlePlay(item.id)}
                  >
                    <Ionicons 
                      name={isLoading ? "hourglass" : playingId === item.id ? "pause" : "play"} 
                      size={24} 
                      color={playingId === item.id ? "#EF4444" : "#8B5CF6"} 
                    />
                  </Pressable>
                </Animated.View>
              </View>
              
              {playingId === item.id && (
                <Animated.View 
                  className="bg-purple-50 rounded-xl p-4"
                  entering={FadeInLeft.duration(300)}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-purple-900 font-medium">Now Playing</Text>
                    <Text className="text-purple-700 text-sm">
                      {Math.floor(currentPosition / 60000)}:{String(Math.floor((currentPosition % 60000) / 1000)).padStart(2, '0')} / {item.duration}
                    </Text>
                  </View>
                  <View className="bg-purple-200 rounded-full h-2">
                    <Animated.View 
                      className="bg-purple-600 rounded-full h-2" 
                      style={progressStyle}
                    />
                  </View>
                </Animated.View>
              )}
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}