import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { 
  setActiveMeasureIdx, 
  addMeasure, 
  removeMeasure, 
  updateChordForMeasure 
} from '../../../store/slices/playerSlice';

export const MeasureNavigation: React.FC = () => {
  const dispatch = useAppDispatch();
  const { measures, activeMeasureIdx } = useAppSelector(state => state.player);
  const activeMeasure = measures[activeMeasureIdx];
  const currentChord = activeMeasure?.steps[0]?.chord || 'Am';

  const handleMeasureChange = (delta: number) => {
    const newIndex = Math.max(0, Math.min(measures.length - 1, activeMeasureIdx + delta));
    dispatch(setActiveMeasureIdx(newIndex));
  };

  const handleAddMeasure = () => {
    dispatch(addMeasure());
  };

  const handleRemoveMeasure = () => {
    if (measures.length > 1) {
      dispatch(removeMeasure());
    }
  };

  const handleChordChange = (chord: string) => {
    dispatch(updateChordForMeasure(chord));
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      
      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleMeasureChange(-1)}
          disabled={activeMeasureIdx === 0}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:hover:bg-slate-100 rounded-xl transition-all active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center px-6 min-w-[120px]">
          <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mb-1">Такт</span>
          <span className="text-3xl font-mono font-bold text-slate-900">
            {activeMeasureIdx + 1} <span className="text-slate-300 text-xl font-normal">/ {measures.length}</span>
          </span>
        </div>
        <button
          onClick={() => handleMeasureChange(1)}
          disabled={activeMeasureIdx === measures.length - 1}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:hover:bg-slate-100 rounded-xl transition-all active:scale-95"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Chord Editor */}
      <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
         <label className="text-sm text-slate-500 font-medium">Аккорд:</label>
         <select
           value={currentChord}
           onChange={(e) => handleChordChange(e.target.value)}
           className="bg-transparent text-blue-600 font-bold text-xl focus:outline-none cursor-pointer"
         >
           {['Am', 'A', 'C', 'G', 'D', 'Dm', 'E', 'Em', 'F'].map(c => (
             <option key={c} value={c}>{c}</option>
           ))}
         </select>
      </div>

      {/* Measure Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleAddMeasure}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-sm font-semibold transition-colors border border-emerald-200/50"
         >
           <Plus size={18} /> Добавить
        </button>
        {measures.length > 1 && (
          <button
            onClick={handleRemoveMeasure}
            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl transition-colors border border-rose-200/50"
            title="Удалить текущий такт"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};