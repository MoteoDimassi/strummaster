import React, { useState, useEffect } from 'react';
import { Play, Square, RotateCcw } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import {
  setBpm,
  setIsPlaying,
  setActiveMeasureIdx,
  setCurrentDisplayStepIdx,
  reset as resetPlayer,
  changeStepCount
} from '../../../store/slices/playerSlice';
import { playerService } from '../services/PlayerService';
import { audioEngineService } from '../../audio/services/AudioEngineService';

export const PlayerControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bpm, isPlaying, measures, activeMeasureIdx } = useAppSelector(state => state.player);
  const activeMeasure = measures[activeMeasureIdx];
  const stepCount = activeMeasure?.steps.length || 8;
  
  const [tempBpm, setTempBpm] = useState<string>(bpm.toString());

  // Sync player service with Redux state
  useEffect(() => {
    playerService.setMeasures(measures);
    playerService.setActiveMeasureIdx(activeMeasureIdx);
    playerService.setConfig({ bpm });
  }, [measures, activeMeasureIdx, bpm]);

  // Subscribe to player service events
  useEffect(() => {
    const unsubscribeStep = playerService.onStep((data) => {
      // Обновляем текущий шаг для анимации
      dispatch(setCurrentDisplayStepIdx(data.stepIndex));
    });

    const unsubscribePlay = playerService.onPlay((data) => {
      // Обновляем состояние Redux при начале воспроизведения
      dispatch(setIsPlaying(data.isPlaying));
      dispatch(setActiveMeasureIdx(data.measureIdx));
    });

    const unsubscribeStop = playerService.onStop((data) => {
      // Обновляем состояние Redux при остановке
      dispatch(setIsPlaying(data.isPlaying));
      dispatch(setActiveMeasureIdx(data.measureIdx));
      // Сбрасываем отображаемый шаг при остановке
      dispatch(setCurrentDisplayStepIdx(null));
    });

    return () => {
      unsubscribeStep();
      unsubscribePlay();
      unsubscribeStop();
    };
  }, [dispatch]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      playerService.stop();
    } else {
      await playerService.start();
    }
  };

  const handleReset = () => {
    playerService.reset();
    dispatch(resetPlayer());
  };

  const handleStepCountChange = (delta: number) => {
    dispatch(changeStepCount(delta));
  };

  const handleBpmChange = (newBpm: number) => {
    dispatch(setBpm(newBpm));
    playerService.setConfig({ bpm: newBpm });
  };

  return (
    <div className="w-full max-w-3xl bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Play/Stop Button */}
        <button
          onClick={handleTogglePlay}
          className={`
            flex items-center justify-center w-20 h-20 rounded-full shadow-lg transition-all duration-200
            ${isPlaying 
              ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30' 
              : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
            }
          `}
        >
          {isPlaying ? (
            <Square fill="white" className="text-white ml-0.5" size={32} />
          ) : (
            <Play fill="white" className="text-white ml-1" size={36} />
          )}
        </button>

        {/* BPM Control */}
        <div className="flex-1 w-full flex flex-col gap-2">
          <div className="flex justify-between text-slate-300 font-medium">
            <span>Tempo</span>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="range"
              min="35"
              max="250"
              value={bpm}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                handleBpmChange(newValue);
                setTempBpm(newValue.toString());
              }}
              className="flex-1 h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tempBpm}
                onChange={(e) => {
                  const value = e.target.value;
                  const digitsOnly = value.replace(/\D/g, '');
                  
                  const cursorPos = e.target.selectionStart;
                  
                  let newValue = digitsOnly;
                  if (cursorPos < value.length) {
                    const beforeCursor = digitsOnly.substring(0, cursorPos);
                    const afterCursor = digitsOnly.substring(cursorPos);
                    newValue = afterCursor;
                  }
                  
                  setTempBpm(newValue);
                  
                  if (newValue !== '') {
                    handleBpmChange(Number(newValue));
                  }
                }}
                onBlur={(e) => {
                  const value = Number(tempBpm);
                  if (tempBpm === '' || value < 35) {
                    handleBpmChange(35);
                    setTempBpm('35');
                  } else if (value > 250) {
                    handleBpmChange(250);
                    setTempBpm('250');
                  } else {
                    handleBpmChange(value);
                  }
                }}
                onFocus={(e) => {
                  e.target.select();
                  setTempBpm(bpm.toString());
                }}
                className="w-16 bg-slate-900 text-amber-400 font-mono text-sm rounded-lg px-2 py-1 border border-slate-700 focus:ring-2 focus:ring-amber-500 outline-none text-center"
              />
              <span className="text-amber-400 font-mono text-sm">BPM</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Separator */}
        <div className="hidden md:block w-px h-16 bg-slate-700"></div>

        {/* Length Controls */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-slate-300 text-sm font-medium">Length</span>
          <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-700">
            <button 
              onClick={() => handleStepCountChange(-2)}
              disabled={stepCount <= 4}
              className="p-2 hover:bg-slate-700 rounded-md disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <span className="w-8 text-center font-mono font-bold text-lg text-slate-200">{stepCount}</span>
             <button 
              onClick={() => handleStepCountChange(2)}
              disabled={stepCount >= 16}
              className="p-2 hover:bg-slate-700 rounded-md disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Reset */}
        <button 
          onClick={handleReset}
          className="p-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
          title="Reset Pattern"
        >
          <RotateCcw size={20} />
        </button>

      </div>
    </div>
  );
};