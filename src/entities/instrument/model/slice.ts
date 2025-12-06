import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InstrumentState {
  bpm: number;
  isPlaying: boolean;
  currentDisplayStepIdx: number | null;
}

const initialState: InstrumentState = {
  bpm: 90,
  isPlaying: false,
  currentDisplayStepIdx: null,
};

export const instrumentSlice = createSlice({
  name: 'instrument',
  initialState,
  reducers: {
    setBpm: (state, action: PayloadAction<number>) => {
      state.bpm = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setCurrentDisplayStepIdx: (state, action: PayloadAction<number | null>) => {
      state.currentDisplayStepIdx = action.payload;
    },
    reset: (state) => {
      state.isPlaying = false;
      state.currentDisplayStepIdx = null;
    }
  }
});

export const {
  setBpm,
  setIsPlaying,
  setCurrentDisplayStepIdx,
  reset
} = instrumentSlice.actions;

export default instrumentSlice.reducer;