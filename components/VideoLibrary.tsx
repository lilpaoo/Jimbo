import React, { useState, useMemo } from 'react';
import { WORKOUT_VIDEOS } from '../constants';
import type { WorkoutVideo } from '../types';

type FilterCategory = 'bodyPart' | 'difficulty' | 'type';
type FilterValue = string;

const FilterButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
      isActive
        ? 'bg-primary text-white shadow'
        : 'bg-gray-200 dark:bg-dark-surface text-gray-700 dark:text-dark-text hover:bg-gray-300 dark:hover:bg-gray-600'
    }`}
  >
    {label}
  </button>
);

const VideoCard: React.FC<{ video: WorkoutVideo }> = ({ video }) => (
  <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
    <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
    <div className="p-4">
      <h3 className="font-bold text-lg text-gray-800 dark:text-white">{video.title}</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">{video.bodyPart}</span>
        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">{video.difficulty}</span>
        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">{video.type}</span>
      </div>
    </div>
  </div>
);


const VideoLibrary: React.FC = () => {
  const [filters, setFilters] = useState<Record<FilterCategory, FilterValue>>({
    bodyPart: 'All',
    difficulty: 'All',
    type: 'All',
  });

  const handleFilterChange = (category: FilterCategory, value: FilterValue) => {
    setFilters(prev => ({ ...prev, [category]: value }));
  };

  const filteredVideos = useMemo(() => {
    return WORKOUT_VIDEOS.filter(video => {
      return (
        (filters.bodyPart === 'All' || video.bodyPart === filters.bodyPart) &&
        (filters.difficulty === 'All' || video.difficulty === filters.difficulty) &&
        (filters.type === 'All' || video.type === filters.type)
      );
    });
  }, [filters]);

  const filterOptions = {
      bodyPart: ['All', 'Chest', 'Back', 'Legs', 'Arms', 'Core', 'Full Body'],
      difficulty: ['All', 'Beginner', 'Intermediate', 'Advanced'],
      type: ['All', 'Strength', 'Cardio', 'Flexibility']
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Workout Video Library</h1>
        <p className="text-gray-500 dark:text-dark-text-secondary">Browse our extensive library of exercises to perfect your form.</p>
      </header>

      <div className="bg-white dark:bg-dark-surface p-4 rounded-xl shadow-md space-y-4">
        {Object.entries(filterOptions).map(([category, options]) => (
            <div key={category}>
                <h3 className="text-md font-semibold mb-2 capitalize text-gray-700 dark:text-dark-text">{category.replace(/([A-Z])/g, ' $1')}</h3>
                <div className="flex flex-wrap gap-2">
                    {options.map(option => (
                        <FilterButton 
                            key={option}
                            label={option} 
                            isActive={filters[category as FilterCategory] === option}
                            onClick={() => handleFilterChange(category as FilterCategory, option)}
                        />
                    ))}
                </div>
            </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.length > 0 ? (
          filteredVideos.map(video => <VideoCard key={video.id} video={video} />)
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-dark-text-secondary">No videos match your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default VideoLibrary;