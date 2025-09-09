import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList, MainTabParamList } from "../types/navigation";

import OnboardingNavigator from "./OnboardingNavigator";
import HomeScreen from "../screens/HomeScreen";
import ActivitiesScreen from "../screens/ActivitiesScreen";
import ProgressScreen from "../screens/ProgressScreen";
import SettingsScreen from "../screens/SettingsScreen";
import PremiumScreen from "../screens/PremiumScreen";
import ActivityDetailScreen from "../screens/ActivityDetailScreen";
import MoodTrackerScreen from "../screens/MoodTrackerScreen";
import ActivityLibraryScreen from "../screens/ActivityLibraryScreen";

import { useUserStore } from "../state/userStore";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Activities") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Progress") {
            iconName = focused ? "trophy" : "trophy-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else {
            iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#8B5CF6",
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Activities" component={ActivitiesScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasCompletedOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen 
            name="Premium" 
            component={PremiumScreen}
            options={{
              presentation: "modal",
              headerShown: true,
              headerTitle: "Go Premium",
              headerTitleStyle: { fontWeight: "600" },
            }}
          />
          <Stack.Screen 
            name="ActivityDetail" 
            component={ActivityDetailScreen}
            options={{
              headerShown: true,
              headerTitle: "",
            }}
          />
          <Stack.Screen 
            name="MoodTracker" 
            component={MoodTrackerScreen}
            options={{
              presentation: "modal",
              headerShown: true,
              headerTitle: "Mood Tracker",
              headerTitleStyle: { fontWeight: "600" },
            }}
          />
          <Stack.Screen 
            name="ActivityLibrary" 
            component={ActivityLibraryScreen}
            options={{
              presentation: "modal",
              headerShown: true,
              headerTitle: "Activity Library",
              headerTitleStyle: { fontWeight: "600" },
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}