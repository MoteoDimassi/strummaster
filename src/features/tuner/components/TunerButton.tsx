import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { openTuner } from '../../../store/slices/tunerSlice';

export const TunerButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector(state => state.tuner);

  const handleOpenTuner = () => {
    dispatch(openTuner());
  };

  return (
    <div className="w-full flex justify-end">
      <button
        onClick={handleOpenTuner}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        Тюнер
      </button>
    </div>
  );
};