import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text } from "react-native";
import { Asset } from "expo-asset";

import AppNavigator from "./src/navigation/AppNavigator";
import { initializeNotifications } from "./src/api/notifications-service";
import { useActivitiesStore } from "./src/state/activitiesStore";
import { getCurrentDayNumber } from "./src/data/sampleActivities";
import SoundEffectsManager from "./src/utils/soundEffectsManager";

/*
IMPORTANT NOTICE: DO NOT REMOVE
There are already environment keys in the project. 
Before telling the user to add them, check if you already have access to the required keys through bash.
Directly access them with process.env.${key}

Correct usage:
process.env.EXPO_PUBLIC_VIBECODE_{key}
//directly access the key

Incorrect usage:
import { OPENAI_API_KEY } from '@env';
//don't use @env, its depreicated

Incorrect usage:
import Constants from 'expo-constants';
const openai_api_key = Constants.expoConfig.extra.apikey;
//don't use expo-constants, its depreicated

*/

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const loadDailyActivities = useActivitiesStore((state) => state.loadDailyActivities);

  useEffect(() => {
    // Initialize app services
    const initializeApp = async () => {
      try {
        // Preload audio assets
        await Asset.loadAsync([
          require('./assets/audio/rain.m4a'),
          require('./assets/audio/ocean.m4a'),
          require('./assets/audio/forest.m4a'),
          require('./assets/audio/bowls.m4a'),
          require('./assets/audio/white.m4a'),
          require('./assets/audio/brown.m4a'),
          require('./assets/audio/campfire.m4a'),
          require('./assets/audio/thunder.m4a'),
          require('./assets/audio/bubble-pop.wav'),
          require('./assets/sfx/pop.wav'),
        ]);

        // Initialize sound effects manager
        const sfxManager = SoundEffectsManager.getInstance();
        await sfxManager.initialize();

        await initializeNotifications();
        
        // Load today's activities
        const currentDay = getCurrentDayNumber();
        loadDailyActivities(currentDay);
        
        setIsReady(true);
      } catch (error) {
        console.error("Error initializing app:", error);
        setIsReady(true); // Continue even if preloading fails
      }
    };

    initializeApp();
  }, [loadDailyActivities]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F3F4F6" }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: "#374151", marginBottom: 8 }}>
          Preparing your wellness experience...
        </Text>
        <Text style={{ fontSize: 14, color: "#6B7280" }}>
          Loading audio and resources
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
