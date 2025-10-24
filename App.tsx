
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TrainingPlan from './components/TrainingPlan';
import DietPlan from './components/DietPlan';
import VideoLibrary from './components/VideoLibrary';
import VideoAnalysis from './components/VideoAnalysis';
import type { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'training':
        return <TrainingPlan />;
      case 'diet':
        return <DietPlan />;
      case 'videos':
        return <VideoLibrary />;
      case 'analysis':
        return <VideoAnalysis />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-dark-bg text-gray-900 dark:text-dark-text">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
