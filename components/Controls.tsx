import React, { useState } from 'react';
import { Play, Square, Plus, Minus, RotateCcw } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  bpm: number;
  setBpm: (bpm: number) => void;
  onTogglePlay: () => void;
  onReset: () => void;
  stepCount: number;
  onStepCountChange: (delta: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  bpm,
  setBpm,
  onTogglePlay,
  onReset,
  stepCount,
  onStepCountChange,
}) => {
  const [tempBpm, setTempBpm] = useState<string>(bpm.toString());
  return (
    <div className="w-full max-w-3xl bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Play/Stop Button */}
        <button
          onClick={onTogglePlay}
          className={`
            flex items-center justify-center w-20 h-20 rounded-full shadow-lg transition-all duration-200
            ${isPlaying 
              ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30' 
              : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
            }
          `}
        >
          {isPlaying ? (
            <Square fill="white" className="text-white ml-0.5" size={32} />
          ) : (
            <Play fill="white" className="text-white ml-1" size={36} />
          )}
        </button>

        {/* BPM Control */}
        <div className="flex-1 w-full flex flex-col gap-2">
          <div className="flex justify-between text-slate-300 font-medium">
            <span>Tempo</span>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="range"
              min="35"
              max="250"
              value={bpm}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                setBpm(newValue);
                setTempBpm(newValue.toString());
              }}
              className="flex-1 h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tempBpm}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only digits
                  const digitsOnly = value.replace(/\D/g, '');
                  
                  // Get cursor position
                  const cursorPos = e.target.selectionStart;
                  
                  // If cursor is not at the end, clear all digits before cursor
                  let newValue = digitsOnly;
                  if (cursorPos < value.length) {
                    const beforeCursor = digitsOnly.substring(0, cursorPos);
                    const afterCursor = digitsOnly.substring(cursorPos);
                    newValue = afterCursor;
                  }
                  
                  // Update the temporary value (allow empty string)
                  setTempBpm(newValue);
                  
                  // Update the actual BPM if not empty
                  if (newValue !== '') {
                    setBpm(Number(newValue));
                  }
                }}
                onBlur={(e) => {
                  // Set minimum value only if empty or less than 35
                  const value = Number(tempBpm);
                  if (tempBpm === '' || value < 35) {
                    setBpm(35);
                    setTempBpm('35');
                  } else if (value > 250) {
                    setBpm(250);
                    setTempBpm('250');
                  } else {
                    setBpm(value);
                  }
                }}
                onFocus={(e) => {
                  // Select all text when focused
                  e.target.select();
                  // Update temp value to match current BPM
                  setTempBpm(bpm.toString());
                }}
                className="w-16 bg-slate-900 text-amber-400 font-mono text-sm rounded-lg px-2 py-1 border border-slate-700 focus:ring-2 focus:ring-amber-500 outline-none text-center"
              />
              <span className="text-amber-400 font-mono text-sm">BPM</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Separator */}
        <div className="hidden md:block w-px h-16 bg-slate-700"></div>

        {/* Length Controls */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-slate-300 text-sm font-medium">Length</span>
          <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-700">
            <button 
              onClick={() => onStepCountChange(-2)}
              disabled={stepCount <= 4}
              className="p-2 hover:bg-slate-700 rounded-md disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 transition-colors"
            >
              <Minus size={18} />
            </button>
            <span className="w-8 text-center font-mono font-bold text-lg text-slate-200">{stepCount}</span>
             <button 
              onClick={() => onStepCountChange(2)}
              disabled={stepCount >= 16}
              className="p-2 hover:bg-slate-700 rounded-md disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Reset */}
        <button 
          onClick={onReset}
          className="p-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
          title="Reset Pattern"
        >
          <RotateCcw size={20} />
        </button>

      </div>
    </div>
  );
};