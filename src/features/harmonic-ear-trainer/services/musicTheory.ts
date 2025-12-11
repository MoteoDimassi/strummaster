import { NoteName, ChordQuality, RomanNumeral, ScaleDegree, Chord, TonalityType } from '../types';

const CHROMATIC_SCALE: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Major scale intervals: W W H W W W H (0, 2, 4, 5, 7, 9, 11)
const MAJOR_SCALE_DEGREES: ScaleDegree[] = [
  { id: 0, roman: RomanNumeral.I, quality: ChordQuality.MAJOR, intervalFromRoot: 0 },
  { id: 1, roman: RomanNumeral.ii, quality: ChordQuality.MINOR, intervalFromRoot: 2 },
  { id: 2, roman: RomanNumeral.iii, quality: ChordQuality.MINOR, intervalFromRoot: 4 },
  { id: 3, roman: RomanNumeral.IV, quality: ChordQuality.MAJOR, intervalFromRoot: 5 },
  { id: 4, roman: RomanNumeral.V, quality: ChordQuality.MAJOR, intervalFromRoot: 7 },
  { id: 5, roman: RomanNumeral.vi, quality: ChordQuality.MINOR, intervalFromRoot: 9 },
  { id: 6, roman: RomanNumeral.vii, quality: ChordQuality.DIMINISHED, intervalFromRoot: 11 },
];

// Natural Minor scale intervals: W H W W H W W (0, 2, 3, 5, 7, 8, 10)
const NATURAL_MINOR_SCALE_DEGREES: ScaleDegree[] = [
  { id: 0, roman: RomanNumeral.i, quality: ChordQuality.MINOR, intervalFromRoot: 0 },
  { id: 1, roman: RomanNumeral.iidim, quality: ChordQuality.DIMINISHED, intervalFromRoot: 2 },
  { id: 2, roman: RomanNumeral.III, quality: ChordQuality.MAJOR, intervalFromRoot: 3 },
  { id: 3, roman: RomanNumeral.iv, quality: ChordQuality.MINOR, intervalFromRoot: 5 },
  { id: 4, roman: RomanNumeral.v, quality: ChordQuality.MINOR, intervalFromRoot: 7 }, // Natural minor typically has minor v
  { id: 5, roman: RomanNumeral.VI, quality: ChordQuality.MAJOR, intervalFromRoot: 8 },
  { id: 6, roman: RomanNumeral.VII, quality: ChordQuality.MAJOR, intervalFromRoot: 10 },
];

// Harmonic Minor V (Major quality)
const HARMONIC_MINOR_V: ScaleDegree = { 
  id: 7, // Distinct ID from natural v (4)
  roman: RomanNumeral.V, 
  quality: ChordQuality.MAJOR, 
  intervalFromRoot: 7 
};

export type MinorFifthOption = 'NATURAL' | 'HARMONIC' | 'BOTH';

class MusicTheoryService {
  /**
   * Returns the frequency of a note. A4 = 440Hz.
   * Simple calculation relative to C4 (MIDI 60).
   */
  getFrequency(note: NoteName, octave: number): number {
    const semitonesFromC4 = this.getSemitonesFromC4(note, octave);
    // C4 is ~261.63 Hz. Formula: f = 440 * 2^((n-69)/12) where n is MIDI note
    // C4 is MIDI 60. A4 is MIDI 69.
    const midiNote = 60 + semitonesFromC4;
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  }

  private getSemitonesFromC4(note: NoteName, octave: number): number {
    const noteIndex = CHROMATIC_SCALE.indexOf(note);
    // Base octave calculation (relative to C4 being 0 for the C note)
    const octaveOffset = (octave - 4) * 12;
    return octaveOffset + noteIndex;
  }

  /**
   * Returns the note name N semitones away from the root.
   */
  getNoteAtInterval(root: NoteName, semitones: number): NoteName {
    const rootIndex = CHROMATIC_SCALE.indexOf(root);
    const targetIndex = (rootIndex + semitones) % 12;
    return CHROMATIC_SCALE[targetIndex];
  }

  /**
   * Construct a chord based on the key and scale degree.
   */
  buildChord(keyRoot: NoteName, degree: ScaleDegree): Chord {
    const chordRoot = this.getNoteAtInterval(keyRoot, degree.intervalFromRoot);
    
    // Construct triad intervals based on quality
    let intervals = [0, 4, 7]; // Major default
    if (degree.quality === ChordQuality.MINOR) intervals = [0, 3, 7];
    if (degree.quality === ChordQuality.DIMINISHED) intervals = [0, 3, 6];

    // Calculate actual notes and frequencies
    // Base octave 4, but if the note index wraps around relative to key root, bump octave?
    // Simplified: Keep everything tight around Octave 4 for ear training clarity.
    
    // Voice leading logic: keep chords between C3 and C5 approximately.
    const baseOctave = 4;
    
    const frequencies = intervals.map(interval => {
        const noteName = this.getNoteAtInterval(chordRoot, interval);
        let noteOctave = baseOctave;
        // Simple logic: if note is very low relative to C in array, maybe bump? 
        // For now, simple absolute pitch calculation.
        return this.getFrequency(noteName, noteOctave);
    });

    const noteNames = intervals.map(interval => this.getNoteAtInterval(chordRoot, interval) + baseOctave);

    return {
      root: chordRoot,
      octave: baseOctave,
      quality: degree.quality,
      roman: degree.roman,
      notes: noteNames,
      frequencies: frequencies
    };
  }

  /**
   * Generates a random chord progression in the given key.
   * Constraints:
   * 1. Must contain the Tonic (I or i).
   */
  generateProgression(keyRoot: NoteName, availableDegrees: ScaleDegree[], length: number): Chord[] {
    const chords: Chord[] = [];
    
    // Ensure we can identify the tonic from the provided degrees or generate it if missing (though UI should enforce presence)
    // The tonic has id 0.
    const tonicDegree = availableDegrees.find(d => d.id === 0);
    
    if (!tonicDegree && availableDegrees.length === 0) {
        // Fallback if empty array passed - should not happen in correct usage
        return [];
    }

    // If tonic is missing from available degrees but required by logic, we might have an issue.
    // We assume the UI enforces Tonic selection. 

    let hasTonic = false;

    for (let i = 0; i < length; i++) {
      let degree: ScaleDegree;
      
      // Force tonic if it's the last slot and we haven't had it yet
      // Only possible if tonic is in availableDegrees
      if (i === length - 1 && !hasTonic && tonicDegree) {
        degree = tonicDegree; 
      } else {
        const randomIndex = Math.floor(Math.random() * availableDegrees.length);
        degree = availableDegrees[randomIndex];
      }

      if (degree.id === 0) hasTonic = true;
      chords.push(this.buildChord(keyRoot, degree));
    }

    // Double check safety for tonic requirement
    if (!hasTonic && tonicDegree) {
       const replaceIdx = Math.floor(Math.random() * length);
       chords[replaceIdx] = this.buildChord(keyRoot, tonicDegree);
    }

    return chords;
  }

  getAllKeys(): NoteName[] {
    return CHROMATIC_SCALE;
  }

  getScaleDegrees(type: TonalityType, minorOption: MinorFifthOption = 'NATURAL'): ScaleDegree[] {
    if (type === 'Мажор') return MAJOR_SCALE_DEGREES;
    
    const degrees = [...NATURAL_MINOR_SCALE_DEGREES];
    
    if (minorOption === 'NATURAL') return degrees;

    // Logic for Harmonic or Mixed
    return degrees.reduce<ScaleDegree[]>((acc, deg) => {
        if (deg.id === 4) { // The 'v' slot
             if (minorOption === 'HARMONIC') {
                 // Replace v with V
                 acc.push(HARMONIC_MINOR_V);
             } else { // BOTH
                 acc.push(deg); // v
                 acc.push(HARMONIC_MINOR_V); // V
             }
        } else {
            acc.push(deg);
        }
        return acc;
    }, []);
  }
}

export const musicTheory = new MusicTheoryService();