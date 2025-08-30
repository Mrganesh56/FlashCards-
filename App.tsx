import React, { useState, useEffect } from 'react';
import { NavTab, Deck, UserProgress, User } from './types';
import { BottomNav } from './components/BottomNav';
import { Onboarding } from './components/Onboarding';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { DeckScreen } from './screens/DeckScreen';
import { StudyScreen } from './screens/StudyScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { useDarkMode } from './hooks/useDarkMode';


const MOCK_DECKS: Deck[] = [
  {
    id: 'deck-1',
    title: 'Biology 101: Cell Structure',
    userId: 'user-1',
    cards: [
      { id: 'card-1-1', question: 'What is the powerhouse of the cell?', answer: 'Mitochondria' },
      { id: 'card-1-2', question: 'What contains the cell\'s genetic material?', answer: 'Nucleus' },
      { id: 'card-1-3', question: 'What is the function of ribosomes?', answer: 'Protein synthesis' },
    ],
    color: '#3b82f6', // blue-500
    icon: 'BookMarked',
  },
  {
    id: 'deck-2',
    title: 'JavaScript Fundamentals',
    userId: 'user-1',
    cards: [
      { id: 'card-2-1', question: 'What are the primitive types in JS?', answer: 'string, number, bigint, boolean, undefined, symbol, and null' },
      { id: 'card-2-2', question: 'What does "===" check for?', answer: 'Both value and type equality' },
    ],
    color: '#f59e0b', // amber-500
    icon: 'BookMarked',
  },
];

const MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Alex Johnson', email: 'alex@example.com', password: 'password123' },
];

const MOCK_PROGRESS: UserProgress = {
  xp: 1250,
  dailyStreak: 7,
  masteredCards: 120,
  revisingCards: 45,
  badges: ['First Deck', '7-Day Streak'],
};

type AppView = 
  | { name: 'home' }
  | { name: 'deck'; deckId: string }
  | { name: 'study'; deckId: string }


export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('hasOnboarded'));
  
  const [users, setUsers] = useState<User[]>(() => {
    return MOCK_USERS.map(user => {
        try {
            const savedUserJSON = localStorage.getItem(`user-profile-${user.id}`);
            if (savedUserJSON) {
                const savedUser = JSON.parse(savedUserJSON);
                return { ...user, name: savedUser.name, email: savedUser.email };
            }
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
        }
        return user;
    });
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [view, setView] = useState<AppView>({ name: 'home' });

  const [decks, setDecks] = useState<Deck[]>(MOCK_DECKS);
  const [progress, setProgress] = useState<UserProgress>(MOCK_PROGRESS);
  const [completedDecks, setCompletedDecks] = useState<string[]>([]);
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasOnboarded', 'true');
    setShowOnboarding(false);
  };
  
  const handleLogin = (email: string, password_param: string): boolean => {
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password_param);
      if (user) {
          setCurrentUser(user);
          return true;
      }
      return false;
  };

  const handleSignUp = (name: string, email: string, password_param: string): boolean => {
      const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
          return false;
      }
      const newUser: User = { id: `user-${Date.now()}`, name, email, password: password_param };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      return true;
  };
  
  const handleLogout = () => {
      setCurrentUser(null);
      setView({ name: 'home' });
      setActiveTab('home');
  };

  const updateUserInList = (updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  
  const handleSelectDeck = (deckId: string) => {
      setView({ name: 'deck', deckId });
  };
  
  const handleStartStudy = (deckId: string) => {
      setView({ name: 'study', deckId });
  };

  const handleBackToHome = () => {
      setView({ name: 'home' });
      setActiveTab('home');
  };
  
  const handleFinishStudy = () => {
    const studiedDeckId = view.name === 'study' ? view.deckId : null;
    if (studiedDeckId && !completedDecks.includes(studiedDeckId)) {
      setCompletedDecks(prev => [...prev, studiedDeckId]);
    }
    
    if(studiedDeckId) {
        setView({ name: 'deck', deckId: studiedDeckId });
    } else {
        setView({ name: 'home' });
        setActiveTab('home');
    }
  }
  
  const userDecks = currentUser ? decks.filter(deck => deck.userId === currentUser.id) : [];

  const renderMainContent = () => {
    if (!currentUser) return null;

    if (view.name === 'deck') {
        const selectedDeck = decks.find(d => d.id === view.deckId);
        return <DeckScreen deck={selectedDeck} onBack={handleBackToHome} onStartStudy={handleStartStudy} />;
    }

    switch (activeTab) {
      case 'home':
      case 'study':
        return <HomeScreen decks={userDecks} setDecks={setDecks} onSelectDeck={handleSelectDeck} currentUser={currentUser} />;
      case 'progress':
        return <ProgressScreen progress={progress} />;
      case 'profile':
        return <ProfileScreen 
                    progress={progress} 
                    user={currentUser}
                    setUser={setCurrentUser}
                    updateUserInList={updateUserInList}
                    activityProgress={userDecks.length}
                    isDarkMode={isDarkMode} 
                    toggleDarkMode={toggleDarkMode}
                    onLogout={handleLogout}
                />;
      default:
        return <HomeScreen decks={userDecks} setDecks={setDecks} onSelectDeck={handleSelectDeck} currentUser={currentUser} />;
    }
  };

  const handleTabChange = (tab: NavTab) => {
      setActiveTab(tab);
      setView({ name: 'home' });
  }

  if (showOnboarding) {
    return (
      <div className="w-screen h-screen">
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  if (!currentUser) {
      return (
        <div className="w-screen h-screen bg-slate-50 dark:bg-slate-900">
            <AuthScreen onLogin={handleLogin} onSignUp={handleSignUp} />
        </div>
      );
  }

  if (view.name === 'study') {
      const studyDeck = decks.find(d => d.id === view.deckId);
      return <StudyScreen deck={studyDeck} onFinish={handleFinishStudy} />;
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <div className="relative max-w-lg mx-auto min-h-screen bg-slate-50 dark:bg-slate-900 shadow-2xl shadow-slate-300/10 dark:shadow-slate-900/50 flex flex-col">
        <main className="flex-grow">
          {renderMainContent()}
        </main>
        <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
      </div>
    </div>
  );
}