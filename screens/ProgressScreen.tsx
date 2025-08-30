
import React from 'react';
import { UserProgress } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ZapIcon, TargetIcon } from '../components/Icons';

interface ProgressScreenProps {
  progress: UserProgress;
}

const data = [
  { name: 'Mon', studied: 20 },
  { name: 'Tue', studied: 45 },
  { name: 'Wed', studied: 60 },
  { name: 'Thu', studied: 30 },
  { name: 'Fri', studied: 75 },
  { name: 'Sat', studied: 90 },
  { name: 'Sun', studied: 50 },
];

const pieData = [
  { name: 'Mastered', value: 120 },
  { name: 'Revising', value: 45 },
];
const COLORS = ['#10b981', '#f59e0b'];

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ progress }) => {
  return (
    <div className="p-4 sm:p-6 pb-24">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Your Progress</h1>
        <p className="text-slate-500 dark:text-slate-400">Keep up the great work!</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center text-orange-500">
                <ZapIcon className="w-6 h-6"/>
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{progress.dailyStreak}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Day Streak</p>
            </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
             <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center text-primary-500">
                <TargetIcon className="w-6 h-6"/>
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{progress.xp}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total XP</p>
            </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Weekly Activity</h3>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="rgb(100 116 139)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgb(100 116 139)" fontSize={12} tickLine={false} axisLine={false}/>
              <Tooltip
                cursor={{ fill: 'rgba(226, 232, 240, 0.5)' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  color: '#334155'
                }}
              />
              <Bar dataKey="studied" fill="hsl(210, 90%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Topic Mastery</h3>
        <div style={{ width: '100%', height: 200 }} className="flex items-center justify-center">
          <ResponsiveContainer>
             <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
         <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-slate-600 dark:text-slate-300">Mastered</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-slate-600 dark:text-slate-300">Revising</span>
            </div>
        </div>
      </div>
    </div>
  );
};
