import React from 'react';
import type { Page } from '../types';
import { DumbbellIcon, UtensilsCrossedIcon, VideoIcon, BotIcon, BarChartIcon, LayoutDashboardIcon } from './icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  page: Page;
  currentPage: Page;
  onClick: (page: Page) => void;
}> = ({ icon, label, page, currentPage, onClick }) => {
  const isActive = currentPage === page;
  return (
    <li
      onClick={() => onClick(page)}
      className={`
        flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all
        ${isActive
          ? 'bg-primary text-white shadow-lg'
          : 'text-gray-600 dark:text-dark-text-secondary hover:bg-gray-200 dark:hover:bg-dark-surface'}
      `}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <aside className="w-64 bg-white dark:bg-dark-surface p-4 flex flex-col shadow-lg">
      <div className="flex items-center mb-8">
        <DumbbellIcon className="h-8 w-8 text-primary" />
        <h1 className="ml-3 text-2xl font-bold text-gray-800 dark:text-white">Jimbo</h1>
      </div>
      <nav>
        <ul>
          <NavItem icon={<LayoutDashboardIcon className="h-6 w-6" />} label="Dashboard" page="dashboard" currentPage={currentPage} onClick={setCurrentPage} />
          <NavItem icon={<DumbbellIcon className="h-6 w-6" />} label="Training Plan" page="training" currentPage={currentPage} onClick={setCurrentPage} />
          <NavItem icon={<UtensilsCrossedIcon className="h-6 w-6" />} label="Diet Plan" page="diet" currentPage={currentPage} onClick={setCurrentPage} />
          <NavItem icon={<VideoIcon className="h-6 w-6" />} label="Video Library" page="videos" currentPage={currentPage} onClick={setCurrentPage} />
          <NavItem icon={<BotIcon className="h-6 w-6" />} label="Video Analysis" page="analysis" currentPage={currentPage} onClick={setCurrentPage} />
        </ul>
      </nav>
      <div className="mt-auto p-4 bg-gray-100 dark:bg-dark-bg rounded-lg text-center">
        <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Ready to crush your goals?</p>
        <p className="font-bold text-primary">Let's get started!</p>
      </div>
    </aside>
  );
};

export default Sidebar;