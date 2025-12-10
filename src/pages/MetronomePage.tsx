import React from 'react';
import BpmControl from '../features/metronome/components/BpmControl';
import BeatsVisualizer from '../features/metronome/components/BeatsVisualizer';
import Controls from '../features/metronome/components/Controls';
import Settings from '../features/metronome/components/Settings';
import Subdivisions from '../features/metronome/components/Subdivisions';
import { useMetronome } from '../features/metronome/hooks/useMetronome';

export const MetronomePage: React.FC = () => {
  const { activeBeat } = useMetronome();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-primary">
      <div className="bg-background-secondary rounded-card shadow-card w-full max-w-2xl p-8 md:p-12 border border-border relative">
        
        {/* Top Tag */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
             {/* This space reserved for future "Pro" badge or similar if needed */}
        </div>

        <BpmControl />
        
        <div className="flex justify-center mb-6">
           <div className="bg-background-surface-tinted text-text-secondary text-caption font-bold px-3 py-1 uppercase tracking-widest rounded-soft">
             Биты
           </div>
        </div>

        <BeatsVisualizer currentBeat={activeBeat} />
        
        <Controls />
        
        <hr className="border-border my-8" />
        
        <Settings />
        
        <Subdivisions />

      </div>
    </div>
  );
};