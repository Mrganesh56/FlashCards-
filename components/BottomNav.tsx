
import React from 'react';
import { NavTab } from '../types';
import { HomeIcon, BookOpenIcon, BarChartIcon, UserIcon } from './Icons';

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-all duration-200 ease-in-out ${
      isActive ? 'text-primary-500' : 'text-slate-400 dark:text-slate-500'
    }`}
  >
    {icon}
    <span className={`text-xs mt-1 font-medium ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`}>
      {label}
    </span>
  </button>
);

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon className="w-6 h-6" /> },
    { id: 'study', label: 'Study', icon: <BookOpenIcon className="w-6 h-6" /> },
    { id: 'progress', label: 'Progress', icon: <BarChartIcon className="w-6 h-6" /> },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-6 h-6" /> },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-t-lg z-50 max-w-lg mx-auto">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </div>
    </div>
  );
};
