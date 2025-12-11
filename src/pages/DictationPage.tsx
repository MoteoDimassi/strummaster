import React, { useState } from 'react';
import { SetupScreen } from '../features/dictation/screens/SetupScreen';
import { TrainingScreen } from '../features/dictation/screens/TrainingScreen';
import { GameSettings } from '../core/dictation/types';

export const DictationPage: React.FC = () => {
  const [dictationSettings, setDictationSettings] = useState<GameSettings | null>(null);

  const handleDictationStart = (settings: GameSettings) => {
    setDictationSettings(settings);
  };

  const handleDictationQuit = () => {
    setDictationSettings(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex justify-center">
      {!dictationSettings ? (
        <SetupScreen onStart={handleDictationStart} />
      ) : (
        <TrainingScreen settings={dictationSettings} onBack={handleDictationQuit} />
      )}
    </div>
  );
};