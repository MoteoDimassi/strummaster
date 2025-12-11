import {
  AudioDataAdapter,
  AnimationAdapter,
  TunerCore
} from '../tuner/TunerCore';
import { TunerResult } from '../../domain/entities';
import { AnimationApiAdapter, AudioApiAdapter, BrowserApiAdapterFactory } from './BrowserApiAdapter';

// Адаптер для AudioData (AnalyserNode)
class WebAudioDataAdapter implements AudioDataAdapter {
  private analyser: AnalyserNode | null = null;
  private audioContext: AudioContext | null = null;
  private audioApiAdapter: AudioApiAdapter;
  private stream: MediaStream | null = null;

  constructor(audioApiAdapter?: AudioApiAdapter) {
    this.audioApiAdapter = audioApiAdapter || BrowserApiAdapterFactory.createAudioAdapter();
  }

  // Метод для установки анализатора из TunerService
  setAnalyser(analyser: AnalyserNode, audioContext: AudioContext): void {
    this.analyser = analyser;
    this.audioContext = audioContext;
  }

  // Метод для создания анализатора, если он не был установлен извне
  ensureAnalyser(): void {
    if (!this.analyser || !this.audioContext) {
      console.log('[WebAudioDataAdapter] Создание AudioContext и AnalyserNode');
      this.audioContext = this.audioApiAdapter.createAudioContext();
      this.analyser = this.audioApiAdapter.createAnalyser(this.audioContext);
      console.log('[WebAudioDataAdapter] ВНИМАНИЕ: AnalyserNode создан, но не подключен к источнику аудио!');
    }
  }

  getFloatTimeDomainData(buffer: Float32Array): void {
    if (this.analyser) {
      // Проверяем, подключен ли анализатор к какому-либо источнику
      const hasData = this.checkForAudioData();
      if (!hasData) {
        console.warn('[WebAudioDataAdapter] ОШИБКА: AnalyserNode не подключен к источнику аудио!');
      }
      this.analyser.getFloatTimeDomainData(buffer as any);
    }
  }

  // Вспомогательный метод для проверки наличия аудиоданных
  private checkForAudioData(): boolean {
    if (!this.analyser) return false;
    
    // Проверяем, есть ли какие-либо данные в анализаторе
    const tempBuffer = new Float32Array(128);
    this.analyser.getFloatTimeDomainData(tempBuffer);
    
    // Проверяем, есть ли ненулевые значения
    let hasSignal = false;
    for (let i = 0; i < tempBuffer.length; i++) {
      if (tempBuffer[i] !== 0) {
        hasSignal = true;
        break;
      }
    }
    
    return hasSignal;
  }

  getSampleRate(): number {
    return this.audioContext?.sampleRate || 44100;
  }

  async connectMicrophone(): Promise<void> {
    this.ensureAnalyser();
    if (!this.audioContext || !this.analyser) {
      throw new Error('AudioContext or Analyser not initialized');
    }

    try {
      this.stream = await this.audioApiAdapter.getUserMedia();
      const source = this.audioApiAdapter.createMediaStreamSource(this.audioContext, this.stream);
      source.connect(this.analyser);
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      console.log('[WebAudioDataAdapter] Микрофон успешно подключен');
    } catch (error) {
      console.error('[WebAudioDataAdapter] Ошибка подключения микрофона:', error);
      throw error;
    }
  }

  disconnectMicrophone(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      console.log('[WebAudioDataAdapter] Микрофон отключен');
    }
  }
}

// Адаптер для Animation на основе AnimationApiAdapter
class WebAnimationAdapter implements AnimationAdapter {
  constructor(private animationApiAdapter: AnimationApiAdapter) {}

  requestAnimationFrame(callback: (timestamp: number) => void): number {
    return this.animationApiAdapter.requestAnimationFrame(callback);
  }

  cancelAnimationFrame(id: number): void {
    this.animationApiAdapter.cancelAnimationFrame(id);
  }
}

/**
 * Адаптер для TunerService, который реализует интерфейсы TunerCore
 * и позволяет существующему коду работать с новой архитектурой
 */
export class TunerAdapter {
  private tunerCore: TunerCore;
  private audioDataAdapter: WebAudioDataAdapter;
  private animationAdapter: WebAnimationAdapter;
  private buffer: Float32Array;
  private stopContinuousAnalysis: (() => void) | null = null;
  private isRunning: boolean = false;
  private currentMode: 'chromatic' | 'guitar' = 'chromatic';

  constructor(
    animationApiAdapter?: AnimationApiAdapter,
    audioApiAdapter?: AudioApiAdapter
  ) {
    this.tunerCore = new TunerCore();
    this.audioDataAdapter = new WebAudioDataAdapter(audioApiAdapter);
    this.animationAdapter = new WebAnimationAdapter(
      animationApiAdapter || BrowserApiAdapterFactory.createAnimationAdapter()
    );
    this.buffer = new Float32Array(2048);
  }

  // Инициализация адаптера
  async initialize(): Promise<void> {
    console.log('[TunerAdapter] Инициализация адаптера тюнера');
    // Убеждаемся, что у нас есть анализатор
    this.audioDataAdapter.ensureAnalyser();
    console.log('[TunerAdapter] Анализатор создан, но нет подключения к микрофону');
  }

  // Делегируем вызовы к TunerCore
  analyzeFrequency(frequency: number): TunerResult {
    return this.tunerCore.analyzeFrequency(frequency);
  }

  analyzeFrequencyForGuitar(frequency: number): TunerResult {
    return this.tunerCore.analyzeFrequencyForGuitar(frequency);
  }

  getClosestGuitarNote(pitch: number) {
    return this.tunerCore.getClosestGuitarNote(pitch);
  }

  getGuitarNotes() {
    return this.tunerCore.getGuitarNotes();
  }

  frequencyFromNoteNumber(note: number): number {
    return this.tunerCore.frequencyFromNoteNumber(note);
  }

  autoCorrelate(buf: Float32Array, sampleRate: number): number {
    return this.tunerCore.autoCorrelate(buf, sampleRate);
  }

  // Методы для работы с адаптером
  async start(): Promise<void> {
    console.log('[TunerAdapter] Запуск тюнера');
    this.isRunning = true;
    await this.initialize();
    await this.audioDataAdapter.connectMicrophone();
  }

  stop(): void {
    console.log('[TunerAdapter] Остановка тюнера');
    this.isRunning = false;
    // Останавливаем непрерывный анализ, если он запущен
    if (this.stopContinuousAnalysis) {
      this.stopContinuousAnalysis();
      this.stopContinuousAnalysis = null;
    }
    this.audioDataAdapter.disconnectMicrophone();
  }

  async getPitch(): Promise<TunerResult | null> {
    // Возвращаем null, так как анализ должен выполняться через непрерывный анализ
    return null;
  }

  startContinuousAnalysis(callback: (result: TunerResult | null) => void): void {
    console.log('[TunerAdapter] Запуск непрерывного анализа');
    // Останавливаем предыдущий анализ, если он был запущен
    if (this.stopContinuousAnalysis) {
      this.stopContinuousAnalysis();
    }

    // Проверяем, есть ли анализатор
    if (!this.audioDataAdapter['analyser']) {
      console.error('[TunerAdapter] ОШИБКА: AnalyserNode не инициализирован!');
    }

    // Запускаем непрерывный анализ через TunerCore
    this.stopContinuousAnalysis = this.tunerCore.startContinuousAnalysis(
      this.audioDataAdapter,
      this.animationAdapter,
      this.buffer,
      (result) => {
        // console.log('[TunerAdapter] Результат анализа:', result); // Слишком много логов
        callback(result);
      },
      () => this.isRunning,
      () => {
        // Получаем текущий режим из store через глобальный объект window или другой механизм
        // В данном случае, так как TunerAdapter не имеет доступа к Redux store,
        // мы можем использовать временное решение или передавать режим через метод
        // Но лучше всего использовать TunerService как фасад
        
        // Попытка получить режим из TunerService, если бы он был доступен
        // Но так как TunerService импортирует TunerAdapter, мы не можем импортировать TunerService здесь (циклическая зависимость)
        
        // В качестве временного решения, мы будем использовать свойство currentMode, которое нужно добавить в TunerAdapter
        return this.currentMode;
      }
    );
    console.log('[TunerAdapter] Анализ запущен');
  }

  // Метод оставлен для совместимости, но не выполняет функционал
  startTunerServiceAnalysis(callback: (result: TunerResult | null) => void): void {
    console.warn('startTunerServiceAnalysis не поддерживается без прямой зависимости от TunerService');
  }

  // Дополнительные методы для доступа к TunerCore
  getTunerCore(): TunerCore {
    return this.tunerCore;
  }

  // Метод для получения состояния
  isAudioRunning(): boolean {
    return this.isRunning;
  }

  // Метод для переключения между режимами анализа
  useTunerCoreAnalysis(useCore: boolean): void {
    // Здесь можно реализовать переключение между использованием
    // TunerCore и TunerService для анализа
    if (useCore) {
      console.log('Using TunerCore for analysis');
    } else {
      console.log('Using TunerService for analysis');
    }
  }

  setMode(mode: 'chromatic' | 'guitar'): void {
    this.currentMode = mode;
  }
}

// Экспортируем экземпляр адаптера
export const tunerAdapter = new TunerAdapter();