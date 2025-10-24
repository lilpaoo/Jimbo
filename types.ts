export type Page = 'dashboard' | 'training' | 'diet' | 'videos' | 'analysis';

export interface WorkoutVideo {
  id: number;
  title: string;
  thumbnail: string;
  bodyPart: 'Chest' | 'Back' | 'Legs' | 'Arms' | 'Core' | 'Full Body';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'Strength' | 'Cardio' | 'Flexibility';
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
}

export interface DailyWorkout {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface TrainingPlan {
  weekly_plan: DailyWorkout[];
}

export interface Meal {
  meal_type: string;
  description: string;
  calories: number;
}

export interface DailyDiet {
  day: string;
  meals: Meal[];
  total_calories: number;
}

export interface DietPlan {
  diet_plan: DailyDiet[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}