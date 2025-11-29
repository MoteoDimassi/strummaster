import { StrumDirection, StrumType } from '../../../domain/entities';
import { audioSampleFactory, PlaybackStrategyFactory, PlaybackStrategyType } from '../../../shared/utils';
import { audioEventBus } from '../../../shared/utils/AudioEventBus';

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
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private playbackStrategy: PlaybackStrategyType = 'basic';
  private isInitialized = false;
  private activeSources: AudioBufferSourceNode[] = [];

  constructor() {
    // Lazy initialization
  }

  private init() {
    if (this.isInitialized) return;
    
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.5; // Default volume
    
    // Initialize sample factory with audio context
    audioSampleFactory.setAudioContext(this.ctx);
    
    // Preload mute sound
    this.preloadMuteSample();
    
    this.isInitialized = true;
    
    audioEventBus.emitSync('play', { initialized: true });
  }

  public get currentTime(): number {
    if (!this.ctx) this.init();
    return this.ctx!.currentTime;
  }

  public async resume(): Promise<void> {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
      audioEventBus.emitSync('resume');
    }
    
    // Восстанавливаем громкость после возможного глушения
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(0.5, this.ctx!.currentTime);
    }
  }

  public setVolume(val: number): void {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  public setPlaybackStrategy(strategy: PlaybackStrategyType): void {
    this.playbackStrategy = strategy;
  }

  private async preloadMuteSample(): Promise<void> {
    try {
      await audioSampleFactory.preloadMuteSample();
    } catch (error) {
      console.error('Failed to preload mute sample:', error);
    }
  }

  public async preloadChord(chordName: string): Promise<void> {
    this.init();
    const frets = CHORD_FRETS[chordName];
    if (!frets) return;

    try {
      await audioSampleFactory.loadChordSamples(chordName, frets);
    } catch (error) {
      console.error(`Failed to preload chord ${chordName}:`, error);
    }
  }

  public async strum(
    direction: StrumDirection, 
    chordName: string, 
    type: StrumType, 
    time?: number
  ): Promise<void> {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    // Ghost notes are silent
    if (type === 'ghost') {
      audioEventBus.emitSync('step', { type: 'ghost', chord: chordName });
      return;
    }

    const startTime = time || this.ctx.currentTime;

    try {
      // Handle Mute Strum
      if (type === 'mute') {
        const muteSample = await audioSampleFactory.preloadMuteSample();
        const strategy = PlaybackStrategyFactory.getMuteStrategy();
        await strategy.play([muteSample], direction, type, this.ctx, this.masterGain, startTime, this.registerActiveSource.bind(this));
        
        audioEventBus.emitSync('step', { type: 'mute', chord: chordName });
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
      
      await strategy.play(chordSample.samples, direction, type, this.ctx, this.masterGain, startTime, this.registerActiveSource.bind(this));
      
      audioEventBus.emitSync('step', { 
        type: 'strum', 
        chord: chordName, 
        direction,
        strategy: this.playbackStrategy 
      });
      
    } catch (error) {
      console.error(`Failed to play strum:`, error);
      audioEventBus.emitSync('error', { 
        type: 'strum', 
        chord: chordName, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  public async playNote(stringName: string, fret: number, time?: number): Promise<void> {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const startTime = time || this.ctx.currentTime;

    try {
      const sample = await audioSampleFactory.loadSample({
        stringName,
        fret
      });

      if (!sample.buffer) {
        throw new Error(`Sample not loaded: ${stringName}-${fret}`);
      }

      const strategy = PlaybackStrategyFactory.getStrategy(this.playbackStrategy);
      await strategy.play([sample], 'down', 'strum', this.ctx, this.masterGain, startTime, this.registerActiveSource.bind(this));
      
      audioEventBus.emitSync('play', { 
        type: 'note', 
        string: stringName, 
        fret 
      });
      
    } catch (error) {
      console.error(`Failed to play note:`, error);
      audioEventBus.emitSync('error', { 
        type: 'note', 
        string: stringName, 
        fret,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  public registerActiveSource(source: AudioBufferSourceNode): void {
    this.activeSources.push(source);
    
    // Автоматически удаляем источник из списка при остановке
    source.onended = () => {
      const index = this.activeSources.indexOf(source);
      if (index > -1) {
        this.activeSources.splice(index, 1);
      }
    };
  }

  public stopAllSounds(): void {
    if (!this.ctx || !this.masterGain) return;
    
    // Мгновенно глушим все звуки через master gain
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    
    // Останавливаем все активные источники звука
    this.activeSources.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Источник может быть уже остановлен, игнорируем ошибку
      }
    });
    this.activeSources = [];
  }

  public stop(): void {
    this.stopAllSounds();
    
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
      this.masterGain = null;
      this.isInitialized = false;
    }
    
    audioEventBus.emitSync('stop');
  }

  public getAvailableChords(): string[] {
    return Object.keys(CHORD_FRETS);
  }

  public getPlaybackStrategy(): PlaybackStrategyType {
    return this.playbackStrategy;
  }

  public isAudioInitialized(): boolean {
    return this.isInitialized;
  }
}

export const audioEngineService = new AudioEngineService();