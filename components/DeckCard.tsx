
import React from 'react';
import { Deck } from '../types';
import { BookMarkedIcon } from './Icons';

interface DeckCardProps {
  deck: Deck;
  onClick: () => void;
}

const IconWrapper: React.FC<{ iconName: string, className?: string }> = ({ iconName, className }) => {
    // In a real app, you would have a more robust icon mapping system
    if (iconName === 'BookMarked') return <BookMarkedIcon className={className} />;
    return <BookMarkedIcon className={className} />;
};

export const DeckCard: React.FC<DeckCardProps> = ({ deck, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full h-full p-4 rounded-2xl flex flex-col justify-between text-left transition-all duration-300 transform hover:-translate-y-1"
      style={{ backgroundColor: deck.color }}
    >
      <div>
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
            <IconWrapper iconName={deck.icon} className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-white font-bold text-lg leading-tight">{deck.title}</h3>
      </div>
      <p className="text-white/70 text-sm font-medium mt-2">{deck.cards.length} cards</p>
    </button>
  );
};
