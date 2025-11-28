import React from 'react';
import { Info } from 'lucide-react';
import { StrumNode } from '../../../shared/components/StrumNode';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { updateStep } from '../../../store/slices/playerSlice';

export const StrumPattern: React.FC = () => {
  const dispatch = useAppDispatch();
  const { measures, activeMeasureIdx, currentDisplayStepIdx, hasUnsavedChanges } = useAppSelector(state => state.player);
  
  const activeMeasure = measures[activeMeasureIdx];
  const currentChord = activeMeasure?.steps[0]?.chord || 'Am';

  const handleStepClick = (stepIdx: number) => {
    const step = activeMeasure.steps[stepIdx];
    // Cycle: ghost -> strum -> mute -> ghost
    const nextType = step.strumType === 'ghost' ? 'strum'
      : step.strumType === 'strum' ? 'mute'
      : 'ghost';
    
    dispatch(updateStep({ 
      measureIdx: activeMeasureIdx, 
      stepIdx, 
      updates: { strumType: nextType } 
    }));
  };

  const handleLyricsChange = (stepIdx: number, text: string) => {
    dispatch(updateStep({ 
      measureIdx: activeMeasureIdx, 
      stepIdx, 
      updates: { lyrics: text } 
    }));
  };

  if (!activeMeasure) return null;

  return (
    <div className="w-full pb-6 pt-2">
      <div className="visualizer-container flex justify-center w-full px-4">
        <div className="strum-container relative flex gap-4 md:gap-6 bg-slate-950/40 p-8 pt-10 rounded-3xl border border-white/5 shadow-2xl items-center justify-center">
          
          {/* Measure Chord Label Background */}
          <div className="absolute top-3 left-4 text-slate-700 font-black text-6xl opacity-10 pointer-events-none select-none">
            {currentChord}
          </div>

          {activeMeasure.steps.map((step, index) => (
            <StrumNode
              key={step.id}
              step={step}
              isActive={currentDisplayStepIdx === index}
              onClick={() => handleStepClick(index)}
              onLyricsChange={(text) => handleLyricsChange(index, text)}
            />
          ))}
        </div>
      </div>
      
      <p className="text-center text-slate-500 mt-6 flex items-center justify-center gap-2 text-sm">
        <Info size={16} />
        <span className="hidden md:inline">Edit mode:</span> Tap arrow to cycle: Strum → Mute → Ghost. Type below arrow for lyrics.
        {hasUnsavedChanges && (
          <span className="ml-2 text-amber-400 font-medium">Есть несохраненные изменения в такте!</span>
        )}
      </p>
    </div>
  );
};