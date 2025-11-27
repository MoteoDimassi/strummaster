import React, { useState, useEffect, useRef } from 'react';

// Расширение типа Window для поддержки webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

interface TunerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TunerModal: React.FC<TunerModalProps> = ({ isOpen, onClose }) => {
  // Константы для нот
  const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  
  // Стандартная настройка гитары (E2, A2, D3, G3, B3, E4)
  const guitarNotes = [
    { note: "E", octave: 2, freq: 82.41 },
    { note: "A", octave: 2, freq: 110.00 },
    { note: "D", octave: 3, freq: 146.83 },
    { note: "G", octave: 3, freq: 196.00 },
    { note: "B", octave: 3, freq: 246.94 },
    { note: "E", octave: 4, freq: 329.63 }
  ];

  // Состояния
  const [isRunning, setIsRunning] = useState(false);
  const [currentNote, setCurrentNote] = useState("-");
  const [currentFrequency, setCurrentFrequency] = useState(0);
  const [currentDetune, setCurrentDetune] = useState(0);
  const [pointerPosition, setPointerPosition] = useState(50);
  const [isInTune, setIsInTune] = useState(false);
  const [currentMode, setCurrentMode] = useState<'chromatic' | 'guitar'>('chromatic');
  const [error, setError] = useState<string | null>(null);

  // Рефы для Web Audio API
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafIDRef = useRef<number | null>(null);
  const bufRef = useRef<Float32Array>(new Float32Array(2048));

  // Функция автокорреляции для определения частоты
  const autoCorrelate = (buf: Float32Array, sampleRate: number): number => {
    // Реализация алгоритма ACF2+
    let SIZE = buf.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      const val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);

    if (rms < 0.01) // недостаточно сигнала
      return -1;

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++)
      if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    for (let i = 1; i < SIZE / 2; i++)
      if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

    buf = buf.slice(r1, r2);
    SIZE = buf.length;

    let c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++)
      for (let j = 0; j < SIZE - i; j++)
        c[i] = c[i] + buf[j] * buf[j + i];

    let d = 0; while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  };

  // Функции для работы с нотами
  const noteFromPitch = (frequency: number): number => {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    return Math.round(noteNum) + 69;
  };

  const frequencyFromNoteNumber = (note: number): number => {
    return 440 * Math.pow(2, (note - 69) / 12);
  };

  const centsOffFromPitch = (frequency: number, note: number): number => {
    return Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2));
  };

  const getClosestGuitarNote = (pitch: number) => {
    let minDiff = Infinity;
    let closestNote = null;

    guitarNotes.forEach(gNote => {
      const diff = Math.abs(pitch - gNote.freq);
      if (diff < minDiff) {
        minDiff = diff;
        closestNote = gNote;
      }
    });

    // Вычисляем центы от целевой ноты гитары
    const cents = Math.floor(1200 * Math.log(pitch / closestNote.freq) / Math.log(2));

    return {
      note: closestNote.note,
      cents: cents
    };
  };

  // Сброс UI
  const resetUI = () => {
    setCurrentNote("-");
    setIsInTune(false);
    setCurrentFrequency(0);
    setCurrentDetune(0);
    setPointerPosition(50);
  };

  // Запуск тюнера
  const startTuner = async () => {
    try {
      setError(null);
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      // Проверяем доступность navigator и navigator.mediaDevices
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Ваш браузер не поддерживает доступ к микрофону или функция недоступна в текущем контексте');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaStreamSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      mediaStreamSourceRef.current.connect(analyserRef.current);
      
      setIsRunning(true);
      updatePitch();
    } catch (err) {
      console.error("Error accessing microphone", err);
      if (err instanceof Error) {
        setError(`Ошибка доступа к микрофону: ${err.message}`);
      } else {
        setError("Не удалось получить доступ к микрофону. Пожалуйста, проверьте разрешения.");
      }
    }
  };

  // Остановка тюнера
  const stopTuner = () => {
    setIsRunning(false);
    if (rafIDRef.current) cancelAnimationFrame(rafIDRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    audioContextRef.current = null;
    resetUI();
  };

  // Обновление высоты тона
  const updatePitch = () => {
    if (!analyserRef.current || !audioContextRef.current) return;
    
    analyserRef.current.getFloatTimeDomainData(bufRef.current);
    const ac = autoCorrelate(bufRef.current, audioContextRef.current.sampleRate);

    if (ac !== -1) {
      const pitch = ac;
      setCurrentFrequency(Math.round(pitch));

      let noteName: string, cents: number;

      if (currentMode === 'chromatic') {
        const note = noteFromPitch(pitch);
        noteName = noteStrings[note % 12];
        const detune = centsOffFromPitch(pitch, note);
        cents = detune;
      } else {
        // Режим гитары
        const result = getClosestGuitarNote(pitch);
        noteName = result.note;
        cents = result.cents;
      }

      setCurrentNote(noteName);
      setCurrentDetune(cents);

      // Преобразование центов (-50 до +50) в проценты (0% до 100%)
      let percent = 50 + cents;
      
      // Ограничение значений
      if (percent < 0) percent = 0;
      if (percent > 100) percent = 100;

      setPointerPosition(percent);

      // Проверка, настроена ли нота
      const inTune = Math.abs(cents) < 5;
      setIsInTune(inTune);
    }

    if (isRunning) {
      rafIDRef.current = window.requestAnimationFrame(updatePitch);
    }
  };

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      if (rafIDRef.current) cancelAnimationFrame(rafIDRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Сброс при смене режима
  useEffect(() => {
    resetUI();
  }, [currentMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800/95 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Закрыть"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Заголовок */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Тюнер</h2>

        {/* Ошибка */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Управление */}
        <div className="mb-6">
          <button
            onClick={isRunning ? stopTuner : startTuner}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isRunning 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isRunning ? 'Выключить микрофон' : 'Включить микрофон'}
          </button>

          {/* Переключатель режима */}
          <div className="flex justify-center gap-6 mt-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="chromatic"
                checked={currentMode === 'chromatic'}
                onChange={(e) => setCurrentMode(e.target.value as 'chromatic' | 'guitar')}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-300">Хроматический</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="guitar"
                checked={currentMode === 'guitar'}
                onChange={(e) => setCurrentMode(e.target.value as 'chromatic' | 'guitar')}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-300">Гитара (EADGBE)</span>
            </label>
          </div>
        </div>

        {/* Дисплей тюнера */}
        <div className="flex flex-col items-center">
          {/* Нота */}
          <div className={`text-6xl font-bold mb-2 transition-colors ${
            isInTune ? 'text-green-400' : 'text-white'
          }`}>
            {currentNote}
          </div>

          {/* Частота */}
          <div className="text-slate-400 mb-4">
            <span className="text-xl">{currentFrequency}</span> Hz
          </div>

          {/* Индикатор настройки */}
          <div className="w-full h-5 bg-slate-700 rounded-full relative mb-2 overflow-hidden">
            <div 
              className={`absolute top-0 w-1 h-full transition-all duration-100 ${
                isInTune ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-white'
              }`}
              style={{ 
                left: `${pointerPosition}%`,
                transform: 'translateX(-50%)'
              }}
            />
          </div>

          {/* Шкала */}
          <div className="flex justify-between w-full px-2 mb-2">
            <span className="text-xs text-slate-500">-50</span>
            <span className="text-xs text-slate-500">0</span>
            <span className="text-xs text-slate-500">+50</span>
          </div>

          {/* Центы */}
          <div className="text-slate-400 text-sm">
            {currentDetune} cents
          </div>
        </div>
      </div>
    </div>
  );
};

export default TunerModal;