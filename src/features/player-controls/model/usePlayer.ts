import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setIsPlaying, setCurrentDisplayStepIdx } from '../../../entities/instrument/model/slice';
import { useAudioContext } from '../../../shared/lib/audio/useAudioContext';
import { StrumDirection, StrumType } from '../../../domain/entities';

export const usePlayer = () => {
  const dispatch = useDispatch();
  const { bpm, isPlaying } = useSelector((state: RootState) => state.instrument);
  const { measures, activeMeasureIdx } = useSelector((state: RootState) => state.measure);
  const { audioEngine, isReady } = useAudioContext();
  
  const schedulerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const currentStepIndexRef = useRef<number>(0);
  const currentMeasureIndexRef = useRef<number>(0);

  const scheduleNextStep = useCallback(() => {
    const secondsPerBeat = 60.0 / bpm;
    // Assuming 4/4 time signature and 8th notes (0.5 beat)
    // Adjust this logic based on your actual step duration requirements
    const stepDuration = secondsPerBeat * 0.5; 
    
    nextNoteTimeRef.current += stepDuration;
    
    currentStepIndexRef.current++;
    
    const currentMeasure = measures[currentMeasureIndexRef.current];
    if (currentStepIndexRef.current >= currentMeasure.steps.length) {
      currentStepIndexRef.current = 0;
      // Loop current measure for now, or move to next
      // currentMeasureIndexRef.current = (currentMeasureIndexRef.current + 1) % measures.length;
    }
  }, [bpm, measures]);

  const playStep = useCallback((time: number) => {
    const currentMeasure = measures[currentMeasureIndexRef.current];
    const step = currentMeasure.steps[currentStepIndexRef.current];
    
    if (step.strumType !== 'ghost') {
      audioEngine.strum(
        step.direction as StrumDirection,
        step.chord,
        step.strumType as StrumType,
        time
      );
    }
    
    // Update UI
    // We use a timeout to sync UI update with audio time roughly
    // Ideally we'd use a more precise method or requestAnimationFrame
    const timeToPlay = (time - audioEngine.currentTime) * 1000;
    setTimeout(() => {
      dispatch(setCurrentDisplayStepIdx(currentStepIndexRef.current));
    }, Math.max(0, timeToPlay));
    
  }, [audioEngine, measures, dispatch]);

  const scheduler = useCallback(() => {
    // Lookahead time (e.g. 0.1s)
    const lookahead = 0.1;
    const scheduleAheadTime = 0.1;
    
    if (!audioEngine.isAudioInitialized()) return;

    while (nextNoteTimeRef.current < audioEngine.currentTime + scheduleAheadTime) {
      playStep(nextNoteTimeRef.current);
      scheduleNextStep();
    }
    
    schedulerTimerRef.current = setTimeout(scheduler, lookahead * 1000);
  }, [audioEngine, playStep, scheduleNextStep]);

  const start = useCallback(async () => {
    if (!isReady) return;
    
    await audioEngine.resume();
    
    if (isPlaying) return;
    
    // Reset state
    currentStepIndexRef.current = 0;
    currentMeasureIndexRef.current = activeMeasureIdx;
    nextNoteTimeRef.current = audioEngine.currentTime + 0.1; // Start slightly in future
    
    dispatch(setIsPlaying(true));
    scheduler();
  }, [isReady, isPlaying, activeMeasureIdx, audioEngine, dispatch, scheduler]);

  const stop = useCallback(() => {
    if (schedulerTimerRef.current) {
      clearTimeout(schedulerTimerRef.current);
      schedulerTimerRef.current = null;
    }
    
    dispatch(setIsPlaying(false));
    dispatch(setCurrentDisplayStepIdx(null));
    audioEngine.stopAllSounds();
  }, [dispatch, audioEngine]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (schedulerTimerRef.current) {
        clearTimeout(schedulerTimerRef.current);
      }
    };
  }, []);

  // Watch for isPlaying changes from external sources (if any)
  useEffect(() => {
    if (!isPlaying && schedulerTimerRef.current) {
      stop();
    }
  }, [isPlaying, stop]);

  return {
    isPlaying,
    togglePlay,
    start,
    stop
  };
};