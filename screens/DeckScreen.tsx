
import React from 'react';
import { Deck } from '../types';

interface DeckScreenProps {
  deck: Deck | undefined;
  onBack: () => void;
  onStartStudy: (deckId: string) => void;
}

export const DeckScreen: React.FC<DeckScreenProps> = ({ deck, onBack, onStartStudy }) => {
  if (!deck) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Deck not found.</h2>
        <button onClick={onBack} className="mt-4 text-primary-500 font-semibold">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 pb-24">
      <header className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-300"><path d="m15 18-6-6 6-6"></path></svg>
        </button>
        <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{deck.title}</h1>
            <p className="text-slate-500 dark:text-slate-400">{deck.cards.length} cards</p>
        </div>
      </header>

      <button
        onClick={() => onStartStudy(deck.id)}
        className="w-full bg-primary-500 text-white font-bold py-4 px-4 rounded-xl mb-6 shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all duration-300 transform hover:scale-105"
      >
        Start Studying
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deck.cards.map((card) => (
          <div key={card.id} className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="font-semibold text-slate-700 dark:text-slate-200">{card.question}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
