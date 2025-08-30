
import React, { useState } from 'react';
import { UploadCloudIcon, BrainCircuitIcon, BarChartIcon } from './Icons';

interface OnboardingProps {
  onComplete: () => void;
}

const OnboardingStep: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="text-center flex flex-col items-center p-4 animate-enter">
    <div className="w-32 h-32 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mb-8">
        {icon}
    </div>
    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{title}</h2>
    <p className="text-slate-500 dark:text-slate-400 max-w-xs">{description}</p>
  </div>
);


export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <UploadCloudIcon className="w-16 h-16 text-primary-500" />,
      title: 'Upload Your Notes',
      description: 'Easily upload your study materials - PDFs, text notes, or even images.',
    },
    {
      icon: <BrainCircuitIcon className="w-16 h-16 text-primary-500" />,
      title: 'AI-Powered Generation',
      description: 'Our smart AI analyzes your content and automatically creates flashcards for you.',
    },
    {
      icon: <BarChartIcon className="w-16 h-16 text-primary-500" />,
      title: 'Track Your Progress',
      description: 'Study effectively and watch your knowledge grow with detailed analytics.',
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-between items-center p-8 bg-slate-50 dark:bg-slate-900">
      <div className="flex-grow flex items-center justify-center">
        {/* FIX: Pass step data to OnboardingStep component instead of rendering object. */}
        <OnboardingStep {...steps[step]} />
      </div>
      <div className="w-full">
         <div className="flex justify-center space-x-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === step ? 'bg-primary-500 scale-125' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        <button
          onClick={handleNext}
          className="w-full bg-primary-500 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all duration-300 transform hover:scale-105"
        >
          {step === steps.length - 1 ? "Let's Get Started" : 'Continue'}
        </button>
      </div>
    </div>
  );
};
