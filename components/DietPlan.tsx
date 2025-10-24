import React, { useState } from 'react';
import { generateDietPlan } from '../services/geminiService';
import type { DietPlan as DPlan, DailyDiet } from '../types';

const DailyDietCard: React.FC<{ dailyDiet: DailyDiet }> = ({ dailyDiet }) => (
  <div className="bg-white dark:bg-dark-surface p-4 rounded-lg shadow-md flex flex-col h-full">
    <div className="flex justify-between items-baseline">
        <h3 className="text-lg font-bold text-primary">{dailyDiet.day}</h3>
        <p className="text-sm font-semibold text-gray-600 dark:text-dark-text-secondary">{dailyDiet.total_calories} kcal</p>
    </div>
    <div className="space-y-2 mt-3 flex-grow">
      {dailyDiet.meals.map((meal, index) => (
        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
          <p className="font-semibold text-gray-800 dark:text-white">{meal.meal_type}</p>
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-1">{meal.description}</p>
          <p className="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">{meal.calories} kcal</p>
        </div>
      ))}
    </div>
  </div>
);


const DietPlan: React.FC = () => {
  const [formData, setFormData] = useState({
    goal: 'fat loss',
    preferences: 'high-protein',
  });
  const [dietPlan, setDietPlan] = useState<DPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDietPlan(null);

    const prompt = `
      Create a personalized 7-day diet plan for a user.
      - Primary Goal: ${formData.goal}
      - Dietary Preference: ${formData.preferences}
      
      The plan should include 3 main meals and 1-2 snacks per day.
      For each meal, provide a brief description and an estimated calorie count.
      Calculate the total daily calories.
      Return the response in the specified JSON format.
    `;

    try {
      const plan = await generateDietPlan(prompt);
      setDietPlan(plan);
    } catch (err) {
      setError('Failed to generate diet plan. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Diet Plan Generator</h1>
        <p className="text-gray-500 dark:text-dark-text-secondary">Tell me your goals and I'll create a delicious and effective diet plan for you.</p>
      </header>

      <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text">Primary Goal</label>
            <select name="goal" value={formData.goal} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary">
              <option value="fat loss">Fat Loss</option>
              <option value="muscle gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text">Dietary Preference</label>
            <select name="preferences" value={formData.preferences} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary">
              <option value="balanced">Balanced</option>
              <option value="high-protein">High-Protein</option>
              <option value="low-carb">Low-Carb</option>
              <option value="vegetarian">Vegetarian</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full sm:w-auto bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 whitespace-nowrap">
            {loading ? 'Generating...' : 'Generate Diet Plan'}
          </button>
        </form>
      </div>

      {error && <div className="text-red-500 text-center">{error}</div>}
      
      {loading && <div className="text-center">Generating your personalized diet plan...</div>}

      {dietPlan && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Your Weekly Diet Plan</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {dietPlan.diet_plan.map((dayPlan, index) => <DailyDietCard key={index} dailyDiet={dayPlan} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default DietPlan;