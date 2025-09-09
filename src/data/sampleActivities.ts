import { DailyActivities } from "../state/activitiesStore";

export const sampleDailyActivities: DailyActivities[] = [
  {
    day: 1,
    date: new Date().toISOString().split('T')[0],
    activities: [
      {
        id: "day1_relax_free",
        type: "relax",
        title: "Bubble Pop Calm",
        description: "Tap bubbles slowly while taking deep breaths",
        premium_only: false,
        content: {
          instructions: "Tap each bubble gently and take a deep breath",
          duration: "5 minutes"
        }
      },
      {
        id: "day1_learn_free",
        type: "learn",
        title: "Morning Affirmation",
        description: "Start your day with positive energy",
        premium_only: false,
        content: {
          affirmation: "I am capable of amazing things today",
          instructions: "Repeat this affirmation 3 times with intention"
        }
      },
      {
        id: "day1_create_free",
        type: "create",
        title: "Gratitude Moment",
        description: "Write one thing you're grateful for",
        premium_only: false,
        content: {
          prompt: "What made you smile recently?",
          instructions: "Write 2-3 sentences about something that brought you joy"
        }
      },
      {
        id: "day1_relax_premium",
        type: "relax",
        title: "Forest Meditation Journey",
        description: "Follow a calming 5-minute breathing meditation",
        premium_only: true,
        content: {
          instructions: "Breathe in for 4 counts, hold for 4, exhale for 6",
          duration: "5 minutes",
          backgroundMusic: "forest_sounds",
          description: "Imagine walking through a peaceful forest as you breathe deeply"
        }
      },
      {
        id: "day1_learn_premium",
        type: "learn",
        title: "Amazing Nature Fact",
        description: "Discover something wonderful about our world",
        premium_only: true,
        content: {
          fact: "Octopuses have three hearts and blue blood!",
          explanation: "Two hearts pump blood to the gills, while the third pumps blood to the rest of the body. Their blue blood contains copper instead of iron.",
          quiz: {
            question: "How many hearts does an octopus have?",
            options: ["1", "2", "3", "4"],
            correct: 2
          }
        }
      },
      {
        id: "day1_create_premium",
        type: "create",
        title: "Dream Garden Drawing",
        description: "Design your perfect peaceful garden",
        premium_only: true,
        content: {
          prompt: "Draw a garden where you'd love to relax",
          tools: ["watercolor brush", "pencil", "flower stamps"],
          inspiration: "Think about colors, flowers, and peaceful elements"
        }
      }
    ]
  },
  {
    day: 2,
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    activities: [
      {
        id: "day2_relax_free",
        type: "relax",
        title: "Color Breathing",
        description: "Visualize calming colors as you breathe",
        premium_only: false,
        content: {
          instructions: "Imagine breathing in blue calm, breathing out gray stress",
          duration: "3 minutes"
        }
      },
      {
        id: "day2_learn_free",
        type: "learn",
        title: "Kindness Affirmation",
        description: "Embrace compassion for yourself and others",
        premium_only: false,
        content: {
          affirmation: "I choose kindness for myself and others today",
          instructions: "Say this while placing your hand on your heart"
        }
      },
      {
        id: "day2_create_free",
        type: "create",
        title: "Happy Memory",
        description: "Capture a favorite memory in words",
        premium_only: false,
        content: {
          prompt: "Describe a moment when you felt truly happy",
          instructions: "Write about the details - what you saw, heard, and felt"
        }
      },
      {
        id: "day2_relax_premium",
        type: "relax",
        title: "Guided Starry Meditation",
        description: "Journey through a peaceful starlit sky",
        premium_only: true,
        content: {
          instructions: "Close your eyes and imagine floating among gentle stars",
          duration: "8 minutes",
          backgroundMusic: "starry_night",
          description: "Let the peaceful night sky guide you to deep relaxation"
        }
      },
      {
        id: "day2_learn_premium",
        type: "learn",
        title: "Space Wonder",
        description: "Journey to the stars with fascinating facts",
        premium_only: true,
        content: {
          fact: "A day on Venus is longer than its year!",
          explanation: "Venus rotates so slowly that one day (243 Earth days) is longer than one year (225 Earth days).",
          quiz: {
            question: "Which planet has days longer than its years?",
            options: ["Mars", "Venus", "Mercury", "Jupiter"],
            correct: 1
          }
        }
      },
      {
        id: "day2_create_premium",
        type: "create",
        title: "Emotion Color Wheel",
        description: "Express your feelings through colors and shapes",
        premium_only: true,
        content: {
          prompt: "Create a color wheel showing how you feel today",
          tools: ["gradient brush", "color picker", "blend tool"],
          inspiration: "Use warm colors for happy feelings, cool colors for calm"
        }
      }
    ]
  }
];

export const getCurrentDayNumber = (): number => {
  const startDate = new Date("2025-01-01"); // App launch date
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return ((diffDays - 1) % 365) + 1; // Cycle through 365 days
};