
import type { WorkoutVideo } from './types';

export const WORKOUT_VIDEOS: WorkoutVideo[] = [
  { id: 1, title: 'Classic Bench Press', thumbnail: 'https://picsum.photos/seed/bench/400/225', bodyPart: 'Chest', difficulty: 'Intermediate', type: 'Strength' },
  { id: 2, title: 'Beginner Bodyweight Squat', thumbnail: 'https://picsum.photos/seed/squat/400/225', bodyPart: 'Legs', difficulty: 'Beginner', type: 'Strength' },
  { id: 3, title: 'Advanced Pull-ups', thumbnail: 'https://picsum.photos/seed/pullup/400/225', bodyPart: 'Back', difficulty: 'Advanced', type: 'Strength' },
  { id: 4, title: 'Bicep Curls', thumbnail: 'https://picsum.photos/seed/bicep/400/225', bodyPart: 'Arms', difficulty: 'Beginner', type: 'Strength' },
  { id: 5, title: 'Plank for Core Strength', thumbnail: 'https://picsum.photos/seed/plank/400/225', bodyPart: 'Core', difficulty: 'Beginner', type: 'Strength' },
  { id: 6, title: 'High-Intensity Interval Training (HIIT)', thumbnail: 'https://picsum.photos/seed/hiit/400/225', bodyPart: 'Full Body', difficulty: 'Intermediate', type: 'Cardio' },
  { id: 7, title: 'Deadlift Form Guide', thumbnail: 'https://picsum.photos/seed/deadlift/400/225', bodyPart: 'Back', difficulty: 'Advanced', type: 'Strength' },
  { id: 8, title: 'Yoga for Flexibility', thumbnail: 'https://picsum.photos/seed/yoga/400/225', bodyPart: 'Full Body', difficulty: 'Beginner', type: 'Flexibility' },
  { id: 9, title: 'Lunge Variations', thumbnail: 'https://picsum.photos/seed/lunge/400/225', bodyPart: 'Legs', difficulty: 'Intermediate', type: 'Strength' },
  { id: 10, title: 'Overhead Press', thumbnail: 'https://picsum.photos/seed/press/400/225', bodyPart: 'Arms', difficulty: 'Intermediate', type: 'Strength' },
  { id: 11, title: 'Russian Twists', thumbnail: 'https://picsum.photos/seed/twist/400/225', bodyPart: 'Core', difficulty: 'Intermediate', type: 'Strength' },
  { id: 12, title: 'Advanced Push-up Variations', thumbnail: 'https://picsum.photos/seed/pushup/400/225', bodyPart: 'Chest', difficulty: 'Advanced', type: 'Strength' }
];

export const PROGRESS_DATA = [
    { week: 'Week 1', workouts: 3 },
    { week: 'Week 2', workouts: 4 },
    { week: 'Week 3', workouts: 3 },
    { week: 'Week 4', workouts: 5 },
    { week: 'Week 5', workouts: 4 },
    { week: 'Week 6', workouts: 6 },
];
