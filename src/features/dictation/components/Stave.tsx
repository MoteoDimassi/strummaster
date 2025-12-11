import React from 'react';
import { Note, StaveNote, NoteName } from '../../../core/dictation/types';

interface StaveProps {
  notes: StaveNote[];
  interactive?: boolean;
  selectedNoteId?: string | null;
  onNoteClick?: (id: string) => void;
  scaleRoot?: NoteName;
}

const LINE_SPACING = 20; // Pixels between staff lines
const TOP_MARGIN = 150; // Increased margin to fit high notes (Octave 5)
const STAVE_WIDTH = 800;
const VIEWBOX_HEIGHT = 350; // Reduced height to be more compact

export const Stave: React.FC<StaveProps> = ({ 
  notes, 
  interactive, 
  selectedNoteId,
  onNoteClick 
}) => {
  
  // Calculate Y position based on MIDI pitch
  // We use B3 (MIDI 59) as the visual center (Middle Line of Treble Clef, though technically B4 is middle of staff)
  // Let's stick to standard Treble Clef alignment for visual familiarity.
  // Treble Clef: Bottom line is E4 (MIDI 64). Middle line is B4 (MIDI 71).
  // This is too high for Great/Small octaves.
  // Previous implementation centered B3 (MIDI 59) on middle line.
  // Let's keep B3 as middle line reference (Line 3, index 2).
  // Middle line Y = TOP_MARGIN + 2 * LINE_SPACING.
  
  const getNoteY = (midi: number) => {
    // Reference Note: B3 (59) at Middle Line
    const refMidi = 59; 
    
    // Calculate semitone difference
    const semitoneDiff = midi - refMidi;
    
    // We need to map semitones to visual steps. 
    // Diatonic scale steps approx.
    // C(0), D(2), E(4), F(5), G(7), A(9), B(11)
    const diatonicSteps = [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6];
    
    const getDiatonicIndex = (m: number) => {
       const octave = Math.floor(m / 12);
       const note = m % 12;
       return (octave * 7) + diatonicSteps[note];
    };
    
    const refIndex = getDiatonicIndex(refMidi);
    const currIndex = getDiatonicIndex(midi);
    
    // Positive difference means higher pitch -> Lower Y
    const stepDiff = currIndex - refIndex;
    
    const middleLineY = TOP_MARGIN + (2 * LINE_SPACING);
    return middleLineY - (stepDiff * (LINE_SPACING / 2));
  };

  const isSharp = (note: Note) => note.name.includes('#');
  const isFlat = (note: Note) => note.name.includes('b');

  return (
    <div
      className="w-full overflow-x-auto bg-white rounded-lg shadow-inner border border-slate-200 p-4 flex justify-center"
      onClick={() => interactive && onNoteClick && onNoteClick('')}
    >
      <svg
        width="100%"
        height={VIEWBOX_HEIGHT}
        viewBox={`0 0 ${Math.max(STAVE_WIDTH, notes.length * 60 + 100)} ${VIEWBOX_HEIGHT}`}
        className="min-w-[600px]"
      >
        {/* Draw Stave Lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line 
            key={i}
            x1="10" 
            x2="100%" 
            y1={TOP_MARGIN + i * LINE_SPACING} 
            y2={TOP_MARGIN + i * LINE_SPACING} 
            stroke="#333" 
            strokeWidth="1.5" 
          />
        ))}

        {/* Notes */}
        {notes.map((note, index) => {
          const x = 60 + (index * 60);
          const y = getNoteY(note.midi);
          const sharp = isSharp(note);
          const flat = isFlat(note);
          const isSelected = note.id === selectedNoteId;
          
          // Ledger Lines Logic
          const staffTop = TOP_MARGIN;
          const staffBottom = TOP_MARGIN + 4 * LINE_SPACING;
          
          // A note needs ledger lines if it is above top line (y < staffTop)
          // or below bottom line (y > staffBottom).
          // We must draw lines at intervals of LINE_SPACING relative to staff.
          
          const ledgerLines = [];
          
          if (y < staffTop - 5) {
             // Notes above staff
             // Draw lines starting from Top - Spacing, upwards to y
             for (let ly = staffTop - LINE_SPACING; ly >= y - 5; ly -= LINE_SPACING) {
                 ledgerLines.push(ly);
             }
          } else if (y > staffBottom + 5) {
             // Notes below staff
             // Draw lines starting from Bottom + Spacing, downwards to y
             for (let ly = staffBottom + LINE_SPACING; ly <= y + 5; ly += LINE_SPACING) {
                 ledgerLines.push(ly);
             }
          }

          const baseColor = note.isError 
            ? "#ef4444" // red-500
            : "#0f172a"; // slate-900
            
          const noteColor = isSelected && !note.isError ? "#3b82f6" : baseColor;

          return (
            <g 
                key={note.id || index} 
                className={interactive ? "cursor-pointer transition-all duration-200" : ""}
                onClick={(e) => {
                  e.stopPropagation();
                  interactive && onNoteClick && onNoteClick(note.id);
                }}
            >
              {/* Ledger Lines */}
              {ledgerLines.map(ly => (
                <line 
                    key={ly}
                    x1={x - 14} x2={x + 14} 
                    y1={ly} y2={ly} 
                    stroke={isSelected ? noteColor : "#333"} 
                    strokeWidth="1"
                />
              ))}

              {/* Selection Halo */}
              {isSelected && (
                <ellipse 
                  cx={x} 
                  cy={y} 
                  rx="18" 
                  ry="35" 
                  fill="rgba(59, 130, 246, 0.2)"
                />
              )}

              {/* Note Head */}
              <ellipse 
                cx={x} 
                cy={y} 
                rx="8" 
                ry="6" 
                fill={noteColor}
                transform={`rotate(-10 ${x} ${y})`}
              />
              
              {/* Note Stem */}
              <line 
                x1={y > TOP_MARGIN + 2 * LINE_SPACING ? x + 7 : x - 7} 
                y1={y} 
                x2={y > TOP_MARGIN + 2 * LINE_SPACING ? x + 7 : x - 7} 
                y2={y > TOP_MARGIN + 2 * LINE_SPACING ? y - 35 : y + 35} 
                stroke={noteColor} 
                strokeWidth="2"
              />

              {/* Accidental (Sharp) */}
              {sharp && (
                <text x={x - 20} y={y + 5} fontSize="18" fill={noteColor}>♯</text>
              )}
              {/* Accidental (Flat) */}
              {flat && (
                <text x={x - 20} y={y + 5} fontSize="20" fill={noteColor}>♭</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};