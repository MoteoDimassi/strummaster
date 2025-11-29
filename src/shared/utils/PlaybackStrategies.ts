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
}

export class BasicStrumStrategy implements PlaybackStrategy {
  private readonly staggerTime = 0.01; // 10ms delay between strings

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
    gain.gain.value = 1.0;

    source.connect(gain);
    gain.connect(destination);

    // Регистрируем источник, если предоставлен колбэк
    if (sourceCallback) {
      sourceCallback(source);
    }

    source.start(time);
  }
}

export class AggressiveStrumStrategy implements PlaybackStrategy {
  private readonly staggerTime = 0.008; // Faster stagger for aggressive sound
  private readonly gainMultiplier = 1.2;

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
    gain.gain.value = gainMultiplier;

    source.connect(gain);
    gain.connect(destination);

    // Регистрируем источник, если предоставлен колбэк
    if (sourceCallback) {
      sourceCallback(source);
    }

    source.start(time);
  }
}

export class GentleStrumStrategy implements PlaybackStrategy {
  private readonly staggerTime = 0.015; // Slower stagger for gentle sound
  private readonly gainMultiplier = 0.8;

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
    gain.gain.value = gainMultiplier;

    source.connect(gain);
    gain.connect(destination);

    // Регистрируем источник, если предоставлен колбэк
    if (sourceCallback) {
      sourceCallback(source);
    }

    source.start(time);
  }
}

export class MuteStrategy implements PlaybackStrategy {
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
    gain.gain.value = 0.8;

    source.connect(gain);
    gain.connect(destination);

    // Регистрируем источник, если предоставлен колбэк
    if (sourceCallback) {
      sourceCallback(source);
    }

    source.start(startTime);
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