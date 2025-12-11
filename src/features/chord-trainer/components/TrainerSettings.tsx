import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setRootNoteIndex, toggleChordTypeSelection, generateTask, resetScore } from '../../../store/slices/chordTrainerSlice';
import { NOTE_NAMES, CHORD_TYPES } from '../utils/musicTheory';
import { Settings, X } from 'lucide-react';

interface TrainerSettingsProps {
  onStart: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

const TrainerSettings: React.FC<TrainerSettingsProps> = ({ onStart, isModal = false, onClose }) => {
  const dispatch = useAppDispatch();
  const { rootNoteIndex, selectedChordIndices } = useAppSelector((state) => state.chordTrainer);

  const handleStart = () => {
    dispatch(resetScore());
    dispatch(generateTask());
    onStart();
  };

  const content = (
    <div className={`bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 md:p-8 space-y-6 ${isModal ? 'max-h-[90vh] overflow-y-auto' : ''}`}>
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Settings className="mr-3 text-brand-blue" size={28} />
                {isModal ? 'Trainer Settings' : 'Chord Trainer Setup'}
            </h2>
            {isModal && onClose && (
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                    <X size={24} />
                </button>
            )}
        </div>

        {/* Root Note Selection */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
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
                                ? 'bg-brand-blue text-white shadow-md transform scale-105' 
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
                                ? 'border-brand-blue bg-blue-50 text-brand-blue ring-1 ring-brand-blue'
                                : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                        <span className="font-medium">{chord.name}</span>
                        {selectedChordIndices.includes(index) && (
                            <div className="w-2 h-2 rounded-full bg-brand-blue"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* Action */}
        <div className="pt-4 flex justify-end space-x-4">
            {isModal && onClose && (
                <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                >
                    Cancel
                </button>
            )}
            <button
                onClick={handleStart}
                disabled={selectedChordIndices.length === 0}
                className="px-8 py-3 bg-brand-blue hover:bg-brand-hover text-white rounded-xl font-bold shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
                {isModal ? 'Apply & Restart' : 'Start Training'}
            </button>
        </div>
      </div>
  );

  if (isModal) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            {content}
        </div>
    );
  }

  return <div className="flex justify-center w-full">{content}</div>;
};

export default TrainerSettings;