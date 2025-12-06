'use client';

import { Header } from '../../shared/components/Header';
import { Footer } from '../../shared/components/Footer';
import { 
  MeasureNavigation, 
  PatternControls, 
  StrumPattern, 
  PlayerControls 
} from '../../features/player/components';
import { Music, Guitar, Info } from 'lucide-react';

export default function StrumBuilderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
              <Guitar className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
            StrumBuilder
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Создавайте и оттачивайте ритмические паттерны для игры на гитаре. 
            Настраивайте темп, выбирайте аккорды и развивайте чувство ритма.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-slate-800/30 border border-white/10 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <Info className="text-blue-400 mt-0.5" size={20} />
            <div className="text-sm text-slate-300">
              <p className="font-medium mb-1">Как использовать:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Нажимайте на стрелки для переключения между ударами вниз, вверх и пропусками</li>
                <li>Используйте навигацию тактов для создания последовательности аккордов</li>
                <li>Настраивайте темп и длину паттерна с помощью элементов управления</li>
                <li>Нажмите Play для прослушивания созданного ритма</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Measure Navigation */}
          <MeasureNavigation />
          
          {/* Pattern Controls (shown when there are unsaved changes) */}
          <PatternControls />
          
          {/* Strum Pattern Visualizer */}
          <StrumPattern />
          
          {/* Player Controls */}
          <div className="flex justify-center">
            <PlayerControls />
          </div>
        </div>

        {/* Additional Tips */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/20 border border-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-white">Удар</h3>
            </div>
            <p className="text-sm text-slate-400">
              Активный удар по струнам вниз или вверх
            </p>
          </div>
          
          <div className="bg-slate-800/20 border border-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-rose-500/20 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-white">Приглушение</h3>
            </div>
            <p className="text-sm text-slate-400">
              Приглушенный удар с касанием струн ладонью
            </p>
          </div>
          
          <div className="bg-slate-800/20 border border-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-slate-500/20 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-white">Пропуск</h3>
            </div>
            <p className="text-sm text-slate-400">
              Пропуск удара для создания пауз в ритме
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}