import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudioConfig } from '../../domain/entities';

interface AudioState {
  config: AudioConfig;
  isInitialized: boolean;
  isAudioContextSuspended: boolean;
  loadedSamples: Set<string>;
  preloadingChords: Set<string>;
}

const initialState: AudioState = {
  config: {
    bpm: 90,
    volume: 0.5
  },
  isInitialized: false,
  isAudioContextSuspended: false,
  loadedSamples: new Set(),
  preloadingChords: new Set(),
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    setAudioConfig: (state, action: PayloadAction<Partial<AudioConfig>>) => {
      state.config = { ...state.config, ...action.payload };
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.config.volume = action.payload;
    },
    initializeAudio: (state) => {
      state.isInitialized = true;
    },
    setAudioContextSuspended: (state, action: PayloadAction<boolean>) => {
      state.isAudioContextSuspended = action.payload;
    },
    addLoadedSample: (state, action: PayloadAction<string>) => {
      state.loadedSamples.add(action.payload);
    },
    addPreloadingChord: (state, action: PayloadAction<string>) => {
      state.preloadingChords.add(action.payload);
    },
    removePreloadingChord: (state, action: PayloadAction<string>) => {
      state.preloadingChords.delete(action.payload);
    },
    resetAudioState: (state) => {
      state.loadedSamples.clear();
      state.preloadingChords.clear();
    }
  }
});

export const {
  setAudioConfig,
  setVolume,
  initializeAudio,
  setAudioContextSuspended,
  addLoadedSample,
  addPreloadingChord,
  removePreloadingChord,
  resetAudioState
} = audioSlice.actions;

export default audioSlice.reducer;