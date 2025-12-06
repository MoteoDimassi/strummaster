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
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Тренировщик ритма
        </h1>
        <p className="text-slate-300 text-lg">
          Практикуйте игру на гитаре с различными ритмическими паттернами
        </p>
      </div>
      
      {/* Measure Navigation & Info */}
      <MeasureNavigation />

      {/* Pattern Controls */}
      <PatternControls />
      
      {/* Visualizer Area */}
      <StrumPattern />

      {/* Controls */}
      <PlayerControls />
    </div>
  );
};