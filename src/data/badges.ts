import { Ionicons } from "@expo/vector-icons";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  requirement: string;
  streakRequired?: number;
  activitiesRequired?: number;
}

export const badgesData: Badge[] = [
  {
    id: "first_step",
    name: "First Step",
    description: "Complete your first activity",
    icon: "footsteps",
    requirement: "Complete 1 activity",
    activitiesRequired: 1,
  },
  {
    id: "week_warrior",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "flame",
    requirement: "7 day streak",
    streakRequired: 7,
  },
  {
    id: "month_master",
    name: "Month Master",
    description: "Achieve a 30-day streak",
    icon: "trophy",
    requirement: "30 day streak",
    streakRequired: 30,
  },
  {
    id: "century_champion",
    name: "Century Champion",
    description: "Reach a 100-day streak",
    icon: "star",
    requirement: "100 day streak",
    streakRequired: 100,
  },
  {
    id: "zen_master",
    name: "Zen Master",
    description: "Complete 50 relaxation activities",
    icon: "leaf",
    requirement: "50 relax activities",
    activitiesRequired: 50,
  },
  {
    id: "knowledge_seeker",
    name: "Knowledge Seeker",
    description: "Complete 50 learning activities",
    icon: "bulb",
    requirement: "50 learn activities",
    activitiesRequired: 50,
  },
  {
    id: "creative_soul",
    name: "Creative Soul",
    description: "Complete 50 creative activities",
    icon: "brush",
    requirement: "50 create activities",
    activitiesRequired: 50,
  },
  {
    id: "early_bird",
    name: "Early Bird",
    description: "Complete activities before 9 AM",
    icon: "sunny",
    requirement: "Complete 10 morning activities",
    activitiesRequired: 10,
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Complete activities after 8 PM",
    icon: "moon",
    requirement: "Complete 10 evening activities",
    activitiesRequired: 10,
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Complete all daily activities for 7 days",
    icon: "checkmark-circle",
    requirement: "7 perfect days",
    streakRequired: 7,
  },
];

export const getBadgeProgress = (
  badge: Badge, 
  currentStreak: number, 
  totalActivities: number,
  completedActivities: string[]
): { unlocked: boolean; progress: number; total: number } => {
  if (badge.streakRequired) {
    return {
      unlocked: currentStreak >= badge.streakRequired,
      progress: Math.min(currentStreak, badge.streakRequired),
      total: badge.streakRequired,
    };
  }
  
  if (badge.activitiesRequired) {
    let relevantCount = totalActivities;
    
    // For type-specific badges, count only relevant activities
    if (badge.id === "zen_master") {
      relevantCount = completedActivities.filter(id => id.includes("_relax_")).length;
    } else if (badge.id === "knowledge_seeker") {
      relevantCount = completedActivities.filter(id => id.includes("_learn_")).length;
    } else if (badge.id === "creative_soul") {
      relevantCount = completedActivities.filter(id => id.includes("_create_")).length;
    }
    
    return {
      unlocked: relevantCount >= badge.activitiesRequired,
      progress: Math.min(relevantCount, badge.activitiesRequired),
      total: badge.activitiesRequired,
    };
  }
  
  return { unlocked: false, progress: 0, total: 1 };
};