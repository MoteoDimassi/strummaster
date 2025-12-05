import { Note, NoteName, ScaleType } from './types';

export const NOTE_NAMES_SHARP: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTE_NAMES_FLAT: NoteName[] =  ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export const OCTAVE_LABELS: Record<number, string> = {
  2: 'Great',
  3: 'Small',
  4: '1st',
  5: '2nd'
};

export const SCALE_INTERVALS: Record<ScaleType, number[]> = {
  'Major': [0, 2, 4, 5, 7, 9, 11],
  'Minor': [0, 2, 3, 5, 7, 8, 10] // Natural minor
};

export const getNoteFromMidi = (midi: number, useFlats: boolean = false): Note => {
  const nameIndex = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  const name = useFlats ? NOTE_NAMES_FLAT[nameIndex] : NOTE_NAMES_SHARP[nameIndex];
  
  // Calculate frequency: f = 440 * 2^((d-69)/12)
  const frequency = 440 * Math.pow(2, (midi - 69) / 12);
  
  return { name, octave, frequency, midi };
};

const getRootIndex = (root: NoteName): number => {
  let idx = NOTE_NAMES_SHARP.indexOf(root);
  if (idx === -1) idx = NOTE_NAMES_FLAT.indexOf(root);
  return idx;
};

export const generateScale = (root: NoteName, type: ScaleType, selectedOctaves: number[], rangeLimit: number = 7): Note[] => {
  const flatKeysMajor = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];
  const flatKeysMinor = ['D', 'G', 'C', 'F', 'Bb', 'Eb'];
  
  const useFlats = (type === 'Major' && flatKeysMajor.includes(root)) ||
                   (type === 'Minor' && flatKeysMinor.includes(root));

  const rootIndex = getRootIndex(root);
  const intervals = SCALE_INTERVALS[type];
  const notes: Note[] = [];

  // Sort octaves to ensure correct order
  const sortedOctaves = [...selectedOctaves].sort((a, b) => a - b);

  sortedOctaves.forEach(octave => {
    // Standard MIDI octave numbering: C4 is 60. 
    const octaveBaseMidi = (octave + 1) * 12; 
    const rootMidi = octaveBaseMidi + rootIndex;

    intervals.forEach(interval => {
        notes.push(getNoteFromMidi(rootMidi + interval, useFlats));
    });
  });

  const sortedNotes = notes.sort((a, b) => a.midi - b.midi);

  // Filter by rangeLimit (number of notes from the scale starting from tonic)
  // 1. Identify distinct pitch classes starting from the root of the lowest octave.
  // Since sortedNotes is sorted by MIDI, and the lowest note generated is the root of the lowest octave,
  // the order of pitch classes encountered will start with the Tonic.
  const uniquePitchClasses = Array.from(new Set(sortedNotes.map(n => n.midi % 12)));
  const allowedPitchClasses = uniquePitchClasses.slice(0, rangeLimit);
  
  return sortedNotes.filter(n => allowedPitchClasses.includes(n.midi % 12));
};

export const generateMelody = (scale: Note[], length: number, difficulty: number): Note[] => {
  if (scale.length === 0) return [];
  
  // The scale is already filtered by generateScale to contain only the allowed notes.
  const pool = scale;

  // 2. Define Max Interval based on Difficulty
  // Level 1: 2 semitones
  // Level 2: 4 semitones
  // Level 3: 7 semitones
  // Level 4: 9 semitones
  // Level 5: 12 semitones
  const maxIntervalMap: Record<number, number> = {
      1: 2,
      2: 4,
      3: 7,
      4: 9,
      5: 12
  };
  const maxInterval = maxIntervalMap[difficulty] || 12;

  const melody: Note[] = [];
  
  // First note is random from the pool
  melody.push(pool[Math.floor(Math.random() * pool.length)]);
  
  // Subsequent notes
  for (let i = 1; i < length; i++) {
      const prevNote = melody[i - 1];
      
      // Filter candidates that are within the allowed interval distance
      const candidates = pool.filter(n => {
          const interval = Math.abs(n.midi - prevNote.midi);
          return interval <= maxInterval; 
      });

      if (candidates.length > 0) {
          const nextNote = candidates[Math.floor(Math.random() * candidates.length)];
          melody.push(nextNote);
      } else {
          // Fallback if no notes within range
          melody.push(pool[Math.floor(Math.random() * pool.length)]);
      }
  }

  return melody;
};