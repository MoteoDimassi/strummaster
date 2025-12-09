// Chord Shapes (Fret positions: 6E, 5A, 4D, 3G, 2B, 1e)
export const CHORD_FRETS: Record<string, (number | null)[]> = {
  'Am': [null, 0, 2, 2, 1, 0], // X02210
  'A':  [null, 0, 2, 2, 2, 0], // X02220
  'C':  [null, 3, 2, 0, 1, 0], // X32010
  'D':  [null, null, 0, 2, 3, 2], // XX0232
  'Dm': [null, null, 0, 2, 3, 1], // XX0231
  'E':  [0, 2, 2, 1, 0, 0], // 022100
  'Em': [0, 2, 2, 0, 0, 0], // 022000
  'G':  [3, 2, 0, 0, 0, 3], // 320003
  'F':  [null, null, 3, 2, 1, 1], // XX3211
};

export const STRINGS = ['6E', '5A', '4D', '3G', '2B', '1e'];

export const getAvailableChords = (): string[] => {
  return Object.keys(CHORD_FRETS);
};

export const getChordFrets = (chordName: string): (number | null)[] | undefined => {
  return CHORD_FRETS[chordName];
};