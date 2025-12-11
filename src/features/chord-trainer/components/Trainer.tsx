import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { generateTask, setDetectedChordName, clearNotes, toggleNote, markTaskSolved } from '../../../store/slices/chordTrainerSlice';
import { identifyChordFromMidi } from '../utils/chordLogic';
import { audioService } from '../services/audioService';
import Piano from './Piano';
import Staff from './Staff';
import TrainerSettings from './TrainerSettings';
import { Volume2, ArrowRight, RefreshCw, CheckCircle2, AudioLines, Trophy, Settings, RotateCcw } from 'lucide-react';

const Trainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentTask, activeNotes, detectedChordName, score, taskSolved } = useAppSelector((state) => state.chordTrainer);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize task if none exists
  useEffect(() => {
    if (gameStarted && !currentTask) {
        dispatch(generateTask());
    }
  }, [currentTask, dispatch, gameStarted]);

  // Auto-play sound when task changes
  useEffect(() => {
    if (currentTask) {
        audioService.resume().then(() => {
            const timer = setTimeout(() => {
                audioService.playChord(currentTask.notes);
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
        audioService.resume();
        audioService.playChord(currentTask.notes);
    }
  };

  const playArpeggio = () => {
    if (currentTask) {
        audioService.resume();
        audioService.playArpeggio(currentTask.notes);
    }
  };

  const handleNext = () => {
    dispatch(generateTask());
  };

  const handlePianoNoteClick = (midi: number) => {
    audioService.resume();
    if (!activeNotes.includes(midi)) {
        audioService.playNote(midi, 0.5);
    }
    dispatch(toggleNote(midi));
  };

  if (!gameStarted) {
    return <TrainerSettings onStart={() => setGameStarted(true)} />;
  }

  if (!currentTask) return null;

  return (
    <div className="flex flex-col space-y-8">
      {/* Header Info */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
            <div className="flex items-center text-amber-600 font-bold space-x-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-200 shadow-sm">
                <Trophy size={18} className="fill-amber-500 stroke-amber-700" />
                <span>Score: {score}</span>
            </div>
            
            <div className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-100 hidden sm:block">
            Root: {identifyChordFromMidi(currentTask.notes)?.root || '?'}
            </div>
        </div>

        <div className="flex items-center space-x-2">
            <button
                onClick={() => setGameStarted(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                title="Exit"
            >
                <RotateCcw size={20} />
                <span className="hidden sm:inline text-sm font-medium">Exit</span>
            </button>
            <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Settings"
            >
                <Settings size={24} />
            </button>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <TrainerSettings
            isModal
            onClose={() => setIsSettingsOpen(false)}
            onStart={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Controls Area */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <button 
                  onClick={playChord}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-brand-blue text-white px-5 py-3 rounded-lg shadow-md hover:bg-brand-hover active:scale-95 transition-all"
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
    </div>
  );
};

export default Trainer;