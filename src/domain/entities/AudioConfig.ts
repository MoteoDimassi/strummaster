export interface AudioConfig {
  bpm: number;
  volume: number;
}

export interface Note {
  name: string;
  frequency: number;
  octave?: number;
}

export interface TunerResult {
  note: string;
  frequency: number;
  cents: number;
  isInTune: boolean;
}