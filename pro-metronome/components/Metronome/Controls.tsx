import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Play, Pause, MousePointerClick } from 'lucide-react';
import { RootState } from '../../store/store';
import { togglePlay, setBpm } from '../../store/metronomeSlice';

const Controls: React.FC = () => {
  const dispatch = useDispatch();
  const isPlaying = useSelector((state: RootState) => state.metronome.isPlaying);
  
  // Tap Tempo State
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  const handleTap = useCallback(() => {
    const now = Date.now();
    
    // Reset if it's been a while (2 seconds) since last tap
    let newTimes = [...tapTimes];
    if (newTimes.length > 0 && now - newTimes[newTimes.length - 1] > 2000) {
      newTimes = [];
    }

    newTimes.push(now);
    
    // Keep only last 5 taps
    if (newTimes.length > 5) {
      newTimes.shift();
    }
    
    setTapTimes(newTimes);

    if (newTimes.length >= 2) {
      // Calculate intervals
      let intervals = [];
      for (let i = 1; i < newTimes.length; i++) {
        intervals.push(newTimes[i] - newTimes[i - 1]);
      }
      
      // Average interval
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      
      dispatch(setBpm(calculatedBpm));
    }
  }, [tapTimes, dispatch]);

  return (
    <div className="flex gap-4 justify-center mb-10">
      <button
        onClick={() => dispatch(togglePlay())}
        className={`
          flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-white font-semibold text-lg transition-all shadow-md active:scale-95
          ${isPlaying ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-400 hover:bg-orange-500'}
        `}
      >
        {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
        {isPlaying ? 'Стоп' : 'Старт'}
      </button>

      <button
        onClick={handleTap}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-400 hover:bg-emerald-500 text-white font-semibold text-lg transition-all shadow-md active:scale-95"
      >
        <MousePointerClick />
        Ручной Темп
      </button>
    </div>
  );
};

export default Controls;
