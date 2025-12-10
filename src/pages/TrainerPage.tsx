import React, { useEffect } from 'react';
import { MeasureNavigation } from '../features/player/components/MeasureNavigation';
import { PatternControls } from '../features/player/components/PatternControls';
import { StrumPattern } from '../features/player/components/StrumPattern';
import { PlayerControls } from '../features/player/components/PlayerControls';
import { useAppDispatch } from '../store/hooks';
import { setCurrentDisplayStepIdx } from '../store/slices/playerSlice';
import { audioEventBus } from '../shared/utils/AudioEventBus';

export const TrainerPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // Subscribe to audio events for visual feedback
  useEffect(() => {
    const unsubscribeStep = audioEventBus.subscribe('step', (event) => {
      if (event.data && typeof event.data.stepIdx === 'number') {
        dispatch(setCurrentDisplayStepIdx(event.data.stepIdx));
      }
    });

    const unsubscribeStop = audioEventBus.subscribe('stop', () => {
      dispatch(setCurrentDisplayStepIdx(null));
    });

    return () => {
      unsubscribeStep();
      unsubscribeStop();
    };
  }, [dispatch]);

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 px-4">
      <div className="text-center mb-10 mt-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          Тренировщик ритма
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Практикуйте игру на гитаре с различными ритмическими паттернами, создавайте свои ритмы и развивайте чувство времени
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Measure Navigation & Info */}
        <MeasureNavigation />

        {/* Pattern Controls */}
        <PatternControls />
        
        {/* Visualizer Area */}
        <StrumPattern />

        {/* Controls */}
        <PlayerControls />
      </div>
    </div>
  );
};