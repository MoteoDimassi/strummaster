import React from 'react';

interface PianoProps {
  startOctave: number; // e.g., 3 for starting at C3
  numOctaves: number;
  activeNotes: number[];
  onNoteClick: (midi: number) => void;
}

const Piano: React.FC<PianoProps> = ({ startOctave, numOctaves, activeNotes, onNoteClick }) => {
  const startMidi = startOctave * 12 + 12; // MIDI 12 is C0, so C3 is 48
  const totalKeys = numOctaves * 12;

  const isBlackKey = (midi: number) => {
    const n = midi % 12;
    return n === 1 || n === 3 || n === 6 || n === 8 || n === 10;
  };

  // Generate keys structure
  const keys = [];
  for (let i = 0; i < totalKeys; i++) {
    const midi = startMidi + i;
    keys.push({ midi, isBlack: isBlackKey(midi) });
  }

  const whiteKeys = keys.filter(k => !k.isBlack);
  const blackKeys = keys.filter(k => k.isBlack);

  return (
    <div className="relative h-48 select-none w-full max-w-4xl mx-auto overflow-hidden bg-gray-900 p-2 rounded-lg shadow-xl">
      <div className="relative flex h-full">
        {/* Render White Keys */}
        {whiteKeys.map((key) => {
           const isActive = activeNotes.includes(key.midi);
           return (
            <div
                key={key.midi}
                onClick={() => onNoteClick(key.midi)}
                className={`flex-1 border-r border-gray-300 last:border-r-0 rounded-b-md cursor-pointer transition-colors active:bg-gray-200 z-10 relative
                    ${isActive ? 'bg-blue-200 shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]' : 'bg-white hover:bg-gray-50'}`}
            >
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">
                    {key.midi % 12 === 0 ? `C${Math.floor(key.midi/12)-1}` : ''}
                </span>
            </div>
           )
        })}

        {/* Render Black Keys (Overlay) */}
        {blackKeys.map((key) => {
            const isActive = activeNotes.includes(key.midi);
            const noteInOctave = key.midi % 12;
            const octaveIndex = Math.floor((key.midi - startMidi) / 12);
            
            const whiteKeyWidthPct = 100 / whiteKeys.length;
            const baseIndex = (octaveIndex * 7);

            // Refined spacing for black keys
            let offsetMultiplier = 0;
            if (noteInOctave === 1) offsetMultiplier = 0.65; // C#
            else if (noteInOctave === 3) offsetMultiplier = 1.75; // D#
            else if (noteInOctave === 6) offsetMultiplier = 3.65; // F#
            else if (noteInOctave === 8) offsetMultiplier = 4.75; // G#
            else if (noteInOctave === 10) offsetMultiplier = 5.8; // A#

            const leftPos = (baseIndex + offsetMultiplier) * whiteKeyWidthPct;

            return (
                <div
                    key={key.midi}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent clicking white key underneath
                        onNoteClick(key.midi);
                    }}
                    style={{ 
                        left: `${leftPos}%`, 
                        width: `${whiteKeyWidthPct * 0.7}%` 
                    }}
                    className={`absolute top-0 h-[60%] z-20 rounded-b-md cursor-pointer transition-colors
                        ${isActive ? 'bg-blue-600' : 'bg-black hover:bg-gray-800'}`}
                />
            );
        })}
      </div>
    </div>
  );
};

export default Piano;