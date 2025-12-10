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
      <div className="visualizer-container flex justify-center w-full">
        <div className="strum-container relative flex gap-3 md:gap-4 bg-white p-8 pt-12 pb-10 rounded-3xl border border-slate-200 shadow-sm items-center justify-center overflow-hidden">
          
          {/* Measure Chord Label Background */}
          <div className="absolute top-4 left-6 text-slate-100 font-black text-8xl pointer-events-none select-none z-0">
            {currentChord}
          </div>

          <div className="relative z-10 flex gap-3 md:gap-4">
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
      </div>
      
      <div className="flex flex-col items-center gap-2 mt-6">
        <p className="text-center text-slate-400 flex items-center justify-center gap-2 text-sm">
          <Info size={16} />
          <span className="hidden md:inline font-medium">Подсказка:</span> Нажмите на стрелку для переключения: Удар → Приглушение → Пропуск
        </p>
        {hasUnsavedChanges && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium border border-amber-100">
            Есть несохраненные изменения
          </span>
        )}
      </div>
    </div>
  );
};