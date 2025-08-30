import React, { useState } from 'react';
import { ZapIcon } from '../components/Icons';

interface AuthScreenProps {
  onLogin: (email: string, pass: string) => boolean;
  onSignUp: (name: string, email: string, pass: string) => boolean;
}

type AuthView = 'login' | 'signup';

const AuthInput: React.FC<{
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ type, placeholder, value, onChange }) => (
    <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
    />
);

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onSignUp }) => {
    const [view, setView] = useState<AuthView>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        let success = false;
        if (view === 'login') {
            if (!email || !password) {
                setError('Please fill in all fields.');
                return;
            }
            success = onLogin(email, password);
            if (!success) {
                setError('Invalid email or password.');
            }
        } else {
            if (!name || !email || !password) {
                setError('Please fill in all fields.');
                return;
            }
            success = onSignUp(name, email, password);
            if(!success) {
                setError('An account with this email already exists.');
            }
        }
    };

    const switchView = (newView: AuthView) => {
        setView(newView);
        setError('');
        setName('');
        setEmail('');
        setPassword('');
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-primary-500/10 dark:bg-primary-500/20 rounded-2xl mb-4">
                        <ZapIcon className="w-10 h-10 text-primary-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                        {view === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {view === 'login' ? 'Log in to continue your learning journey.' : 'Sign up to start creating your flashcards.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {view === 'signup' && (
                        <AuthInput type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
                    )}
                    <AuthInput type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
                    <AuthInput type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-primary-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all duration-300"
                    >
                        {view === 'login' ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button onClick={() => switchView(view === 'login' ? 'signup' : 'login')} className="text-sm font-medium text-primary-500 hover:underline">
                        {view === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                    </button>
                </div>
            </div>
        </div>
    );
};