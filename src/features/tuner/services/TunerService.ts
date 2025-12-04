import { TunerResult } from '../../../domain/entities';
import { tunerAdapter } from '../../../core/adapters/TunerAdapter';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export class TunerService {
  private isRunning: boolean = false;

  async start(): Promise<void> {
    console.log('[TunerService] Запуск тюнера');
    await tunerAdapter.start();
    this.isRunning = true;
  }

  stop(): void {
    console.log('[TunerService] Остановка тюнера');
    tunerAdapter.stop();
    this.isRunning = false;
  }

  async getPitch(): Promise<TunerResult | null> {
    return tunerAdapter.getPitch();
  }

  startContinuousAnalysis(callback: (result: TunerResult | null) => void): void {
    console.log('[TunerService] Запуск непрерывного анализа');
    tunerAdapter.startContinuousAnalysis(callback);
  }

  // Методы для прямого использования TunerCore
  analyzeFrequency(frequency: number): TunerResult {
    return tunerAdapter.analyzeFrequency(frequency);
  }

  analyzeFrequencyForGuitar(frequency: number): TunerResult {
    return tunerAdapter.analyzeFrequencyForGuitar(frequency);
  }

  getClosestGuitarNote(pitch: number) {
    return tunerAdapter.getClosestGuitarNote(pitch);
  }

  getGuitarNotes() {
    return tunerAdapter.getGuitarNotes();
  }

  frequencyFromNoteNumber(note: number): number {
    return tunerAdapter.frequencyFromNoteNumber(note);
  }

  autoCorrelate(buf: Float32Array, sampleRate: number): number {
    return tunerAdapter.autoCorrelate(buf, sampleRate);
  }

  isAudioRunning(): boolean {
    return this.isRunning;
  }

  // Метод для переключения между режимами анализа
  useTunerCoreAnalysis(useCore: boolean): void {
    tunerAdapter.useTunerCoreAnalysis(useCore);
  }

  // Метод для прямого использования TunerService
  startTunerServiceAnalysis(callback: (result: TunerResult | null) => void): void {
    tunerAdapter.startTunerServiceAnalysis(callback);
  }
}

export const tunerService = new TunerService();