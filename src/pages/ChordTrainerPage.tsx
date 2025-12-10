import React from 'react';
import Trainer from '../features/chord-trainer/components/Trainer';

export const ChordTrainerPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-5xl">
        <Trainer />
      </div>
    </div>
  );
};