import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MinusCircle, PlusCircle, ChevronLeft, ChevronRight, Volume2, Music, Check } from 'lucide-react';
import { RootState } from '../../../store';
import { 
  setBeatsPerBar, 
  toggleAccent, 
  setSoundType,
  setVolume
} from '../../../store/slices/metronomeSlice';
import { SoundType } from '../types';

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    beatsPerBar, 
    accentFirstBeat, 
    soundType,
    volume
  } = useSelector((state: RootState) => state.metronome);

  const sounds = [
    { id: SoundType.Click, label: 'Клик' },
    { id: SoundType.Woodblock, label: 'Вудблок' },
    { id: SoundType.Beep, label: 'Писк' },
    { id: SoundType.Drum, label: 'Барабан' },
  ];

  const currentSoundIndex = sounds.findIndex(s => s.id === soundType);

  const cycleSound = (direction: 'next' | 'prev') => {
    let newIndex = direction === 'next' ? currentSoundIndex + 1 : currentSoundIndex - 1;
    if (newIndex >= sounds.length) newIndex = 0;
    if (newIndex < 0) newIndex = sounds.length - 1;
    dispatch(setSoundType(sounds[newIndex].id));
  };
  
  const volumePercent = Math.round(volume * 100);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Beats Selector */}
      <div className="flex items-center justify-between py-3 border-b border-border">
        <span className="text-foreground text-lg font-medium">Биты</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(setBeatsPerBar(beatsPerBar - 1))}
            className="text-muted-foreground hover:text-foreground transition-colors active:scale-95"
            disabled={beatsPerBar <= 1}
          >
            <MinusCircle size={32} strokeWidth={1.5} />
          </button>
          <span className="text-2xl font-bold text-foreground w-8 text-center">{beatsPerBar}</span>
          <button
             onClick={() => dispatch(setBeatsPerBar(beatsPerBar + 1))}
             className="text-muted-foreground hover:text-foreground transition-colors active:scale-95"
             disabled={beatsPerBar >= 16}
          >
            <PlusCircle size={32} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Accent Toggle */}
      <div
        className="flex items-center justify-between py-3 border-b border-border cursor-pointer group"
        onClick={() => dispatch(toggleAccent())}
      >
         <div className="flex items-center gap-3">
            <div className={`
              w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 border
              ${accentFirstBeat
                ? 'bg-primary border-primary'
                : 'bg-card border-border group-hover:border-primary'
              }
            `}>
               {accentFirstBeat && <Check size={16} className="text-primary-foreground" strokeWidth={3} />}
            </div>
            <span className="text-foreground text-lg select-none group-hover:text-foreground transition-colors">Выделить первый бит</span>
         </div>
      </div>

      {/* Sound Selector */}
      <div className="flex items-center justify-between py-3 border-b border-border">
         <div className="flex items-center gap-3">
            <Music className="text-muted-foreground" size={20} />
            <span className="text-foreground text-lg">Звук</span>
         </div>
         
         <div className="flex items-center bg-secondary rounded-lg p-1 border border-border">
            <button
              onClick={() => cycleSound('prev')}
              className="p-1.5 text-muted-foreground hover:text-primary transition-colors hover:bg-card rounded-md active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="w-24 text-center font-medium text-foreground select-none text-sm">
              {sounds[currentSoundIndex].label}
            </span>
            <button
              onClick={() => cycleSound('next')}
              className="p-1.5 text-muted-foreground hover:text-primary transition-colors hover:bg-card rounded-md active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
         </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-between py-3 border-b border-border">
         <div className="flex items-center gap-3">
            <Volume2 className="text-muted-foreground" size={20} />
            <span className="text-foreground text-lg">Громкость</span>
         </div>
         
         <div className="flex items-center w-40 relative h-8">
            {/* Custom Range Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={volumePercent}
              onChange={(e) => dispatch(setVolume(Number(e.target.value) / 100))}
              className="absolute z-10 w-full h-full opacity-0 cursor-pointer"
            />
            
            {/* Track Background */}
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden absolute top-1/2 -translate-y-1/2 left-0">
               <div
                  className="h-full bg-primary transition-all duration-75 ease-out"
                  style={{ width: `${volumePercent}%` }}
               />
            </div>

            {/* Thumb */}
            <div
               className="absolute w-5 h-5 bg-primary border-2 border-card rounded-full shadow-md pointer-events-none top-1/2 -translate-y-1/2 transition-all duration-75 ease-out"
               style={{ left: `calc(${volumePercent}% - 10px)` }}
            />
         </div>
      </div>
    </div>
  );
};

export default Settings;