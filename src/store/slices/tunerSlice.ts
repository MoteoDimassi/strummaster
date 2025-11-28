import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TunerResult } from '../../domain/entities';

export type TunerMode = 'chromatic' | 'guitar';

interface TunerState {
  isOpen: boolean;
  isRunning: boolean;
  currentNote: string;
  currentFrequency: number;
  currentDetune: number;
  pointerPosition: number;
  isInTune: boolean;
  mode: TunerMode;
  error: string | null;
}

const initialState: TunerState = {
  isOpen: false,
  isRunning: false,
  currentNote: "-",
  currentFrequency: 0,
  currentDetune: 0,
  pointerPosition: 50,
  isInTune: false,
  mode: 'chromatic',
  error: null,
};

const tunerSlice = createSlice({
  name: 'tuner',
  initialState,
  reducers: {
    openTuner: (state) => {
      state.isOpen = true;
      state.error = null;
    },
    closeTuner: (state) => {
      state.isOpen = false;
      state.isRunning = false;
    },
    setTunerMode: (state, action: PayloadAction<TunerMode>) => {
      state.mode = action.payload;
      // Reset UI when mode changes
      state.currentNote = "-";
      state.isInTune = false;
      state.currentFrequency = 0;
      state.currentDetune = 0;
      state.pointerPosition = 50;
    },
    startTuner: (state) => {
      state.isRunning = true;
      state.error = null;
    },
    stopTuner: (state) => {
      state.isRunning = false;
      // Reset UI when stopping
      state.currentNote = "-";
      state.isInTune = false;
      state.currentFrequency = 0;
      state.currentDetune = 0;
      state.pointerPosition = 50;
    },
    updateTunerResult: (state, action: PayloadAction<TunerResult>) => {
      const { note, frequency, cents, isInTune } = action.payload;
      
      state.currentNote = note;
      state.currentFrequency = frequency;
      state.currentDetune = cents;
      state.isInTune = isInTune;
      
      // Convert cents (-50 to +50) to percentage (0% to 100%)
      let percent = 50 + cents;
      
      // Clamp values
      if (percent < 0) percent = 0;
      if (percent > 100) percent = 100;
      
      state.pointerPosition = percent;
    },
    setTunerError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isRunning = false;
    },
    clearTunerError: (state) => {
      state.error = null;
    }
  }
});

export const {
  openTuner,
  closeTuner,
  setTunerMode,
  startTuner,
  stopTuner,
  updateTunerResult,
  setTunerError,
  clearTunerError
} = tunerSlice.actions;

export default tunerSlice.reducer;