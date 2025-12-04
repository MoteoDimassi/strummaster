import { StrumDirection, StrumType } from '../../domain/entities';

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

// Интерфейсы для адаптеров аудио API
export interface AudioContextAdapter {
  currentTime: number;
  resume(): Promise<void>;
  close(): void;
}

export interface GainNodeAdapter {
  gain: {
    value: number;
    setValueAtTime(value: number, time: number): void;
  };
  connect(destination: any): void;
}

export interface AudioBufferSourceNodeAdapter {
  buffer: any;
  connect(destination: any): void;
  start(time?: number): void;
  stop(): void;
  onended: (() => void) | null;
}

export interface AudioSampleAdapter {
  id: string;
  url: string;
  buffer?: any;
  isLoading: boolean;
  error?: string;
}

export interface ChordSampleAdapter {
  chord: string;
  samples: AudioSampleAdapter[];
}

export interface AudioSampleFactoryAdapter {
  preloadMuteSample(): Promise<AudioSampleAdapter>;
  loadChordSamples(chordName: string, chordFrets: (number | null)[]): Promise<ChordSampleAdapter>;
  loadSample(config: { stringName: string; fret: number }): Promise<AudioSampleAdapter>;
}

export interface PlaybackStrategyAdapter {
  play(
    samples: AudioSampleAdapter[],
    direction: StrumDirection,
    type: StrumType,
    audioContext: AudioContextAdapter,
    destination: GainNodeAdapter,
    time?: number,
    sourceCallback?: (source: AudioBufferSourceNodeAdapter) => void
  ): Promise<void>;
}

export interface PlaybackStrategyFactoryAdapter {
  getStrategy(type: string): PlaybackStrategyAdapter;
  getMuteStrategy(): PlaybackStrategyAdapter;
}

export interface AudioEventBusAdapter {
  emitSync(event: string, data?: any): void;
}

export type PlaybackStrategyType = 'basic' | 'aggressive' | 'gentle';

export class AudioEngineCore {
  private playbackStrategy: PlaybackStrategyType = 'basic';
  private isInitialized = false;
  private activeSources: AudioBufferSourceNodeAdapter[] = [];

  constructor(
    private audioContextAdapter: AudioContextAdapter | null = null,
    private masterGainAdapter: GainNodeAdapter | null = null,
    private sampleFactoryAdapter: AudioSampleFactoryAdapter | null = null,
    private playbackStrategyFactoryAdapter: PlaybackStrategyFactoryAdapter | null = null,
    private eventBusAdapter: AudioEventBusAdapter | null = null
  ) {}

  public get currentTime(): number {
    if (!this.audioContextAdapter) {
      throw new Error('AudioContext adapter not initialized');
    }
    return this.audioContextAdapter.currentTime;
  }

  public async resume(): Promise<void> {
    if (!this.audioContextAdapter) {
      throw new Error('AudioContext adapter not initialized');
    }
    
    await this.audioContextAdapter.resume();
    
    if (this.eventBusAdapter) {
      this.eventBusAdapter.emitSync('resume');
    }
    
    // Восстанавливаем громкость после возможного глушения
    if (this.masterGainAdapter && this.audioContextAdapter) {
      this.masterGainAdapter.gain.setValueAtTime(0.5, this.audioContextAdapter.currentTime);
    }
  }

  public setVolume(val: number): void {
    if (this.masterGainAdapter && this.audioContextAdapter) {
      this.masterGainAdapter.gain.setValueAtTime(val, this.audioContextAdapter.currentTime);
    }
  }

  public setPlaybackStrategy(strategy: PlaybackStrategyType): void {
    this.playbackStrategy = strategy;
  }

  public async preloadMuteSample(): Promise<void> {
    if (!this.sampleFactoryAdapter) {
      throw new Error('Sample factory adapter not initialized');
    }
    
    try {
      await this.sampleFactoryAdapter.preloadMuteSample();
    } catch (error) {
      console.error('Failed to preload mute sample:', error);
    }
  }

  public async preloadChord(chordName: string): Promise<void> {
    if (!this.sampleFactoryAdapter) {
      throw new Error('Sample factory adapter not initialized');
    }
    
    const frets = CHORD_FRETS[chordName];
    if (!frets) return;

    try {
      await this.sampleFactoryAdapter.loadChordSamples(chordName, frets);
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
    if (!this.audioContextAdapter || !this.masterGainAdapter || !this.sampleFactoryAdapter || !this.playbackStrategyFactoryAdapter) {
      throw new Error('Required adapters not initialized');
    }

    // Ghost notes are silent
    if (type === 'ghost') {
      if (this.eventBusAdapter) {
        this.eventBusAdapter.emitSync('step', { type: 'ghost', chord: chordName });
      }
      return;
    }

    const startTime = time || this.audioContextAdapter.currentTime;

    try {
      // Handle Mute Strum
      if (type === 'mute') {
        const muteSample = await this.sampleFactoryAdapter.preloadMuteSample();
        const strategy = this.playbackStrategyFactoryAdapter.getMuteStrategy();
        await strategy.play([muteSample], direction, type, this.audioContextAdapter, this.masterGainAdapter, startTime, this.registerActiveSource.bind(this));
        
        if (this.eventBusAdapter) {
          this.eventBusAdapter.emitSync('step', { type: 'mute', chord: chordName });
        }
        return;
      }

      // Handle Normal Strum
      const frets = CHORD_FRETS[chordName];
      if (!frets) {
        console.error(`Unknown chord: ${chordName}`);
        return;
      }

      const chordSample = await this.sampleFactoryAdapter.loadChordSamples(chordName, frets);
      const strategy = this.playbackStrategyFactoryAdapter.getStrategy(this.playbackStrategy);
      
      await strategy.play(chordSample.samples, direction, type, this.audioContextAdapter, this.masterGainAdapter, startTime, this.registerActiveSource.bind(this));
      
      if (this.eventBusAdapter) {
        this.eventBusAdapter.emitSync('step', { 
          type: 'strum', 
          chord: chordName, 
          direction,
          strategy: this.playbackStrategy 
        });
      }
      
    } catch (error) {
      console.error(`Failed to play strum:`, error);
      if (this.eventBusAdapter) {
        this.eventBusAdapter.emitSync('error', { 
          type: 'strum', 
          chord: chordName, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
  }

  public async playNote(stringName: string, fret: number, time?: number): Promise<void> {
    if (!this.audioContextAdapter || !this.masterGainAdapter || !this.sampleFactoryAdapter || !this.playbackStrategyFactoryAdapter) {
      throw new Error('Required adapters not initialized');
    }

    const startTime = time || this.audioContextAdapter.currentTime;

    try {
      const sample = await this.sampleFactoryAdapter.loadSample({
        stringName,
        fret
      });

      if (!sample.buffer) {
        throw new Error(`Sample not loaded: ${stringName}-${fret}`);
      }

      const strategy = this.playbackStrategyFactoryAdapter.getStrategy(this.playbackStrategy);
      await strategy.play([sample], 'down', 'strum', this.audioContextAdapter, this.masterGainAdapter, startTime, this.registerActiveSource.bind(this));
      
      if (this.eventBusAdapter) {
        this.eventBusAdapter.emitSync('play', { 
          type: 'note', 
          string: stringName, 
          fret 
        });
      }
      
    } catch (error) {
      console.error(`Failed to play note:`, error);
      if (this.eventBusAdapter) {
        this.eventBusAdapter.emitSync('error', { 
          type: 'note', 
          string: stringName, 
          fret,
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
  }

  public registerActiveSource(source: AudioBufferSourceNodeAdapter): void {
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
    if (!this.audioContextAdapter || !this.masterGainAdapter) {
      return;
    }
    
    // Мгновенно глушим все звуки через master gain
    this.masterGainAdapter.gain.setValueAtTime(0, this.audioContextAdapter.currentTime);
    
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
    
    if (this.audioContextAdapter) {
      this.audioContextAdapter.close();
      this.audioContextAdapter = null;
      this.masterGainAdapter = null;
      this.isInitialized = false;
    }
    
    if (this.eventBusAdapter) {
      this.eventBusAdapter.emitSync('stop');
    }
  }

  public getAvailableChords(): string[] {
    return Object.keys(CHORD_FRETS);
  }

  public getChordFrets(chordName: string): (number | null)[] | undefined {
    return CHORD_FRETS[chordName];
  }

  public getPlaybackStrategy(): PlaybackStrategyType {
    return this.playbackStrategy;
  }

  public isAudioInitialized(): boolean {
    return this.isInitialized;
  }

  public getStrings(): string[] {
    return [...STRINGS];
  }

  // Методы для установки адаптеров
  public setAudioContextAdapter(adapter: AudioContextAdapter): void {
    this.audioContextAdapter = adapter;
  }

  public setMasterGainAdapter(adapter: GainNodeAdapter): void {
    this.masterGainAdapter = adapter;
  }

  public setSampleFactoryAdapter(adapter: AudioSampleFactoryAdapter): void {
    this.sampleFactoryAdapter = adapter;
  }

  public setPlaybackStrategyFactoryAdapter(adapter: PlaybackStrategyFactoryAdapter): void {
    this.playbackStrategyFactoryAdapter = adapter;
  }

  public setEventBusAdapter(adapter: AudioEventBusAdapter): void {
    this.eventBusAdapter = adapter;
  }

  // Метод для инициализации
  public initialize(): void {
    this.isInitialized = true;
    
    if (this.eventBusAdapter) {
      this.eventBusAdapter.emitSync('play', { initialized: true });
    }
  }
}