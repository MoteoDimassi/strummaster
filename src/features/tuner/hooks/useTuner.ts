import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  startTuner, 
  stopTuner, 
  setTunerMode, 
  updateTunerResult, 
  setTunerError,
  TunerMode 
} from '../../../store/slices/tunerSlice';
import { tunerService } from '../services/TunerService';

export const useTuner = () => {
  const dispatch = useAppDispatch();
  const { isRunning, mode, error, isOpen } = useAppSelector(state => state.tuner);

  const start = useCallback(async () => {
    try {
      await tunerService.start();
      dispatch(startTuner());
      
      tunerService.startContinuousAnalysis((result) => {
        if (result) {
          dispatch(updateTunerResult(result));
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось запустить тюнер';
      dispatch(setTunerError(errorMessage));
    }
  }, [dispatch]);

  const stop = useCallback(() => {
    tunerService.stop();
    dispatch(stopTuner());
  }, [dispatch]);

  const toggle = useCallback(() => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  }, [isRunning, start, stop]);

  const changeMode = useCallback((newMode: TunerMode) => {
    dispatch(setTunerMode(newMode));
    tunerService.setMode(newMode);
  }, [dispatch]);

  return {
    isRunning,
    mode,
    error,
    isOpen,
    start,
    stop,
    toggle,
    changeMode
  };
};