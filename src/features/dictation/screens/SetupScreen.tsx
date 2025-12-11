import React, { useState } from 'react';
import { GameSettings, NoteName, ScaleType } from '../../../core/dictation/types';
import { Play, Music, Star, ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
import { OCTAVE_LABELS } from '../../../core/dictation/musicTheory';

interface SetupScreenProps {
  onStart: (settings: GameSettings) => void;
}

const PRESETS: Record<number, Partial<GameSettings>> = {
  1: { replayLimit: 'infinity', scaleRange: 3, melodyNoteCount: 3, selectedOctaves: [4] },
  2: { replayLimit: 'infinity', scaleRange: 4, melodyNoteCount: 5, selectedOctaves: [4] },
  3: { replayLimit: 7, scaleRange: 5, melodyNoteCount: 5, selectedOctaves: [4] },
  4: { replayLimit: 5, scaleRange: 6, melodyNoteCount: 6, selectedOctaves: [3, 4] },
  5: { replayLimit: 3, scaleRange: 7, melodyNoteCount: 7, selectedOctaves: [3, 4] },
};

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Default to level 3 settings
  const [settings, setSettings] = useState<GameSettings>({
    rootNote: 'C',
    scaleType: 'Major',
    difficulty: 3,
    ...PRESETS[3] as any
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings.selectedOctaves.length === 0) {
        alert("Пожалуйста, выберите хотя бы одну октаву.");
        return;
    }
    onStart(settings);
  };

  const handleDifficultyChange = (level: number) => {
    setSettings(prev => ({
        ...prev,
        difficulty: level,
        ...PRESETS[level]
    }));
  };

  const toggleOctave = (octave: number) => {
    setSettings(prev => {
        if (prev.selectedOctaves.includes(octave)) {
            return { ...prev, selectedOctaves: prev.selectedOctaves.filter(o => o !== octave) };
        } else {
            return { ...prev, selectedOctaves: [...prev.selectedOctaves, octave] };
        }
    });
  };

  const ROOT_OPTIONS: NoteName[] = ['C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  const DIFFICULTY_DESCRIPTIONS: Record<number, string> = {
      1: 'Очень легко: Поступенное движение, короткая мелодия',
      2: 'Легко: Малые скачки, простая гамма',
      3: 'Средне: Скачки на квинту, ограниченные повторы',
      4: 'Сложно: Большие скачки, 2 октавы',
      5: 'Эксперт: Скачки на полную октаву, сложная мелодия'
  };

  return (
    <div className="w-[576px] mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 border border-slate-100 text-slate-900">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-600 rounded-lg text-white">
            <Music size={24} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Новый диктант</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Difficulty (Stars) */}
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Уровень сложности</label>
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => handleDifficultyChange(star)}
                                className="p-1 focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star 
                                    size={36} 
                                    fill={star <= settings.difficulty ? "#eab308" : "transparent"} 
                                    className={star <= settings.difficulty ? "text-yellow-500" : "text-slate-300"} 
                                />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <p className="text-sm text-slate-600 font-medium">
                        {DIFFICULTY_DESCRIPTIONS[settings.difficulty]}
                    </p>
                </div>
            </div>
        </div>

        {/* Basic Settings: Key & Scale */}
        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Тоника</label>
            <select 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={settings.rootNote}
                onChange={(e) => setSettings({...settings, rootNote: e.target.value as NoteName})}
            >
                {ROOT_OPTIONS.map(n => (
                    <option key={n} value={n}>{n}</option>
                ))}
            </select>
            </div>

            <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Тип гаммы</label>
            <select 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={settings.scaleType}
                onChange={(e) => setSettings({...settings, scaleType: e.target.value as ScaleType})}
            >
                <option value="Major">Мажор</option>
                <option value="Minor">Минор</option>
            </select>
            </div>
        </div>

        {/* Advanced Settings Toggle */}
        <div className="border-t border-slate-200 pt-4">
            <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
                <Settings2 size={16} />
                Дополнительные настройки
                {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
        </div>

        {/* Advanced Settings Section */}
        {showAdvanced && (
            <div className="space-y-5 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                {/* Replay Limit */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Лимит повторений</label>
                    <select 
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        value={settings.replayLimit}
                        onChange={(e) => setSettings({...settings, replayLimit: e.target.value === 'infinity' ? 'infinity' : Number(e.target.value)})}
                    >
                        <option value="infinity">Без ограничений</option>
                        {[...Array(10)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1} повтор</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Scale Range */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Ступени гаммы (3-7)</label>
                        <input 
                            type="number" min="3" max="7" 
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                            value={settings.scaleRange}
                            onChange={(e) => setSettings({...settings, scaleRange: Number(e.target.value)})}
                        />
                    </div>

                    {/* Melody Length */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Длина мелодии</label>
                        <input 
                            type="number" min="3" max="15" 
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                            value={settings.melodyNoteCount}
                            onChange={(e) => setSettings({...settings, melodyNoteCount: Number(e.target.value)})}
                        />
                    </div>
                </div>

                {/* Octave Selection */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Октавы</label>
                    <div className="flex flex-wrap gap-2">
                        {[2, 3, 4, 5].map(oct => (
                            <button
                                key={oct}
                                type="button"
                                onClick={() => toggleOctave(oct)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                                    settings.selectedOctaves.includes(oct)
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                                }`}
                            >
                                {OCTAVE_LABELS[oct]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm mt-4"
        >
            <Play size={20} />
            Начать тренировку
        </button>
      </form>
    </div>
  );
};