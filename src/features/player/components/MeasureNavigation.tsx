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
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/50 p-4 rounded-xl border border-white/5">
      
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleMeasureChange(-1)}
          disabled={activeMeasureIdx === 0}
          className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center px-4 min-w-[100px]">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Такт</span>
          <span className="text-2xl font-mono font-bold text-white">
            {activeMeasureIdx + 1} <span className="text-slate-500 text-lg">/ {measures.length}</span>
          </span>
        </div>
        <button
          onClick={() => handleMeasureChange(1)}
          disabled={activeMeasureIdx === measures.length - 1}
          className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Chord Editor */}
      <div className="flex items-center gap-3">
         <label className="text-sm text-slate-400 font-medium">Аккорд:</label>
         <select
           value={currentChord}
           onChange={(e) => handleChordChange(e.target.value)}
           className="bg-slate-900 border border-slate-700 text-amber-400 font-bold text-lg rounded-lg px-3 py-1 focus:ring-2 focus:ring-amber-500 outline-none"
         >
           {['Am', 'A', 'C', 'G', 'D', 'Dm', 'E', 'Em', 'F'].map(c => (
             <option key={c} value={c}>{c}</option>
           ))}
         </select>
      </div>

      {/* Measure Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleAddMeasure}
          className="flex items-center gap-1 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 rounded-lg text-sm font-medium transition-colors border border-emerald-600/30"
         >
           <Plus size={16} /> Добавить такт
        </button>
        {measures.length > 1 && (
          <button
            onClick={handleRemoveMeasure}
            className="p-2 bg-rose-900/20 hover:bg-rose-900/40 text-rose-400 rounded-lg transition-colors border border-rose-900/30"
            title="Удалить текущий такт"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};