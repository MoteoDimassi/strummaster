import { CHORD_TYPES, NOTE_NAMES, ChordDefinition } from './musicTheory';

/**
 * Pure logic module for chord operations.
 * Decoupled from React and Redux.
 */

export interface IdentifiedChord {
  root: string;
  quality: string;
  name: string;
  exactMatch: boolean;
}

// Generate MIDI notes for a chord
export const generateChordMidi = (rootMidi: number, chordType: ChordDefinition): number[] => {
  return chordType.intervals.map(interval => rootMidi + interval);
};

// Analyze a set of MIDI notes and return possible chord names
export const identifyChordFromMidi = (midiNotes: number[]): IdentifiedChord | null => {
  if (midiNotes.length < 3) return null;

  // Sort notes to handle inversions or random order input
  const sortedNotes = [...midiNotes].sort((a, b) => a - b);
  
  // Normalize to 0-11 range (pitch classes) ensuring uniqueness
  const pitchClasses = [...new Set(sortedNotes.map(n => n % 12))].sort((a, b) => a - b);
  
  // Brute force check: treat each note as a potential root
  for (let i = 0; i < pitchClasses.length; i++) {
    const potentialRoot = pitchClasses[i];
    
    // Calculate intervals relative to this potential root
    const currentIntervals = pitchClasses.map(pc => {
      let interval = pc - potentialRoot;
      if (interval < 0) interval += 12;
      return interval;
    }).sort((a, b) => a - b);

    // Compare against known chord types
    for (const type of CHORD_TYPES) {
        // Normalize chord definition intervals to mod 12 (pitch classes) for comparison
        // This allows definitions like [0, 4, 7, 14] (Add9) to match user input [C, E, G, D]
        const typeIntervalsNormalized = [...new Set(type.intervals.map(iv => iv % 12))].sort((a, b) => a - b);

        if (arraysEqual(currentIntervals, typeIntervalsNormalized)) {
            const rootName = NOTE_NAMES[potentialRoot];
            return {
            root: rootName,
            quality: type.name,
            name: `${rootName}${type.suffix}`,
            exactMatch: true
            };
        }
    }
  }

  return {
    root: '?',
    quality: 'Unknown',
    name: 'Unknown Chord',
    exactMatch: false
  };
};

// Helper for array comparison
const arraysEqual = (a: number[], b: number[]) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};