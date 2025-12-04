import {
  AudioContextAdapter,
  GainNodeAdapter,
  AudioBufferSourceNodeAdapter,
  AudioSampleAdapter,
  ChordSampleAdapter,
  AudioSampleFactoryAdapter,
  PlaybackStrategyAdapter,
  PlaybackStrategyFactoryAdapter,
  AudioEventBusAdapter,
  AudioEngineCore
} from '../audio/AudioEngineCore';
import { audioSampleFactory } from '../../shared/utils/AudioSampleFactory';
import { PlaybackStrategyFactory } from '../../shared/utils/PlaybackStrategies';
import { audioEventBus } from '../../shared/utils/AudioEventBus';

// Реальный AudioContext для работы с Web Audio API
let audioContext: AudioContext | null = null;

// Инициализация AudioContext
function getAudioContext(): AudioContext {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error('Web Audio API не поддерживается в этом браузере');
    }
    audioContext = new AudioContextClass();
  }
  return audioContext;
}

// Адаптер для AudioContext
class WebAudioContextAdapter implements AudioContextAdapter {
  get currentTime(): number {
    return getAudioContext().currentTime;
  }

  async resume(): Promise<void> {
    await getAudioContext().resume();
  }

  close(): void {
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
  }
}

// Реальный GainNode для работы с Web Audio API
let masterGainNode: GainNode | null = null;

// Инициализация Master Gain Node
function getMasterGainNode(): GainNode {
  if (!masterGainNode) {
    const context = getAudioContext();
    masterGainNode = context.createGain();
    masterGainNode.connect(context.destination);
    masterGainNode.gain.value = 0.5; // Начальная громкость
  }
  return masterGainNode;
}

// Адаптер для GainNode
class WebGainNodeAdapter implements GainNodeAdapter {
  get gain() {
    const gainNode = getMasterGainNode();
    return {
      get value() {
        return gainNode.gain.value;
      },
      setValueAtTime: (value: number, time: number) => {
        gainNode.gain.setValueAtTime(value, time);
      }
    };
  }

  connect(destination: any): void {
    getMasterGainNode().connect(destination);
  }
}

// Адаптер для AudioBufferSourceNode
class WebAudioBufferSourceNodeAdapter implements AudioBufferSourceNodeAdapter {
  private source: AudioBufferSourceNode;
  private _onended: (() => void) | null = null;

  constructor() {
    this.source = getAudioContext().createBufferSource();
    
    // Настраиваем обработчик события onended
    this.source.onended = () => {
      if (this._onended) {
        this._onended();
      }
    };
  }

  get buffer(): any {
    return this.source.buffer;
  }

  set buffer(value: any) {
    this.source.buffer = value;
  }

  connect(destination: any): void {
    this.source.connect(destination);
  }

  start(time?: number): void {
    this.source.start(time);
  }

  stop(): void {
    try {
      this.source.stop();
    } catch (e) {
      // Игнорируем ошибку, если источник уже остановлен
    }
  }

  get onended(): (() => void) | null {
    return this._onended;
  }

  set onended(callback: (() => void) | null) {
    this._onended = callback;
  }

  // Метод для доступа к нативному источнику
  getNativeSource(): AudioBufferSourceNode {
    return this.source;
  }
}

// Адаптер для AudioSample
class WebAudioSampleAdapter implements AudioSampleAdapter {
  constructor(private sample: any) {}

  get id(): string {
    return this.sample.id;
  }

  get url(): string {
    return this.sample.url;
  }

  get buffer(): any {
    return this.sample.buffer;
  }

  get isLoading(): boolean {
    return this.sample.isLoading;
  }

  get error(): string | undefined {
    return this.sample.error;
  }
}

// Адаптер для ChordSample
class WebChordSampleAdapter implements ChordSampleAdapter {
  constructor(private chordSample: any) {}

  get chord(): string {
    return this.chordSample.chord;
  }

  get samples(): AudioSampleAdapter[] {
    return this.chordSample.samples.map((sample: any) => new WebAudioSampleAdapter(sample));
  }
}

// Адаптер для AudioSampleFactory
class WebAudioSampleFactoryAdapter implements AudioSampleFactoryAdapter {
  async preloadMuteSample(): Promise<AudioSampleAdapter> {
    const sample = await audioSampleFactory.preloadMuteSample();
    return new WebAudioSampleAdapter(sample);
  }

  async loadChordSamples(chordName: string, chordFrets: (number | null)[]): Promise<ChordSampleAdapter> {
    const chordSample = await audioSampleFactory.loadChordSamples(chordName, chordFrets);
    return new WebChordSampleAdapter(chordSample);
  }

  async loadSample(config: { stringName: string; fret: number }): Promise<AudioSampleAdapter> {
    const sample = await audioSampleFactory.loadSample(config);
    return new WebAudioSampleAdapter(sample);
  }
}

// Адаптер для PlaybackStrategy
class WebPlaybackStrategyAdapter implements PlaybackStrategyAdapter {
  constructor(private strategy: any) {}

  async play(
    samples: AudioSampleAdapter[],
    direction: any,
    type: any,
    audioContext: AudioContextAdapter,
    destination: GainNodeAdapter,
    time?: number,
    sourceCallback?: (source: AudioBufferSourceNodeAdapter) => void
  ): Promise<void> {
    // Преобразуем адаптеры обратно в оригинальные объекты
    const originalSamples = samples.map(s => ({
      id: s.id,
      url: s.url,
      buffer: s.buffer,
      isLoading: s.isLoading,
      error: s.error
    }));

    // Создаем временные объекты AudioContext и destination для совместимости
    const tempAudioContext = {
      currentTime: audioContext.currentTime,
      createBufferSource: () => new WebAudioBufferSourceNodeAdapter()
    };

    const tempDestination = {
      connect: () => {}
    };

    // Вызываем оригинальную стратегию воспроизведения
    await this.strategy.play(
      originalSamples,
      direction,
      type,
      tempAudioContext as any,
      tempDestination as any,
      time,
      sourceCallback
    );
  }
}

// Адаптер для PlaybackStrategyFactory
class WebPlaybackStrategyFactoryAdapter implements PlaybackStrategyFactoryAdapter {
  getStrategy(type: string): PlaybackStrategyAdapter {
    const strategy = PlaybackStrategyFactory.getStrategy(type as any);
    return new WebPlaybackStrategyAdapter(strategy);
  }

  getMuteStrategy(): PlaybackStrategyAdapter {
    const strategy = PlaybackStrategyFactory.getMuteStrategy();
    return new WebPlaybackStrategyAdapter(strategy);
  }
}

// Адаптер для AudioEventBus
class WebAudioEventBusAdapter implements AudioEventBusAdapter {
  emitSync(event: string, data?: any): void {
    audioEventBus.emitSync(event as any, data);
  }
}

/**
 * Адаптер для AudioEngineService, который реализует интерфейсы AudioEngineCore
 * и позволяет существующему коду работать с новой архитектурой
 */
export class AudioEngineAdapter {
  private audioEngineCore: AudioEngineCore;

  constructor() {
    // Создаем экземпляр AudioEngineCore с адаптерами
    this.audioEngineCore = new AudioEngineCore(
      new WebAudioContextAdapter(),
      new WebGainNodeAdapter(),
      new WebAudioSampleFactoryAdapter(),
      new WebPlaybackStrategyFactoryAdapter(),
      new WebAudioEventBusAdapter()
    );

    // Инициализируем AudioEngineCore
    this.audioEngineCore.initialize();
  }

  // Делегируем вызовы к AudioEngineCore
  get currentTime(): number {
    return this.audioEngineCore.currentTime;
  }

  async resume(): Promise<void> {
    await this.audioEngineCore.resume();
  }

  setVolume(val: number): void {
    this.audioEngineCore.setVolume(val);
  }

  setPlaybackStrategy(strategy: any): void {
    this.audioEngineCore.setPlaybackStrategy(strategy);
  }

  async preloadMuteSample(): Promise<void> {
    await this.audioEngineCore.preloadMuteSample();
  }

  async preloadChord(chordName: string): Promise<void> {
    await this.audioEngineCore.preloadChord(chordName);
  }

  async strum(direction: any, chordName: string, type: any, time?: number): Promise<void> {
    await this.audioEngineCore.strum(direction, chordName, type, time);
  }

  async playNote(stringName: string, fret: number, time?: number): Promise<void> {
    await this.audioEngineCore.playNote(stringName, fret, time);
  }

  registerActiveSource(source: any): void {
    this.audioEngineCore.registerActiveSource(source);
  }

  stopAllSounds(): void {
    this.audioEngineCore.stopAllSounds();
  }

  stop(): void {
    this.audioEngineCore.stop();
  }

  getAvailableChords(): string[] {
    return this.audioEngineCore.getAvailableChords();
  }

  getPlaybackStrategy(): any {
    return this.audioEngineCore.getPlaybackStrategy();
  }

  isAudioInitialized(): boolean {
    return this.audioEngineCore.isAudioInitialized();
  }

  // Дополнительные методы для доступа к AudioEngineCore
  getAudioEngineCore(): AudioEngineCore {
    return this.audioEngineCore;
  }
}

// Экспортируем экземпляр адаптера
export const audioEngineAdapter = new AudioEngineAdapter();