import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { generateTask, setDetectedChordName, clearNotes, toggleNote, markTaskSolved } from '../store/slices/trainerSlice';
import { identifyChordFromMidi } from '../services/chordLogic';
import { audioEngine } from '../services/audioEngine';
import Piano from './Piano';
import Staff from './Staff';
import { Volume2, ArrowRight, RefreshCw, ArrowLeft, CheckCircle2, AudioLines, Trophy } from 'lucide-react';

const Trainer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTask, activeNotes, detectedChordName, score, taskSolved } = useSelector((state: RootState) => state.trainer);

  // Redirect if no task (e.g. reload on this page)
  useEffect(() => {
    if (!currentTask) {
        navigate('/');
    }
  }, [currentTask, navigate]);

  // Auto-play sound when task changes
  useEffect(() => {
    if (currentTask) {
        audioEngine.resume().then(() => {
            const timer = setTimeout(() => {
                audioEngine.playChord(currentTask.notes);
            }, 350); 
            return () => clearTimeout(timer);
        });
    }
  }, [currentTask]);

  // Check logic helper
  const isCorrect = React.useMemo(() => {
      if (!currentTask) return false;
      const taskNotesSorted = [...currentTask.notes].sort((a,b) => a-b);
      const userNotesSorted = [...activeNotes].sort((a,b) => a-b);
      
      if (taskNotesSorted.length !== userNotesSorted.length) return false;
      return taskNotesSorted.every((val, index) => val === userNotesSorted[index]);
  }, [currentTask, activeNotes]);

  // Real-time identification and score update
  useEffect(() => {
    // Identify Chord Name
    const identification = identifyChordFromMidi(activeNotes);
    if (identification) {
        dispatch(setDetectedChordName(identification.name));
    } else {
        dispatch(setDetectedChordName(activeNotes.length > 0 ? '...' : ''));
    }

    // Check for score update
    if (isCorrect && !taskSolved) {
        dispatch(markTaskSolved());
        // Optional: Play a success sound here if desired
    }
  }, [activeNotes, dispatch, isCorrect, taskSolved]);

  const playChord = () => {
    if (currentTask) {
        audioEngine.resume();
        audioEngine.playChord(currentTask.notes);
    }
  };

  const playArpeggio = () => {
    if (currentTask) {
        audioEngine.resume();
        audioEngine.playArpeggio(currentTask.notes);
    }
  };

  const handleNext = () => {
    dispatch(generateTask());
  };

  const handlePianoNoteClick = (midi: number) => {
    audioEngine.resume();
    if (!activeNotes.includes(midi)) {
        audioEngine.playNote(midi, 0.5);
    }
    dispatch(toggleNote(midi));
  };

  if (!currentTask) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-4">
            <button 
                onClick={() => navigate('/')} 
                className="flex items-center text-gray-600 hover:text-brand-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                <span className="font-semibold">Settings</span>
            </button>
            <div className="h-6 w-px bg-gray-300 mx-2 hidden sm:block"></div>
            <h2 className="text-xl font-bold text-gray-800 hidden sm:block">Ear Trainer</h2>
        </div>
        
        <div className="flex items-center space-x-4">
            <div className="flex items-center text-amber-600 font-bold space-x-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-200 shadow-sm">
                <Trophy size={18} className="fill-amber-500 stroke-amber-700" />
                <span>Score: {score}</span>
            </div>
            
            <div className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-100 hidden sm:block">
            Root: {identifyChordFromMidi(currentTask.notes)?.root || '?'}
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-8 flex flex-col">
        
        {/* Controls Area */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                <button 
                    onClick={playChord}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-brand-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-brand-700 active:scale-95 transition-all"
                >
                    <Volume2 size={24} />
                    <span className="font-semibold">Chord</span>
                </button>
                <button 
                    onClick={playArpeggio}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
                >
                    <AudioLines size={24} />
                    <span className="font-semibold">Arpeggio</span>
                </button>
            </div>

            <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
                 <button 
                    onClick={() => dispatch(clearNotes())}
                    className="p-3 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200 transition"
                    title="Clear Keys"
                >
                    <RefreshCw size={20} />
                </button>
                <button 
                    onClick={handleNext}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg shadow-md active:scale-95 transition-all text-white
                        ${isCorrect 
                            ? 'bg-green-600 hover:bg-green-700 animate-pulse' 
                            : 'bg-slate-800 hover:bg-slate-900'}`}
                >
                    <span>Next Chord</span>
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>

        {/* Visualization Area */}
        <div className="space-y-6">
            {/* Status & Feedback */}
            <div className={`text-center transition-all duration-500 min-h-[48px] flex items-center justify-center ${isCorrect ? 'scale-105' : 'scale-100'}`}>
                {isCorrect ? (
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-6 py-2 rounded-full font-bold shadow-sm">
                        <CheckCircle2 size={24} />
                        <span>Correct! It's a {detectedChordName}</span>
                    </div>
                ) : (
                     <div className="flex items-center justify-center text-gray-500 font-medium text-lg">
                        {detectedChordName ? `Detected: ${detectedChordName}` : 'Select notes on piano...'}
                    </div>
                )}
            </div>

            {/* Staff */}
            <Staff />

            {/* Piano */}
            <div className="pt-4">
                <Piano 
                    startOctave={3} 
                    numOctaves={3} 
                    activeNotes={activeNotes} 
                    onNoteClick={handlePianoNoteClick}
                />
            </div>
        </div>
      </main>
    </div>
  );
};

export default Trainer;