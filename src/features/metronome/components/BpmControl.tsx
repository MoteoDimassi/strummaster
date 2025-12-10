import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus } from 'lucide-react';
import { RootState } from '../../../store';
import { setBpm, incrementBpm } from '../../../store/slices/metronomeSlice';

const BpmControl: React.FC = () => {
  const dispatch = useDispatch();
  const bpm = useSelector((state: RootState) => state.metronome.bpm);

  const getTempoMarking = (bpm: number): string => {
    if (bpm < 40) return 'Grave';
    if (bpm < 60) return 'Largo';
    if (bpm < 66) return 'Larghetto';
    if (bpm < 76) return 'Adagio';
    if (bpm < 108) return 'Andante';
    if (bpm < 120) return 'Moderato';
    if (bpm < 168) return 'Allegro';
    if (bpm < 200) return 'Presto';
    return 'Prestissimo';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setBpm(parseInt(e.target.value, 10)));
  };

  const handleDecrease = useCallback(() => dispatch(incrementBpm(-1)), [dispatch]);
  const handleIncrease = useCallback(() => dispatch(incrementBpm(1)), [dispatch]);

  return (
    <div className="flex flex-col items-center w-full mb-8">
      <div className="bg-secondary text-foreground px-3 py-1 rounded-md text-sm font-medium mb-4">
        Ударов в Минуту
      </div>
      
      <div className="text-[120px] leading-none font-bold text-foreground tracking-tighter">
        {bpm}
      </div>
      
      <div className="text-muted-foreground text-lg font-medium mb-8">
        {getTempoMarking(bpm)}
      </div>

      <div className="flex items-center w-full max-w-lg gap-6">
        <button
          onClick={handleDecrease}
          className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          aria-label="Decrease Tempo"
        >
          <Minus size={24} />
        </button>

        <div className="flex-1 relative h-6 flex items-center">
            {/* Custom Range Slider */}
            <input
              type="range"
              min="20"
              max="300"
              value={bpm}
              onChange={handleChange}
              className="w-full absolute z-10 opacity-0 cursor-pointer h-full"
            />
            {/* Visual Track */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden relative">
                 <div
                   className="h-full bg-primary rounded-full"
                   style={{ width: `${((bpm - 20) / (300 - 20)) * 100}%` }}
                 />
            </div>
            {/* Visual Thumb */}
            <div
               className="absolute w-6 h-6 bg-primary rounded-full shadow-md pointer-events-none"
               style={{ left: `calc(${((bpm - 20) / (300 - 20)) * 100}% - 12px)` }}
            />
        </div>

        <button
          onClick={handleIncrease}
          className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          aria-label="Increase Tempo"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

export default BpmControl;