import React from 'react';
import { ArrowDown, ArrowUp, Circle, CircleDot, X } from 'lucide-react';
import { StrumStep } from '../../domain/entities/StrumStep';

interface StrumNodeProps {
  step: StrumStep;
  isActive: boolean;
  onClick: () => void;
  onLyricsChange: (text: string) => void;
}

export const StrumNode: React.FC<StrumNodeProps> = ({ step, isActive, onClick, onLyricsChange }) => {
  const isDown = step.direction === 'down';
  
  // Helper to determine styles based on strum type
  const getStyles = () => {
    if (isActive) return 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-100';
    
    switch (step.strumType) {
      case 'strum':
        return 'bg-slate-800 border-slate-700 text-white group-hover:bg-slate-700 group-hover:border-slate-600 shadow-md';
      case 'mute':
        return 'bg-rose-50 border-rose-200 text-rose-500 group-hover:bg-rose-100 group-hover:border-rose-300';
      case 'ghost':
      default:
        return 'bg-slate-50 border-slate-200 text-slate-300 group-hover:bg-slate-100 group-hover:border-slate-300';
    }
  };

  return (
    <div className="strum-node flex flex-col items-center gap-3 group select-none">
      
      {/* Clickable Arrow Area */}
      <div
        onClick={onClick}
        className={`
          relative flex flex-col items-center justify-center gap-3 cursor-pointer
          transition-all duration-200 ease-out
          ${isActive ? 'scale-105 -translate-y-1' : 'hover:scale-105 hover:-translate-y-1'}
        `}
      >
        {/* Arrow Indicator */}
        <div
          className={`
            w-14 h-20 md:w-16 md:h-24 rounded-2xl flex items-center justify-center border-2
            transition-all duration-200
            ${getStyles()}
          `}
        >
          {isDown ? (
            <ArrowDown size={40} strokeWidth={isActive ? 3 : 2.5} />
          ) : (
            <ArrowUp size={40} strokeWidth={isActive ? 3 : 2.5} />
          )}
        </div>

        {/* Type Indicator */}
        <div
          className={`
            transition-colors duration-200 h-5 flex items-center justify-center
            ${isActive ? 'text-blue-600' :
              step.strumType === 'strum' ? 'text-slate-600' :
              step.strumType === 'mute' ? 'text-rose-500' : 'text-slate-300'}
          `}
        >
          {step.strumType === 'strum' && <CircleDot size={18} className="opacity-100" />}
          {step.strumType === 'mute' && <X size={18} className="opacity-100" />}
          {step.strumType === 'ghost' && <Circle size={18} className="opacity-100" />}
        </div>
      </div>

      {/* Lyrics Input */}
      <div className="w-16">
        <input
          type="text"
          value={step.lyrics}
          onChange={(e) => onLyricsChange(e.target.value)}
          placeholder="текст"
          className={`
            w-full bg-transparent text-center text-sm font-medium border-b border-transparent focus:outline-none focus:border-blue-500 transition-colors
            placeholder:text-slate-300
            ${isActive ? 'text-blue-700' : 'text-slate-600 hover:border-slate-300'}
          `}
        />
      </div>
    </div>
  );
};