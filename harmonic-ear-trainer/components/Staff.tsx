import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Staff: React.FC = () => {
  const activeNotes = useSelector((state: RootState) => state.trainer.activeNotes);

  // SVG Configuration
  const width = 600;
  const height = 240; // Increased height to accommodate low/high notes
  const lineSpacing = 15;
  const staffTopY = 100; // Moved down slightly to center in new height
  
  // Music logic for visual
  // Middle C (MIDI 60) is below the staff.
  // Treble Clef: Bottom line is E4 (64). Top line is F5 (77).
  
  // Map MIDI to Y coordinate.
  // Higher pitch = Lower Y value.
  // One MIDI semitone is not linear vertical distance due to accidentals (sharps/flats).
  // We map based on "Scale Steps". C=0, D=1, E=2...
  
  const getNoteStep = (midi: number) => {
    const octave = Math.floor(midi / 12) - 1;
    const noteIndex = midi % 12;
    // Map chromatic index to diatonic step index (C Major scale)
    const stepMap = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6]; 
    const stepInOctave = stepMap[noteIndex];
    return (octave * 7) + stepInOctave;
  };

  const isAccidental = (midi: number) => {
    const n = midi % 12;
    return [1, 3, 6, 8, 10].includes(n);
  };

  // Reference: E4 (MIDI 64) is on the bottom line.
  // E4 step = (4 * 7) + 2 = 30.
  // C4 step = 28. (Diff -2)
  const referenceStep = getNoteStep(64); 
  const referenceY = staffTopY + (4 * lineSpacing); // Y of bottom line

  const getNoteY = (midi: number) => {
    const step = getNoteStep(midi);
    const stepDiff = step - referenceStep;
    // Each step is half a line spacing up/down
    return referenceY - (stepDiff * (lineSpacing / 2));
  };

  return (
    <div className="w-full flex justify-center py-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Staff Lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line 
            key={i} 
            x1="20" 
            y1={staffTopY + (i * lineSpacing)} 
            x2={width - 20} 
            y2={staffTopY + (i * lineSpacing)} 
            stroke="#333" 
            strokeWidth="1.5" 
          />
        ))}

        {/* Clef - Doubled size to 150, adjusted position to align G-curl on line 3 */}
        <text x="0" y={staffTopY + 3 * lineSpacing + 26} fontFamily="serif" fontSize="150" fill="#000">𝄞</text>

        {/* Render Notes */}
        {activeNotes.map((midi) => {
            const x = 120 + (midi - 48) * 12; // Spreading based on pitch
            const y = getNoteY(midi);
            const accidental = isAccidental(midi);
            
            const step = getNoteStep(midi);
            const stepDiff = step - referenceStep;

            // Generate Ledger Lines
            const ledgerLines = [];
            // Top line is F5 (stepDiff 8). First ledger line above is A5 (stepDiff 10).
            if (stepDiff >= 10) {
                for (let s = 10; s <= stepDiff; s += 2) {
                    const ly = referenceY - (s * (lineSpacing / 2));
                    ledgerLines.push(
                        <line key={`l-${s}`} x1={x - 14} y1={ly} x2={x + 14} y2={ly} stroke="#333" strokeWidth="1.5" />
                    );
                }
            }
            // Bottom line is E4 (stepDiff 0). First ledger line below is C4 (stepDiff -2).
            if (stepDiff <= -2) {
                for (let s = -2; s >= stepDiff; s -= 2) {
                    const ly = referenceY - (s * (lineSpacing / 2));
                    ledgerLines.push(
                        <line key={`l-${s}`} x1={x - 14} y1={ly} x2={x + 14} y2={ly} stroke="#333" strokeWidth="1.5" />
                    );
                }
            }

            return (
                <g key={midi}>
                    {/* Render Ledger Lines */}
                    {ledgerLines}

                    {/* Stem - Direction depends on pitch usually, simplified to up for low, down for high */}
                    <line 
                        x1={x + 7} 
                        y1={y} 
                        x2={x + 7} 
                        y2={stepDiff >= 5 ? y + 35 : y - 35} 
                        stroke="#000" 
                        strokeWidth="1.5" 
                    />

                    {/* Note Head */}
                    <ellipse cx={x} cy={y} rx="8" ry="6" transform={`rotate(-15 ${x} ${y})`} fill="#000" />
                    
                    {/* Sharp symbol */}
                    {accidental && (
                        <text x={x - 20} y={y + 5} fontSize="18" fill="#000">♯</text>
                    )}
                </g>
            );
        })}
      </svg>
    </div>
  );
};

export default Staff;