import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CHORD_TYPES } from '../../features/chord-trainer/utils/musicTheory';
import { generateChordMidi } from '../../features/chord-trainer/utils/chordLogic';

interface ChordTrainerState {
  // Settings
  rootNoteIndex: number; // 0 = C, 1 = C#, etc.
  selectedChordIndices: number[]; // Indices mapping to CHORD_TYPES
  
  // Session
  score: number;
  taskSolved: boolean; // Tracks if the current task has been solved to prevent double points

  currentTask: {
    rootMidi: number;
    chordTypeIndex: number;
    notes: number[];
  } | null;
  
  // User Input
  activeNotes: number[]; // MIDI numbers currently held/selected by user
  detectedChordName: string;
}

const initialState: ChordTrainerState = {
  rootNoteIndex: 0, // Default C
  selectedChordIndices: [0, 1], // Default Major, Minor
  score: 0,
  taskSolved: false,
  currentTask: null,
  activeNotes: [],
  detectedChordName: '',
};

const chordTrainerSlice = createSlice({
  name: 'chordTrainer',
  initialState,
  reducers: {
    setRootNoteIndex: (state, action: PayloadAction<number>) => {
      state.rootNoteIndex = action.payload;
    },
    toggleChordTypeSelection: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (state.selectedChordIndices.includes(index)) {
        // Prevent deselecting if it's the last one
        if (state.selectedChordIndices.length > 1) {
          state.selectedChordIndices = state.selectedChordIndices.filter(i => i !== index);
        }
      } else {
        state.selectedChordIndices.push(index);
      }
    },
    generateTask: (state) => {
      // Logic to pick a random chord from selected types
      // Root note is fixed by settings, but octave can vary around middle C (60)
      // For this trainer, let's keep the bass note within 48 (C3) to 60 (C4)
      
      const octaveOffset = 48 + Math.floor(Math.random() * 2) * 12; // C3 or C4 base
      const rootMidi = octaveOffset + state.rootNoteIndex;
      
      const randomTypeIndex = state.selectedChordIndices[Math.floor(Math.random() * state.selectedChordIndices.length)];
      const chordType = CHORD_TYPES[randomTypeIndex];
      
      const notes = generateChordMidi(rootMidi, chordType);
      
      state.currentTask = {
        rootMidi,
        chordTypeIndex: randomTypeIndex,
        notes,
      };
      // Clear user input on new task
      state.activeNotes = [];
      state.detectedChordName = '';
      state.taskSolved = false; // Reset solved status for new task
    },
    toggleNote: (state, action: PayloadAction<number>) => {
      const midi = action.payload;
      if (state.activeNotes.includes(midi)) {
        state.activeNotes = state.activeNotes.filter(n => n !== midi);
      } else {
        state.activeNotes.push(midi);
      }
    },
    setDetectedChordName: (state, action: PayloadAction<string>) => {
      state.detectedChordName = action.payload;
    },
    clearNotes: (state) => {
        state.activeNotes = [];
        state.detectedChordName = '';
    },
    markTaskSolved: (state) => {
        if (!state.taskSolved) {
            state.score += 1;
            state.taskSolved = true;
        }
    },
    resetScore: (state) => {
        state.score = 0;
        state.taskSolved = false;
    }
  },
});

export const { 
  setRootNoteIndex, 
  toggleChordTypeSelection, 
  generateTask, 
  toggleNote, 
  setDetectedChordName,
  clearNotes,
  markTaskSolved,
  resetScore
} = chordTrainerSlice.actions;

export default chordTrainerSlice.reducer;