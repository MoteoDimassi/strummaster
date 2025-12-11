import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CHORD_TYPES, MIN_MIDI_NOTE, MAX_MIDI_NOTE } from '../../features/chord-trainer/utils/musicTheory';
import { generateChordMidi } from '../../features/chord-trainer/utils/chordLogic';

interface ChordTrainerState {
  // Settings
  rootNoteIndex: number; // 0 = C, 1 = C#, etc.
  isRandomRoot: boolean; // If true, rootNoteIndex is ignored for generation
  selectedOctaves: number[]; // Array of octaves (e.g., [3, 4])
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
  isRandomRoot: false,
  selectedOctaves: [3, 4], // Default octaves 3 and 4
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
      state.isRandomRoot = false; // Disable random if specific root selected
    },
    setRandomRoot: (state, action: PayloadAction<boolean>) => {
      state.isRandomRoot = action.payload;
    },
    toggleOctaveSelection: (state, action: PayloadAction<number>) => {
      const octave = action.payload;
      if (state.selectedOctaves.includes(octave)) {
        // Prevent deselecting if it's the last one
        if (state.selectedOctaves.length > 1) {
          state.selectedOctaves = state.selectedOctaves.filter(o => o !== octave);
        }
      } else {
        state.selectedOctaves.push(octave);
      }
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
      
      let validTaskFound = false;
      let attempts = 0;
      const MAX_ATTEMPTS = 50;

      while (!validTaskFound && attempts < MAX_ATTEMPTS) {
        attempts++;

        // Select random octave from enabled octaves
        const randomOctave = state.selectedOctaves[Math.floor(Math.random() * state.selectedOctaves.length)];
        const octaveOffset = (randomOctave + 1) * 12; // MIDI octave calculation (C3 is 48, so octave 3 -> 48)
        
        let currentRootIndex = state.rootNoteIndex;
        if (state.isRandomRoot) {
          currentRootIndex = Math.floor(Math.random() * 12);
        }

        const rootMidi = octaveOffset + currentRootIndex;
        
        const randomTypeIndex = state.selectedChordIndices[Math.floor(Math.random() * state.selectedChordIndices.length)];
        const chordType = CHORD_TYPES[randomTypeIndex];
        
        const notes = generateChordMidi(rootMidi, chordType);
        
        // Check if all notes are within the piano range
        const isWithinRange = notes.every(note => note >= MIN_MIDI_NOTE && note <= MAX_MIDI_NOTE);

        if (isWithinRange) {
            state.currentTask = {
                rootMidi,
                chordTypeIndex: randomTypeIndex,
                notes,
            };
            validTaskFound = true;
        }
      }

      if (!validTaskFound) {
          // Fallback if no valid chord found (should be rare with correct settings)
          // Just generate a simple C major in the lowest selected octave or default
          const fallbackOctave = state.selectedOctaves[0] || 3;
          const rootMidi = (fallbackOctave + 1) * 12; // C
          const chordType = CHORD_TYPES[0]; // Major
          const notes = generateChordMidi(rootMidi, chordType);
           state.currentTask = {
                rootMidi,
                chordTypeIndex: 0,
                notes,
            };
      }

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
  setRandomRoot,
  toggleOctaveSelection,
  toggleChordTypeSelection,
  generateTask,
  toggleNote,
  setDetectedChordName,
  clearNotes,
  markTaskSolved,
  resetScore
} = chordTrainerSlice.actions;

export default chordTrainerSlice.reducer;