import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Measure, StrumStep } from '../../domain/entities';

interface PlayerState {
  bpm: number;
  isPlaying: boolean;
  measures: Measure[];
  activeMeasureIdx: number;
  currentDisplayStepIdx: number | null;
  globalStrumPattern: StrumStep[];
  hasUnsavedChanges: boolean;
}

const generateSteps = (count: number, chord: string = 'Am'): StrumStep[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `step-${Date.now()}-${i}`,
    direction: i % 2 === 0 ? 'down' : 'up',
    strumType: (i === 0 || i === 2 || i === 4 || i === 6) ? 'strum' : 'ghost',
    chord: chord,
    lyrics: ''
  }));
};

const createMeasure = (id: number, chord: string = 'Am'): Measure => ({
  id: `measure-${Date.now()}-${id}`,
  steps: generateSteps(8, chord)
});

const initialState: PlayerState = {
  bpm: 90,
  isPlaying: false,
  measures: [createMeasure(0, 'Am')],
  activeMeasureIdx: 0,
  currentDisplayStepIdx: null,
  globalStrumPattern: [],
  hasUnsavedChanges: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setBpm: (state, action: PayloadAction<number>) => {
      state.bpm = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setActiveMeasureIdx: (state, action: PayloadAction<number>) => {
      state.activeMeasureIdx = action.payload;
    },
    setCurrentDisplayStepIdx: (state, action: PayloadAction<number | null>) => {
      state.currentDisplayStepIdx = action.payload;
    },
    addMeasure: (state) => {
      const currentMeasure = state.measures[state.activeMeasureIdx];
      const newMeasure: Measure = {
        id: `measure-${Date.now()}-${state.measures.length}`,
        steps: currentMeasure.steps.map(step => ({
          ...step,
          id: `step-${Date.now()}-${Math.random()}`
        }))
      };
      
      state.measures.splice(state.activeMeasureIdx + 1, 0, newMeasure);
      state.activeMeasureIdx += 1;
    },
    removeMeasure: (state) => {
      if (state.measures.length <= 1) return;
      
      state.measures = state.measures.filter((_, i) => i !== state.activeMeasureIdx);
      state.activeMeasureIdx = Math.max(0, state.activeMeasureIdx - 1);
    },
    updateChordForMeasure: (state, action: PayloadAction<string>) => {
      const chord = action.payload;
      state.measures = state.measures.map((m, i) => {
        if (i === state.activeMeasureIdx) {
          return {
            ...m,
            steps: m.steps.map(s => ({ ...s, chord }))
          };
        }
        return m;
      });
    },
    updateStep: (state, action: PayloadAction<{measureIdx: number, stepIdx: number, updates: Partial<StrumStep>}>) => {
      const { measureIdx, stepIdx, updates } = action.payload;
      state.measures = state.measures.map((m, i) => {
        if (i === measureIdx) {
          const newSteps = [...m.steps];
          newSteps[stepIdx] = { ...newSteps[stepIdx], ...updates };
          return { ...m, steps: newSteps };
        }
        return m;
      });
      
      if (measureIdx === state.activeMeasureIdx) {
        state.hasUnsavedChanges = true;
      }
    },
    applyToAllMeasures: (state) => {
      const currentMeasure = state.measures[state.activeMeasureIdx];
      if (!currentMeasure) return;
      
      state.globalStrumPattern = [...currentMeasure.steps];
      
      state.measures = state.measures.map(m => {
        const currentChord = m.steps[0]?.chord || 'Am';
        let newSteps = [];
        
        if (currentMeasure.steps.length > m.steps.length) {
          newSteps = [...m.steps];
          const stepsToAdd = currentMeasure.steps.length - m.steps.length;
          for (let i = 0; i < stepsToAdd; i++) {
            newSteps.push({
              id: `step-added-${Date.now()}-${i}`,
              direction: (m.steps.length + i) % 2 === 0 ? 'down' : 'up',
              strumType: 'ghost',
              chord: currentChord,
              lyrics: ''
            });
          }
        } else {
          newSteps = m.steps.slice(0, currentMeasure.steps.length);
        }
        
        newSteps = newSteps.map((step, idx) => ({
          ...step,
          strumType: currentMeasure.steps[idx].strumType
        }));
        
        return {
          ...m,
          steps: newSteps
        };
      });
      
      state.hasUnsavedChanges = false;
    },
    saveOnlyInThisMeasure: (state) => {
      state.hasUnsavedChanges = false;
    },
    changeStepCount: (state, action: PayloadAction<number>) => {
      const delta = action.payload;
      state.measures = state.measures.map((m, i) => {
        if (i === state.activeMeasureIdx) {
          const currentLen = m.steps.length;
          const newLen = Math.max(4, Math.min(16, currentLen + delta));
          const currentChord = m.steps[0]?.chord || 'Am';
          
          if (newLen === currentLen) return m;
          
          let newSteps = [...m.steps];
          if (newLen > currentLen) {
            const added = Array.from({ length: newLen - currentLen }, (_, k) => ({
              id: `step-added-${Date.now()}-${k}`,
              direction: ((currentLen + k) % 2 === 0 ? 'down' : 'up') as 'down' | 'up',
              strumType: 'ghost' as const,
              chord: currentChord,
              lyrics: ''
            }));
            newSteps = [...newSteps, ...added];
          } else {
            newSteps = newSteps.slice(0, newLen);
          }
          
          state.hasUnsavedChanges = true;
          
          return { ...m, steps: newSteps };
        }
        return m;
      });
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
  setActiveMeasureIdx,
  setCurrentDisplayStepIdx,
  addMeasure,
  removeMeasure,
  updateChordForMeasure,
  updateStep,
  applyToAllMeasures,
  saveOnlyInThisMeasure,
  changeStepCount,
  reset
} = playerSlice.actions;

export default playerSlice.reducer;
