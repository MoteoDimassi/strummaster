import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StrumStep, Measure } from './types';
import { StrumNode } from './components/StrumNode';
import { Controls } from './components/Controls';
import TunerModal from './components/TunerModal';
import { audioEngine } from './services/audioEngine';
import { Music, Volume2, Info, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';

// Default pattern generator
const generateSteps = (count: number, chord: string = 'Am'): StrumStep[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `step-${Date.now()}-${i}`,
    direction: i % 2 === 0 ? 'down' : 'up',
    strumType: (i === 0 || i === 2 || i === 4 || i === 6) ? 'strum' : 'ghost',
    chord: chord,
    lyrics: ''
  }));
};

const createMeasure = (id: number, chord: string = 'Am'): Measure => ({
  id: `measure-${Date.now()}-${id}`,
  steps: generateSteps(8, chord)
});

const App: React.FC = () => {
  // --- STATE ---
  const [bpm, setBpm] = useState(90);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Data State
  const [measures, setMeasures] = useState<Measure[]>([createMeasure(0, 'Am')]);
  const [activeMeasureIdx, setActiveMeasureIdx] = useState(0);

  // Playback State
  // We track the *global* position relative to the current measure during playback
  const [currentDisplayStepIdx, setCurrentDisplayStepIdx] = useState<number | null>(null);
  
  // Modal State
  const [isTunerModalOpen, setIsTunerModalOpen] = useState(false);
  
  // Global strum pattern state - для отслеживания изменений, которые должны применяться ко всем тактам
  const [globalStrumPattern, setGlobalStrumPattern] = useState<StrumStep[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // --- REFS (for Scheduler) ---
  const nextNoteTimeRef = useRef<number>(0);
  const currentMeasureIdxRef = useRef<number>(0);
  const currentStepIdxRef = useRef<number>(0);
  const timerIDRef = useRef<number | null>(null);
  
  const measuresRef = useRef(measures);
  const bpmRef = useRef(bpm);
  const visualTimeoutsRef = useRef<number[]>([]);

  // Constants
  const LOOKAHEAD = 25.0; 
  const SCHEDULE_AHEAD_TIME = 0.1;

  // Sync refs
  useEffect(() => {
    measuresRef.current = measures;
  }, [measures]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  // --- ACTIONS ---

  const handleMeasureChange = (delta: number) => {
    const newIndex = Math.max(0, Math.min(measures.length - 1, activeMeasureIdx + delta));
    setActiveMeasureIdx(newIndex);
  };

  const addMeasure = () => {
    const currentMeasure = measures[activeMeasureIdx];
    // Copy the entire pattern from the current measure for continuity
    const newMeasure: Measure = {
      id: `measure-${Date.now()}-${measures.length}`,
      steps: currentMeasure.steps.map(step => ({
        ...step,
        id: `step-${Date.now()}-${Math.random()}` // Generate unique IDs for new steps
      }))
    };
    
    // Insert the new measure after the current measure
    const newMeasures = [...measures];
    newMeasures.splice(activeMeasureIdx + 1, 0, newMeasure);
    
    setMeasures(newMeasures);
    setActiveMeasureIdx(activeMeasureIdx + 1); // Jump to the new measure
  };

  const removeMeasure = () => {
    if (measures.length <= 1) return;
    setMeasures(prev => {
      const newMeasures = prev.filter((_, i) => i !== activeMeasureIdx);
      return newMeasures;
    });
    setActiveMeasureIdx(prev => Math.max(0, prev - 1));
  };

  const updateChordForMeasure = (chord: string) => {
    setMeasures(prev => prev.map((m, i) => {
      if (i === activeMeasureIdx) {
        return {
          ...m,
          steps: m.steps.map(s => ({ ...s, chord }))
        };
      }
      return m;
    }));
  };

  const updateStep = (measureIdx: number, stepIdx: number, updates: Partial<StrumStep>) => {
    // Обновляем только текущий такт и помечаем наличие несохраненных изменений
    setMeasures(prev => prev.map((m, i) => {
      if (i === measureIdx) {
        const newSteps = [...m.steps];
        newSteps[stepIdx] = { ...newSteps[stepIdx], ...updates };
        return { ...m, steps: newSteps };
      }
      return m;
    }));
    
    // Помечаем, что есть несохраненные изменения
    setHasUnsavedChanges(true);
  };

  // Функция для применения изменений ко всем тактам
  const applyToAllMeasures = () => {
    const currentMeasure = measures[activeMeasureIdx];
    if (!currentMeasure) return;
    
    // Обновляем глобальный паттерн
    setGlobalStrumPattern([...currentMeasure.steps]);
    
    // Применяем все изменения из текущего такта ко всем тактам
    setMeasures(prev => prev.map(m => {
      const currentChord = m.steps[0]?.chord || 'Am';
      let newSteps = [];
      
      // Сначала создаем нужное количество шагов
      if (currentMeasure.steps.length > m.steps.length) {
        // Если нужно добавить шаги
        newSteps = [...m.steps];
        const stepsToAdd = currentMeasure.steps.length - m.steps.length;
        for (let i = 0; i < stepsToAdd; i++) {
          newSteps.push({
            id: `step-added-${Date.now()}-${i}`,
            direction: (m.steps.length + i) % 2 === 0 ? 'down' : 'up' as any,
            strumType: 'ghost',
            chord: currentChord,
            lyrics: ''
          });
        }
      } else {
        // Если нужно уменьшить количество шагов или оставить как есть
        newSteps = m.steps.slice(0, currentMeasure.steps.length);
      }
      
      // Затем применяем состояния из текущего такта к каждому шагу
      newSteps = newSteps.map((step, idx) => ({
        ...step,
        strumType: currentMeasure.steps[idx].strumType
      }));
      
      return {
        ...m,
        steps: newSteps
      };
    }));
    
    // Сбрасываем флаг несохраненных изменений
    setHasUnsavedChanges(false);
  };

  // Функция для сохранения изменений только в текущем такте
  const saveOnlyInThisMeasure = () => {
    // Просто сбрасываем флаг несохраненных изменений
    setHasUnsavedChanges(false);
  };

  const changeStepCount = (delta: number) => {
    setMeasures(prev => prev.map((m, i) => {
      if (i === activeMeasureIdx) {
        const currentLen = m.steps.length;
        const newLen = Math.max(4, Math.min(16, currentLen + delta));
        const currentChord = m.steps[0]?.chord || 'Am';
        
        // Если количество шагов не изменилось, ничего не делаем
        if (newLen === currentLen) return m;
        
        let newSteps = [...m.steps];
        if (newLen > currentLen) {
          const added = Array.from({ length: newLen - currentLen }, (_, k) => ({
            id: `step-added-${Date.now()}-${k}`,
            direction: (currentLen + k) % 2 === 0 ? 'down' : 'up' as any,
            strumType: 'ghost',
            chord: currentChord,
            lyrics: ''
          }));
          newSteps = [...newSteps, ...added];
        } else {
          newSteps = newSteps.slice(0, newLen);
        }
        
        // Помечаем, что есть несохраненные изменения
        setHasUnsavedChanges(true);
        
        return { ...m, steps: newSteps };
      }
      return m;
    }));
  };

  // Функции для управления модальным окном тюнера
  const openTunerModal = () => {
    setIsTunerModalOpen(true);
  };

  const closeTunerModal = () => {
    setIsTunerModalOpen(false);
  };

  // --- SCHEDULING LOGIC ---

  // NOTE: nextNote must be stable to prevent scheduler re-creation
  const nextNote = useCallback(() => {
    const secondsPerBeat = 60.0 / bpmRef.current;
    const secondsPerEighth = secondsPerBeat / 2;
    nextNoteTimeRef.current += secondsPerEighth;
    
    // Advance logic
    const currentMeasure = measuresRef.current[currentMeasureIdxRef.current];
    currentStepIdxRef.current += 1;

    // Check if end of measure
    if (currentStepIdxRef.current >= currentMeasure.steps.length) {
      currentStepIdxRef.current = 0;
      currentMeasureIdxRef.current += 1;
      
      // Loop song
      if (currentMeasureIdxRef.current >= measuresRef.current.length) {
        currentMeasureIdxRef.current = 0;
      }
    }
  }, []);

  // NOTE: scheduleNote must be stable. Do not read state directly here, use functional updates.
  const scheduleNote = useCallback((measureIdx: number, stepIdx: number, time: number) => {
    const measure = measuresRef.current[measureIdx];
    if (!measure) return;
    const step = measure.steps[stepIdx];
    if (!step) return;

    // 1. Audio
    audioEngine.strum(step.direction, step.chord, step.strumType, time);

    // 2. Visuals
    const currentTime = audioEngine.currentTime;
    const delayMs = (time - currentTime) * 1000;

    const timeoutId = window.setTimeout(() => {
      // Functional update to avoid dependency on activeMeasureIdx state
      setActiveMeasureIdx(prevIdx => {
        if (prevIdx !== measureIdx) return measureIdx;
        return prevIdx;
      });
      setCurrentDisplayStepIdx(stepIdx);
    }, Math.max(0, delayMs));

    visualTimeoutsRef.current.push(timeoutId);
  }, []);

  // NOTE: scheduler must be stable to prevent Effect from re-running and resetting playback
  const scheduler = useCallback(() => {
    if (nextNoteTimeRef.current < audioEngine.currentTime - 0.2) {
        nextNoteTimeRef.current = audioEngine.currentTime;
    }

    while (nextNoteTimeRef.current < audioEngine.currentTime + SCHEDULE_AHEAD_TIME) {
      scheduleNote(currentMeasureIdxRef.current, currentStepIdxRef.current, nextNoteTimeRef.current);
      nextNote();
    }
    
    timerIDRef.current = window.setTimeout(scheduler, LOOKAHEAD);
  }, [nextNote, scheduleNote]); 

  const handleTogglePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      await audioEngine.resume();
      setIsPlaying(true);
    }
  };

  // Playback Effect
  // Critical: This effect must ONLY re-run when isPlaying toggles. 
  // It MUST NOT re-run when activeMeasureIdx changes, otherwise it resets the loop.
  useEffect(() => {
    if (isPlaying) {
      // Start from the beginning of the CURRENT measure
      currentMeasureIdxRef.current = activeMeasureIdx;
      currentStepIdxRef.current = 0;
      nextNoteTimeRef.current = audioEngine.currentTime + 0.1;
      scheduler();
    } else {
      if (timerIDRef.current) window.clearTimeout(timerIDRef.current);
      visualTimeoutsRef.current.forEach(id => window.clearTimeout(id));
      visualTimeoutsRef.current = [];
      setCurrentDisplayStepIdx(null);
    }

    return () => {
      if (timerIDRef.current) window.clearTimeout(timerIDRef.current);
      visualTimeoutsRef.current.forEach(id => window.clearTimeout(id));
      visualTimeoutsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, scheduler]); 

  const activeMeasure = measures[activeMeasureIdx];
  const currentChord = activeMeasure.steps[0]?.chord || 'Am';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-100 selection:bg-amber-500/30 w-full overflow-x-hidden">
      
      {/* Header */}
      <header className="bg-slate-950/50 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-2 rounded-lg shadow-lg shadow-orange-500/20">
              <Music className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                StrumMaster
              </h1>
              <p className="text-xs text-slate-500 font-medium">Guitar Rhythm Trainer</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 border border-slate-800 px-3 py-1 rounded-full">
            <Volume2 size={12} />
            <span>Synth Active</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 gap-8 w-full">
        
        {/* Measure Navigation & Info */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/50 p-4 rounded-xl border border-white/5">
          
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleMeasureChange(-1)}
              disabled={activeMeasureIdx === 0}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col items-center px-4 min-w-[100px]">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Measure</span>
              <span className="text-2xl font-mono font-bold text-white">
                {activeMeasureIdx + 1} <span className="text-slate-500 text-lg">/ {measures.length}</span>
              </span>
            </div>
            <button
              onClick={() => handleMeasureChange(1)}
              disabled={activeMeasureIdx === measures.length - 1}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Chord Editor */}
          <div className="flex items-center gap-3">
             <label className="text-sm text-slate-400 font-medium">Chord:</label>
             <select
               value={currentChord}
               onChange={(e) => updateChordForMeasure(e.target.value)}
               className="bg-slate-900 border border-slate-700 text-amber-400 font-bold text-lg rounded-lg px-3 py-1 focus:ring-2 focus:ring-amber-500 outline-none"
             >
               {['Am', 'A', 'C', 'G', 'D', 'Dm', 'E', 'Em', 'F'].map(c => (
                 <option key={c} value={c}>{c}</option>
               ))}
             </select>
          </div>

          {/* Measure Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={addMeasure}
              className="flex items-center gap-1 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 rounded-lg text-sm font-medium transition-colors border border-emerald-600/30"
            >
              <Plus size={16} /> Add Bar
            </button>
            {measures.length > 1 && (
              <button
                onClick={removeMeasure}
                className="p-2 bg-rose-900/20 hover:bg-rose-900/40 text-rose-400 rounded-lg transition-colors border border-rose-900/30"
                title="Delete Current Measure"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Tuner Button */}
        <div className="w-full flex justify-end">
          <button
            onClick={openTunerModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Тюнер
          </button>
        </div>

        {/* Visualizer Area */}
        <div className="w-full pb-6 pt-2">
          {/* Кнопки управления паттерном */}
          {hasUnsavedChanges && (
            <div className="w-full flex justify-center gap-4 mb-4 animate-pulse">
              <button
                onClick={applyToAllMeasures}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h18m-9-9v18"/>
                  <path d="M3 6h18M3 18h18"/>
                </svg>
                Применить ко всем тактам
              </button>
              <button
                onClick={saveOnlyInThisMeasure}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Сохранить только в этом такте
              </button>
            </div>
          )}
          
          <div className="visualizer-container flex justify-center w-full px-4">
            <div className="strum-container relative flex gap-4 md:gap-6 bg-slate-950/40 p-8 pt-10 rounded-3xl border border-white/5 shadow-2xl items-center justify-center">
              
              {/* Measure Chord Label Background */}
              <div className="absolute top-3 left-4 text-slate-700 font-black text-6xl opacity-10 pointer-events-none select-none">
                {currentChord}
              </div>

              {activeMeasure.steps.map((step, index) => (
                <StrumNode
                  key={step.id}
                  step={step}
                  isActive={currentDisplayStepIdx === index}
                  onClick={() => {
                    // Cycle: ghost -> strum -> mute -> ghost
                    const nextType = step.strumType === 'ghost' ? 'strum'
                      : step.strumType === 'strum' ? 'mute'
                      : 'ghost';
                    updateStep(activeMeasureIdx, index, { strumType: nextType });
                  }}
                  onLyricsChange={(text) => updateStep(activeMeasureIdx, index, { lyrics: text })}
                />
              ))}
            </div>
          </div>
          <p className="text-center text-slate-500 mt-6 flex items-center justify-center gap-2 text-sm">
            <Info size={16} />
            <span className="hidden md:inline">Edit mode:</span> Tap arrow to cycle: Strum &rarr; Mute &rarr; Ghost. Type below arrow for lyrics.
            {hasUnsavedChanges && (
              <span className="ml-2 text-amber-400 font-medium">Есть несохраненные изменения в такте!</span>
            )}
          </p>
        </div>

        {/* Controls */}
        <Controls
          isPlaying={isPlaying}
          bpm={bpm}
          setBpm={setBpm}
          onTogglePlay={handleTogglePlay}
          onReset={() => {
            setIsPlaying(false);
            setCurrentDisplayStepIdx(null);
            currentStepIdxRef.current = 0;
            currentMeasureIdxRef.current = activeMeasureIdx;
          }}
          stepCount={activeMeasure.steps.length}
          onStepCountChange={changeStepCount}
        />

      </main>

      <footer className="p-4 text-center text-slate-700 text-sm">
        StrumMaster v2.0 &bull; Measures & Lyrics
      </footer>

      {/* Tuner Modal */}
      <TunerModal
        isOpen={isTunerModalOpen}
        onClose={closeTunerModal}
      />
    </div>
  );
};

export default App;