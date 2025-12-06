import React, { useEffect } from 'react';
import { MeasureNavigation } from '../features/player/components/MeasureNavigation';
import { PatternControls } from '../features/player/components/PatternControls';
import { StrumPattern } from '../features/player/components/StrumPattern';
import { PlayerControls } from '../features/player/components/PlayerControls';
import { useAppDispatch } from '../store/hooks';
import { setCurrentDisplayStepIdx } from '../store/slices/playerSlice';
import { audioEventBus } from '../shared/utils/AudioEventBus';

export const HomePage: React.FC = () => {
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
    <>
      {/* Measure Navigation & Info */}
      <MeasureNavigation />

      {/* Pattern Controls */}
      <PatternControls />
      
      {/* Visualizer Area */}
      <StrumPattern />

      {/* Controls */}
      <PlayerControls />
    </>
  );
};