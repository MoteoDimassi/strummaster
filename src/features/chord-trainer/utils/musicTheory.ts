export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export interface ChordDefinition {
  name: string;
  intervals: number[]; // Intervals in semitones from root
  suffix: string;
}

export const CHORD_TYPES: ChordDefinition[] = [
  // Трезвучия
  { name: 'Мажор', intervals: [0, 4, 7], suffix: '' },
  { name: 'Минор', intervals: [0, 3, 7], suffix: 'm' },
  { name: 'Уменьшенный', intervals: [0, 3, 6], suffix: 'dim' },
  { name: 'Увеличенный', intervals: [0, 4, 8], suffix: 'aug' },
  { name: 'Sus2', intervals: [0, 2, 7], suffix: 'sus2' },
  { name: 'Sus4', intervals: [0, 5, 7], suffix: 'sus4' },
  
  // Септаккорды
  { name: 'Мажорный септ', intervals: [0, 4, 7, 11], suffix: 'maj7' },
  { name: 'Минорный септ', intervals: [0, 3, 7, 10], suffix: 'm7' },
  { name: 'Доминантсепт', intervals: [0, 4, 7, 10], suffix: '7' },
  
  // Секстаккорды
  { name: 'Мажорный секст', intervals: [0, 4, 7, 9], suffix: '6' },
  { name: 'Минорный секст', intervals: [0, 3, 7, 9], suffix: 'm6' },

  // Нонаккорды (расширенные интервалы для голосоведения)
  { name: 'Мажорный нон', intervals: [0, 4, 7, 11, 14], suffix: 'maj9' },
  { name: 'Минорный нон', intervals: [0, 3, 7, 10, 14], suffix: 'm9' },
  { name: 'Доминантнон', intervals: [0, 4, 7, 10, 14], suffix: '9' },
  { name: 'Добавленный нон', intervals: [0, 4, 7, 14], suffix: 'add9' },

  // Ундецимаккорды
  { name: 'Минорный ундецим', intervals: [0, 3, 7, 10, 14, 17], suffix: 'm11' },
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