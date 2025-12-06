'use client';

import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { 
  startTuner, 
  stopTuner, 
  updateTunerResult,
  setTunerError,
  setTunerMode,
  TunerMode
} from '../../store/slices/tunerSlice';
import { tunerService } from '../../features/tuner/services/TunerService';
import { TunerDisplay } from '../../features/tuner/components/TunerDisplay';
import { TunerControls } from '../../features/tuner/components/TunerControls';

export default function TunerPage() {
  const dispatch = useAppDispatch();
  const { isRunning, mode, error, currentNote, currentFrequency, currentDetune, pointerPosition, isInTune } = useAppSelector(state => state.tuner);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (isRunning) {
        stopTunerService();
      }
    };
  }, [isRunning]);

  const startTunerService = async () => {
    try {
      await tunerService.start();
      dispatch(startTuner());
      
      tunerService.startContinuousAnalysis((result) => {
        if (result) {
          dispatch(updateTunerResult(result));
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start tuner';
      dispatch(setTunerError(errorMessage));
    }
  };

  const stopTunerService = () => {
    tunerService.stop();
    dispatch(stopTuner());
  };

  const handleModeChange = (newMode: TunerMode) => {
    dispatch(setTunerMode(newMode));
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/95 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Guitar Tuner</h1>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <TunerControls 
          isRunning={isRunning}
          mode={mode}
          onToggle={isRunning ? stopTunerService : startTunerService}
          onModeChange={handleModeChange}
        />

        <TunerDisplay
          currentNote={currentNote}
          currentFrequency={currentFrequency}
          currentDetune={currentDetune}
          pointerPosition={pointerPosition}
          isInTune={isInTune}
        />
      </div>
    </div>
  );
}