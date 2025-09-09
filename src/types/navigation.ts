import { Activity } from "../state/activitiesStore";
import type { NavigatorScreenParams } from "@react-navigation/native";
import type { ExpandedActivity } from "../data/expandedActivities";

export type MainTabParamList = {
  Home: undefined;
  Activities: undefined;
  Progress: undefined;
  Settings: undefined;
};

type AnyActivity = Activity | ExpandedActivity;

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Premium: undefined;
  ActivityDetail: { activity: AnyActivity };
  MoodTracker: undefined;
  ActivityLibrary: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  Value: undefined;
  Upgrade: undefined;
};