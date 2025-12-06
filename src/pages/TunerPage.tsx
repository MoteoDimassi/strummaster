import React from 'react';
import { TunerDisplay } from '../features/tuner/components/TunerDisplay';
import { TunerControls } from '../features/tuner/components/TunerControls';

export const TunerPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
      <h1 className="text-3xl font-bold text-amber-500">Гитарный Тюнер</h1>
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 w-full flex flex-col items-center gap-8">
        <TunerDisplay />
        <TunerControls />
      </div>
    </div>
  );
};