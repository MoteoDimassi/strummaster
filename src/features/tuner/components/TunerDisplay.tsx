import React from 'react';

interface TunerDisplayProps {
  currentNote: string;
  currentFrequency: number;
  currentDetune: number;
  pointerPosition: number;
  isInTune: boolean;
}

export const TunerDisplay: React.FC<TunerDisplayProps> = ({
  currentNote,
  currentFrequency,
  currentDetune,
  pointerPosition,
  isInTune
}) => {
  return (
    <div className="flex flex-col items-center">
      {/* Нота */}
      <div className={`text-6xl font-bold mb-2 transition-colors ${
        isInTune ? 'text-green-400' : 'text-white'
      }`}>
        {currentNote}
      </div>

      {/* Частота */}
      <div className="text-slate-400 mb-4">
        <span className="text-xl">{currentFrequency}</span> Hz
      </div>

      {/* Индикатор настройки */}
      <div className="w-full h-5 bg-slate-700 rounded-full relative mb-2 overflow-hidden">
        <div 
          className={`absolute top-0 w-1 h-full transition-all duration-100 ${
            isInTune ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-white'
          }`}
          style={{ 
            left: `${pointerPosition}%`,
            transform: 'translateX(-50%)'
          }}
        />
      </div>

      {/* Шкала */}
      <div className="flex justify-between w-full px-2 mb-2">
        <span className="text-xs text-slate-500">-50</span>
        <span className="text-xs text-slate-500">0</span>
        <span className="text-xs text-slate-500">+50</span>
      </div>

      {/* Центы */}
      <div className="text-slate-400 text-sm">
        {currentDetune} cents
      </div>
    </div>
  );
};