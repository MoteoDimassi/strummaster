export type StrumDirection = 'down' | 'up';

export interface StrumStep {
  id: string;
  direction: StrumDirection;
  isHit: boolean; // true = play chord, false = ghost strum (miss)
  chord: string; // e.g., 'Am', 'C', 'G'
  lyrics: string; // Syllable associated with this beat
}

export interface Measure {
  id: string;
  steps: StrumStep[];
}

export interface AudioConfig {
  bpm: number;
  volume: number;
}