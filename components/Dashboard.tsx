import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PROGRESS_DATA } from '../constants';

const StatCard: React.FC<{ title: string; value: string; icon: string }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-md flex items-center space-x-4">
    <div className="text-4xl">{icon}</div>
    <div>
      <p className="text-gray-500 dark:text-dark-text-secondary">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
);


const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-dark-text-secondary">Welcome back! Here's your fitness summary.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Workouts This Week" value="4" icon="🏋️" />
        <StatCard title="Current Streak" value="12 Days" icon="🔥" />
        <StatCard title="Calories Burned" value="2,150" icon="⚡" />
      </div>

      <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Weekly Workout Progress</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={PROGRESS_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="week" stroke="#A0A0A0"/>
              <YAxis stroke="#A0A0A0"/>
              <Tooltip
                contentStyle={{
                    backgroundColor: 'rgba(30, 30, 30, 0.8)',
                    borderColor: '#00A86B',
                    color: '#E0E0E0'
                }}
                />
              <Legend />
              <Bar dataKey="workouts" fill="#00A86B" name="Workouts Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;