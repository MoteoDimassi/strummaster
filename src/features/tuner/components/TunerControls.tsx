import React from 'react';
import { TunerMode } from '../../../store/slices/tunerSlice';

interface TunerControlsProps {
  isRunning: boolean;
  mode: TunerMode;
  onToggle: () => void;
  onModeChange: (mode: TunerMode) => void;
}

export const TunerControls: React.FC<TunerControlsProps> = ({
  isRunning,
  mode,
  onToggle,
  onModeChange
}) => {
  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isRunning 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isRunning ? 'Выключить микрофон' : 'Включить микрофон'}
      </button>

      {/* Переключатель режима */}
      <div className="flex justify-center gap-6 mt-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="mode"
            value="chromatic"
            checked={mode === 'chromatic'}
            onChange={(e) => onModeChange(e.target.value as TunerMode)}
            className="mr-2 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-slate-300">Хроматический</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="mode"
            value="guitar"
            checked={mode === 'guitar'}
            onChange={(e) => onModeChange(e.target.value as TunerMode)}
            className="mr-2 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-slate-300">Гитара (EADGBE)</span>
        </label>
      </div>
    </div>
  );
};