import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MetronomeState, SoundType, Rhythm } from '../../features/metronome/types';

const initialState: MetronomeState = {
  isPlaying: false,
  bpm: 120,
  beatsPerBar: 4,
  subdivision: Rhythm.Quarter,
  accentFirstBeat: true,
  soundType: SoundType.Click,
  volume: 0.8,
};

const metronomeSlice = createSlice({
  name: 'metronome',
  initialState,
  reducers: {
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setBpm: (state, action: PayloadAction<number>) => {
      state.bpm = Math.max(20, Math.min(300, action.payload));
    },
    incrementBpm: (state, action: PayloadAction<number>) => {
      state.bpm = Math.max(20, Math.min(300, state.bpm + action.payload));
    },
    setBeatsPerBar: (state, action: PayloadAction<number>) => {
      state.beatsPerBar = Math.max(1, Math.min(16, action.payload));
    },
    setSubdivision: (state, action: PayloadAction<Rhythm>) => {
      state.subdivision = action.payload;
    },
    toggleAccent: (state) => {
      state.accentFirstBeat = !state.accentFirstBeat;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload));
    },
    setSoundType: (state, action: PayloadAction<SoundType>) => {
      state.soundType = action.payload;
    },
  },
});

export const {
  togglePlay,
  setPlaying,
  setBpm,
  incrementBpm,
  setBeatsPerBar,
  setSubdivision,
  toggleAccent,
  setVolume,
  setSoundType
} = metronomeSlice.actions;

export default metronomeSlice.reducer;