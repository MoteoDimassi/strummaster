import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { Header, Footer } from './shared/components';
import { MeasureNavigation } from './features/player/components/MeasureNavigation';
import { PatternControls } from './features/player/components/PatternControls';
import { StrumPattern } from './features/player/components/StrumPattern';
import { PlayerControls } from './features/player/components/PlayerControls';
import { TunerModal } from './features/tuner/components/TunerModal';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { setCurrentDisplayStepIdx } from './store/slices/playerSlice';
import { audioEventBus } from './shared/utils/AudioEventBus';
import { SetupScreen } from './features/dictation/screens/SetupScreen';
import { TrainingScreen } from './features/dictation/screens/TrainingScreen';
import { GameSettings } from './core/dictation/types';
import { useState } from 'react';
import './index.css';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentDisplayStepIdx } = useAppSelector(state => state.player);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [dictationSettings, setDictationSettings] = useState<GameSettings | null>(null);

  // Subscribe to audio events for visual feedback
  useEffect(() => {
    const unsubscribeStep = audioEventBus.subscribe('step', (event) => {
      if (event.data && typeof event.data.stepIdx === 'number') {
        dispatch(setCurrentDisplayStepIdx(event.data.stepIdx));
      }
    });

    const unsubscribeStop = audioEventBus.subscribe('stop', () => {
      dispatch(setCurrentDisplayStepIdx(null));
    });

    return () => {
      unsubscribeStep();
      unsubscribeStop();
    };
  }, [dispatch]);

  const handleToolSelect = (tool: string) => {
    setActiveTool(tool);
    if (tool !== 'Музыкальный диктант') {
      setDictationSettings(null);
    }
  };

  const handleDictationStart = (settings: GameSettings) => {
    setDictationSettings(settings);
  };

  const handleDictationQuit = () => {
    setDictationSettings(null);
    setActiveTool(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-100 selection:bg-amber-500/30 w-full overflow-x-hidden">
      
      {/* Header */}
      <Header onToolSelect={handleToolSelect} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 gap-8 w-full">
        
        {activeTool === 'Музыкальный диктант' ? (
          <div className="w-full max-w-5xl">
            {!dictationSettings ? (
              <SetupScreen onStart={handleDictationStart} />
            ) : (
              <TrainingScreen settings={dictationSettings} onBack={handleDictationQuit} />
            )}
          </div>
        ) : (
          <>
            {/* Measure Navigation & Info */}
            <MeasureNavigation />

            {/* Pattern Controls */}
            <PatternControls />
            
            {/* Visualizer Area */}
            <StrumPattern />

            {/* Controls */}
            <PlayerControls />
          </>
        )}

      </main>

      <Footer />

      {/* Tuner Modal */}
      <TunerModal />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;