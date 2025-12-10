import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { setRootNoteIndex, toggleChordTypeSelection, generateTask, resetScore } from '../store/slices/trainerSlice';
import { NOTE_NAMES, CHORD_TYPES } from '../utils/musicTheory';
import { audioEngine } from '../services/audioEngine';
import { Music, PlayCircle, Settings } from 'lucide-react';

const Welcome: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { rootNoteIndex, selectedChordIndices } = useSelector((state: RootState) => state.trainer);

  const handleStart = () => {
    // Unlock audio context on user interaction
    audioEngine.resume();
    
    // Start fresh
    dispatch(resetScore());
    dispatch(generateTask());
    navigate('/trainer');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl p-8 space-y-8">
        
        <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 text-brand-600 rounded-full mb-4">
                <Music size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Harmonic Ear Trainer</h1>
            <p className="text-gray-600">Configure your session and sharpen your harmonic hearing.</p>
        </div>

        {/* Root Note Selection */}
        <div className="space-y-4">
            <h3 className="flex items-center text-lg font-semibold text-gray-800">
                <Settings size={20} className="mr-2" />
                Select Root Note
            </h3>
            <p className="text-sm text-gray-500">The chord questions will be based on this root note (transposed randomly within octaves).</p>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                {NOTE_NAMES.map((note, index) => (
                    <button
                        key={note}
                        onClick={() => dispatch(setRootNoteIndex(index))}
                        className={`py-2 px-1 rounded-md text-sm font-medium transition-all duration-200
                            ${rootNoteIndex === index 
                                ? 'bg-brand-600 text-white shadow-md transform scale-105' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {note}
                    </button>
                ))}
            </div>
        </div>

        {/* Chord Types Selection */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Select Chord Types</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CHORD_TYPES.map((chord, index) => (
                    <button
                        key={chord.name}
                        onClick={() => dispatch(toggleChordTypeSelection(index))}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200
                            ${selectedChordIndices.includes(index)
                                ? 'border-brand-500 bg-brand-50 text-brand-900 ring-1 ring-brand-500'
                                : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                        <span className="font-medium">{chord.name}</span>
                        {selectedChordIndices.includes(index) && (
                            <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* Action */}
        <div className="pt-4">
            <button
                onClick={handleStart}
                disabled={selectedChordIndices.length === 0}
                className="w-full flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-xl text-lg font-bold shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <PlayCircle size={24} />
                <span>Start Training</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;