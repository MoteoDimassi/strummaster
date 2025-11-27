import React from 'react';
import { ArrowDown, ArrowUp, Circle, CircleDot, X } from 'lucide-react';
import { StrumStep } from '../types';

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
    if (isActive) return 'bg-amber-500 border-amber-400 text-white shadow-amber-500/50';
    
    switch (step.strumType) {
      case 'strum':
        return 'bg-slate-700 border-slate-600 text-slate-200 group-hover:bg-slate-600';
      case 'mute':
        return 'bg-rose-900/40 border-rose-800 text-rose-400 group-hover:bg-rose-900/60';
      case 'ghost':
      default:
        return 'bg-slate-800/50 border-slate-700/50 text-slate-500 group-hover:bg-slate-800';
    }
  };

  return (
    <div className="strum-node flex flex-col items-center gap-2 group select-none">
      
      {/* Clickable Arrow Area */}
      <div
        onClick={onClick}
        className={`
          relative flex flex-col items-center justify-center gap-3 cursor-pointer
          transition-all duration-200 ease-in-out
          ${isActive ? 'scale-110 -translate-y-2' : 'hover:scale-105 hover:-translate-y-1'}
        `}
      >
        {/* Arrow Indicator */}
        <div
          className={`
            w-16 h-24 rounded-2xl flex items-center justify-center shadow-lg border-2
            transition-colors duration-150
            ${getStyles()}
          `}
        >
          {isDown ? (
            <ArrowDown size={48} strokeWidth={isActive ? 3 : 2} />
          ) : (
            <ArrowUp size={48} strokeWidth={isActive ? 3 : 2} />
          )}
        </div>

        {/* Type Indicator */}
        <div
          className={`
            transition-colors duration-200
            ${isActive ? 'text-amber-400' :
              step.strumType === 'strum' ? 'text-emerald-400' :
              step.strumType === 'mute' ? 'text-rose-400' : 'text-slate-600'}
          `}
        >
          {step.strumType === 'strum' && <CircleDot size={20} fill="currentColor" className="opacity-80" />}
          {step.strumType === 'mute' && <X size={20} className="opacity-80" />}
          {step.strumType === 'ghost' && <Circle size={20} className="opacity-50" />}
        </div>

        {/* Active Glow */}
        {isActive && (
          <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full z-[-1]" />
        )}
      </div>

      {/* Lyrics Input */}
      <div className="w-16">
        <input 
          type="text" 
          value={step.lyrics}
          onChange={(e) => onLyricsChange(e.target.value)}
          placeholder="lyric"
          className={`
            w-full bg-transparent text-center text-sm border-b border-dashed focus:outline-none focus:border-amber-500
            placeholder:text-slate-700
            ${isActive ? 'text-amber-100 border-amber-500/50' : 'text-slate-300 border-slate-700'}
          `}
        />
      </div>
    </div>
  );
};