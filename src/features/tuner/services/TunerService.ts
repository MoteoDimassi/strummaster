import { TunerResult } from '../../../domain/entities';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export class TunerService {
  private isRunning: boolean = false;

  async start(): Promise<void> {
    console.log('[TunerService] Запуск тюнера - ПУСТАЯ РЕАЛИЗАЦИЯ!');
    this.isRunning = true;
  }

  stop(): void {
    console.log('[TunerService] Остановка тюнера');
    this.isRunning = false;
  }

  async getPitch(): Promise<TunerResult | null> {
    console.log('[TunerService] Запрос высоты тона - ПУСТАЯ РЕАЛИЗАЦИЯ!');
    return null;
  }

  startContinuousAnalysis(callback: (result: TunerResult | null) => void): void {
    console.log('[TunerService] Запуск непрерывного анализа - ПУСТАЯ РЕАЛИЗАЦИЯ!');
    // Пустая реализация для совместимости
  }

  // Методы для прямого использования TunerCore
  analyzeFrequency(frequency: number): TunerResult {
    return { note: '', frequency: 0, cents: 0, isInTune: false };
  }

  analyzeFrequencyForGuitar(frequency: number): TunerResult {
    return { note: '', frequency: 0, cents: 0, isInTune: false };
  }

  getClosestGuitarNote(pitch: number) {
    return null;
  }

  getGuitarNotes() {
    return [];
  }

  frequencyFromNoteNumber(note: number): number {
    return 0;
  }

  autoCorrelate(buf: Float32Array, sampleRate: number): number {
    return 0;
  }

  isAudioRunning(): boolean {
    return this.isRunning;
  }

  // Метод для переключения между режимами анализа
  useTunerCoreAnalysis(useCore: boolean): void {
    // Пустая реализация для совместимости
  }

  // Метод для прямого использования TunerService
  startTunerServiceAnalysis(callback: (result: TunerResult | null) => void): void {
    // Пустая реализация для совместимости
  }
}

export const tunerService = new TunerService();