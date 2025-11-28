import { StrumDirection, StrumType } from '../../domain/entities';

export interface AudioSample {
  id: string;
  url: string;
  buffer?: AudioBuffer;
  isLoading: boolean;
  error?: string;
}

export interface ChordSample {
  chord: string;
  samples: AudioSample[];
}

export interface AudioSampleConfig {
  stringName: string;
  fret: number;
  chord?: string;
}

class AudioSampleFactory {
  private static instance: AudioSampleFactory;
  private audioContext: AudioContext | null = null;
  private cache: Map<string, AudioSample> = new Map();
  private loadingPromises: Map<string, Promise<AudioBuffer>> = new Map();

  private constructor() {}

  static getInstance(): AudioSampleFactory {
    if (!AudioSampleFactory.instance) {
      AudioSampleFactory.instance = new AudioSampleFactory();
    }
    return AudioSampleFactory.instance;
  }

  setAudioContext(context: AudioContext): void {
    this.audioContext = context;
  }

  private getSampleUrl(stringName: string, fret: number): string {
    return `/samples/${stringName}/fret${fret}.mp3`;
  }

  private getSampleKey(config: AudioSampleConfig): string {
    return `${config.stringName}-${config.fret}${config.chord ? `-${config.chord}` : ''}`;
  }

  async loadSample(config: AudioSampleConfig): Promise<AudioSample> {
    const key = this.getSampleKey(config);
    
    // Return from cache if already loaded
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(key)) {
      const buffer = await this.loadingPromises.get(key)!;
      return this.cache.get(key)!;
    }

    // Create new sample entry
    const sample: AudioSample = {
      id: key,
      url: this.getSampleUrl(config.stringName, config.fret),
      isLoading: true
    };
    
    this.cache.set(key, sample);

    // Load the audio buffer
    const loadPromise = this.loadAudioBuffer(sample.url);
    this.loadingPromises.set(key, loadPromise);

    try {
      const buffer = await loadPromise;
      sample.buffer = buffer;
      sample.isLoading = false;
      this.loadingPromises.delete(key);
      return sample;
    } catch (error) {
      sample.error = error instanceof Error ? error.message : 'Unknown error';
      sample.isLoading = false;
      this.loadingPromises.delete(key);
      throw error;
    }
  }

  private async loadAudioBuffer(url: string): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized');
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return await this.audioContext.decodeAudioData(arrayBuffer);
  }

  async loadChordSamples(chordName: string, chordFrets: (number | null)[]): Promise<ChordSample> {
    const strings = ['6E', '5A', '4D', '3G', '2B', '1e'];
    const samples: AudioSample[] = [];

    const loadPromises = chordFrets.map(async (fret, index) => {
      if (fret !== null) {
        try {
          const sample = await this.loadSample({
            stringName: strings[index],
            fret,
            chord: chordName
          });
          return { index, sample };
        } catch (error) {
          console.error(`Failed to load sample for ${strings[index]} fret ${fret}:`, error);
          return null;
        }
      }
      return null;
    });

    const results = await Promise.all(loadPromises);
    
    // Sort by string index to maintain order
    results
      .filter((result): result is { index: number; sample: AudioSample } => result !== null)
      .sort((a, b) => a.index - b.index)
      .forEach(({ sample }) => samples.push(sample));

    return {
      chord: chordName,
      samples
    };
  }

  preloadMuteSample(): Promise<AudioSample> {
    return this.loadSample({
      stringName: 'mute',
      fret: 0
    });
  }

  getSample(config: AudioSampleConfig): AudioSample | undefined {
    const key = this.getSampleKey(config);
    return this.cache.get(key);
  }

  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getLoadingSamplesCount(): number {
    return this.loadingPromises.size;
  }
}

export const audioSampleFactory = AudioSampleFactory.getInstance();