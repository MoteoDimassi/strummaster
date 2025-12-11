import React, { useState, useMemo, useEffect } from 'react';
import { musicTheory, MinorFifthOption } from '../services/musicTheory';
import { audioEngine } from '../services/audioEngine';
import { NoteName, GameState, Chord, RomanNumeral, TonalityType, InstrumentType, ScaleDegree } from '../types';
import { CHORD_DURATION } from '../constants';
import { Play, RotateCcw, Volume2, CheckCircle, HelpCircle, Music2, Settings2, ChevronUp, ChevronDown, XCircle, Trophy, Home, Filter, Mic2, X, Ear } from 'lucide-react';

// --- Components ---

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' }> = ({
  className = '', variant = 'primary', children, ...props
}) => {
  const base = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-brand-blue hover:bg-brand-hover text-white shadow-lg shadow-brand-blue/20",
    secondary: "bg-background-surface-tinted hover:bg-accents-neutral-border text-text-primary",
    outline: "border-2 border-accents-neutral-border hover:border-brand-blue text-text-secondary hover:text-brand-blue",
    ghost: "bg-transparent hover:bg-background-surface-tinted text-text-secondary hover:text-text-primary",
    danger: "bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/20"
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-background-secondary border border-accents-neutral-border rounded-xl p-6 shadow-card ${className}`}>{children}</div>
);

const InstrumentSelector: React.FC<{
  current: InstrumentType;
  onChange: (i: InstrumentType) => void;
  compact?: boolean;
}> = ({ current, onChange, compact = false }) => (
  <div className={`flex gap-2 ${compact ? 'text-xs' : ''}`}>
    {(['Пианино', 'Синтезатор', 'Пэд'] as InstrumentType[]).map((inst) => (
      <button
        key={inst}
        onClick={() => onChange(inst)}
        className={`
          ${compact ? 'py-1 px-2' : 'flex-1 py-2 px-3'}
          rounded-lg border font-medium transition-all
          ${current === inst
            ? 'bg-brand-blue/10 border-brand-blue text-brand-blue'
            : 'bg-background-surface-tinted border-transparent text-text-secondary hover:border-accents-neutral-border'}
        `}
      >
        {inst}
      </button>
    ))}
  </div>
);

// --- Main App ---

export const HarmonicEarTrainer: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('SETUP');
  
  // Settings
  const [selectedKey, setSelectedKey] = useState<NoteName>('C');
  const [tonalityType, setTonalityType] = useState<TonalityType>('Мажор');
  const [minorFifthOption, setMinorFifthOption] = useState<MinorFifthOption>('NATURAL');
  const [progLength, setProgLength] = useState<number>(4);
  const [instrument, setInstrument] = useState<InstrumentType>('Пианино');
  
  // New Settings State
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  
  // ID 7 is for Harmonic V. Initialize with all potentially valid IDs to be safe.
  const [activeDegreeIds, setActiveDegreeIds] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7]);

  // Stats
  const [score, setScore] = useState({ correct: 0, wrong: 0 });

  // Game Data
  const [progression, setProgression] = useState<Chord[]>([]);
  const [userAnswers, setUserAnswers] = useState<(RomanNumeral | null)[]>([]);
  const [activeChordIndex, setActiveChordIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Interaction State
  const [openCardIndex, setOpenCardIndex] = useState<number | null>(null);
  const [roundStatus, setRoundStatus] = useState<'PLAYING' | 'ERROR' | 'SUCCESS'>('PLAYING');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Detailed result tracking to manage individual card highlighting
  const [checkedResults, setCheckedResults] = useState<{ wrong: number[]; correct: number[] }>({ wrong: [], correct: [] });

  // Update Audio Engine when instrument changes
  useEffect(() => {
    audioEngine.setInstrument(instrument);
  }, [instrument]);

  // Dynamic available degrees based on selected tonality type
  const allDegrees = useMemo(() => {
    return musicTheory.getScaleDegrees(tonalityType, minorFifthOption);
  }, [tonalityType, minorFifthOption]);
  
  // Computed active degrees for game generation logic
  const activeDegrees = useMemo(() => {
    return allDegrees.filter(d => activeDegreeIds.includes(d.id));
  }, [allDegrees, activeDegreeIds]);

  // -- Actions --

  const toggleDegree = (id: number) => {
    if (id === 0) return; // Prevent disabling Tonic (I/i)
    
    setActiveDegreeIds(prev => {
        if (prev.includes(id)) {
            return prev.filter(d => d !== id);
        } else {
            return [...prev, id];
        }
    });
  };

  const startGame = () => {
    // Generate using ONLY the active degrees
    const newProgression = musicTheory.generateProgression(selectedKey, activeDegrees, progLength);
    setProgression(newProgression);
    setUserAnswers(new Array(newProgression.length).fill(null));
    setCheckedResults({ wrong: [], correct: [] });
    setRoundStatus('PLAYING');
    setOpenCardIndex(null);
    setGameState('PLAYING');
    setIsSettingsOpen(false);
    // Auto play after a short delay
    setTimeout(() => playProgression(newProgression), 500);
  };

  const playProgression = (chordsToPlay: Chord[]) => {
    if (isPlaying) return;
    setIsPlaying(true);
    setActiveChordIndex(0);

    // Visual sync loop
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= chordsToPlay.length) {
        clearInterval(interval);
        setActiveChordIndex(null);
        setIsPlaying(false);
      } else {
        setActiveChordIndex(current);
      }
    }, CHORD_DURATION * 1000);

    // Audio Engine Trigger
    audioEngine.playProgression(chordsToPlay.map(c => c.frequencies), CHORD_DURATION);
  };

  const playTonic = () => {
    if (isPlaying) return;
    const tonicDegree = allDegrees[0]; // I or i
    const tonicChord = musicTheory.buildChord(selectedKey, tonicDegree);
    audioEngine.playChord(tonicChord.frequencies, CHORD_DURATION);
  };

  const handleAnswer = (chordIndex: number, degree: ScaleDegree) => {
    // 1. Play the sound of the selected degree for comparison ONLY if enabled
    if (previewMode) {
        const previewChord = musicTheory.buildChord(selectedKey, degree);
        audioEngine.playChord(previewChord.frequencies, 0.8);
    }

    // 2. Update state
    const newAnswers = [...userAnswers];
    newAnswers[chordIndex] = degree.roman;
    setUserAnswers(newAnswers);
    setOpenCardIndex(null); // Close drawer after selection
    
    // Remove specific indices from results so they stop being highlighted
    setCheckedResults(prev => ({
        wrong: prev.wrong.filter(i => i !== chordIndex),
        correct: prev.correct.filter(i => i !== chordIndex)
    }));
  };

  const checkAnswers = () => {
    const wrongIndices: number[] = [];
    const correctIndices: number[] = [];
    
    progression.forEach((chord, idx) => {
        if (chord.roman === userAnswers[idx]) {
            correctIndices.push(idx);
        } else {
            wrongIndices.push(idx);
        }
    });

    setCheckedResults({ wrong: wrongIndices, correct: correctIndices });
    
    if (wrongIndices.length === 0) {
      setScore(s => ({ ...s, correct: s.correct + 1 }));
      setRoundStatus('SUCCESS');
    } else {
      setScore(s => ({ ...s, wrong: s.wrong + 1 }));
      setRoundStatus('ERROR');
    }
  };

  const playSingleChord = (chord: Chord, index: number) => {
    audioEngine.playChord(chord.frequencies, CHORD_DURATION);
    setActiveChordIndex(index);
    setTimeout(() => setActiveChordIndex(null), CHORD_DURATION * 1000);
  };

  const resetGame = () => {
    setGameState('SETUP');
    setProgression([]);
    setUserAnswers([]);
    setCheckedResults({ wrong: [], correct: [] });
    setRoundStatus('PLAYING');
    setScore({ correct: 0, wrong: 0 });
    setIsSettingsOpen(false);
  };

  // --- Render Helpers ---

  const renderSetup = () => (
    <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-2xl py-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-4 bg-brand-blue/10 rounded-full mb-4 ring-1 ring-brand-blue/50">
          <Music2 className="w-12 h-12 text-brand-blue" />
        </div>
        <h1 className="text-4xl font-bold text-text-primary tracking-tight">Гармонический Тренажер Слуха</h1>
        <p className="text-text-secondary max-w-md mx-auto">
          Настройте свою тренировочную сессию. Выберите тональность, лад и ступени.
        </p>
      </div>

      <Card className="w-full space-y-8">
        {/* Key Selection */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
            <Settings2 size={16} /> Выберите основную тональность
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {musicTheory.getAllKeys().map((key) => (
              <button
                key={key}
                onClick={() => setSelectedKey(key)}
                className={`p-2 rounded-md text-sm font-bold transition-all ${
                  selectedKey === key
                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20 ring-2 ring-brand-blue ring-offset-2 ring-offset-background-secondary'
                    : 'bg-background-surface-tinted text-text-secondary hover:bg-accents-neutral-border hover:text-text-primary'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tonality & Instrument */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">Лад</label>
              <div className="flex bg-background-surface-tinted p-1 rounded-lg">
                {(['Мажор', 'Минор'] as TonalityType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTonalityType(type)}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                      tonalityType === type
                        ? 'bg-background-secondary text-text-primary shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              
              {/* Minor 5th Option */}
              {tonalityType === 'Минор' && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-xs font-medium text-text-secondary mb-2">Качество V ступени</label>
                  <div className="flex flex-col gap-1">
                     {[
                       { id: 'NATURAL', label: 'Натуральный (v)', desc: 'Минорная квинта' },
                       { id: 'HARMONIC', label: 'Гармонический (V)', desc: 'Мажорная квинта' },
                       { id: 'BOTH', label: 'Смешанный (v & V)', desc: 'Оба типа' }
                     ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setMinorFifthOption(opt.id as MinorFifthOption)}
                          className={`flex items-center justify-between px-3 py-2 rounded text-sm transition-all border ${
                            minorFifthOption === opt.id
                              ? 'bg-brand-blue/10 border-brand-blue text-brand-blue'
                              : 'bg-background-surface-tinted border-transparent text-text-secondary hover:bg-accents-neutral-border'
                          }`}
                        >
                           <span className="font-medium">{opt.label}</span>
                           <span className="text-xs opacity-50">{opt.desc}</span>
                        </button>
                     ))}
                  </div>
                </div>
              )}
            </div>

            {/* Instrument Selection */}
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                   <Mic2 size={16} /> Звук
                </label>
                <InstrumentSelector current={instrument} onChange={setInstrument} />
            </div>
          </div>

          {/* Length Selection */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">Длина последовательности</label>
            <div className="flex items-center gap-4">
               <input
                 type="range"
                 min="3"
                 max="8"
                 step="1"
                 value={progLength}
                 onChange={(e) => setProgLength(parseInt(e.target.value))}
                 className="w-full h-2 bg-background-surface-tinted rounded-lg appearance-none cursor-pointer accent-brand-blue"
               />
               <span className="text-xl font-bold text-brand-blue w-8 text-center">{progLength}</span>
            </div>
             <p className="text-xs text-text-secondary mt-2">
              Количество аккордов в последовательности.
             </p>
          </div>
        </div>

        {/* Scale Degree Selection */}
        <div>
           <label className="block text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
             <Filter size={16} /> Активные ступени лада
           </label>
           <div className="flex flex-wrap gap-2">
              {allDegrees.map((degree) => {
                  const isActive = activeDegreeIds.includes(degree.id);
                  const isTonic = degree.id === 0;
                  return (
                      <button
                        key={degree.id}
                        onClick={() => toggleDegree(degree.id)}
                        disabled={isTonic}
                        className={`
                           flex-1 min-w-[3rem] flex flex-col items-center justify-center p-2 rounded-lg border transition-all
                           ${isActive
                              ? 'bg-brand-blue/10 border-brand-blue text-brand-blue shadow-[0_0_10px_rgba(0,102,204,0.15)]'
                              : 'bg-background-surface-tinted border-transparent text-text-secondary hover:border-accents-neutral-border'}
                           ${isTonic ? 'opacity-80 cursor-default' : 'cursor-pointer active:scale-95'}
                        `}
                        title={isTonic ? "Тоника должна быть активна" : `Переключить ${degree.roman}`}
                      >
                         <span className="text-sm md:text-base font-bold">{degree.roman}</span>
                         {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1" />}
                      </button>
                  );
              })}
           </div>
           <p className="text-xs text-text-secondary mt-2">
             Нажмите для переключения. Только выбранные ступени будут использоваться в последовательности.
           </p>
        </div>

        <div className="pt-6 border-t border-accents-neutral-border">
           <Button onClick={startGame} className="w-full py-4 text-lg">
             Начать тренировку
           </Button>
        </div>
      </Card>
    </div>
  );

  const renderGame = () => (
    <div className="w-full max-w-5xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-background-secondary/80 p-4 rounded-xl backdrop-blur-sm border border-accents-neutral-border relative z-30 shadow-minimal">
        
        {/* Info & Stats */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
           
           <div className="flex items-center gap-2 relative">
             <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-2 rounded-lg border transition-all ${isSettingsOpen ? 'bg-brand-blue/10 border-brand-blue text-brand-blue' : 'bg-background-surface-tinted border-accents-neutral-border text-text-secondary hover:text-text-primary'}`}
                title="Настройки звука"
             >
                <Settings2 size={18} />
             </button>
             
             {isSettingsOpen && (
               <div className="absolute top-full left-0 mt-2 p-4 bg-background-secondary border border-accents-neutral-border rounded-lg shadow-xl z-50 w-72 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                        <Music2 size={12} /> Настройки аудио
                    </span>
                    <button onClick={() => setIsSettingsOpen(false)} className="text-text-secondary hover:text-text-primary"><X size={14}/></button>
                  </div>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs text-text-secondary mb-2 block">Инструмент</label>
                          <InstrumentSelector current={instrument} onChange={setInstrument} compact />
                      </div>

                      <div className="pt-4 border-t border-accents-neutral-border">
                          <label className="flex items-center justify-between cursor-pointer group">
                             <div className="flex flex-col">
                                 <span className="text-sm font-medium text-text-primary transition-colors flex items-center gap-2">
                                     <Ear size={14} /> Предпросмотр аккордов
                                 </span>
                                 <span className="text-[10px] text-text-secondary">Воспроизводить звук при выборе ответа</span>
                             </div>
                             
                             <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={previewMode}
                                    onChange={(e) => setPreviewMode(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-background-surface-tinted peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-brand-blue/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                             </div>
                          </label>
                      </div>
                  </div>
               </div>
             )}

             <div className="bg-background-surface-tinted px-3 py-2 rounded-lg text-sm font-mono text-brand-blue border border-accents-neutral-border shadow-inner flex flex-col leading-none justify-center h-10">
                <span className="font-bold">{selectedKey} {tonalityType}</span>
                {tonalityType === 'Минор' && (
                    <span className="text-[10px] opacity-70">
                        {minorFifthOption === 'NATURAL' ? 'Натуральный' : minorFifthOption === 'HARMONIC' ? 'Гармонический' : 'Смешанный'}
                    </span>
                )}
             </div>
           </div>
           
           <div className="flex items-center gap-4 text-sm font-bold bg-background-surface-tinted px-4 py-2 rounded-lg border border-accents-neutral-border h-10">
              <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14}/> {score.correct}</span>
              <span className="text-text-secondary">|</span>
              <span className="text-destructive flex items-center gap-1"><XCircle size={14}/> {score.wrong}</span>
           </div>
        </div>

        {/* Play Controls */}
        <div className="flex gap-3">
            <button
                onClick={playTonic}
                disabled={isPlaying}
                className="flex items-center gap-2 px-3 py-2 bg-background-surface-tinted hover:bg-accents-neutral-border border border-accents-neutral-border rounded-lg text-green-600 hover:text-green-700 font-medium disabled:opacity-50 transition-colors"
                title="Воспроизвести тонический аккорд"
            >
                <Home size={18} />
                <span className="hidden sm:inline">Тоника</span>
            </button>
            
            <button
                onClick={() => playProgression(progression)}
                disabled={isPlaying}
                className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-brand-hover rounded-lg text-white font-medium disabled:opacity-50 transition-colors shadow-lg shadow-brand-blue/20"
            >
                <Play size={18} fill={isPlaying ? "currentColor" : "none"} />
                {isPlaying ? 'Воспроизведение...' : 'Повторить'}
            </button>
            <Button variant="ghost" onClick={resetGame} className="text-sm">
                <RotateCcw size={16} /> Выход
            </Button>
        </div>
      </div>

      {/* Progression Slots */}
      <div 
        className={`grid gap-4 ${
          progLength <= 4 ? 'grid-cols-2 md:grid-cols-4' : 
          progLength <= 6 ? 'grid-cols-3 md:grid-cols-6' : 
          'grid-cols-4 md:grid-cols-8'
        }`}
      >
        {progression.map((chord, index) => {
          const isPlayingCurrent = activeChordIndex === index;
          const userAnswer = userAnswers[index];
          
          // Logic for feedback
          const isSuccess = roundStatus === 'SUCCESS';
          
          const isWrong = checkedResults.wrong.includes(index);
          const isCorrect = isSuccess || checkedResults.correct.includes(index);
          
          const isOpen = openCardIndex === index;

          return (
            <div 
              key={index} 
              className={`relative group transition-all duration-300 ${isPlayingCurrent ? '-translate-y-2' : ''}`}
            >
              {/* Play Indicator */}
              {isPlayingCurrent && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-brand-blue animate-bounce z-10">
                  <Volume2 size={20} />
                </div>
              )}

              {/* CARD CONTAINER */}
              <div
                className={`
                  h-36 md:h-48 rounded-xl border-2 flex flex-col relative overflow-hidden bg-background-secondary shadow-card transition-colors
                  ${isPlayingCurrent ? 'border-brand-blue shadow-lg ring-1 ring-brand-blue' : 'border-accents-neutral-border'}
                  ${isWrong ? 'border-destructive bg-destructive/5' : ''}
                  ${isCorrect ? 'border-green-500 bg-green-50' : ''}
                `}
              >
                {/* Main Content (Click to Listen) */}
                <div
                    className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-background-surface-tinted transition-colors"
                    onClick={() => playSingleChord(chord, index)}
                >
                    <div className="text-2xl md:text-3xl font-bold">
                        {userAnswer ? (
                            <span className={`
                                ${isWrong ? 'text-destructive' : ''}
                                ${isCorrect ? 'text-green-600' : ''}
                                ${!isWrong && !isCorrect ? 'text-brand-blue' : ''}
                            `}>
                                {userAnswer}
                            </span>
                        ) : (
                            <span className="text-text-secondary">?</span>
                        )}
                    </div>
                    {/* Show actual chord info ONLY on Success */}
                    {isSuccess && (
                        <span className="text-[10px] md:text-xs text-green-600/80 uppercase tracking-widest mt-1">
                            {chord.root} {chord.quality}
                        </span>
                    )}
                </div>

                {/* Drawer Trigger Button (Bottom) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // Toggle drawer
                        setOpenCardIndex(isOpen ? null : index);
                    }}
                    disabled={isSuccess} // Lock when finished
                    className={`
                        h-8 w-full flex items-center justify-center border-t border-accents-neutral-border transition-colors
                        ${isSuccess ? 'cursor-default opacity-0' : 'hover:bg-background-surface-tinted cursor-pointer text-text-secondary hover:text-brand-blue'}
                    `}
                >
                    <ChevronUp size={16} />
                </button>

                {/* SLIDING DRAWER (Overlay) */}
                <div className={`
                    absolute inset-0 bg-background-secondary z-20 transition-transform duration-300 flex flex-col
                    ${isOpen ? 'translate-y-0' : 'translate-y-full'}
                `}>
                    {/* Header / Close */}
                    <button
                        onClick={() => setOpenCardIndex(null)}
                        className="w-full h-8 flex items-center justify-center bg-background-surface-tinted hover:bg-accents-neutral-border text-text-secondary hover:text-text-primary border-b border-accents-neutral-border"
                    >
                        <ChevronDown size={16} />
                    </button>
                    
                    {/* Grid Options (Filtered by activeDegrees) */}
                    <div className="flex-1 overflow-y-auto p-2">
                        <div className="grid grid-cols-3 gap-2">
                            {activeDegrees.map(deg => (
                                <button
                                    key={deg.id}
                                    onClick={() => handleAnswer(index, deg)}
                                    className={`
                                        aspect-square flex items-center justify-center rounded text-xs md:text-sm font-bold transition-all
                                        ${userAnswer === deg.roman
                                            ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                                            : 'bg-background-surface-tinted text-text-secondary hover:bg-accents-neutral-border hover:text-text-primary'}
                                    `}
                                >
                                    {deg.roman}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex justify-center mt-6 pb-8">
        {roundStatus === 'SUCCESS' ? (
          <div className="flex flex-col items-center gap-4 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 text-xl font-bold text-green-600">
               <Trophy /> Идеально!
            </div>
            <div className="flex gap-4">
              <Button onClick={() => playProgression(progression)} variant="secondary">
                <Play size={18} /> Слушать снова
              </Button>
              <Button onClick={startGame} variant="primary">
                 Следующая последовательность
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 w-full max-w-md">
              <Button
                onClick={checkAnswers}
                disabled={userAnswers.includes(null)}
                variant={roundStatus === 'ERROR' ? 'danger' : 'primary'}
                className="w-full py-3 text-lg"
              >
                {roundStatus === 'ERROR' ? 'Попробовать снова' : 'Проверить ответы'}
              </Button>
              {roundStatus === 'ERROR' && checkedResults.wrong.length > 0 && (
                  <p className="text-destructive text-sm flex items-center gap-1 animate-pulse">
                      <XCircle size={14} /> Неверные варианты выделены. Не сдавайтесь!
                  </p>
              )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-primary text-text-primary p-4 md:p-8 flex items-center justify-center font-sans">
      {gameState === 'SETUP' ? renderSetup() : renderGame()}
    </div>
  );
}