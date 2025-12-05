import React, { useMemo } from 'react';
import { Note, NoteName } from '../../../core/dictation/types';
import { NOTE_NAMES_SHARP } from '../../../core/dictation/musicTheory';

interface PianoKeyboardProps {
  octaves: number[]; // Selected octaves
  scaleNotes?: Note[];
  onNoteClick: (note: Note, isScaleNote: boolean) => void;
  disableNonScaleNotes?: boolean;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  octaves: selectedOctaves,
  scaleNotes = [],
  onNoteClick,
  disableNonScaleNotes = false,
}) => {
  // Always render octaves [2, 3, 4, 5] in two rows
  const PIANO_ROWS = [
    [2, 3],
    [4, 5]
  ];

  return (
    <div className="space-y-4 select-none">
      {PIANO_ROWS.map((rowOctaves, idx) => (
        <div key={idx} className="bg-slate-800 p-2 md:p-4 rounded-xl shadow-inner flex overflow-x-auto pb-4 custom-scrollbar justify-center">
          {/* Flex container for octaves */}
          <div className="flex">
            {rowOctaves.map(octave => (
              <PianoOctave 
                key={octave} 
                octave={octave} 
                scaleNotes={scaleNotes} 
                onKeyClick={onNoteClick}
                isSelected={selectedOctaves.includes(octave)}
                restrictToScale={disableNonScaleNotes}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Sub-component for Piano Keys
const PianoOctave: React.FC<{ 
    octave: number, 
    scaleNotes: Note[], 
    onKeyClick: (note: Note, isScale: boolean) => void,
    isSelected: boolean,
    restrictToScale: boolean
}> = ({ octave, scaleNotes, onKeyClick, isSelected, restrictToScale }) => {
    
    // Generate full chromatic notes for this octave
    const keys = useMemo(() => {
        const whiteKeys = [];
        const blackKeys = [];
        
        // Standard MIDI for Octave: C starts at (octave + 1) * 12
        const baseMidi = (octave + 1) * 12;
        
        // Helper to find if this note is in our generated scale
        const getScaleNote = (midi: number) => scaleNotes.find(n => n.midi === midi);
        const createNote = (midi: number, name: string) => {
             const sn = getScaleNote(midi);
             return {
                 midi,
                 note: sn || { 
                    name: name as NoteName, 
                    midi, 
                    octave, 
                    frequency: 440 * Math.pow(2, (midi - 69) / 12) 
                 },
                 inScale: !!sn,
                 label: name
             };
        };

        // White keys: 0, 2, 4, 5, 7, 9, 11 relative to base
        // Indices: 0-6
        const whiteKeyMidis = [0, 2, 4, 5, 7, 9, 11];
        const whiteKeyNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

        whiteKeyMidis.forEach((offset, idx) => {
            whiteKeys.push(createNote(baseMidi + offset, whiteKeyNames[idx]));
        });

        // Black keys: 1(C#), 3(D#), 6(F#), 8(G#), 10(A#)
        // We need to know which "border" they sit on.
        // C# sits between C(0) and D(1) -> Offset 1 (100/7 * 1)
        // D# sits between D(1) and E(2) -> Offset 2
        // F# sits between F(3) and G(4) -> Offset 4
        // G# sits between G(4) and A(5) -> Offset 5
        // A# sits between A(5) and B(6) -> Offset 6
        
        const blackDefinitions = [
            { midiOffset: 1, name: 'C#', positionIndex: 1 },
            { midiOffset: 3, name: 'D#', positionIndex: 2 },
            { midiOffset: 6, name: 'F#', positionIndex: 4 },
            { midiOffset: 8, name: 'G#', positionIndex: 5 },
            { midiOffset: 10, name: 'A#', positionIndex: 6 },
        ];

        blackDefinitions.forEach(def => {
            blackKeys.push({
                ...createNote(baseMidi + def.midiOffset, def.name),
                positionIndex: def.positionIndex
            });
        });

        return { whites: whiteKeys, blacks: blackKeys };
    }, [octave, scaleNotes]);

    return (
        <div className={`relative flex flex-none w-[240px] md:w-[280px] h-32 md:h-40 ${isSelected ? '' : 'opacity-60 grayscale-[0.5]'}`}>
            {/* White Keys Container */}
            {keys.whites.map((k) => {
                const isInteractive = k.inScale || (isSelected && !restrictToScale);
                const isScaleVisual = k.inScale;
                
                return (
                <button
                    key={k.midi}
                    onClick={() => onKeyClick(k.note, k.inScale)}
                    disabled={!isInteractive}
                    className={`
                        flex-1
                        border-r border-slate-300 last:border-r-0 rounded-b-md 
                        flex items-end justify-center pb-2
                        transition-all duration-100 text-xs font-bold
                        ${isScaleVisual
                            ? 'bg-white text-slate-900 active:bg-slate-100 shadow-[inset_0_-5px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-[2px]' 
                            : isInteractive
                                ? 'bg-slate-100 text-slate-400 active:bg-slate-200 shadow-[inset_0_-3px_0_rgba(0,0,0,0.05)] active:shadow-none' 
                                : 'bg-slate-300 text-slate-400 opacity-50 cursor-not-allowed'
                        }
                    `}
                >
                    <span className="mb-1 pointer-events-none">{isScaleVisual && k.label}</span>
                </button>
            )})}
            
            {/* Black Keys Overlay */}
            {keys.blacks.map((k) => {
                const isInteractive = k.inScale || (isSelected && !restrictToScale);
                const isScaleVisual = k.inScale;
                // Width of black key relative to octave width. 
                // Approx 60% of white key width (100/7). 0.6 * 14.28 = 8.5%
                const widthPercent = 8.5; 
                // Left position: (index * 100/7) %
                const leftPercent = k.positionIndex * (100 / 7);

                return (
                <button
                    key={k.midi}
                    onClick={() => onKeyClick(k.note, k.inScale)}
                    disabled={!isInteractive}
                    style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                        height: '60%', // Black keys are shorter
                        transform: 'translateX(-50%)' // Center on the line
                    }}
                    className={`
                        absolute top-0 z-10
                        rounded-b-md flex items-end justify-center pb-2
                        text-[10px] font-bold transition-all duration-100 border border-slate-900
                        ${isScaleVisual
                            ? 'bg-slate-900 text-white active:bg-black shadow-[2px_2px_4px_rgba(0,0,0,0.4)] active:shadow-none active:translate-y-[1px]' 
                            : isInteractive
                                ? 'bg-slate-700 text-slate-300 active:bg-slate-800'
                                : 'bg-slate-600 text-slate-400 opacity-50 cursor-not-allowed'
                        }
                    `}
                >
                    <span className="pointer-events-none hidden md:block">{isScaleVisual && k.label}</span>
                </button>
            )})}
        </div>
    );
};