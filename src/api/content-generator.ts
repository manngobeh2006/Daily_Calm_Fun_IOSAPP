import { getOpenAIChatResponse } from "./chat-service";
import { DailyActivities } from "../state/activitiesStore";

export const generateDailyActivities = async (dayNumber: number): Promise<DailyActivities> => {
  const prompt = `Generate a day ${dayNumber} of activities for a wellness app called "Daily Calm & Fun-2" targeting women, kids, and families. 

Create exactly 6 activities following this structure:
- 3 FREE activities (1 relax, 1 learn, 1 create)
- 3 PREMIUM activities (1 relax, 1 learn, 1 create)

Activity types:
RELAX: calming mini-games (bubble pop, breathing exercises, simple puzzles, meditation)
LEARN: affirmations, fun facts, quizzes, educational content
CREATE: journaling prompts, drawing challenges, story builders, creative writing

Return ONLY a valid JSON object in this exact format:
{
  "day": ${dayNumber},
  "date": "${new Date().toISOString().split('T')[0]}",
  "activities": [
    {
      "id": "day${dayNumber}_relax_free",
      "type": "relax",
      "title": "Activity Title",
      "description": "Brief engaging description",
      "premium_only": false,
      "content": {
        "instructions": "Step by step instructions",
        "duration": "5-10 minutes"
      }
    }
  ]
}

Make activities family-friendly, engaging, and varied. Ensure titles are catchy and descriptions are motivating.`;

  try {
    const response = await getOpenAIChatResponse(prompt);
    const content = response.content.trim();
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }
    
    const dailyActivities = JSON.parse(jsonMatch[0]);
    return dailyActivities;
  } catch (error) {
    console.error("Error generating activities:", error);
    
    // Fallback content
    return {
      day: dayNumber,
      date: new Date().toISOString().split('T')[0],
      activities: [
        {
          id: `day${dayNumber}_relax_free`,
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
          id: `day${dayNumber}_learn_free`,
          type: "learn",
          title: "Daily Affirmation",
          description: "I am strong, calm, and creative",
          premium_only: false,
          content: {
            affirmation: "I am strong, calm, and creative",
            instructions: "Repeat this affirmation 3 times"
          }
        },
        {
          id: `day${dayNumber}_create_free`,
          type: "create",
          title: "Gratitude Note",
          description: "Write one thing you're grateful for today",
          premium_only: false,
          content: {
            prompt: "What made you smile today?",
            instructions: "Write a few sentences about something positive"
          }
        },
        {
          id: `day${dayNumber}_relax_premium`,
          type: "relax",
          title: "Guided Breathing",
          description: "Follow a calming 3-minute breathing exercise",
          premium_only: true,
          content: {
            instructions: "Breathe in for 4, hold for 4, out for 6",
            duration: "3 minutes"
          }
        },
        {
          id: `day${dayNumber}_learn_premium`,
          type: "learn",
          title: "Fun Fact",
          description: "Did you know? Butterflies taste with their feet!",
          premium_only: true,
          content: {
            fact: "Butterflies taste with their feet!",
            explanation: "They have taste receptors on their feet to help them find food"
          }
        },
        {
          id: `day${dayNumber}_create_premium`,
          type: "create",
          title: "Drawing Challenge",
          description: "Draw your favorite animal using special brushes",
          premium_only: true,
          content: {
            prompt: "Draw your favorite animal",
            tools: ["watercolor brush", "pencil", "marker"]
          }
        }
      ]
    };
  }
};

export const generateFreshAffirmation = async (): Promise<string> => {
  const prompt = `Generate a single positive, empowering affirmation for a wellness app targeting women, kids, and families. 

The affirmation should be:
- Positive and uplifting
- Family-friendly
- Easy to remember
- Focused on self-worth, strength, creativity, or calm
- Between 5-15 words

Return ONLY the affirmation text, nothing else.`;

  try {
    const response = await getOpenAIChatResponse(prompt);
    return response.content.trim().replace(/['"]/g, '');
  } catch (error) {
    console.error("Error generating affirmation:", error);
    
    // Fallback affirmations
    const fallbackAffirmations = [
      "I am strong, calm, and creative",
      "I choose peace and joy today",
      "I am worthy of love and happiness",
      "I trust in my ability to grow",
      "I am grateful for this moment",
      "I radiate positivity and kindness",
      "I am capable of amazing things",
      "I embrace my unique gifts",
      "I am surrounded by love and support",
      "I choose to see the good in everything"
    ];
    
    return fallbackAffirmations[Math.floor(Math.random() * fallbackAffirmations.length)];
  }
};

export const preloadActivitiesContent = async (): Promise<DailyActivities[]> => {
  const activities: DailyActivities[] = [];
  
  // Generate first 7 days immediately, rest can be generated on demand
  for (let day = 1; day <= 7; day++) {
    try {
      const dailyContent = await generateDailyActivities(day);
      activities.push(dailyContent);
    } catch (error) {
      console.error(`Error generating day ${day}:`, error);
    }
  }
  
  return activities;
};