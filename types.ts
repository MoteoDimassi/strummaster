export type StrumDirection = 'down' | 'up';
export type StrumType = 'strum' | 'mute' | 'ghost';

export interface StrumStep {
  id: string;
  direction: StrumDirection;
  strumType: StrumType; // 'strum' = play chord, 'mute' = muted sound, 'ghost' = miss
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