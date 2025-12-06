'use client';

import { useState } from 'react';
import { Header } from '../../shared/components/Header';
import { Footer } from '../../shared/components/Footer';
import { SetupScreen } from '../../features/dictation/screens/SetupScreen';
import { TrainingScreen } from '../../features/dictation/screens/TrainingScreen';
import { GameSettings } from '../../core/dictation/types';
import { Brain, Music, ArrowLeft, Info } from 'lucide-react';

export default function DictationPage() {
  const [gameState, setGameState] = useState<'setup' | 'training'>('setup');
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);

  const handleStartTraining = (settings: GameSettings) => {
    setGameSettings(settings);
    setGameState('training');
  };

  const handleBackToSetup = () => {
    setGameState('setup');
    setGameSettings(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {gameState === 'setup' && (
          <>
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
                  <Brain className="text-white" size={32} />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                Музыкальный диктант
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Развивайте музыкальный слух и способность распознавать ноты. 
                Тренируйтесь определять мелодии на слух в интерактивном формате.
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-slate-800/30 border border-white/10 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <Info className="text-purple-400 mt-0.5" size={20} />
                <div className="text-sm text-slate-300">
                  <p className="font-medium mb-1">Как это работает:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>Настройте уровень сложности и параметры тренировки</li>
                    <li>Прослушайте мелодию, которая будет воспроизведена</li>
                    <li>Определите ноты и воспроизведите мелодию на пианино</li>
                    <li>Проверьте свой результат и переходите к следующему упражнению</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Setup Screen */}
            <SetupScreen onStart={handleStartTraining} />
          </>
        )}

        {gameState === 'training' && gameSettings && (
          <TrainingScreen 
            settings={gameSettings} 
            onBack={handleBackToSetup} 
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}