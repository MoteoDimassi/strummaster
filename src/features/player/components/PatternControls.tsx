import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { 
  applyToAllMeasures, 
  saveOnlyInThisMeasure 
} from '../../../store/slices/playerSlice';

export const PatternControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const { hasUnsavedChanges } = useAppSelector(state => state.player);

  if (!hasUnsavedChanges) return null;

  return (
    <div className="w-full flex justify-center gap-3 mb-6">
      <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
        <button
          onClick={() => dispatch(applyToAllMeasures())}
          className="px-5 py-2.5 bg-white text-blue-600 shadow-sm rounded-lg font-semibold text-sm transition-all flex items-center gap-2 hover:text-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18m-9-9v18"/>
            <path d="M3 6h18M3 18h18"/>
          </svg>
          Применить ко всем
        </button>
        <button
          onClick={() => dispatch(saveOnlyInThisMeasure())}
          className="px-5 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg font-medium text-sm transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Только этот такт
        </button>
      </div>
    </div>
  );
};