import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setSubdivision } from '../../../store/slices/metronomeSlice';
import { Rhythm } from '../types';

// --- Shared Constants ---
const COLOR_ACTIVE = "var(--color-primary-foreground)";
const COLOR_INACTIVE = "var(--color-foreground)";

interface IconProps { active: boolean; }

// Utility for note head
const NoteHead = ({ cx, cy, fill }: { cx: number, cy: number, fill: string }) => (
  <ellipse cx={cx} cy={cy} rx="4.5" ry="3.2" transform={`rotate(-15 ${cx} ${cy})`} fill={fill} />
);

// 1. Quarter
const IconQuarter = ({ active }: IconProps) => {
  const c = active ? COLOR_ACTIVE : COLOR_INACTIVE;
  return (
    <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
      <path d="M27 24V6" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <NoteHead cx={23.5} cy={24} fill={c} />
    </svg>
  );
};

// 2. Eighth (Two beamed)
const IconEighth = ({ active }: IconProps) => {
  const c = active ? COLOR_ACTIVE : COLOR_INACTIVE;
  return (
    <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
      {/* Beam */}
      <path d="M17 6h14" stroke={c} strokeWidth="3.5" strokeLinecap="butt"/>
      {/* Stems */}
      <path d="M17 6v18" stroke={c} strokeWidth="2"/>
      <path d="M31 6v18" stroke={c} strokeWidth="2"/>
      {/* Heads */}
      <NoteHead cx={13.5} cy={24} fill={c} />
      <NoteHead cx={27.5} cy={24} fill={c} />
    </svg>
  );
};

// 3. Triplet
const IconTriplet = ({ active }: IconProps) => {
  const c = active ? COLOR_ACTIVE : COLOR_INACTIVE;
  // Shifted down slightly to allow space for number
  return (
    <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
       {/* Beam */}
      <path d="M12 9h24" stroke={c} strokeWidth="3.5" />
       {/* Stems */}
      <path d="M12 9v18" stroke={c} strokeWidth="2"/>
      <path d="M24 9v18" stroke={c} strokeWidth="2"/>
      <path d="M36 9v18" stroke={c} strokeWidth="2"/>
       {/* Heads */}
      <NoteHead cx={8.5} cy={27} fill={c} />
      <NoteHead cx={20.5} cy={27} fill={c} />
      <NoteHead cx={32.5} cy={27} fill={c} />
       {/* Number */}
      <text x="24" y="6" fill={c} fontSize="10" textAnchor="middle" fontWeight="bold" fontFamily="serif" style={{ fontStyle: 'italic' }}>3</text>
    </svg>
  );
};

// 4. Sixteenth (Four beamed)
const IconSixteenth = ({ active }: IconProps) => {
  const c = active ? COLOR_ACTIVE : COLOR_INACTIVE;
  return (
    <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
      {/* Beams */}
      <path d="M9 6h30" stroke={c} strokeWidth="3.5" />
      <path d="M9 11.5h30" stroke={c} strokeWidth="3.5" />
      {/* Stems */}
      <path d="M9 6v18" stroke={c} strokeWidth="2"/>
      <path d="M19 6v18" stroke={c} strokeWidth="2"/>
      <path d="M29 6v18" stroke={c} strokeWidth="2"/>
      <path d="M39 6v18" stroke={c} strokeWidth="2"/>
      {/* Heads */}
      <NoteHead cx={5.5} cy={24} fill={c} />
      <NoteHead cx={15.5} cy={24} fill={c} />
      <NoteHead cx={25.5} cy={24} fill={c} />
      <NoteHead cx={35.5} cy={24} fill={c} />
    </svg>
  );
};

// 5. Dotted Eighth + Sixteenth
const IconDottedEighthSixteenth = ({ active }: IconProps) => {
  const c = active ? COLOR_ACTIVE : COLOR_INACTIVE;
  return (
    <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
      {/* Main Beam */}
      <path d="M15 6h18" stroke={c} strokeWidth="3.5" />
      {/* 16th sub-beam (right) */}
      <path d="M26 11.5h7" stroke={c} strokeWidth="3.5" />
      
      {/* Stems */}
      <path d="M15 6v18" stroke={c} strokeWidth="2"/>
      <path d="M33 6v18" stroke={c} strokeWidth="2"/>
      
      {/* Heads */}
      <NoteHead cx={11.5} cy={24} fill={c} />
      <NoteHead cx={29.5} cy={24} fill={c} />
      
      {/* Dot */}
      <circle cx={20} cy={24} r="2" fill={c} />
    </svg>
  );
};

// 6. Sixteenth + Dotted Eighth
const IconSixteenthDottedEighth = ({ active }: IconProps) => {
  const c = active ? COLOR_ACTIVE : COLOR_INACTIVE;
  return (
    <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
      {/* Main Beam */}
      <path d="M15 6h18" stroke={c} strokeWidth="3.5" />
      {/* 16th sub-beam (left) */}
      <path d="M15 11.5h7" stroke={c} strokeWidth="3.5" />
      
      {/* Stems */}
      <path d="M15 6v18" stroke={c} strokeWidth="2"/>
      <path d="M33 6v18" stroke={c} strokeWidth="2"/>
      
      {/* Heads */}
      <NoteHead cx={11.5} cy={24} fill={c} />
      <NoteHead cx={29.5} cy={24} fill={c} />
      
      {/* Dot */}
      <circle cx={39} cy={24} r="2" fill={c} />
    </svg>
  );
};

// 7. Quarter + Eighth Triplet
const IconTripletQuarterEighth = ({ active }: IconProps) => {
  const c = active ? COLOR_ACTIVE : COLOR_INACTIVE;
  // Shifted slightly for spacing
  return (
    <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
      {/* Bracket */}
      <path d="M16 6h16" stroke={c} strokeWidth="1" />
      <path d="M16 6v3" stroke={c} strokeWidth="1" />
      <path d="M32 6v3" stroke={c} strokeWidth="1" />
      <text x="24" y="5" fill={c} fontSize="10" textAnchor="middle" fontWeight="bold" fontFamily="serif" style={{ fontStyle: 'italic' }}>3</text>

      {/* Quarter Note */}
      <path d="M16 26V10" stroke={c} strokeWidth="2" />
      <NoteHead cx={12.5} cy={26} fill={c} />

      {/* Eighth Note */}
      <path d="M32 26V10" stroke={c} strokeWidth="2" />
      <path d="M32 10c2 0 4 1.5 4 4s-2 6-6 8" stroke={c} strokeWidth="2" fill="none"/> {/* Flag */}
      <NoteHead cx={28.5} cy={26} fill={c} />
    </svg>
  );
};

const Subdivisions: React.FC = () => {
  const dispatch = useDispatch();
  const currentSub = useSelector((state: RootState) => state.metronome.subdivision);

  const options = [
    { value: Rhythm.Quarter, icon: IconQuarter },
    { value: Rhythm.Eighth, icon: IconEighth },
    { value: Rhythm.Triplet, icon: IconTriplet },
    { value: Rhythm.Sixteenth, icon: IconSixteenth },
    { value: Rhythm.DottedEighthSixteenth, icon: IconDottedEighthSixteenth },
    { value: Rhythm.SixteenthDottedEighth, icon: IconSixteenthDottedEighth },
    { value: Rhythm.TripletQuarterEighth, icon: IconTripletQuarterEighth },
  ];

  return (
    <div className="mt-8">
      <h3 className="text-foreground text-lg mb-4 text-left font-medium">Ритмы</h3>
      <div className="flex flex-wrap gap-4 justify-start">
        {options.map((opt) => {
           const isActive = currentSub === opt.value;
           return (
             <button
               key={opt.value}
               onClick={() => dispatch(setSubdivision(opt.value))}
               className={`
                 w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-200 border-2
                 ${isActive
                    ? 'bg-primary border-primary shadow-md scale-105'
                    : 'bg-card border-border hover:border-primary/50 hover:bg-secondary'
                 }
               `}
               title={opt.value}
             >
               <opt.icon active={isActive} />
             </button>
           );
        })}
      </div>
    </div>
  );
};

export default Subdivisions;