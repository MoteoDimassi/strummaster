export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type TonalityType = 'Мажор' | 'Минор';

export type InstrumentType = 'Пианино' | 'Синтезатор' | 'Пэд';

export enum ChordQuality {
  MAJOR = 'Мажорный',
  MINOR = 'Минорный',
  DIMINISHED = 'Уменьшенный'
}

export enum RomanNumeral {
  // Major Scale
  I = 'I',
  ii = 'ii',
  iii = 'iii',
  IV = 'IV',
  V = 'V',
  vi = 'vi',
  vii = 'vii°',
  // Minor Scale (Natural) additions
  i = 'i',
  iidim = 'ii°',
  III = 'III',
  iv = 'iv',
  v = 'v',
  VI = 'VI',
  VII = 'VII'
}

export interface ScaleDegree {
  id: number; // 0-6
  roman: RomanNumeral;
  quality: ChordQuality;
  intervalFromRoot: number; // semitones
}

export interface Chord {
  root: NoteName;
  octave: number;
  quality: ChordQuality;
  roman: RomanNumeral;
  notes: string[]; // e.g., ["C4", "E4", "G4"]
  frequencies: number[];
}

export interface Progression {
  id: string;
  key: NoteName;
  chords: Chord[];
}

export type GameState = 'SETUP' | 'PLAYING' | 'RESULT';