export enum Rhythm {
  Quarter = 'quarter',
  Eighth = 'eighth',
  Triplet = 'triplet',
  Sixteenth = 'sixteenth',
  DottedEighthSixteenth = 'dotted-eighth-sixteenth',
  SixteenthDottedEighth = 'sixteenth-dotted-eighth',
  TripletQuarterEighth = 'triplet-quarter-eighth'
}

export enum SoundType {
  Click = 'click',
  Woodblock = 'woodblock',
  Beep = 'beep',
  Drum = 'drum'
}

export interface MetronomeState {
  isPlaying: boolean;
  bpm: number;
  beatsPerBar: number;
  subdivision: Rhythm;
  accentFirstBeat: boolean;
  soundType: SoundType;
  volume: number; // 0.0 to 1.0
}
