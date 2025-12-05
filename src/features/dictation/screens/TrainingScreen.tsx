import React, { useState, useEffect } from 'react';
import { GameSettings, StaveNote, Note } from '../../../core/dictation/types';
import { generateScale, generateMelody } from '../../../core/dictation/musicTheory';
import { audioClient } from '../../../core/dictation/AudioClient';
import { Stave } from '../components/Stave';
import { PianoKeyboard } from '../components/PianoKeyboard';
import { Play, RefreshCw, Check, ArrowLeft, Volume2, Music4, Trash2, Keyboard, X } from 'lucide-react';

interface TrainingScreenProps {
  settings: GameSettings;
  onBack: () => void;
}

export const TrainingScreen: React.FC<TrainingScreenProps> = ({ settings, onBack }) => {
  const [scalePool, setScalePool] = useState<Note[]>([]);
  const [targetMelody, setTargetMelody] = useState<Note[]>([]);
  const [userNotes, setUserNotes] = useState<StaveNote[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [playCount, setPlayCount] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'success' | 'error'>('none');
  const [message, setMessage] = useState<string>('');
  const [inputMode, setInputMode] = useState<'write' | 'trial'>('write');
  
  // Counters
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  // Initialize Game
  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const scale = generateScale(settings.rootNote, settings.scaleType, settings.selectedOctaves, settings.scaleRange);
    const melody = generateMelody(scale, settings.melodyNoteCount, settings.difficulty);
    
    setScalePool(scale);
    setTargetMelody(melody);
    setUserNotes([]);
    setSelectedNoteId(null);
    setPlayCount(0);
    setFeedback('none');
    setMessage(`Listen to the ${settings.melodyNoteCount}-note melody.`);
  };

  const playMelody = async () => {
    if (settings.replayLimit !== 'infinity' && playCount >= settings.replayLimit) {
        setMessage("Replay limit reached!");
        return;
    }

    setPlayCount(p => p + 1);
    const sequence = targetMelody.map(n => ({ frequency: n.frequency, duration: 0.6 }));
    await audioClient.playSequence(sequence);
  };

  const playScale = async () => {
    // Play one octave of the scale from the lowest selected
    if (scalePool.length === 0) return;
    const startMidi = scalePool[0].midi;
    // Get first 8 notes if available
    const sequence = scalePool.filter(n => n.midi < startMidi + 13).map(n => ({ frequency: n.frequency, duration: 0.4 }));
    await audioClient.playSequence(sequence);
  };

  const playNote = async (note: Note) => {
    await audioClient.playTone(note.frequency, 0.4);
  };

  const handlePianoKeyClick = (note: Note, isScaleNote: boolean) => {
      if (inputMode === 'trial') {
        playNote(note);
        return;
      }

      // In write mode, we DO NOT play the sound, as requested.
      
      // In write mode, only allow scale notes?
      if (!isScaleNote) {
          setMessage("Note not in scale!");
          return; 
      }

      if (feedback === 'success') return; 
      
      // Reset error states
      if (feedback === 'error') {
          setFeedback('none');
          setUserNotes(prev => prev.map(n => ({ ...n, isError: false })));
      }

      if (selectedNoteId) {
          // Replace existing note
          setUserNotes(prev => prev.map(n => {
              if (n.id === selectedNoteId) {
                  return { ...note, id: selectedNoteId }; 
              }
              return n;
          }));
          setSelectedNoteId(null);
      } else {
          // Add new note
          const newId = Math.random().toString(36).substr(2, 9);
          const newNote: StaveNote = { ...note, id: newId };
          setUserNotes(prev => [...prev, newNote]);
      }
  };

  const handleNoteClick = (id: string) => {
      if (feedback === 'success') return;
      setSelectedNoteId(id === selectedNoteId ? null : id); 
  };

  const deleteSelectedNote = () => {
      if (feedback === 'success' || !selectedNoteId) return;
      setUserNotes(prev => prev.filter(n => n.id !== selectedNoteId));
      setSelectedNoteId(null);
  };

  const clearAllNotes = () => {
      setUserNotes([]);
      setSelectedNoteId(null);
  };

  const checkSolution = () => {
    setSelectedNoteId(null);

    if (userNotes.length !== targetMelody.length) {
        setMessage(`Incorrect length. Expected ${targetMelody.length} notes.`);
        setFeedback('error');
        setErrorCount(c => c + 1);
        return;
    }

    let hasError = false;
    const checkedNotes = userNotes.map((uNote, index) => {
        const isCorrect = uNote.midi === targetMelody[index].midi;
        if (!isCorrect) hasError = true;
        return { ...uNote, isError: !isCorrect };
    });

    setUserNotes(checkedNotes);

    if (hasError) {
        setFeedback('error');
        setMessage("Some notes are incorrect. Tap a red note to correct it.");
        setErrorCount(c => c + 1);
    } else {
        setFeedback('success');
        setMessage("Correct! Generating new melody...");
        setSuccessCount(c => c + 1);
        const winSequence = [523.25, 659.25, 783.99, 1046.50].map(f => ({frequency: f, duration: 0.1}));
        audioClient.playSequence(winSequence);
        setTimeout(startNewRound, 2000);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl p-2 md:p-4 text-slate-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 text-sm font-medium">
            <ArrowLeft size={18} className="mr-1"/> Quit
        </button>
        
        <div className="flex gap-3">
             <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">
                 <Check size={14} /> {successCount}
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200">
                 <X size={14} /> {errorCount}
             </div>
             <div className="bg-slate-200 px-3 py-1 rounded-full text-xs font-semibold text-slate-700">
                Replays: {settings.replayLimit === 'infinity' ? playCount : `${playCount} / ${settings.replayLimit}`}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Col: Controls */}
        <div className="lg:col-span-1 space-y-3">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                <div className="flex gap-2">
                    <button 
                        onClick={playMelody}
                        disabled={settings.replayLimit !== 'infinity' && playCount >= settings.replayLimit}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                            settings.replayLimit !== 'infinity' && playCount >= settings.replayLimit
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        <Play size={18} /> Melody
                    </button>
                    
                    <button 
                        onClick={playScale}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                    >
                        <Music4 size={18} /> Scale
                    </button>
                </div>
            </div>

            <div className={`p-3 rounded-xl border text-center transition-colors ${
                feedback === 'success' ? 'bg-green-50 border-green-200' : 
                feedback === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-100'
            }`}>
                <p className={`text-sm font-medium ${
                    feedback === 'success' ? 'text-green-600' : 
                    feedback === 'error' ? 'text-red-500' : 'text-slate-700'
                }`}>
                    {message}
                </p>
            </div>
        </div>

        {/* Right Col: Stave & Input */}
        <div className="lg:col-span-2 space-y-4">
             <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
                <Stave 
                    notes={userNotes} 
                    interactive={true} 
                    selectedNoteId={selectedNoteId}
                    onNoteClick={handleNoteClick} 
                />
             </div>

             {/* Action Bar */}
             <div className="flex flex-wrap justify-between gap-2 items-center bg-slate-100 p-2 rounded-lg">
                <div className="flex gap-2">
                    <button 
                        onClick={clearAllNotes}
                        className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors text-xs font-medium"
                    >
                        <RefreshCw size={14} /> Clear
                    </button>
                    <button 
                        onClick={deleteSelectedNote}
                        disabled={!selectedNoteId}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-xs font-medium ${
                            selectedNoteId 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                : 'text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>

                <div className="flex items-center gap-2">
                     <button 
                        onClick={() => setInputMode(m => m === 'write' ? 'trial' : 'write')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors border ${
                            inputMode === 'write' 
                                ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' 
                                : 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200'
                        }`}
                    >
                        {inputMode === 'write' ? <Keyboard size={14}/> : <Volume2 size={14}/>}
                        {inputMode === 'write' ? 'Write Mode' : 'Trial Mode'}
                    </button>

                    <button 
                        onClick={checkSolution}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-semibold shadow-sm transition-transform active:scale-95"
                    >
                        <Check size={16} /> Check
                    </button>
                </div>
             </div>

             {/* Piano Keyboard Component */}
             <PianoKeyboard 
                octaves={settings.selectedOctaves}
                scaleNotes={scalePool}
                onNoteClick={handlePianoKeyClick}
                disableNonScaleNotes={inputMode === 'write'}
             />
        </div>
      </div>
    </div>
  );
};