import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Drum } from 'lucide-react';

export const MetronomePage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [timeSignature, setTimeSignature] = useState('4/4');
  const [volume, setVolume] = useState(50);
  const [currentBeat, setCurrentBeat] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const interval = 60000 / (bpm * 4); // Convert BPM to milliseconds
      intervalRef.current = setInterval(() => {
        setCurrentBeat((prev) => (prev + 1) % 4);
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, bpm]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setCurrentBeat(0);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentBeat(0);
    setBpm(120);
    setTimeSignature('4/4');
    setVolume(50);
  };

  const handleBpmChange = (value: number) => {
    const newBpm = Math.max(40, Math.min(240, value));
    setBpm(newBpm);
  };

  const getBeatIndicator = (beat: number) => {
    const isActive = currentBeat === beat;
    const isFirstBeat = beat === 0;
    
    return (
      <div
        key={beat}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-150 ${
          isActive
            ? isFirstBeat
              ? 'bg-amber-500 scale-110 shadow-lg shadow-amber-500/50'
              : 'bg-blue-500 scale-110 shadow-lg shadow-blue-500/50'
            : 'bg-slate-700'
        }`}
      >
        <span className={`text-2xl font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
          {beat + 1}
        </span>
      </div>
    );
  };

  const timeSignatures = ['2/4', '3/4', '4/4', '5/4', '6/8', '7/8', '9/8'];
  const beats = parseInt(timeSignature.split('/')[0]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent">
            Метроном
          </h1>
          <p className="text-slate-400 text-lg">
            Точный инструмент для отработки чувства ритма
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-8 mb-8">
          {/* Визуальный индикатор ритма */}
          <div className="flex justify-center items-center gap-4 mb-8">
            {Array.from({ length: beats }).map((_, index) => getBeatIndicator(index))}
          </div>

          {/* Отображение BPM */}
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-white mb-2">{bpm}</div>
            <div className="text-slate-400 text-lg">ударов в минуту</div>
          </div>

          {/* Элементы управления */}
          <div className="space-y-6">
            {/* Кнопки управления воспроизведением */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePlayPause}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isPlaying ? (
                  <>
                    <Pause size={20} />
                    Пауза
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Старт
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                <RotateCcw size={20} />
                Сброс
              </button>
            </div>

            {/* Регулятор BPM */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Темп (BPM)</span>
                <span>{bpm}</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleBpmChange(bpm - 1)}
                  className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="range"
                  min="40"
                  max="240"
                  value={bpm}
                  onChange={(e) => handleBpmChange(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <button
                  onClick={() => handleBpmChange(bpm + 1)}
                  className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>40</span>
                <span>140</span>
                <span>240</span>
              </div>
            </div>

            {/* Размер такта */}
            <div className="space-y-2">
              <div className="text-sm text-slate-400">Размер такта</div>
              <div className="grid grid-cols-4 gap-2">
                {timeSignatures.map((signature) => (
                  <button
                    key={signature}
                    onClick={() => setTimeSignature(signature)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      timeSignature === signature
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {signature}
                  </button>
                ))}
              </div>
            </div>

            {/* Регулятор громкости */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Volume2 size={16} />
                  <span>Громкость</span>
                </div>
                <span>{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Предустановки темпа */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Drum size={20} />
            Предустановки темпа
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => setBpm(60)}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-center transition-colors"
            >
              <div className="text-lg font-semibold">Largo</div>
              <div className="text-sm text-slate-400">60 BPM</div>
            </button>
            <button
              onClick={() => setBpm(80)}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-center transition-colors"
            >
              <div className="text-lg font-semibold">Andante</div>
              <div className="text-sm text-slate-400">80 BPM</div>
            </button>
            <button
              onClick={() => setBpm(120)}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-center transition-colors"
            >
              <div className="text-lg font-semibold">Moderato</div>
              <div className="text-sm text-slate-400">120 BPM</div>
            </button>
            <button
              onClick={() => setBpm(140)}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-center transition-colors"
            >
              <div className="text-lg font-semibold">Allegro</div>
              <div className="text-sm text-slate-400">140 BPM</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};