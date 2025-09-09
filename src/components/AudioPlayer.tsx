import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import AudioManager, { AudioTrack } from "../utils/audioManager";

interface AudioPlayerProps {
  trackId?: string;
  soundscapeId?: string;
  autoPlay?: boolean;
  showTimer?: boolean;
  timerMinutes?: number;
  onComplete?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  trackId,
  soundscapeId,
  autoPlay = false,
  showTimer = false,
  timerMinutes = 10,
  onComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [timeRemaining, setTimeRemaining] = useState(timerMinutes * 60);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioManager = AudioManager.getInstance();

  useEffect(() => {
    if (autoPlay && (trackId || soundscapeId)) {
      handlePlay();
    }

    return () => {
      audioManager.stop();
    };
  }, [trackId, soundscapeId, autoPlay]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && showTimer && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleStop();
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, showTimer, timeRemaining]);

  const handlePlay = async () => {
    try {
      setLoading(true);
      setError(null);
      let success = false;
      
      if (trackId) {
        success = await audioManager.playTrack(trackId, true);
        const track = audioManager.getAvailableTracks().find(t => t.id === trackId);
        setCurrentTrack(track || null);
      } else if (soundscapeId) {
        success = await audioManager.playSoundscape(soundscapeId, true);
      }

      if (success) {
        setIsPlaying(true);
        if (showTimer) {
          setTimeRemaining(timerMinutes * 60);
        }
      } else {
        setError(audioManager.getLastError() || "Audio could not start. Please try again.");
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAliasPlay = async (idOrAlias: string) => {
    const manager: any = audioManager as any;
    const resolved = (manager.resolveAlias ? manager.resolveAlias(idOrAlias) : idOrAlias) as string;
    await audioManager.stop();
    await audioManager.playTrack(resolved, true);
  };

  const handlePause = async () => {
    await audioManager.pause();
    setIsPlaying(false);
  };

  const handleResume = async () => {
    await audioManager.resume();
    setIsPlaying(true);
  };

  const handleStop = async () => {
    await audioManager.stop();
    setIsPlaying(false);
    if (showTimer) {
      setTimeRemaining(timerMinutes * 60);
    }
  };

  const handleVolumeChange = async (newVolume: number) => {
    setVolume(newVolume);
    await audioManager.setVolume(newVolume);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 24, shadowColor: "#000000", shadowOpacity: 0.05, shadowRadius: 8, borderWidth: 1, borderColor: "#F3F4F6" }}>
      {/* Track Info */}
      {currentTrack && (
        <View style={{ marginBottom: 16 }}>
          <Text className="text-lg font-semibold text-gray-900">{currentTrack.name}</Text>
          <Text className="text-gray-600 text-sm">{currentTrack.description}</Text>
        </View>
      )}

      {/* Timer Display */}
      {showTimer && (
        <View className="items-center mb-4">
          <Text className="text-3xl font-bold text-gray-900 mb-1">
            {formatTime(timeRemaining)}
          </Text>
          <Text className="text-gray-600 text-sm">Time Remaining</Text>
        </View>
      )}

      {/* Play Controls */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 24 }}>
        <Pressable
          style={{ width: 48, height: 48, backgroundColor: "#F3F4F6", borderRadius: 24, alignItems: "center", justifyContent: "center" }}
          onPress={handleStop}
        >
          <Ionicons name="stop" size={24} color="#6B7280" />
        </Pressable>

        <Pressable
          style={{ width: 64, height: 64, backgroundColor: loading ? "#A78BFA" : "#7C3AED", borderRadius: 32, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 6, opacity: loading ? 0.8 : 1 }}
          onPress={loading ? undefined : (isPlaying ? handlePause : (audioManager.isCurrentlyPlaying() ? handleResume : handlePlay))}
        >
          {loading ? (
            <Ionicons name="time" size={28} color="#FFFFFF" />
          ) : (
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={32} 
              color="white" 
              style={{ marginLeft: isPlaying ? 0 : 3 }}
            />
          )}
        </Pressable>

        <Pressable
          style={{ width: 48, height: 48, backgroundColor: "#F3F4F6", borderRadius: 24, alignItems: "center", justifyContent: "center" }}
          onPress={() => {/* Could add skip functionality */}}
        >
          <Ionicons name="refresh" size={24} color="#6B7280" />
        </Pressable>
      </View>

      {/* Error / Loading */}
      {loading && (
        <View style={{ paddingVertical: 8, marginBottom: 8 }}>
          <Text className="text-gray-500 text-sm">Preparing audio…</Text>
        </View>
      )}
      {error && (
        <View style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA", borderWidth: 1, padding: 12, borderRadius: 12, marginBottom: 12 }}>
          <Text style={{ color: "#991B1B", marginBottom: 8, fontWeight: "600" }}>{error}</Text>
          <Pressable style={{ backgroundColor: "#EF4444", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignSelf: "flex-start" }} onPress={handlePlay}>
            <Text style={{ color: "white", fontWeight: "600" }}>Try Again</Text>
          </Pressable>
        </View>
      )}

      {/* Volume Control */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <Text className="text-gray-700 font-medium">Volume</Text>
          <Text className="text-gray-500 text-sm">{Math.round(volume * 100)}%</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Ionicons name="volume-low" size={20} color="#9CA3AF" />
          <View style={{ flex: 1 }}>
            <Slider
              style={{ height: 40 }}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={handleVolumeChange}
              minimumTrackTintColor="#8B5CF6"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#8B5CF6"
            />
          </View>
          <Ionicons name="volume-high" size={20} color="#9CA3AF" />
        </View>
      </View>

      {/* Progress Bar for Timer */}
      {showTimer && (
        <View style={{ marginBottom: 8 }}>
          <View style={{ backgroundColor: "#E5E7EB", borderRadius: 9999, height: 8 }}>
            <View 
              style={{ 
                backgroundColor: "#8B5CF6",
                borderRadius: 9999,
                height: 8,
                width: `${((timerMinutes * 60 - timeRemaining) / (timerMinutes * 60)) * 100}%`
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

interface SoundscapePickerProps {
  onSelect: (soundscapeId: string) => void;
  isPremium: boolean;
  selectedId?: string;
}

export const SoundscapePicker: React.FC<SoundscapePickerProps> = ({
  onSelect,
  isPremium,
  selectedId
}) => {
  const audioManager = AudioManager.getInstance();
  const soundscapes = audioManager.getAvailableSoundscapes();
  const tracks = audioManager.getAvailableTracks();

  const categories = [
    { id: 'nature', name: 'Nature', icon: 'leaf', color: '#10B981' },
    { id: 'meditation', name: 'Meditation', icon: 'flower', color: '#8B5CF6' },
    { id: 'focus', name: 'Focus', icon: 'eye', color: '#F59E0B' },
    { id: 'sleep', name: 'Sleep', icon: 'moon', color: '#6366F1' },
    { id: 'ambient', name: 'Ambient', icon: 'musical-notes', color: '#EC4899' }
  ];

  return (
    <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 24, shadowColor: "#000000", shadowOpacity: 0.05, shadowRadius: 8, borderWidth: 1, borderColor: "#F3F4F6" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#111827", marginBottom: 16 }}>Choose Your Soundscape</Text>
      
      {categories.map(category => {
        const categoryTracks = tracks.filter(t => t.category === category.id);
        const categorySoundscapes = soundscapes.filter(s => s.category === category.id);
        
        if (categoryTracks.length === 0 && categorySoundscapes.length === 0) return null;

        return (
          <View key={category.id} className="mb-6">
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View 
                style={{ width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", marginRight: 12, backgroundColor: category.color + '20' }}
              >
                <Ionicons name={category.icon as any} size={16} color={category.color} />
              </View>
              <Text className="text-gray-900 font-semibold">{category.name}</Text>
            </View>

            {/* Individual Tracks */}
            {categoryTracks.map(track => (
              <Pressable
                key={track.id}
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 12, marginBottom: 8, backgroundColor: selectedId === track.id ? "#F5F3FF" : "#F9FAFB", opacity: track.premium && !isPremium ? 0.6 : 1, borderWidth: selectedId === track.id ? 1 : 0, borderColor: selectedId === track.id ? "#DDD6FE" : "transparent" }}
                onPress={() => track.premium && !isPremium ? null : onSelect(track.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#111827", fontWeight: "600" }}>{track.name}</Text>
                  <Text style={{ color: "#4B5563", fontSize: 12 }}>{track.description}</Text>
                </View>
                
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {track.premium && !isPremium && (
                    <View style={{ backgroundColor: "#E9D5FF", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999, marginRight: 8 }}>
                      <Text style={{ color: "#7C3AED", fontSize: 12, fontWeight: "600" }}>Premium</Text>
                    </View>
                  )}
                  <Ionicons 
                    name={selectedId === track.id ? "radio-button-on" : "radio-button-off"} 
                    size={20} 
                    color={selectedId === track.id ? "#8B5CF6" : "#9CA3AF"} 
                  />
                </View>
              </Pressable>
            ))}

            {/* Soundscape Combinations */}
            {categorySoundscapes.map(soundscape => (
              <Pressable
                key={soundscape.id}
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 2, borderStyle: "dashed", backgroundColor: selectedId === soundscape.id ? "#F5F3FF" : "#F9FAFB", borderColor: selectedId === soundscape.id ? "#C4B5FD" : "#D1D5DB", opacity: soundscape.premium && !isPremium ? 0.6 : 1 }}
                onPress={() => soundscape.premium && !isPremium ? null : onSelect(soundscape.id)}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text className="text-gray-900 font-medium">{soundscape.name}</Text>
                    <View className="bg-blue-100 px-2 py-1 rounded-full ml-2">
                      <Text className="text-blue-700 text-xs font-medium">Mix</Text>
                    </View>
                  </View>
                  <Text className="text-gray-600 text-sm">{soundscape.description}</Text>
                </View>
                
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {soundscape.premium && !isPremium && (
                    <View style={{ backgroundColor: "#E9D5FF", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999, marginRight: 8 }}>
                      <Text style={{ color: "#7C3AED", fontSize: 12, fontWeight: "600" }}>Premium</Text>
                    </View>
                  )}
                  <Ionicons 
                    name={selectedId === soundscape.id ? "radio-button-on" : "radio-button-off"} 
                    size={20} 
                    color={selectedId === soundscape.id ? "#8B5CF6" : "#9CA3AF"} 
                  />
                </View>
              </Pressable>
            ))}
          </View>
        );
      })}
    </View>
  );
};