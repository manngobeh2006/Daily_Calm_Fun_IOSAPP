import { ExpandedActivity, getActivitiesByCategory, getActivitiesByDifficulty, getActivitiesByTags } from "../data/expandedActivities";

export interface UserProfile {
  preferredCategories: string[];
  preferredDifficulty: "beginner" | "intermediate" | "advanced";
  preferredDuration: number; // in minutes
  timeOfDayPreferences: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
  completedActivities: string[];
  skippedActivities: string[];
  favoriteActivities: string[];
  moodPatterns: {
    [mood: number]: string[]; // mood level -> preferred activity categories
  };
  stressLevels: {
    [level: number]: string[]; // stress level -> preferred activity types
  };
  goals: string[]; // "stress_relief", "better_sleep", "focus", "energy", etc.
  lastActiveTime: string;
  sessionDurations: number[]; // Track how long user typically engages
}

export interface PersonalizationContext {
  currentMood?: number;
  stressLevel?: number;
  timeOfDay: "morning" | "afternoon" | "evening";
  availableTime?: number; // in minutes
  lastActivityCategory?: string;
  consecutiveDays?: number;
  weatherCondition?: "sunny" | "rainy" | "cloudy";
  location?: "home" | "work" | "travel";
}

export interface RecommendationScore {
  activity: ExpandedActivity;
  score: number;
  reasons: string[];
}

class PersonalizationEngine {
  private static instance: PersonalizationEngine;
  private userProfile: UserProfile;

  private constructor() {
    this.userProfile = this.getDefaultProfile();
  }

  public static getInstance(): PersonalizationEngine {
    if (!PersonalizationEngine.instance) {
      PersonalizationEngine.instance = new PersonalizationEngine();
    }
    return PersonalizationEngine.instance;
  }

  private getDefaultProfile(): UserProfile {
    return {
      preferredCategories: ["breathing", "meditation", "gratitude"],
      preferredDifficulty: "beginner",
      preferredDuration: 10,
      timeOfDayPreferences: {
        morning: ["morning_routine", "energy_builder", "gratitude"],
        afternoon: ["work_break", "focus_boost", "stress_relief"],
        evening: ["sleep_preparation", "meditation", "self_compassion"]
      },
      completedActivities: [],
      skippedActivities: [],
      favoriteActivities: [],
      moodPatterns: {
        1: ["anxiety_relief", "stress_relief", "breathing"],
        2: ["anxiety_relief", "self_compassion", "breathing"],
        3: ["energy_builder", "focus_boost", "gratitude"],
        4: ["creativity_boost", "gratitude", "meditation"],
        5: ["creativity_boost", "gratitude", "energy_builder"]
      },
      stressLevels: {
        1: ["gratitude", "creativity_boost", "energy_builder"],
        2: ["meditation", "breathing", "gratitude"],
        3: ["breathing", "stress_relief", "meditation"],
        4: ["anxiety_relief", "breathing", "stress_relief"],
        5: ["anxiety_relief", "breathing", "stress_relief"]
      },
      goals: ["stress_relief", "better_sleep"],
      lastActiveTime: new Date().toISOString(),
      sessionDurations: [5, 8, 10, 7, 12] // Default session lengths
    };
  }

  public updateUserProfile(updates: Partial<UserProfile>): void {
    this.userProfile = { ...this.userProfile, ...updates };
    this.saveProfile();
  }

  public recordActivityCompletion(activityId: string, duration: number, rating?: number): void {
    // Add to completed activities
    if (!this.userProfile.completedActivities.includes(activityId)) {
      this.userProfile.completedActivities.push(activityId);
    }

    // Record session duration
    this.userProfile.sessionDurations.push(duration);
    if (this.userProfile.sessionDurations.length > 20) {
      this.userProfile.sessionDurations = this.userProfile.sessionDurations.slice(-20); // Keep last 20
    }

    // If highly rated, add to favorites
    if (rating && rating >= 4) {
      if (!this.userProfile.favoriteActivities.includes(activityId)) {
        this.userProfile.favoriteActivities.push(activityId);
      }
    }

    this.saveProfile();
  }

  public recordActivitySkip(activityId: string): void {
    if (!this.userProfile.skippedActivities.includes(activityId)) {
      this.userProfile.skippedActivities.push(activityId);
    }
    this.saveProfile();
  }

  public recordMoodActivity(mood: number, activityCategory: string): void {
    if (!this.userProfile.moodPatterns[mood]) {
      this.userProfile.moodPatterns[mood] = [];
    }
    
    if (!this.userProfile.moodPatterns[mood].includes(activityCategory)) {
      this.userProfile.moodPatterns[mood].push(activityCategory);
    }
    
    this.saveProfile();
  }

  public getRecommendations(
    context: PersonalizationContext,
    count: number = 5,
    availableActivities: ExpandedActivity[] = []
  ): RecommendationScore[] {
    const activities = availableActivities.length > 0 ? availableActivities : this.getAllActivities();
    const scores: RecommendationScore[] = [];

    for (const activity of activities) {
      const score = this.calculateActivityScore(activity, context);
      const reasons = this.getRecommendationReasons(activity, context, score);
      
      scores.push({
        activity,
        score: score.total,
        reasons
      });
    }

    // Sort by score and return top recommendations
    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  private calculateActivityScore(activity: ExpandedActivity, context: PersonalizationContext): {
    total: number;
    breakdown: { [key: string]: number };
  } {
    const breakdown: { [key: string]: number } = {};
    let total = 0;

    // Base score
    breakdown.base = 50;
    total += breakdown.base;

    // Category preference
    if (this.userProfile.preferredCategories.includes(activity.category)) {
      breakdown.categoryPreference = 20;
      total += breakdown.categoryPreference;
    }

    // Difficulty preference
    if (activity.difficulty === this.userProfile.preferredDifficulty) {
      breakdown.difficultyMatch = 15;
      total += breakdown.difficultyMatch;
    }

    // Duration preference
    const durationDiff = Math.abs(activity.duration - this.userProfile.preferredDuration);
    breakdown.durationMatch = Math.max(0, 15 - durationDiff);
    total += breakdown.durationMatch;

    // Time of day preference
    const timePreferences = this.userProfile.timeOfDayPreferences[context.timeOfDay] || [];
    if (timePreferences.includes(activity.category)) {
      breakdown.timeOfDayMatch = 25;
      total += breakdown.timeOfDayMatch;
    }

    // Mood-based recommendation
    if (context.currentMood !== undefined) {
      const moodCategories = this.userProfile.moodPatterns[context.currentMood] || [];
      if (moodCategories.includes(activity.category)) {
        breakdown.moodMatch = 30;
        total += breakdown.moodMatch;
      }
    }

    // Stress level consideration
    if (context.stressLevel !== undefined) {
      const stressCategories = this.userProfile.stressLevels[context.stressLevel] || [];
      if (stressCategories.includes(activity.category)) {
        breakdown.stressMatch = 25;
        total += breakdown.stressMatch;
      }
    }

    // Available time constraint
    if (context.availableTime && activity.duration > context.availableTime) {
      breakdown.timeConstraint = -30;
      total += breakdown.timeConstraint;
    }

    // Favorite activity bonus
    if (this.userProfile.favoriteActivities.includes(activity.id)) {
      breakdown.favoriteBonus = 40;
      total += breakdown.favoriteBonus;
    }

    // Recently completed penalty (avoid repetition)
    const recentlyCompleted = this.userProfile.completedActivities.slice(-5);
    if (recentlyCompleted.includes(activity.id)) {
      breakdown.repetitionPenalty = -20;
      total += breakdown.repetitionPenalty;
    }

    // Skipped activity penalty
    if (this.userProfile.skippedActivities.includes(activity.id)) {
      breakdown.skippedPenalty = -15;
      total += breakdown.skippedPenalty;
    }

    // Variety bonus (encourage trying new categories)
    const recentCategories = this.getRecentActivityCategories();
    if (!recentCategories.includes(activity.category)) {
      breakdown.varietyBonus = 10;
      total += breakdown.varietyBonus;
    }

    // Goal alignment
    const goalTags = this.getGoalTags();
    const matchingTags = activity.tags.filter(tag => goalTags.includes(tag));
    if (matchingTags.length > 0) {
      breakdown.goalAlignment = matchingTags.length * 8;
      total += breakdown.goalAlignment;
    }

    // Weather-based recommendations
    if (context.weatherCondition) {
      const weatherBonus = this.getWeatherBonus(activity, context.weatherCondition);
      breakdown.weatherBonus = weatherBonus;
      total += weatherBonus;
    }

    return { total: Math.max(0, total), breakdown };
  }

  private getRecommendationReasons(
    activity: ExpandedActivity,
    context: PersonalizationContext,
    score: { total: number; breakdown: { [key: string]: number } }
  ): string[] {
    const reasons: string[] = [];

    if (score.breakdown.moodMatch > 0) {
      reasons.push("Perfect for your current mood");
    }

    if (score.breakdown.stressMatch > 0) {
      reasons.push("Helps with your stress level");
    }

    if (score.breakdown.timeOfDayMatch > 0) {
      reasons.push(`Great for ${context.timeOfDay} sessions`);
    }

    if (score.breakdown.favoriteBonus > 0) {
      reasons.push("One of your favorites");
    }

    if (score.breakdown.goalAlignment > 0) {
      reasons.push("Aligns with your wellness goals");
    }

    if (score.breakdown.varietyBonus > 0) {
      reasons.push("Try something new");
    }

    if (score.breakdown.durationMatch > 10) {
      reasons.push("Perfect duration for you");
    }

    if (context.availableTime && activity.duration <= context.availableTime) {
      reasons.push(`Fits in your ${context.availableTime} minute window`);
    }

    return reasons.slice(0, 3); // Limit to top 3 reasons
  }

  private getRecentActivityCategories(): string[] {
    // This would typically query the activities store for recent completions
    // For now, return empty array as placeholder
    return [];
  }

  private getGoalTags(): string[] {
    const goalTagMap: { [key: string]: string[] } = {
      stress_relief: ["stress", "anxiety", "calm"],
      better_sleep: ["sleep", "relaxation", "evening"],
      focus: ["focus", "concentration", "productivity"],
      energy: ["energy", "morning", "vitality"],
      creativity: ["creativity", "inspiration"],
      self_care: ["self-compassion", "kindness", "healing"]
    };

    return this.userProfile.goals.flatMap(goal => goalTagMap[goal] || []);
  }

  private getWeatherBonus(activity: ExpandedActivity, weather: string): number {
    const weatherActivityMap: { [key: string]: string[] } = {
      rainy: ["meditation", "breathing", "sleep_preparation", "self_compassion"],
      sunny: ["energy_builder", "gratitude", "creativity_boost", "walking_meditation"],
      cloudy: ["focus_boost", "work_break", "mindful_eating"]
    };

    const preferredCategories = weatherActivityMap[weather] || [];
    return preferredCategories.includes(activity.category) ? 8 : 0;
  }

  private getAllActivities(): ExpandedActivity[] {
    // This would typically import from the expanded activities data
    // For now, return empty array as placeholder
    return [];
  }

  public getPersonalizedDailyPlan(context: PersonalizationContext): {
    morning: ExpandedActivity[];
    afternoon: ExpandedActivity[];
    evening: ExpandedActivity[];
  } {
    const morningContext = { ...context, timeOfDay: "morning" as const };
    const afternoonContext = { ...context, timeOfDay: "afternoon" as const };
    const eveningContext = { ...context, timeOfDay: "evening" as const };

    return {
      morning: this.getRecommendations(morningContext, 2).map(r => r.activity),
      afternoon: this.getRecommendations(afternoonContext, 2).map(r => r.activity),
      evening: this.getRecommendations(eveningContext, 2).map(r => r.activity)
    };
  }

  public getInsights(): {
    preferredTime: string;
    averageSessionLength: number;
    mostCompletedCategory: string;
    streakPotential: number;
    improvementAreas: string[];
  } {
    const avgSessionLength = this.userProfile.sessionDurations.reduce((a, b) => a + b, 0) / 
                            this.userProfile.sessionDurations.length || 0;

    // Calculate category completion rates
    const categoryCompletions: { [key: string]: number } = {};
    // This would analyze completed activities by category
    
    return {
      preferredTime: this.getMostActiveTime(),
      averageSessionLength: Math.round(avgSessionLength),
      mostCompletedCategory: Object.keys(categoryCompletions)[0] || "meditation",
      streakPotential: this.calculateStreakPotential(),
      improvementAreas: this.getImprovementAreas()
    };
  }

  private getMostActiveTime(): string {
    // Analyze completion times to determine preferred time
    return "evening"; // Placeholder
  }

  private calculateStreakPotential(): number {
    // Calculate likelihood of maintaining streaks based on past behavior
    return 75; // Placeholder percentage
  }

  private getImprovementAreas(): string[] {
    const areas: string[] = [];
    
    if (this.userProfile.sessionDurations.every(d => d < 5)) {
      areas.push("Try longer sessions for deeper benefits");
    }
    
    if (this.userProfile.preferredCategories.length < 3) {
      areas.push("Explore more activity categories");
    }
    
    return areas;
  }

  private saveProfile(): void {
    // In a real app, this would save to AsyncStorage
    // For now, just keep in memory
  }

  public loadProfile(): UserProfile {
    // In a real app, this would load from AsyncStorage
    return this.userProfile;
  }

  public exportProfile(): string {
    return JSON.stringify(this.userProfile, null, 2);
  }
}

export default PersonalizationEngine;