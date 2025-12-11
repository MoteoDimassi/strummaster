export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export interface ChordDefinition {
  name: string;
  intervals: number[]; // Intervals in semitones from root
  suffix: string;
}

export const CHORD_TYPES: ChordDefinition[] = [
  // Triads
  { name: 'Major', intervals: [0, 4, 7], suffix: '' },
  { name: 'Minor', intervals: [0, 3, 7], suffix: 'm' },
  { name: 'Diminished', intervals: [0, 3, 6], suffix: 'dim' },
  { name: 'Augmented', intervals: [0, 4, 8], suffix: 'aug' },
  { name: 'Sus2', intervals: [0, 2, 7], suffix: 'sus2' },
  { name: 'Sus4', intervals: [0, 5, 7], suffix: 'sus4' },
  
  // 7th Chords
  { name: 'Major 7', intervals: [0, 4, 7, 11], suffix: 'maj7' },
  { name: 'Minor 7', intervals: [0, 3, 7, 10], suffix: 'm7' },
  { name: 'Dominant 7', intervals: [0, 4, 7, 10], suffix: '7' },
  
  // 6th Chords
  { name: 'Major 6', intervals: [0, 4, 7, 9], suffix: '6' },
  { name: 'Minor 6', intervals: [0, 3, 7, 9], suffix: 'm6' },

  // 9th Chords (Extended intervals for voicing)
  { name: 'Major 9', intervals: [0, 4, 7, 11, 14], suffix: 'maj9' },
  { name: 'Minor 9', intervals: [0, 3, 7, 10, 14], suffix: 'm9' },
  { name: 'Dominant 9', intervals: [0, 4, 7, 10, 14], suffix: '9' },
  { name: 'Add 9', intervals: [0, 4, 7, 14], suffix: 'add9' },

  // 11th Chords
  { name: 'Minor 11', intervals: [0, 3, 7, 10, 14, 17], suffix: 'm11' },
];

// Helper to convert MIDI number to Note Name (e.g., 60 -> C4)
export const midiToNoteName = (midi: number): string => {
  const noteIndex = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
};

// Helper to get frequency from MIDI
export const midiToFreq = (midi: number): number => {
  return 440 * Math.pow(2, (midi - 69) / 12);
};

// Piano Configuration
export const PIANO_START_OCTAVE = 3;
export const PIANO_OCTAVES_COUNT = 3;
export const MIN_MIDI_NOTE = PIANO_START_OCTAVE * 12 + 12; // C3 = 48
export const MAX_MIDI_NOTE = MIN_MIDI_NOTE + (PIANO_OCTAVES_COUNT * 12) - 1; // B5 = 83