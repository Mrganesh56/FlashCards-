export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface Deck {
  id: string;
  title: string;
  cards: Flashcard[];
  color: string;
  icon: string;
  userId?: string;
}

export interface UserProgress {
  xp: number;
  dailyStreak: number;
  masteredCards: number;
  revisingCards: number;
  badges: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for security reasons on the client-side
}


export type NavTab = 'home' | 'study' | 'progress' | 'profile';