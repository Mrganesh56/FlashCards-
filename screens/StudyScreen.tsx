import React, { useState, useEffect, useCallback } from 'react';
import { Deck } from '../types';
import { CheckIcon, XIcon } from '../components/Icons';

interface StudyScreenProps {
  deck: Deck | undefined;
  onFinish: () => void;
}

const Flashcard: React.FC<{
  question: string;
  answer: string;
  isFlipped: boolean;
  onClick: () => void;
  style: React.CSSProperties;
}> = ({ question, answer, isFlipped, onClick, style }) => (
  <div
    className="absolute w-full h-full cursor-pointer"
    style={{ perspective: '1000px' }}
    onClick={onClick}
  >
    <div
      className="relative w-full h-full transition-transform duration-500"
      style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'none' }}
    >
      {/* Front of card */}
      <div className="absolute w-full h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center p-6 text-center border-2 border-slate-200 dark:border-slate-700" style={{ backfaceVisibility: 'hidden' }}>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 dark:text-white">{question}</h2>
      </div>
      {/* Back of card */}
      <div className="absolute w-full h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center p-6 text-center border-2 border-primary-500/50 dark:border-primary-500/70" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
        <p className="text-xl md:text-3xl text-slate-600 dark:text-slate-200">{answer}</p>
      </div>
    </div>
  </div>
);


export const StudyScreen: React.FC<StudyScreenProps> = ({ deck, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [drag, setDrag] = useState({ x: 0, active: false, initialX: 0 });

  const currentCard = deck?.cards[currentIndex];
  const progress = deck ? ((currentIndex) / deck.cards.length) * 100 : 0;

  const resetCard = useCallback(() => {
    setDrag({ x: 0, active: false, initialX: 0 });
    setIsFlipped(false);
  }, []);
  
  const nextCard = useCallback(() => {
    if (deck && currentIndex < deck.cards.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
       setCurrentIndex(deck ? deck.cards.length : 0); // Go to "complete" state
    }
    resetCard();
  }, [deck, currentIndex, resetCard]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isFlipped) return; // Don't allow swiping when flipped
    setDrag({ ...drag, active: true, initialX: e.clientX });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (drag.active) {
      const dx = e.clientX - drag.initialX;
      setDrag({ ...drag, x: dx });
    }
  };

  const handlePointerUp = () => {
    if (drag.active) {
        if (Math.abs(drag.x) > 100) {
          // Animate out
          const outX = drag.x > 0 ? window.innerWidth : -window.innerWidth;
          setDrag({ ...drag, x: outX, active: false });
          setTimeout(nextCard, 200);
        } else {
          // Animate back to center
          setDrag({ x: 0, active: false, initialX: 0 });
        }
    }
  };

  useEffect(() => {
    if (!deck || deck.cards.length === 0) {
      onFinish();
    }
  }, [deck, onFinish]);

  if (!deck) {
    return <div className="fixed inset-0 bg-slate-900 flex items-center justify-center text-slate-500">Loading study session...</div>;
  }
  
  if (currentIndex >= deck.cards.length) {
    return (
        <div className="p-6 text-center flex flex-col items-center justify-center h-full fixed inset-0 bg-slate-50 dark:bg-slate-900">
            <CheckIcon className="w-24 h-24 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Deck Complete!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">You've reviewed all the cards.</p>
            <button onClick={onFinish} className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg">
                Back to Decks
            </button>
        </div>
    );
  }

  const rotation = drag.x / 40;
  const cardStyle = {
    transform: `translateX(${drag.x}px) rotate(${rotation}deg)`,
    transition: drag.active ? 'none' : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
  };

  return (
    <div 
        className="h-full w-full fixed inset-0 bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center overflow-hidden" 
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerUp} // End drag if cursor leaves window
    >
      <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-10 flex items-center gap-4">
        <button onClick={onFinish} className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors">
            <XIcon className="w-6 h-6 text-white"/>
        </button>
        <div className="w-full bg-black/20 rounded-full h-2.5">
          <div
            className="bg-white h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="font-semibold text-white text-sm w-16 text-right">
            {currentIndex + 1}/{deck.cards.length}
        </div>
      </header>
      
      <div 
        className="flex-grow w-full flex items-center justify-center relative p-4"
      >
        <div 
          className="relative w-full md:w-auto md:h-full aspect-[9/16] md:aspect-[16/9] max-w-md md:max-w-none md:max-h-[75vh]"
          onPointerDown={handlePointerDown}
        >
          {/* Background hint cards */}
          {currentIndex + 1 < deck.cards.length && (
              <div className="absolute w-full h-full bg-white/40 dark:bg-slate-800/50 rounded-2xl shadow-md transform -rotate-3 scale-95"></div>
          )}
          {currentIndex + 2 < deck.cards.length && (
              <div className="absolute w-full h-full bg-white/20 dark:bg-slate-700/50 rounded-2xl shadow-sm transform rotate-3 scale-90"></div>
          )}

          <Flashcard
            question={currentCard.question}
            answer={currentCard.answer}
            isFlipped={isFlipped}
            onClick={() => setIsFlipped(!isFlipped)}
            style={cardStyle}
          />
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10 flex justify-center items-center gap-4">
        <button onClick={() => nextCard()} className="w-20 h-20 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-red-500 shadow-xl transform transition-transform hover:scale-105">
          <XIcon className="w-10 h-10" />
        </button>
        <button onClick={() => setIsFlipped(!isFlipped)} className="px-8 py-4 bg-white dark:bg-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-200 shadow-xl transform transition-transform hover:scale-105">
            Flip Card
        </button>
        <button onClick={() => nextCard()} className="w-20 h-20 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-green-500 shadow-xl transform transition-transform hover:scale-105">
          <CheckIcon className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
};