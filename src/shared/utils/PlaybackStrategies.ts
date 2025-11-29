import { StrumDirection, StrumType } from '../../domain/entities';
import { AudioSample } from './AudioSampleFactory';

export interface PlaybackStrategy {
  play(
    samples: AudioSample[],
    direction: StrumDirection,
    type: StrumType,
    audioContext: AudioContext,
    destination: AudioNode,
    time?: number,
    sourceCallback?: (source: AudioBufferSourceNode) => void
  ): Promise<void>;
  
  // Возвращает время затухания для данной стратегии
  getFadeOutTime(): number;
  
  // Возвращает время появления новых звуков
  getFadeInTime(): number;
}

export class BasicStrumStrategy implements PlaybackStrategy {
  private readonly staggerTime = 0.01; // 10ms delay between strings
  private readonly fadeOutTime = 0.05; // 50ms fade out time
  private readonly fadeInTime = 0.02; // 20ms fade in time

  async play(
    samples: AudioSample[],
    direction: StrumDirection,
    type: StrumType,
    audioContext: AudioContext,
    destination: AudioNode,
    time?: number,
    sourceCallback?: (source: AudioBufferSourceNode) => void
  ): Promise<void> {
    if (type === 'ghost') return;

    const startTime = time || audioContext.currentTime;

    // Order samples based on strum direction
    const orderedSamples = direction === 'down'
      ? samples
      : [...samples].reverse();

    const playPromises = orderedSamples.map((sample, index) =>
      this.playSample(sample, startTime + (index * this.staggerTime), audioContext, destination, sourceCallback)
    );

    await Promise.all(playPromises);
  }

  private async playSample(
    sample: AudioSample,
    time: number,
    audioContext: AudioContext,
    destination: AudioNode,
    sourceCallback?: (source: AudioBufferSourceNode) => void
  ): Promise<void> {
    if (!sample.buffer) {
      throw new Error(`Sample ${sample.id} not loaded`);
    }

    const source = audioContext.createBufferSource();
    source.buffer = sample.buffer;

    const gain = audioContext.createGain();
    // Начинаем с минимальной громкости и плавно увеличиваем
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(1.0, time + this.fadeInTime);

    source.connect(gain);
    gain.connect(destination);

    // Регистрируем источник, если предоставлен колбэк
    if (sourceCallback) {
      sourceCallback(source);
    }

    source.start(time);
  }
  
  getFadeOutTime(): number {
    return this.fadeOutTime;
  }
  
  getFadeInTime(): number {
    return this.fadeInTime;
  }
}

export class AggressiveStrumStrategy implements PlaybackStrategy {
  private readonly staggerTime = 0.008; // Faster stagger for aggressive sound
  private readonly gainMultiplier = 1.2;
  private readonly fadeOutTime = 0.03; // 30ms fade out time (faster)
  private readonly fadeInTime = 0.01; // 10ms fade in time (faster)

  async play(
    samples: AudioSample[],
    direction: StrumDirection,
    type: StrumType,
    audioContext: AudioContext,
    destination: AudioNode,
    time?: number,
    sourceCallback?: (source: AudioBufferSourceNode) => void
  ): Promise<void> {
    if (type === 'ghost') return;

    const startTime = time || audioContext.currentTime;
    const orderedSamples = direction === 'down'
      ? samples
      : [...samples].reverse();

    const playPromises = orderedSamples.map((sample, index) =>
      this.playSample(
        sample,
        startTime + (index * this.staggerTime),
        audioContext,
        destination,
        this.gainMultiplier,
        sourceCallback
      )
    );

    await Promise.all(playPromises);
  }

  private async playSample(
    sample: AudioSample,
    time: number,
    audioContext: AudioContext,
    destination: AudioNode,
    gainMultiplier: number = 1.0,
    sourceCallback?: (source: AudioBufferSourceNode) => void
  ): Promise<void> {
    if (!sample.buffer) {
      throw new Error(`Sample ${sample.id} not loaded`);
    }

    const source = audioContext.createBufferSource();
    source.buffer = sample.buffer;

    const gain = audioContext.createGain();
    // Начинаем с минимальной громкости и плавно увеличиваем до нужного значения
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(gainMultiplier, time + this.fadeInTime);

    source.connect(gain);
    gain.connect(destination);

    // Регистрируем источник, если предоставлен колбэк
    if (sourceCallback) {
      sourceCallback(source);
    }

    source.start(time);
  }
  
  getFadeOutTime(): number {
    return this.fadeOutTime;
  }
  
  getFadeInTime(): number {
    return this.fadeInTime;
  }
}

export class GentleStrumStrategy implements PlaybackStrategy {
  private readonly staggerTime = 0.015; // Slower stagger for gentle sound
  private readonly gainMultiplier = 0.8;
  private readonly fadeOutTime = 0.07; // 70ms fade out time (slower)
  private readonly fadeInTime = 0.03; // 30ms fade in time (slower)

  async play(
    samples: AudioSample[],
    direction: StrumDirection,
    type: StrumType,
    audioContext: AudioContext,
    destination: AudioNode,
    time?: number,
    sourceCallback?: (source: AudioBufferSourceNode) => void
  ): Promise<void> {
    if (type === 'ghost') return;

    const startTime = time || audioContext.currentTime;
    const orderedSamples = direction === 'down'
      ? samples
      : [...samples].reverse();

    const playPromises = orderedSamples.map((sample, index) =>
      this.playSample(
        sample,
        startTime + (index * this.staggerTime),
        audioContext,
        destination,
        this.gainMultiplier,
        sourceCallback
      )
    );

    await Promise.all(playPromises);
  }

  private async playSample(
    sample: AudioSample,
    time: number,
    audioContext: AudioContext,
    destination: AudioNode,
    gainMultiplier: number = 1.0,
    sourceCallback?: (source: AudioBufferSourceNode) => void
  ): Promise<void> {
    if (!sample.buffer) {
      throw new Error(`Sample ${sample.id} not loaded`);
    }

    const source = audioContext.createBufferSource();
    source.buffer = sample.buffer;

    const gain = audioContext.createGain();
    // Начинаем с минимальной громкости и плавно увеличиваем до нужного значения
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(gainMultiplier, time + this.fadeInTime);

    source.connect(gain);
    gain.connect(destination);

    // Регистрируем источник, если предоставлен колбэк
    if (sourceCallback) {
      sourceCallback(source);
    }

    source.start(time);
  }
  
  getFadeOutTime(): number {
    return this.fadeOutTime;
  }
  
  getFadeInTime(): number {
    return this.fadeInTime;
  }
}

export class MuteStrategy implements PlaybackStrategy {
  private readonly fadeOutTime = 0.05; // 50ms fade out time
  private readonly fadeInTime = 0.02; // 20ms fade in time
  async play(
    samples: AudioSample[],
    direction: StrumDirection,
    type: StrumType,
    audioContext: AudioContext,
    destination: AudioNode,
    time?: number,
    sourceCallback?: (source: AudioBufferSourceNode) => void
  ): Promise<void> {
    if (type !== 'mute') return;

    const startTime = time || audioContext.currentTime;
    
    // Find mute sample (should be first in array for mute type)
    const muteSample = samples.find(s => s.id.includes('mute'));
    if (!muteSample || !muteSample.buffer) {
      throw new Error('Mute sample not loaded');
    }

    const source = audioContext.createBufferSource();
    source.buffer = muteSample.buffer;

    const gain = audioContext.createGain();
    // Начинаем с минимальной громкости и плавно увеличиваем
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.8, startTime + this.fadeInTime);

    source.connect(gain);
    gain.connect(destination);

    // Регистрируем источник, если предоставлен колбэк
    if (sourceCallback) {
      sourceCallback(source);
    }

    source.start(startTime);
  }
  
  getFadeOutTime(): number {
    return this.fadeOutTime;
  }
  
  getFadeInTime(): number {
    return this.fadeInTime;
  }
}

export type PlaybackStrategyType = 'basic' | 'aggressive' | 'gentle';

export class PlaybackStrategyFactory {
  private static strategies: Map<PlaybackStrategyType, PlaybackStrategy> = new Map();

  static {
    PlaybackStrategyFactory.strategies.set('basic', new BasicStrumStrategy());
    PlaybackStrategyFactory.strategies.set('aggressive', new AggressiveStrumStrategy());
    PlaybackStrategyFactory.strategies.set('gentle', new GentleStrumStrategy());
  }

  static getStrategy(type: PlaybackStrategyType): PlaybackStrategy {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`Unknown playback strategy: ${type}`);
    }
    return strategy;
  }

  static getMuteStrategy(): PlaybackStrategy {
    return new MuteStrategy();
  }
}