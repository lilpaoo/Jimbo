
import { GoogleGenAI, Type } from "@google/genai";
import type { TrainingPlan, DietPlan } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const trainingPlanSchema = {
  type: Type.OBJECT,
  properties: {
    weekly_plan: {
      type: Type.ARRAY,
      description: "A 7-day workout plan.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING, description: "Day of the week (e.g., Monday)." },
          focus: { type: Type.STRING, description: "Main muscle group or workout type for the day (e.g., Chest & Triceps, Legs, Cardio, Rest)." },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Name of the exercise." },
                sets: { type: Type.STRING, description: "Number of sets (e.g., '3-4')." },
                reps: { type: Type.STRING, description: "Number of repetitions (e.g., '8-12')." },
                rest: { type: Type.STRING, description: "Rest time between sets in seconds (e.g., '60s')." },
              },
              required: ["name", "sets", "reps", "rest"],
            },
          },
        },
        required: ["day", "focus", "exercises"],
      },
    },
  },
  required: ["weekly_plan"],
};

const dietPlanSchema = {
    type: Type.OBJECT,
    properties: {
        diet_plan: {
            type: Type.ARRAY,
            description: "A 7-day diet plan.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "Day of the week (e.g., Monday)." },
                    meals: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                meal_type: { type: Type.STRING, description: "e.g., Breakfast, Lunch, Dinner, Snack." },
                                description: { type: Type.STRING, description: "Description of the meal." },
                                calories: { type: Type.NUMBER, description: "Estimated calories for the meal." }
                            },
                            required: ["meal_type", "description", "calories"]
                        }
                    },
                    total_calories: { type: Type.NUMBER, description: "Total estimated calories for the day." }
                },
                required: ["day", "meals", "total_calories"]
            }
        }
    },
    required: ["diet_plan"]
};

export const generateTrainingPlan = async (prompt: string): Promise<TrainingPlan> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: trainingPlanSchema,
        },
    });

    const parsedResponse = JSON.parse(response.text);
    return parsedResponse as TrainingPlan;
};

export const generateDietPlan = async (prompt: string): Promise<DietPlan> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: dietPlanSchema,
        },
    });

    const parsedResponse = JSON.parse(response.text);
    return parsedResponse as DietPlan;
};

export const analyzeWorkoutForm = async (base64Image: string, exercise: string): Promise<string> => {
    const prompt = `Analyze the user's form for a ${exercise} in this image. The user's image is provided. Compare it to the ideal form. Provide specific, actionable feedback on their posture, alignment, and movement. Be encouraging but clear about corrections needed to prevent injury and maximize effectiveness. Format the feedback in markdown with headings for 'Positive Points' and 'Areas for Improvement'.`;
    
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };

    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });

    return response.text;
};
