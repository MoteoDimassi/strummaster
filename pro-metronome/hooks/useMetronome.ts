import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setPlaying } from '../store/metronomeSlice';
import { audioEngine } from '../services/AudioEngine';

export const useMetronome = () => {
  const dispatch = useDispatch();
  const metronomeState = useSelector((state: RootState) => state.metronome);
  const [activeBeat, setActiveBeat] = useState<number>(-1);

  // Sync React State with Audio Engine
  useEffect(() => {
    audioEngine.updateSettings({
      bpm: metronomeState.bpm,
      beatsPerBar: metronomeState.beatsPerBar,
      subdivision: metronomeState.subdivision,
      accentFirstBeat: metronomeState.accentFirstBeat,
      volume: metronomeState.volume,
      soundType: metronomeState.soundType
    });
  }, [
    metronomeState.bpm, 
    metronomeState.beatsPerBar, 
    metronomeState.subdivision,
    metronomeState.accentFirstBeat, 
    metronomeState.volume,
    metronomeState.soundType
  ]);

  // Handle Play/Stop
  useEffect(() => {
    if (metronomeState.isPlaying) {
      audioEngine.start();
    } else {
      audioEngine.stop();
      setActiveBeat(-1); // Reset visualization
    }
  }, [metronomeState.isPlaying]);

  // Setup Visual Callback
  useEffect(() => {
    audioEngine.setCallback((beat, isAccent) => {
        // We use a functional update to ensure we aren't capturing stale state,
        // although here we are just setting a number.
        // This runs at high frequency.
        setActiveBeat(beat);
    });

    return () => {
        audioEngine.setCallback(() => {});
    };
  }, []);

  return { activeBeat };
};
