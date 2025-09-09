import { Activity } from "../state/activitiesStore";

export interface ActivityCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  backgroundColor: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  premium: boolean;
}

export const activityCategories: ActivityCategory[] = [
  {
    id: "breathing",
    name: "Breathing",
    description: "Calm your mind with focused breathing exercises",
    icon: "leaf",
    color: "#10B981",
    backgroundColor: "#ECFDF5",
    difficulty: "beginner",
    duration: "2-10 min",
    premium: false
  },
  {
    id: "meditation",
    name: "Meditation",
    description: "Guided meditations for inner peace",
    icon: "flower",
    color: "#8B5CF6",
    backgroundColor: "#F3E8FF",
    difficulty: "beginner",
    duration: "5-20 min",
    premium: false
  },
  {
    id: "body_scan",
    name: "Body Scan",
    description: "Release tension through mindful body awareness",
    icon: "body",
    color: "#06B6D4",
    backgroundColor: "#ECFEFF",
    difficulty: "intermediate",
    duration: "10-15 min",
    premium: true
  },
  {
    id: "walking_meditation",
    name: "Walking",
    description: "Mindful movement and outdoor connection",
    icon: "walk",
    color: "#84CC16",
    backgroundColor: "#F7FEE7",
    difficulty: "beginner",
    duration: "5-30 min",
    premium: true
  },
  {
    id: "anxiety_relief",
    name: "Anxiety Relief",
    description: "Quick techniques to calm anxious thoughts",
    icon: "heart",
    color: "#EF4444",
    backgroundColor: "#FEF2F2",
    difficulty: "beginner",
    duration: "1-5 min",
    premium: false
  },
  {
    id: "focus_boost",
    name: "Focus Boost",
    description: "Sharpen concentration and mental clarity",
    icon: "eye",
    color: "#F59E0B",
    backgroundColor: "#FFFBEB",
    difficulty: "intermediate",
    duration: "5-15 min",
    premium: true
  },
  {
    id: "energy_builder",
    name: "Energy Builder",
    description: "Revitalize your mind and body",
    icon: "flash",
    color: "#F97316",
    backgroundColor: "#FFF7ED",
    difficulty: "beginner",
    duration: "3-10 min",
    premium: false
  },
  {
    id: "sleep_preparation",
    name: "Sleep Prep",
    description: "Wind down for restful sleep",
    icon: "moon",
    color: "#6366F1",
    backgroundColor: "#EEF2FF",
    difficulty: "beginner",
    duration: "10-20 min",
    premium: true
  },
  {
    id: "gratitude",
    name: "Gratitude",
    description: "Cultivate appreciation and positive thinking",
    icon: "heart-circle",
    color: "#EC4899",
    backgroundColor: "#FDF2F8",
    difficulty: "beginner",
    duration: "3-8 min",
    premium: false
  },
  {
    id: "stress_relief",
    name: "Stress Relief",
    description: "Release tension and find calm",
    icon: "shield-checkmark",
    color: "#14B8A6",
    backgroundColor: "#F0FDFA",
    difficulty: "beginner",
    duration: "5-15 min",
    premium: false
  },
  {
    id: "mindful_eating",
    name: "Mindful Eating",
    description: "Develop a healthy relationship with food",
    icon: "restaurant",
    color: "#65A30D",
    backgroundColor: "#F7FEE7",
    difficulty: "intermediate",
    duration: "10-20 min",
    premium: true
  },
  {
    id: "creativity_boost",
    name: "Creativity",
    description: "Unlock your creative potential",
    icon: "brush",
    color: "#DC2626",
    backgroundColor: "#FEF2F2",
    difficulty: "intermediate",
    duration: "10-25 min",
    premium: true
  },
  {
    id: "self_compassion",
    name: "Self-Compassion",
    description: "Practice kindness toward yourself",
    icon: "heart-half",
    color: "#BE185D",
    backgroundColor: "#FDF2F8",
    difficulty: "intermediate",
    duration: "8-15 min",
    premium: true
  },
  {
    id: "morning_routine",
    name: "Morning Start",
    description: "Begin your day with intention",
    icon: "sunny",
    color: "#FBBF24",
    backgroundColor: "#FFFBEB",
    difficulty: "beginner",
    duration: "5-12 min",
    premium: false
  },
  {
    id: "work_break",
    name: "Work Break",
    description: "Reset during busy workdays",
    icon: "briefcase",
    color: "#6B7280",
    backgroundColor: "#F9FAFB",
    difficulty: "beginner",
    duration: "2-8 min",
    premium: false
  },
  {
    id: "emotional_balance",
    name: "Emotional Balance",
    description: "Navigate difficult emotions with grace",
    icon: "scale",
    color: "#7C3AED",
    backgroundColor: "#F5F3FF",
    difficulty: "advanced",
    duration: "12-20 min",
    premium: true
  }
];

export interface ActivityStep {
  label: string;
  duration?: number; // in seconds
  instruction?: string;
}

export interface ActivitySoundEffects {
  popOnBubble?: boolean;
  defaultEnabled?: boolean;
}

export interface ActivityMinigame {
  type: "go_nogo";
  targetSymbol: string;
  nonTargetSymbols: string[];
  stimulusMs: number;
  durationMs: number;
}

export interface ActivityJournal {
  placeholder: string;
  minWords?: number;
}

export interface ExpandedActivity extends Activity {
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
  tags: string[];
  audioUrl?: string;
  backgroundMusic?: string;
  instructions: string[];
  benefits: string[];
  prerequisites?: string[];
  // New properties for enhanced activities
  animation?: string;
  showBreathingGuide?: boolean;
  soundEffects?: ActivitySoundEffects;
  steps?: ActivityStep[];
  keyboardAware?: boolean;
  fields?: string[];
  minigame?: ActivityMinigame;
  journal?: ActivityJournal;
  activityKey?: string;
}

export const expandedActivities: ExpandedActivity[] = [
  // Breathing Exercises
  {
    id: "breathing_4_7_8",
    type: "relax",
    category: "breathing",
    title: "4-7-8 Breathing",
    description: "A powerful technique to reduce anxiety and promote sleep",
    difficulty: "beginner",
    duration: 5,
    premium_only: false,
    tags: ["anxiety", "sleep", "quick"],
    instructions: [
      "Sit comfortably with your back straight",
      "Exhale completely through your mouth",
      "Inhale through your nose for 4 counts",
      "Hold your breath for 7 counts",
      "Exhale through your mouth for 8 counts",
      "Repeat this cycle 4 times"
    ],
    benefits: [
      "Reduces anxiety and stress",
      "Promotes better sleep",
      "Lowers heart rate",
      "Improves focus"
    ],
    content: {
      instructions: "Follow the guided breathing pattern: inhale for 4, hold for 7, exhale for 8",
      duration: "5 minutes",
      backgroundMusic: "gentle_waves"
    }
  },
  {
    id: "box_breathing",
    type: "relax",
    category: "breathing",
    title: "Box Breathing",
    description: "Military-grade technique for instant calm and focus",
    difficulty: "beginner",
    duration: 4,
    premium_only: false,
    tags: ["focus", "stress", "military"],
    activityKey: "box_breathing",
    animation: "assets/anim/box_breathing.json",
    showBreathingGuide: true,
    soundEffects: {
      popOnBubble: true,
      defaultEnabled: true
    },
    steps: [
      { label: "Inhale 4s", duration: 4 },
      { label: "Hold 4s", duration: 4 },
      { label: "Exhale 4s", duration: 4 },
      { label: "Hold 4s", duration: 4 }
    ],
    instructions: [
      "Sit with feet flat on the floor",
      "Inhale for 4 counts",
      "Hold for 4 counts",
      "Exhale for 4 counts",
      "Hold empty for 4 counts",
      "Repeat for 4-8 cycles"
    ],
    benefits: [
      "Improves concentration",
      "Reduces stress hormones",
      "Enhances emotional regulation",
      "Builds mental resilience"
    ],
    content: {
      instructions: "Breathe in a square pattern: 4 counts each for inhale, hold, exhale, hold",
      duration: "4 minutes"
    }
  },
  
  // Meditation
  {
    id: "loving_kindness",
    type: "learn",
    category: "meditation",
    title: "Loving-Kindness Meditation",
    description: "Cultivate compassion for yourself and others",
    difficulty: "intermediate",
    duration: 12,
    premium_only: true,
    tags: ["compassion", "relationships", "healing"],
    instructions: [
      "Sit comfortably and close your eyes",
      "Start by sending love to yourself",
      "Extend love to someone you care about",
      "Include someone neutral in your life",
      "Send love to someone difficult",
      "Expand to all living beings"
    ],
    benefits: [
      "Increases empathy and compassion",
      "Reduces negative emotions",
      "Improves relationships",
      "Enhances emotional well-being"
    ],
    content: {
      instructions: "Follow the guided meditation to cultivate loving-kindness",
      duration: "12 minutes",
      backgroundMusic: "tibetan_bowls"
    }
  },

  // Anxiety Relief
  {
    id: "sos_grounding",
    type: "relax",
    category: "anxiety_relief",
    title: "5-4-3-2-1 Grounding",
    description: "Emergency technique to stop panic and anxiety",
    difficulty: "beginner",
    duration: 3,
    premium_only: false,
    tags: ["emergency", "panic", "grounding"],
    activityKey: "grounding_54321",
    keyboardAware: true,
    fields: ["see5", "feel4", "hear3", "smell2", "taste1"],
    instructions: [
      "Name 5 things you can see",
      "Name 4 things you can touch",
      "Name 3 things you can hear",
      "Name 2 things you can smell",
      "Name 1 thing you can taste",
      "Take three deep breaths"
    ],
    benefits: [
      "Stops panic attacks",
      "Grounds you in the present",
      "Reduces overwhelming feelings",
      "Can be done anywhere"
    ],
    content: {
      instructions: "Use your senses to ground yourself in the present moment",
      duration: "3 minutes"
    }
  },

  // Focus Boost
  {
    id: "concentration_meditation",
    type: "learn",
    category: "focus_boost",
    title: "Single-Point Focus",
    description: "Train your mind for laser-sharp concentration",
    difficulty: "intermediate",
    duration: 10,
    premium_only: true,
    tags: ["concentration", "productivity", "training"],
    instructions: [
      "Choose a single point of focus (breath, candle, sound)",
      "Gently return attention when mind wanders",
      "Start with 2-minute sessions",
      "Gradually increase duration",
      "Practice daily for best results"
    ],
    benefits: [
      "Improves attention span",
      "Enhances work performance",
      "Reduces mental chatter",
      "Builds mental discipline"
    ],
    content: {
      instructions: "Focus on a single point and gently return when your mind wanders",
      duration: "10 minutes",
      backgroundMusic: "focus_tones"
    }
  },

  // Energy Builder
  {
    id: "energizing_breath",
    type: "create",
    category: "energy_builder",
    title: "Energizing Breath Work",
    description: "Natural caffeine-free energy boost",
    difficulty: "beginner",
    duration: 6,
    premium_only: false,
    tags: ["energy", "morning", "vitality"],
    activityKey: "energizing_breath_work",
    animation: "assets/anim/energizing_breath.json",
    steps: [
      { label: "Stand with feet hip-width apart", duration: 15, instruction: "Ground yourself in a stable position" },
      { label: "Inhale deeply, raise arms overhead", duration: 30, instruction: "Breathe in energy through your entire body" },
      { label: "Exhale forcefully, bring arms down", duration: 30, instruction: "Release tension and activate your core" },
      { label: "Repeat with increasing intensity", duration: 120, instruction: "Build energy with each breath cycle" },
      { label: "Feel energy building in your body", duration: 60, instruction: "Notice the vitality flowing through you" },
      { label: "Gentle cool-down breaths", duration: 45, instruction: "Return to natural breathing rhythm" }
    ],
    instructions: [
      "Stand with feet hip-width apart",
      "Inhale deeply, raising arms overhead",
      "Exhale forcefully, bringing arms down",
      "Repeat with increasing intensity",
      "Feel energy building in your body"
    ],
    benefits: [
      "Increases alertness naturally",
      "Boosts circulation",
      "Enhances mood",
      "Provides sustainable energy"
    ],
    content: {
      instructions: "Use dynamic breathing to energize your body and mind",
      duration: "6 minutes"
    }
  },

  // Sleep Preparation
  {
    id: "progressive_relaxation",
    type: "relax",
    category: "sleep_preparation",
    title: "Progressive Muscle Relaxation",
    description: "Release physical tension for deeper sleep",
    difficulty: "beginner",
    duration: 15,
    premium_only: true,
    tags: ["sleep", "relaxation", "tension"],
    activityKey: "progressive_muscle_relaxation",
    animation: "assets/anim/pmr.json",
    showBreathingGuide: false,
    steps: [
      { label: "Tense and release toes", duration: 30 },
      { label: "Tense and release calves", duration: 30 },
      { label: "Tense and release thighs", duration: 30 },
      { label: "Tense and release glutes", duration: 30 },
      { label: "Tense and release abdomen", duration: 30 },
      { label: "Tense and release hands", duration: 30 },
      { label: "Tense and release arms", duration: 30 },
      { label: "Tense and release shoulders", duration: 30 },
      { label: "Tense and release face", duration: 30 },
      { label: "Full body relaxation", duration: 60 }
    ],
    instructions: [
      "Lie down comfortably",
      "Tense and release each muscle group",
      "Start with your toes, work upward",
      "Hold tension for 5 seconds, then release",
      "Notice the contrast between tension and relaxation"
    ],
    benefits: [
      "Improves sleep quality",
      "Reduces physical tension",
      "Calms the nervous system",
      "Helps with insomnia"
    ],
    content: {
      instructions: "Systematically tense and release muscle groups throughout your body",
      duration: "15 minutes",
      backgroundMusic: "sleep_sounds"
    }
  },

  // Gratitude
  {
    id: "gratitude_journal",
    type: "create",
    category: "gratitude",
    title: "Gratitude Reflection",
    description: "Shift your mindset to abundance and appreciation",
    difficulty: "beginner",
    duration: 5,
    premium_only: false,
    tags: ["gratitude", "positivity", "journaling"],
    activityKey: "gratitude_reflection",
    keyboardAware: true,
    journal: {
      placeholder: "What are three things that brought you joy or comfort today?",
      minWords: 15
    },
    instructions: [
      "Think of three things you're grateful for today",
      "Consider why each one matters to you",
      "Feel the emotion of gratitude in your body",
      "Write them down if possible",
      "End with appreciation for yourself"
    ],
    benefits: [
      "Improves mood and outlook",
      "Increases life satisfaction",
      "Strengthens relationships",
      "Reduces depression and anxiety"
    ],
    content: {
      instructions: "Reflect on the good things in your life with genuine appreciation",
      duration: "5 minutes",
      prompt: "What are three things that brought you joy or comfort today?"
    }
  },

  // Morning Routine
  {
    id: "morning_intention",
    type: "learn",
    category: "morning_routine",
    title: "Morning Intention Setting",
    description: "Start your day with purpose and clarity",
    difficulty: "beginner",
    duration: 8,
    premium_only: false,
    tags: ["morning", "intention", "purpose"],
    instructions: [
      "Sit quietly before starting your day",
      "Take three deep breaths",
      "Ask: 'How do I want to feel today?'",
      "Set one clear intention for the day",
      "Visualize yourself embodying this intention"
    ],
    benefits: [
      "Creates purposeful days",
      "Improves decision-making",
      "Increases motivation",
      "Enhances life satisfaction"
    ],
    content: {
      instructions: "Set a clear intention for how you want to show up today",
      duration: "8 minutes",
      affirmation: "I approach this day with intention and purpose"
    }
  },

  // Work Break
  {
    id: "desk_reset",
    type: "relax",
    category: "work_break",
    title: "Desk Reset Meditation",
    description: "Quick mental refresh during busy workdays",
    difficulty: "beginner",
    duration: 3,
    premium_only: false,
    tags: ["work", "productivity", "quick"],
    instructions: [
      "Sit back in your chair",
      "Close your eyes or soften your gaze",
      "Take five deep breaths",
      "Notice any tension in your body",
      "Set an intention for the next work session"
    ],
    benefits: [
      "Reduces work stress",
      "Improves focus",
      "Prevents burnout",
      "Increases productivity"
    ],
    content: {
      instructions: "Take a mindful break to reset your energy and focus",
      duration: "3 minutes"
    }
  },

  // Additional Meditation Activities
  {
    id: "body_scan_meditation",
    type: "learn",
    category: "meditation",
    title: "Body Scan Meditation",
    description: "Systematic relaxation through body awareness",
    difficulty: "intermediate",
    duration: 15,
    premium_only: true,
    tags: ["relaxation", "awareness", "tension"],
    activityKey: "body_scan_meditation",
    animation: "assets/anim/body_scan.json",
    steps: [
      { label: "Focus on your toes", duration: 45, instruction: "Notice any sensations in your toes" },
      { label: "Move to your feet", duration: 45, instruction: "Feel the weight and temperature of your feet" },
      { label: "Scan your calves", duration: 45, instruction: "Notice any tension or relaxation in your calves" },
      { label: "Focus on your thighs", duration: 45, instruction: "Observe sensations in your thigh muscles" },
      { label: "Scan your hips", duration: 45, instruction: "Notice how your hips feel against the surface" },
      { label: "Move to your abdomen", duration: 45, instruction: "Feel your breath moving in your belly" },
      { label: "Scan your chest", duration: 45, instruction: "Notice your heartbeat and breathing" },
      { label: "Focus on your hands", duration: 45, instruction: "Feel any sensations in your hands and fingers" },
      { label: "Scan your arms", duration: 45, instruction: "Notice the weight and position of your arms" },
      { label: "Move to your shoulders", duration: 45, instruction: "Release any tension in your shoulders" },
      { label: "Scan your neck", duration: 45, instruction: "Notice how your neck feels" },
      { label: "Focus on your face", duration: 45, instruction: "Relax all facial muscles" },
      { label: "Whole body awareness", duration: 90, instruction: "Feel your entire body as one unified whole" }
    ],
    instructions: [
      "Lie down comfortably on your back",
      "Close your eyes and take three deep breaths",
      "Start by focusing on your toes",
      "Slowly move your attention up through each body part",
      "Notice any sensations without judgment",
      "Spend 30 seconds on each area",
      "End by feeling your whole body at once"
    ],
    benefits: [
      "Releases physical tension",
      "Increases body awareness",
      "Promotes deep relaxation",
      "Improves sleep quality"
    ],
    content: {
      instructions: "Systematically scan through your body from toes to head",
      duration: "15 minutes",
      backgroundMusic: "gentle_waves"
    }
  },

  {
    id: "mindfulness_meditation",
    type: "learn",
    category: "meditation",
    title: "Mindfulness Meditation",
    description: "Present moment awareness practice",
    difficulty: "beginner",
    duration: 10,
    premium_only: false,
    tags: ["mindfulness", "present", "awareness"],
    instructions: [
      "Sit comfortably with your back straight",
      "Close your eyes or soften your gaze",
      "Focus on your natural breathing",
      "When thoughts arise, gently return to breath",
      "Notice sounds, sensations, and thoughts",
      "Accept everything without judgment",
      "Return to breath as your anchor"
    ],
    benefits: [
      "Improves present moment awareness",
      "Reduces anxiety and stress",
      "Enhances emotional regulation",
      "Increases mental clarity"
    ],
    content: {
      instructions: "Practice being fully present in this moment",
      duration: "10 minutes",
      backgroundMusic: "nature_sounds"
    }
  },

  // Additional SOS/Anxiety Relief Activities
  {
    id: "panic_attack_relief",
    type: "relax",
    category: "anxiety_relief",
    title: "Panic Attack SOS",
    description: "Emergency technique to stop panic attacks",
    difficulty: "beginner",
    duration: 2,
    premium_only: false,
    tags: ["emergency", "panic", "sos", "quick"],
    activityKey: "panic_attack_sos",
    animation: "assets/anim/panic_sos.json",
    steps: [
      { label: "Find a safe place to sit or stand", duration: 15, instruction: "Ground yourself in a secure position" },
      { label: "Breathe in for 4 counts through your nose", duration: 20, instruction: "Slow, controlled inhale" },
      { label: "Hold your breath for 4 counts", duration: 20, instruction: "Pause and center yourself" },
      { label: "Exhale for 6 counts through your mouth", duration: 30, instruction: "Long, releasing exhale" },
      { label: "Repeat this pattern 5 times", duration: 60, instruction: "Continue the calming rhythm" },
      { label: "Remind yourself: 'This will pass'", duration: 15, instruction: "Affirm your safety and strength" }
    ],
    instructions: [
      "Find a safe place to sit or stand",
      "Breathe in for 4 counts through your nose",
      "Hold your breath for 4 counts",
      "Exhale for 6 counts through your mouth",
      "Repeat this pattern 5 times",
      "Remind yourself: 'This will pass'",
      "Focus on one object in your environment"
    ],
    benefits: [
      "Stops panic attacks quickly",
      "Activates calm response",
      "Reduces overwhelming feelings",
      "Provides immediate relief"
    ],
    content: {
      instructions: "Use controlled breathing to stop panic in its tracks",
      duration: "2 minutes"
    }
  },

  {
    id: "anxiety_reset",
    type: "relax",
    category: "anxiety_relief",
    title: "Quick Anxiety Reset",
    description: "Fast technique to calm anxious thoughts",
    difficulty: "beginner",
    duration: 3,
    premium_only: false,
    tags: ["anxiety", "quick", "reset", "calm"],
    activityKey: "quick_anxiety_reset",
    animation: "assets/anim/quick_reset.json",
    journal: {
      placeholder: "How do you feel after completing this activity?",
      minWords: 5
    },
    instructions: [
      "Place one hand on your chest, one on your belly",
      "Take a slow breath in through your nose",
      "Feel your belly rise more than your chest",
      "Exhale slowly through pursed lips",
      "Count backwards from 10 to 1",
      "With each number, release tension",
      "End with three normal breaths"
    ],
    benefits: [
      "Quickly reduces anxiety",
      "Calms racing thoughts",
      "Lowers heart rate",
      "Restores mental balance"
    ],
    content: {
      instructions: "Reset your nervous system with intentional breathing",
      duration: "3 minutes"
    }
  },

  // Additional Focus Activities
  {
    id: "attention_training",
    type: "learn",
    category: "focus_boost",
    title: "Attention Training",
    description: "Build sustained focus and concentration",
    difficulty: "intermediate",
    duration: 12,
    premium_only: true,
    tags: ["concentration", "training", "attention", "discipline"],
    activityKey: "attention_training",
    minigame: {
      type: "go_nogo",
      targetSymbol: "⭐",
      nonTargetSymbols: ["●", "▲", "■"],
      stimulusMs: 800,
      durationMs: 60000
    },
    instructions: [
      "Choose a simple object to focus on",
      "Set a timer for 2 minutes initially",
      "Keep your attention solely on the object",
      "When mind wanders, gently return focus",
      "Gradually increase duration over time",
      "Notice the quality of your attention",
      "End with appreciation for your effort"
    ],
    benefits: [
      "Strengthens attention span",
      "Improves work performance",
      "Reduces mental distractions",
      "Builds cognitive control"
    ],
    content: {
      instructions: "Train your mind like a muscle through focused attention",
      duration: "12 minutes",
      backgroundMusic: "focus_tones"
    }
  },

  {
    id: "mental_clarity",
    type: "learn",
    category: "focus_boost",
    title: "Mental Clarity Practice",
    description: "Clear mental fog and enhance thinking",
    difficulty: "beginner",
    duration: 8,
    premium_only: false,
    tags: ["clarity", "thinking", "mental", "clear"],
    instructions: [
      "Sit upright with feet flat on floor",
      "Take 5 deep, energizing breaths",
      "Visualize bright light filling your head",
      "Imagine this light clearing away fog",
      "Set a clear intention for your day",
      "Visualize yourself thinking clearly",
      "End with three focused breaths"
    ],
    benefits: [
      "Clears mental fog",
      "Enhances decision making",
      "Improves problem solving",
      "Increases mental energy"
    ],
    content: {
      instructions: "Clear your mind and enhance your thinking capacity",
      duration: "8 minutes"
    }
  },

  // Additional Energy Activities
  {
    id: "morning_energizer",
    type: "create",
    category: "energy_builder",
    title: "Morning Energy Boost",
    description: "Natural way to wake up and energize",
    difficulty: "beginner",
    duration: 5,
    premium_only: false,
    tags: ["morning", "energy", "wake-up", "natural"],
    instructions: [
      "Stand with feet shoulder-width apart",
      "Stretch your arms up toward the ceiling",
      "Take a deep breath and hold for 3 seconds",
      "Exhale while bringing arms down",
      "Do 10 gentle jumping jacks",
      "Shake out your hands and feet",
      "End with 3 energizing breaths"
    ],
    benefits: [
      "Increases natural energy",
      "Improves circulation",
      "Enhances mood",
      "Prepares body for the day"
    ],
    content: {
      instructions: "Activate your body's natural energy systems",
      duration: "5 minutes"
    }
  },

  {
    id: "afternoon_boost",
    type: "create",
    category: "energy_builder",
    title: "Afternoon Energy Revival",
    description: "Beat the afternoon slump naturally",
    difficulty: "beginner",
    duration: 4,
    premium_only: false,
    tags: ["afternoon", "energy", "revival", "boost"],
    activityKey: "afternoon_energy_revival",
    animation: "assets/anim/afternoon_energy.json",
    steps: [
      { label: "Stand up from your workspace", duration: 10, instruction: "Rise and prepare to energize" },
      { label: "Roll your shoulders back 5 times", duration: 30, instruction: "Release upper body tension" },
      { label: "Do 5 neck rolls in each direction", duration: 30, instruction: "Gentle circular movements" },
      { label: "Take 10 deep, energizing breaths", duration: 60, instruction: "Fill your lungs with fresh energy" },
      { label: "Do 10 arm circles forward and back", duration: 30, instruction: "Activate your circulation" },
      { label: "Stretch your arms overhead", duration: 20, instruction: "Reach up and expand your chest" },
      { label: "Set a positive intention", duration: 20, instruction: "Focus your energy for the day ahead" }
    ],
    instructions: [
      "Stand up from your workspace",
      "Roll your shoulders back 5 times",
      "Do 5 neck rolls in each direction",
      "Take 10 deep, energizing breaths",
      "Do 10 arm circles forward and back",
      "Stretch your arms overhead",
      "Set a positive intention for the rest of your day"
    ],
    benefits: [
      "Combats afternoon fatigue",
      "Increases alertness",
      "Improves posture",
      "Boosts productivity"
    ],
    content: {
      instructions: "Revive your energy without caffeine",
      duration: "4 minutes"
    }
  },

  // Additional Sleep Activities
  {
    id: "bedtime_routine",
    type: "relax",
    category: "sleep_preparation",
    title: "Peaceful Bedtime Routine",
    description: "Prepare your mind and body for sleep",
    difficulty: "beginner",
    duration: 12,
    premium_only: true,
    tags: ["sleep", "bedtime", "routine", "peaceful"],
    instructions: [
      "Dim the lights in your room",
      "Sit on the edge of your bed",
      "Take 5 slow, calming breaths",
      "Reflect on 3 good things from today",
      "Gently stretch your neck and shoulders",
      "Lie down and close your eyes",
      "Progressively relax each muscle group",
      "Focus on your breath until you drift off"
    ],
    benefits: [
      "Improves sleep quality",
      "Reduces bedtime anxiety",
      "Creates healthy sleep habits",
      "Promotes deeper rest"
    ],
    content: {
      instructions: "Create a peaceful transition to sleep",
      duration: "12 minutes",
      backgroundMusic: "sleep_sounds"
    }
  },

  {
    id: "sleep_story",
    type: "relax",
    category: "sleep_preparation",
    title: "Guided Sleep Visualization",
    description: "Drift off with a calming mental journey",
    difficulty: "beginner",
    duration: 20,
    premium_only: true,
    tags: ["sleep", "visualization", "story", "calm"],
    instructions: [
      "Lie comfortably in your bed",
      "Close your eyes and breathe naturally",
      "Imagine walking through a peaceful forest",
      "Notice the gentle sounds of nature",
      "Feel the soft ground beneath your feet",
      "Find a comfortable spot to rest",
      "Let the peaceful scene carry you to sleep"
    ],
    benefits: [
      "Helps fall asleep faster",
      "Reduces racing thoughts",
      "Creates positive sleep associations",
      "Promotes restful dreams"
    ],
    content: {
      instructions: "Follow a guided visualization into peaceful sleep",
      duration: "20 minutes",
      backgroundMusic: "forest_sounds"
    }
  },

  // Additional Gratitude Activities
  {
    id: "appreciation_practice",
    type: "create",
    category: "gratitude",
    title: "Daily Appreciation Practice",
    description: "Cultivate deep appreciation for life",
    difficulty: "beginner",
    duration: 7,
    premium_only: false,
    tags: ["appreciation", "gratitude", "daily", "positive"],
    instructions: [
      "Sit quietly and close your eyes",
      "Think of someone who has helped you",
      "Feel genuine appreciation for them",
      "Think of a place that brings you peace",
      "Appreciate the beauty around you",
      "Consider a challenge that made you stronger",
      "End by appreciating yourself"
    ],
    benefits: [
      "Increases life satisfaction",
      "Improves relationships",
      "Boosts positive emotions",
      "Reduces stress and anxiety"
    ],
    content: {
      instructions: "Deepen your appreciation for all aspects of life",
      duration: "7 minutes"
    }
  },

  {
    id: "thankfulness_meditation",
    type: "learn",
    category: "gratitude",
    title: "Thankfulness Meditation",
    description: "Meditative practice of deep gratitude",
    difficulty: "intermediate",
    duration: 10,
    premium_only: true,
    tags: ["thankfulness", "meditation", "gratitude", "deep"],
    instructions: [
      "Sit in a comfortable meditation posture",
      "Begin with 5 deep, centering breaths",
      "Bring to mind something you're grateful for",
      "Feel the emotion of gratitude in your heart",
      "Let this feeling expand throughout your body",
      "Include more things you're thankful for",
      "End by sending gratitude to all beings"
    ],
    benefits: [
      "Deepens gratitude practice",
      "Increases emotional well-being",
      "Strengthens positive mindset",
      "Enhances spiritual connection"
    ],
    content: {
      instructions: "Meditate deeply on the feeling of gratitude",
      duration: "10 minutes",
      backgroundMusic: "gentle_bells"
    }
  }
];

export const getActivitiesByCategory = (categoryId: string): ExpandedActivity[] => {
  return expandedActivities.filter(activity => activity.category === categoryId);
};

export const getActivitiesByDifficulty = (difficulty: "beginner" | "intermediate" | "advanced"): ExpandedActivity[] => {
  return expandedActivities.filter(activity => activity.difficulty === difficulty);
};

export const getActivitiesByDuration = (maxMinutes: number): ExpandedActivity[] => {
  return expandedActivities.filter(activity => activity.duration <= maxMinutes);
};

export const getFreeActivities = (): ExpandedActivity[] => {
  return expandedActivities.filter(activity => !activity.premium_only);
};

export const getPremiumActivities = (): ExpandedActivity[] => {
  return expandedActivities.filter(activity => activity.premium_only);
};

export const getActivitiesByTags = (tags: string[]): ExpandedActivity[] => {
  return expandedActivities.filter(activity => 
    activity.tags.some(tag => tags.includes(tag))
  );
};

export const getRecommendedActivities = (
  mood?: number,
  timeOfDay?: "morning" | "afternoon" | "evening",
  availableTime?: number
): ExpandedActivity[] => {
  let recommended = [...expandedActivities];

  // Filter by mood
  if (mood !== undefined) {
    if (mood <= 2) {
      // Low mood - anxiety relief and stress relief
      recommended = recommended.filter(activity => 
        activity.tags.includes("anxiety") || 
        activity.tags.includes("stress") ||
        activity.category === "anxiety_relief"
      );
    } else if (mood === 3) {
      // Neutral mood - energy and focus
      recommended = recommended.filter(activity => 
        activity.tags.includes("energy") || 
        activity.tags.includes("focus") ||
        activity.category === "energy_builder"
      );
    } else {
      // Good mood - maintain with gratitude and creativity
      recommended = recommended.filter(activity => 
        activity.tags.includes("gratitude") || 
        activity.tags.includes("creativity") ||
        activity.category === "gratitude"
      );
    }
  }

  // Filter by time of day
  if (timeOfDay) {
    if (timeOfDay === "morning") {
      recommended = recommended.filter(activity => 
        activity.tags.includes("morning") || 
        activity.tags.includes("energy") ||
        activity.category === "morning_routine" ||
        activity.category === "energy_builder"
      );
    } else if (timeOfDay === "evening") {
      recommended = recommended.filter(activity => 
        activity.tags.includes("sleep") || 
        activity.tags.includes("relaxation") ||
        activity.category === "sleep_preparation"
      );
    }
  }

  // Filter by available time
  if (availableTime) {
    recommended = recommended.filter(activity => activity.duration <= availableTime);
  }

  return recommended.slice(0, 5); // Return top 5 recommendations
};