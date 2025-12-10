import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface BeatsVisualizerProps {
  currentBeat: number; // The actively playing beat (0-indexed)
}

const BeatsVisualizer: React.FC<BeatsVisualizerProps> = ({ currentBeat }) => {
  const beatsPerBar = useSelector((state: RootState) => state.metronome.beatsPerBar);

  return (
    <div className="flex items-center justify-center gap-3 mb-8 h-12">
      {Array.from({ length: beatsPerBar }).map((_, index) => {
        const isActive = index === currentBeat;
        
        return (
          <div
            key={index}
            className={`
              transition-all duration-100 rounded-full
              ${isActive 
                ? 'w-6 h-6 bg-orange-500 shadow-lg shadow-orange-500/50 scale-110' 
                : 'w-5 h-5 bg-slate-200'
              }
            `}
          />
        );
      })}
    </div>
  );
};

export default BeatsVisualizer;