import React, { useState, useRef, useEffect } from 'react';
import { generateTrainingPlan } from '../services/geminiService';
import type { TrainingPlan as TPlan, DailyWorkout, Exercise, ChatMessage } from '../types';
import { BotIcon } from './icons';

const ExerciseCard: React.FC<{ exercise: Exercise }> = ({ exercise }) => (
  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
    <p className="font-semibold text-gray-800 dark:text-white">{exercise.name}</p>
    <div className="flex justify-between text-sm text-gray-600 dark:text-dark-text-secondary mt-1">
      <span>Sets: {exercise.sets}</span>
      <span>Reps: {exercise.reps}</span>
      <span>Rest: {exercise.rest}</span>
    </div>
  </div>
);

const DailyWorkoutCard: React.FC<{ dailyWorkout: DailyWorkout }> = ({ dailyWorkout }) => (
  <div className="bg-white dark:bg-dark-surface p-4 rounded-lg shadow-md">
    <h3 className="text-lg font-bold text-primary">{dailyWorkout.day} - <span className="text-gray-700 dark:text-dark-text">{dailyWorkout.focus}</span></h3>
    <div className="space-y-2 mt-3">
      {dailyWorkout.exercises.length > 0 ? (
        dailyWorkout.exercises.map((ex, index) => <ExerciseCard key={index} exercise={ex} />)
      ) : (
        <p className="text-gray-500 dark:text-dark-text-secondary">Rest Day</p>
      )}
    </div>
  </div>
);

const TrainingPlan: React.FC = () => {
  const [formData, setFormData] = useState({
    weight: '75',
    height: '180',
    age: '30',
    goal: 'muscle gain',
    daysPerWeek: '4',
    timePerDay: '60'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');

  const [trainingPlan, setTrainingPlan] = useState<TPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setMessages([{ role: 'model', text: "Great! I've got your details. Just hit send to generate your first plan, or add any other requirements you have." }]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      if (loading || !userInput.trim()) return;

      const newUserMessage: ChatMessage = { role: 'user', text: userInput };
      const updatedMessages = [...messages, newUserMessage];
      setMessages(updatedMessages);
      setUserInput('');
      setLoading(true);
      setError(null);

      const basePrompt = `
        You are an expert personal trainer AI named Jimbo.
        Your task is to create or update a personalized weekly training plan based on user details and a conversation history.
        You MUST always respond with ONLY the JSON object that adheres to the provided schema. Do not add any conversational text or markdown formatting around the JSON.

        User's base details:
        - Weight: ${formData.weight} kg
        - Height: ${formData.height} cm
        - Age: ${formData.age} years
        - Primary Goal: ${formData.goal}
        - Availability: ${formData.daysPerWeek} days per week, ${formData.timePerDay} minutes per session.
      `;
      
      const userConversation = updatedMessages
        .filter(msg => msg.role === 'user')
        .map(msg => msg.text)
        .join('\n- ');

      const fullPrompt = `${basePrompt}\n\nConversation and instructions from the user:\n- ${userConversation}`;
      
      try {
        const plan = await generateTrainingPlan(fullPrompt);
        setTrainingPlan(plan);
        setMessages(prev => [...prev, { role: 'model', text: 'Here is your updated plan! Let me know if you want any more adjustments.' }]);
      } catch (err) {
        const errorMessage = 'Sorry, I had trouble generating the plan. Please try rephrasing your request.';
        setError(errorMessage);
        setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
        console.error(err);
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Personalized Training Plan</h1>
        <p className="text-gray-500 dark:text-dark-text-secondary">Let's build the perfect workout plan for you.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className={`lg:col-span-2 space-y-6 ${formSubmitted && trainingPlan ? 'hidden lg:block' : ''}`}>
             <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Details</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text">Weight (kg)</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleChange} disabled={formSubmitted} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary disabled:opacity-70" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text">Height (cm)</label>
                    <input type="number" name="height" value={formData.height} onChange={handleChange} disabled={formSubmitted} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary disabled:opacity-70" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text">Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} disabled={formSubmitted} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary disabled:opacity-70" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text">Primary Goal</label>
                    <select name="goal" value={formData.goal} onChange={handleChange} disabled={formSubmitted} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary disabled:opacity-70">
                      <option value="muscle gain">Muscle Gain</option>
                      <option value="fat loss">Fat Loss</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text">Days per week</label>
                    <input type="number" name="daysPerWeek" value={formData.daysPerWeek} onChange={handleChange} min="1" max="7" disabled={formSubmitted} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary disabled:opacity-70" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text">Time per day (min)</label>
                    <input type="number" name="timePerDay" value={formData.timePerDay} onChange={handleChange} step="15" disabled={formSubmitted} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary disabled:opacity-70" />
                  </div>
                  {!formSubmitted && (
                     <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                      Start Conversation
                    </button>
                  )}
                </form>
             </div>
        </div>

        <div className="lg:col-span-3">
             {formSubmitted ? (
                 <div className="bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-xl shadow-md flex flex-col h-[70vh]">
                     <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Chat with Jimbo</h2>
                     <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-4">
                        {messages.map((msg, index) => (
                           <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                             {msg.role === 'model' && <BotIcon className="h-8 w-8 p-1.5 rounded-full bg-primary text-white flex-shrink-0" />}
                             <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'}`}>
                               <p className="text-sm">{msg.text}</p>
                             </div>
                           </div>
                         ))}
                         {loading && <div className="text-center text-sm text-gray-500 dark:text-dark-text-secondary">Jimbo is thinking...</div>}
                         <div ref={chatEndRef} />
                     </div>
                     <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="e.g., 'focus more on cardio'"
                            className="flex-grow block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary"
                        />
                         <button type="submit" disabled={loading} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400">
                           Send
                         </button>
                     </form>
                 </div>
             ) : (
                <div className="text-center p-8 bg-white dark:bg-dark-surface rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Start by filling out your details</h2>
                    <p className="text-gray-500 dark:text-dark-text-secondary mt-2">Once you provide your information, you can chat with Jimbo to create and refine your perfect plan.</p>
                </div>
             )}
        </div>
      </div>
      
      {error && !loading && <div className="text-red-500 text-center">{error}</div>}

      {trainingPlan && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Your Weekly Training Plan</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {trainingPlan.weekly_plan.map((dayPlan, index) => <DailyWorkoutCard key={index} dailyWorkout={dayPlan} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingPlan;