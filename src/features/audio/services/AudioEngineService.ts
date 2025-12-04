import { StrumDirection, StrumType } from '../../../domain/entities';
import { PlaybackStrategyType } from '../../../shared/utils';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

// Chord Shapes (Fret positions: 6E, 5A, 4D, 3G, 2B, 1e)
const CHORD_FRETS: Record<string, (number | null)[]> = {
  'Am': [null, 0, 2, 2, 1, 0], // X02210
  'A':  [null, 0, 2, 2, 2, 0], // X02220
  'C':  [null, 3, 2, 0, 1, 0], // X32010
  'D':  [null, null, 0, 2, 3, 2], // XX0232
  'Dm': [null, null, 0, 2, 3, 1], // XX0231
  'E':  [0, 2, 2, 1, 0, 0], // 022100
  'Em': [0, 2, 2, 0, 0, 0], // 022000
  'G':  [3, 2, 0, 0, 0, 3], // 320003
  'F':  [null, null, 3, 2, 1, 1], // XX3211
};

const STRINGS = ['6E', '5A', '4D', '3G', '2B', '1e'];

export class AudioEngineService {
  private playbackStrategy: PlaybackStrategyType = 'basic';
  private audioContext: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private isInitialized: boolean = false;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error('Web Audio API не поддерживается в этом браузере');
      }
      this.audioContext = new AudioContextClass();
    }
    return this.audioContext;
  }

  private getMasterGainNode(): GainNode {
    if (!this.masterGainNode) {
      const context = this.getAudioContext();
      this.masterGainNode = context.createGain();
      this.masterGainNode.connect(context.destination);
      this.masterGainNode.gain.value = 0.5;
    }
    return this.masterGainNode;
  }

  private init() {
    if (!this.isInitialized) {
      this.getAudioContext();
      this.getMasterGainNode();
      this.isInitialized = true;
    }
  }

  public get currentTime(): number {
    this.init();
    return this.getAudioContext().currentTime;
  }

  public async resume(): Promise<void> {
    this.init();
    await this.getAudioContext().resume();
  }

  public setVolume(val: number): void {
    this.init();
    this.getMasterGainNode().gain.value = val;
  }

  public setPlaybackStrategy(strategy: PlaybackStrategyType): void {
    this.playbackStrategy = strategy;
  }

  public async preloadChord(chordName: string): Promise<void> {
    this.init();
    // Используем AudioSampleFactory для предварительной загрузки
    const { audioSampleFactory } = await import('../../../shared/utils/AudioSampleFactory');
    
    
    const frets = CHORD_FRETS[chordName];
    if (frets) {
      await audioSampleFactory.loadChordSamples(chordName, frets);
    }
  }

  public async strum(
    direction: StrumDirection,
    chordName: string,
    type: StrumType,
    time?: number
  ): Promise<void> {
    this.init();
    
    // Импортируем зависимости динамически, чтобы избежать циклических зависимостей
    const { audioSampleFactory } = await import('../../../shared/utils/AudioSampleFactory');
    const { PlaybackStrategyFactory } = await import('../../../shared/utils/PlaybackStrategies');
    
    
    // Ghost notes are silent
    if (type === 'ghost') {
      return;
    }
    
    const startTime = time || this.getAudioContext().currentTime;
    
    try {
      // Handle Mute Strum
      if (type === 'mute') {
        const muteSample = await audioSampleFactory.preloadMuteSample();
        const strategy = PlaybackStrategyFactory.getMuteStrategy();
        await strategy.play([muteSample], direction, type, this.getAudioContext(), this.getMasterGainNode(), startTime);
        return;
      }
      
      // Handle Normal Strum
      const frets = CHORD_FRETS[chordName];
      if (!frets) {
        console.error(`Unknown chord: ${chordName}`);
        return;
      }
      
      const chordSample = await audioSampleFactory.loadChordSamples(chordName, frets);
      const strategy = PlaybackStrategyFactory.getStrategy(this.playbackStrategy);
      
      await strategy.play(chordSample.samples, direction, type, this.getAudioContext(), this.getMasterGainNode(), startTime);
      
    } catch (error) {
      console.error(`Failed to play strum:`, error);
    }
  }

  public async playNote(stringName: string, fret: number, time?: number): Promise<void> {
    this.init();
    
    // Импортируем зависимости динамически, чтобы избежать циклических зависимостей
    const { audioSampleFactory } = await import('../../../shared/utils/AudioSampleFactory');
    const { PlaybackStrategyFactory } = await import('../../../shared/utils/PlaybackStrategies');
    
    const startTime = time || this.getAudioContext().currentTime;
    
    try {
      const sample = await audioSampleFactory.loadSample({
        stringName,
        fret
      });
      
      if (!sample.buffer) {
        throw new Error(`Sample not loaded: ${stringName}-${fret}`);
      }
      
      const strategy = PlaybackStrategyFactory.getStrategy(this.playbackStrategy);
      await strategy.play([sample], 'down', 'strum', this.getAudioContext(), this.getMasterGainNode(), startTime);
      
    } catch (error) {
      console.error(`Failed to play note:`, error);
    }
  }

  public registerActiveSource(source: any): void {
    // Пустая реализация для совместимости
  }

  public stopAllSounds(): void {
    this.init();
    this.getMasterGainNode().gain.value = 0;
  }

  public stop(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.masterGainNode = null;
      this.isInitialized = false;
    }
  }

  public getAvailableChords(): string[] {
    return ['Am', 'A', 'C', 'D', 'Dm', 'E', 'Em', 'G', 'F'];
  }

  public getPlaybackStrategy(): PlaybackStrategyType {
    return this.playbackStrategy;
  }

  public isAudioInitialized(): boolean {
    return this.isInitialized;
  }
}

export const audioEngineService = new AudioEngineService();