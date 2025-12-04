import {
  TimerAdapter,
  AudioEngineAdapter,
  EventBusAdapter,
  PlayerCore
} from '../player/PlayerCore';
import { audioEventBus } from '../../shared/utils/AudioEventBus';
import { Measure } from '../../domain/entities';
import { TimerApiAdapter, BrowserApiAdapterFactory } from './BrowserApiAdapter';
import { audioEngineAdapter } from './AudioEngineAdapter';

// Адаптер для Timer на основе BrowserApiAdapter
class WebTimerAdapter implements TimerAdapter {
  constructor(private timerApiAdapter: TimerApiAdapter) {}

  setTimeout(callback: () => void, delay: number): number | null {
    return this.timerApiAdapter.setTimeout(callback, delay);
  }

  clearTimeout(timerId: number | null): void {
    this.timerApiAdapter.clearTimeout(timerId);
  }
}

// Адаптер для AudioEngine
class WebAudioEngineAdapter implements AudioEngineAdapter {
  get currentTime(): number {
    return audioEngineAdapter.currentTime;
  }

  async resume(): Promise<void> {
    await audioEngineAdapter.resume();
  }

  async strum(direction: string, chord: string, strumType: string, time: number): Promise<void> {
    await audioEngineAdapter.strum(direction as any, chord, strumType as any, time);
  }

  stopAllSounds(): void {
    audioEngineAdapter.stopAllSounds();
  }
}

// Адаптер для EventBus
class WebEventBusAdapter implements EventBusAdapter {
  emitSync(event: string, data?: any): void {
    audioEventBus.emitSync(event as any, data);
  }

  subscribe(event: string, callback: (data: any) => void): void {
    audioEventBus.subscribe(event as any, callback);
  }
}

/**
 * Адаптер для PlayerService, который реализует интерфейсы PlayerCore
 * и позволяет существующему коду работать с новой архитектурой
 */
export class PlayerAdapter {
  private playerCore: PlayerCore;

  constructor(timerApiAdapter?: TimerApiAdapter) {
    // Используем переданный адаптер или создаем по умолчанию
    const timerAdapter = timerApiAdapter
      ? new WebTimerAdapter(timerApiAdapter)
      : new WebTimerAdapter(BrowserApiAdapterFactory.createTimerAdapter());
    
    // Создаем экземпляр PlayerCore с адаптерами
    this.playerCore = new PlayerCore(
      timerAdapter,
      new WebAudioEngineAdapter(),
      new WebEventBusAdapter()
    );
  }

  // Делегируем вызовы к PlayerCore
  setMeasures(measures: Measure[]): void {
    this.playerCore.setMeasures(measures);
  }

  setActiveMeasureIdx(idx: number): void {
    this.playerCore.setActiveMeasureIdx(idx);
  }

  setConfig(config: any): void {
    this.playerCore.setConfig(config);
  }

  async start(): Promise<void> {
    await this.playerCore.start();
  }

  stop(): void {
    this.playerCore.stop();
  }

  reset(): void {
    this.playerCore.reset();
  }

  get isCurrentlyPlaying(): boolean {
    return this.playerCore.isCurrentlyPlaying;
  }

  getCurrentPosition(): { measureIdx: number; stepIdx: number } {
    return this.playerCore.getCurrentPosition();
  }

  getDuration(): number {
    return this.playerCore.getDuration();
  }

  getCurrentTime(): number {
    return this.playerCore.getCurrentTime();
  }

  // Дополнительные методы для доступа к PlayerCore
  getPlayerCore(): PlayerCore {
    return this.playerCore;
  }

  // Методы для синхронизации состояний
  syncStates(): void {
    // Метод оставлен для совместимости, но теперь не выполняет синхронизацию с сервисом
    // так как это создавало циклическую зависимость
  }

  // Методы для работы с событиями
  onStep(callback: (data: any) => void): () => void {
    return audioEventBus.subscribe('step' as any, callback);
  }

  onPlay(callback: (data: any) => void): () => void {
    return audioEventBus.subscribe('play' as any, callback);
  }

  onStop(callback: (data: any) => void): () => void {
    return audioEventBus.subscribe('stop' as any, callback);
  }

  onError(callback: (data: any) => void): () => void {
    return audioEventBus.subscribe('error' as any, callback);
  }
}

// Экспортируем экземпляр адаптера
export const playerAdapter = new PlayerAdapter();