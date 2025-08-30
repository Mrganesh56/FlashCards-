import React, { useState } from 'react';
import { UserProgress, User } from '../types';
import { SunIcon, MoonIcon, UserIcon, Edit3Icon, CheckIcon, XIcon, LogOutIcon } from '../components/Icons';

interface ProfileScreenProps {
  progress: UserProgress;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateUserInList: (user: User) => void;
  activityProgress: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
}

const ProfileInput: React.FC<{ label: string; name: keyof Omit<User, 'id' | 'password'>; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; isEmail?: boolean }> = ({ label, name, value, onChange, isEmail = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</label>
        <input
            type={isEmail ? "email" : "text"}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
    </div>
);

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ progress, user, setUser, updateUserInList, activityProgress, isDarkMode, toggleDarkMode, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user.name, email: user.email });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: 'name' | 'email', value: string };
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    
    // Update state
    setUser(updatedUser);
    updateUserInList(updatedUser);

    // Save to localStorage
    try {
        const userToSave = { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email };
        localStorage.setItem(`user-profile-${user.id}`, JSON.stringify(userToSave));
    } catch (error) {
        console.error("Failed to save user profile to localStorage", error);
    }
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ name: user.name, email: user.email });
    setIsEditing(false);
  };

  return (
    <div className="p-4 sm:p-6 pb-24">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Profile</h1>
        {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                <Edit3Icon className="w-4 h-4" />
                <span>Edit Profile</span>
            </button>
        )}
      </header>

      {isEditing ? (
        <div className="mb-8 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-enter">
            <div className="space-y-4">
                <ProfileInput label="Name" name="name" value={formData.name} onChange={handleInputChange} />
                <ProfileInput label="Email" name="email" value={formData.email} onChange={handleInputChange} isEmail/>
            </div>
            <div className="mt-6 flex gap-3">
                <button onClick={handleCancel} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors">
                    <XIcon className="w-5 h-5" /> Cancel
                </button>
                <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white font-semibold transition-colors hover:bg-primary-600">
                    <CheckIcon className="w-5 h-5" /> Save Changes
                </button>
            </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 mb-4 flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-slate-500 dark:text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{user.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">My Study Materials</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{activityProgress} decks created</p>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Settings</h3>
        <div className="flex justify-between items-center">
          <span className="font-medium text-slate-600 dark:text-slate-300">Dark Mode</span>
          <button
            onClick={toggleDarkMode}
            className="w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors"
            style={{ backgroundColor: isDarkMode ? 'hsl(210, 90%, 50%)' : '#d1d5db' }}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                isDarkMode ? 'translate-x-6' : ''
              }`}
            >
              {isDarkMode ? <MoonIcon className="w-4 h-4 text-primary-500 m-1" /> : <SunIcon className="w-4 h-4 text-gray-500 m-1" />}
            </div>
          </button>
        </div>
      </div>
      
       <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Badges</h3>
        <div className="flex gap-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-2xl" title="First Deck">🚀</div>
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-2xl" title="7-Day Streak">🔥</div>
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-2xl" title="100 Cards Mastered">🧠</div>
        </div>
      </div>

       <div className="px-4">
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-red-500 font-semibold bg-red-500/10 hover:bg-red-500/20 transition-colors dark:text-red-400 dark:bg-red-400/10 dark:hover:bg-red-400/20">
            <LogOutIcon className="w-5 h-5" />
            <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};