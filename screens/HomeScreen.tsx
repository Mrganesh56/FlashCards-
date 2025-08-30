import React, { useState, useCallback } from 'react';
import { Deck, Flashcard, User } from '../types';
import { DeckCard } from '../components/DeckCard';
import { PlusIcon, ZapIcon, UploadCloudIcon, FileTextIcon, XIcon } from '../components/Icons';
import { generateFlashcardsFromText, generateFlashcardsFromFile } from '../services/geminiService';

interface HomeScreenProps {
  decks: Deck[];
  setDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
  onSelectDeck: (deckId: string) => void;
  currentUser: User;
}

const GenerationModal: React.FC<{
    onClose: () => void;
    setDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
    userId: string;
}> = ({ onClose, setDecks, userId }) => {
    const [notes, setNotes] = useState('');
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const handleFileChange = (selectedFile: File | null) => {
        if (selectedFile) {
            setFile(selectedFile);
            setNotes(''); // Clear text input when file is selected
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result as string);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                setFilePreview(null);
            }
        }
    };
    
    const handleGenerate = async () => {
        if (!title.trim() || (!notes.trim() && !file)) {
            setError('Please provide a title and either notes or a file.');
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            let newCards: Flashcard[] | null = null;
            if(file) {
                newCards = await generateFlashcardsFromFile(file);
            } else {
                newCards = await generateFlashcardsFromText(notes);
            }

            if (newCards && newCards.length > 0) {
                const newDeck: Deck = {
                    id: `deck-${Date.now()}`,
                    title: title,
                    cards: newCards,
                    color: `hsl(${Math.random() * 360}, 60%, 55%)`,
                    icon: 'BookMarked',
                    userId: userId
                };
                setDecks(prev => [newDeck, ...prev]);
                onClose();
            } else {
                setError('Could not generate flashcards. Please try different content.');
            }
        } catch (err) {
            setError('An error occurred while generating flashcards.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const onDragOver = (e: React.DragEvent) => { e.preventDefault(); };
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFileChange(droppedFile);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-enter" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Create New Deck</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">Upload a file or paste notes to generate flashcards.</p>
                
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Deck Title (e.g., Biology Chapter 5)"
                    className="w-full p-3 mb-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                {!file ? (
                    <div onDragOver={onDragOver} onDrop={onDrop}>
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="w-full h-32 flex flex-col items-center justify-center p-3 mb-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-500 transition-colors">
                                <UploadCloudIcon className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2"/>
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Drag & drop or click to upload</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">PDF, DOC, PNG, JPG</p>
                            </div>
                        </label>
                        <input id="file-upload" type="file" className="hidden" accept=".pdf,.doc,.docx,image/*" onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} />
                        
                        <div className="relative flex items-center my-4">
                            <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                            <span className="flex-shrink mx-4 text-xs text-slate-400 dark:text-slate-500">OR</span>
                            <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                        </div>
                        
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Paste your study notes here..."
                            className="w-full h-24 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            rows={4}
                        />
                    </div>
                ) : (
                    <div className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 overflow-hidden">
                                {filePreview ? (
                                    <img src={filePreview} alt="preview" className="w-12 h-12 rounded-md object-cover" />
                                ) : (
                                    <FileTextIcon className="w-8 h-8 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                                )}
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{file.name}</p>
                            </div>
                            <button onClick={() => { setFile(null); setFilePreview(null); }} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600">
                                <XIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            </button>
                        </div>
                    </div>
                )}
                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button onClick={onClose} className="w-full px-4 py-3 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors">Cancel</button>
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary-500 text-white font-semibold transition-colors hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed">
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <ZapIcon className="w-5 h-5" />
                                <span>Generate Cards</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};


export const HomeScreen: React.FC<HomeScreenProps> = ({ decks, setDecks, onSelectDeck, currentUser }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-4 sm:p-6 pb-24">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Welcome Back, {currentUser.name.split(' ')[0]}!</h1>
        <p className="text-slate-500 dark:text-slate-400">Ready for another study session?</p>
      </header>

      <div className="mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all duration-300 transform hover:scale-105"
        >
          <PlusIcon className="w-6 h-6" />
          Create New Deck
        </button>
      </div>

      <section>
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-4">Your Decks</h2>
        {decks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} onClick={() => onSelectDeck(deck.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <ZapIcon className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">No decks yet!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Tap 'Create New Deck' to get started.</p>
          </div>
        )}
      </section>

      {showModal && <GenerationModal onClose={() => setShowModal(false)} setDecks={setDecks} userId={currentUser.id} />}
    </div>
  );
};