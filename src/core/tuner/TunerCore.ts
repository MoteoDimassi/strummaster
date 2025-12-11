import { TunerResult } from '../../domain/entities';

// Интерфейсы для адаптеров взаимодействия с Web Audio API
export interface AudioDataAdapter {
  getFloatTimeDomainData(buffer: Float32Array): void;
  getSampleRate(): number;
}

export interface AnimationAdapter {
  requestAnimationFrame(callback: (timestamp: number) => void): number;
  cancelAnimationFrame(id: number): void;
}

// Интерфейс для нот гитарного строя
export interface GuitarNote {
  note: string;
  octave: number;
  freq: number;
}

export class TunerCore {
  private readonly guitarNotes: GuitarNote[] = [
    { note: "E", octave: 2, freq: 82.41 },
    { note: "A", octave: 2, freq: 110.00 },
    { note: "D", octave: 3, freq: 146.83 },
    { note: "G", octave: 3, freq: 196.00 },
    { note: "B", octave: 3, freq: 246.94 },
    { note: "E", octave: 4, freq: 329.63 }
  ];

  private readonly noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  /**
   * Анализирует частоту и возвращает результат тюнера
   * @param frequency - частота в Гц
   * @returns результат анализа частоты
   */
  analyzeFrequency(frequency: number): TunerResult {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    const note = Math.round(noteNum) + 69;
    const noteName = this.noteStrings[note % 12];
    const cents = Math.floor(1200 * Math.log(frequency / this.frequencyFromNoteNumber(note)) / Math.log(2));
    const isInTune = Math.abs(cents) < 5;

    return {
      note: noteName,
      frequency: Math.round(frequency),
      cents,
      isInTune
    };
  }

  /**
   * Анализирует частоту для гитарного строя
   * @param frequency - частота в Гц
   * @returns результат анализа частоты для гитары
   */
  analyzeFrequencyForGuitar(frequency: number): TunerResult {
    const closestGuitarNote = this.getClosestGuitarNote(frequency);
    const cents = Math.floor(1200 * Math.log(frequency / closestGuitarNote.freq) / Math.log(2));
    const isInTune = Math.abs(cents) < 5;

    return {
      note: closestGuitarNote.note,
      frequency: Math.round(frequency),
      cents,
      isInTune
    };
  }

  /**
   * Находит ближайшую ноту гитарного строя к заданной частоте
   * @param pitch - частота в Гц
   * @returns ближайшая нота гитарного строя
   */
  getClosestGuitarNote(pitch: number): GuitarNote {
    let minDiff = Infinity;
    let closestNote = this.guitarNotes[0];

    this.guitarNotes.forEach(gNote => {
      const diff = Math.abs(pitch - gNote.freq);
      if (diff < minDiff) {
        minDiff = diff;
        closestNote = gNote;
      }
    });

    return closestNote;
  }

  /**
   * Получает все ноты гитарного строя
   * @returns массив нот гитарного строя
   */
  getGuitarNotes(): GuitarNote[] {
    return [...this.guitarNotes];
  }

  /**
   * Преобразует номер ноты в частоту
   * @param note - номер ноты
   * @returns частота в Гц
   */
  frequencyFromNoteNumber(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  /**
   * Алгоритм автокорреляции для определения основной частоты
   * @param buf - буфер с аудио данными
   * @param sampleRate - частота дискретизации
   * @returns основная частота в Гц или -1, если частота не определена
   */
  autoCorrelate(buf: Float32Array, sampleRate: number): number {
    // ACF2+ algorithm implementation
    let SIZE = buf.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      const val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);

    // Увеличиваем порог чувствительности, чтобы отсечь фоновый шум
    if (rms < 0.02) // not enough signal
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
  }

  /**
   * Анализирует аудио данные с использованием адаптера
   * @param audioAdapter - адаптер для получения аудио данных
   * @param buffer - буфер для хранения аудио данных
   * @param mode - режим тюнера ('chromatic' | 'guitar')
   * @returns результат анализа или null, если частота не определена
   */
  analyzeAudioData(audioAdapter: AudioDataAdapter, buffer: Float32Array, mode: 'chromatic' | 'guitar' = 'chromatic'): TunerResult | null {
    audioAdapter.getFloatTimeDomainData(buffer);
    const frequency = this.autoCorrelate(buffer, audioAdapter.getSampleRate());

    if (frequency !== -1) {
      if (mode === 'guitar') {
        return this.analyzeFrequencyForGuitar(frequency);
      }
      return this.analyzeFrequency(frequency);
    }

    return null;
  }

  /**
   * Запускает непрерывный анализ с использованием адаптеров
   * @param audioAdapter - адаптер для получения аудио данных
   * @param animationAdapter - адаптер для анимации
   * @param buffer - буфер для хранения аудио данных
   * @param callback - функция обратного вызова для передачи результатов
   * @param isRunning - функция для проверки состояния работы
   * @param getMode - функция для получения текущего режима тюнера
   */
  startContinuousAnalysis(
    audioAdapter: AudioDataAdapter,
    animationAdapter: AnimationAdapter,
    buffer: Float32Array,
    callback: (result: TunerResult | null) => void,
    isRunning: () => boolean,
    getMode: () => 'chromatic' | 'guitar' = () => 'chromatic'
  ): () => void {
    let rafID: number | null = null;
    let lastUpdate = 0;
    const updateInterval = 50; // Ограничиваем обновление UI до 20 раз в секунду для плавности

    const analyze = (timestamp: number) => {
      if (!isRunning()) {
        callback(null);
        return;
      }

      if (timestamp - lastUpdate > updateInterval) {
        const result = this.analyzeAudioData(audioAdapter, buffer, getMode());
        callback(result);
        lastUpdate = timestamp;
      }

      if (isRunning()) {
        rafID = animationAdapter.requestAnimationFrame(analyze);
      }
    };

    // Запускаем первый кадр
    rafID = animationAdapter.requestAnimationFrame(analyze);

    // Возвращаем функцию для остановки анализа
    return () => {
      if (rafID !== null) {
        animationAdapter.cancelAnimationFrame(rafID);
      }
    };
  }
}