export type NoteName = 
  'C' | 'C#' | 'Db' |
  'D' | 'D#' | 'Eb' |
  'E' | 
  'F' | 'F#' | 'Gb' |
  'G' | 'G#' | 'Ab' |
  'A' | 'A#' | 'Bb' |
  'B';

export interface Note {
  name: NoteName;
  octave: number;
  frequency: number;
  midi: number;
}

export type ScaleType = 'Major' | 'Minor';

export interface GameSettings {
  replayLimit: number | 'infinity'; // 1-10 or infinity
  scaleRange: number; // 3-7 notes
  selectedOctaves: number[]; // Array of octave numbers (2=Great, 3=Small, 4=1st, etc)
  melodyNoteCount: number; // 3-15
  rootNote: NoteName;
  scaleType: ScaleType;
  difficulty: number; // 1-5 Stars
}

export interface StaveNote extends Note {
  id: string; // Unique ID for React keys
  isError?: boolean;
}

export interface AppState {
  status: 'setup' | 'playing' | 'success';
  settings: GameSettings;
  targetMelody: Note[];
  userNotes: StaveNote[];
  playCount: number;
  feedbackMessage: string | null;
}