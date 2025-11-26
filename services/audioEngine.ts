import { StrumDirection, StrumType } from '../types';

// String names mapping to folder names
const STRINGS = ['6E', '5A', '4D', '3G', '2B', '1e'];

// Chord Shapes (Fret positions: 6E, 5A, 4D, 3G, 2B, 1e)
// null indicates the string is not played (muted/skipped)
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

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  
  // Cache for loaded audio buffers
  private buffers: Map<string, AudioBuffer> = new Map();
  private muteBuffer: AudioBuffer | null = null;
  private loadingPromises: Map<string, Promise<AudioBuffer>> = new Map();

  constructor() {
    // Lazy initialization
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.5; // Default volume
      
      // Preload Mute sound
      this.loadSample('/samples/Mute.mp3').then(buf => this.muteBuffer = buf);
    }
  }

  public get currentTime(): number {
    if (!this.ctx) this.init();
    return this.ctx!.currentTime;
  }

  public async resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  private getSampleUrl(stringName: string, fret: number): string {
    return `/samples/${stringName}/fret${fret}.mp3`;
  }

  private async loadSample(url: string): Promise<AudioBuffer> {
    if (this.buffers.has(url)) return this.buffers.get(url)!;
    if (this.loadingPromises.has(url)) return this.loadingPromises.get(url)!;

    const promise = (async () => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.ctx!.decodeAudioData(arrayBuffer);
        this.buffers.set(url, audioBuffer);
        this.loadingPromises.delete(url);
        return audioBuffer;
      } catch (error) {
        console.error(`Error loading sample: ${url}`, error);
        this.loadingPromises.delete(url);
        throw error;
      }
    })();

    this.loadingPromises.set(url, promise);
    return promise;
  }

  // Preload samples for a specific chord
  public preloadChord(chordName: string) {
    this.init();
    const frets = CHORD_FRETS[chordName];
    if (!frets) return;

    frets.forEach((fret, i) => {
      if (fret !== null) {
        const url = this.getSampleUrl(STRINGS[i], fret);
        this.loadSample(url);
      }
    });
  }

  public async strum(direction: StrumDirection, chordName: string, type: StrumType, time?: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    // Ghost notes are silent (or could be a very quiet percussive sound, but silent for now)
    if (type === 'ghost') return;

    const startTime = time || this.ctx.currentTime;

    // Handle Mute Strum
    if (type === 'mute') {
      if (!this.muteBuffer) {
        try {
          this.muteBuffer = await this.loadSample('/samples/Mute.mp3');
        } catch (e) {
          return; // Failed to load mute
        }
      }
      this.playBuffer(this.muteBuffer, startTime, 0.8);
      return;
    }

    // Handle Normal Strum
    const frets = CHORD_FRETS[chordName];
    if (!frets) return;

    const staggerTime = 0.025; // 25ms delay between strings for strumming effect

    // Identify strings to play
    const stringsToPlay = frets
      .map((fret, index) => ({ fret, stringName: STRINGS[index], index }))
      .filter(s => s.fret !== null);

    // Order based on strum direction
    // Down: 6E -> 1e (Low to High)
    // Up: 1e -> 6E (High to Low)
    const orderedStrings = direction === 'down' ? stringsToPlay : stringsToPlay.reverse();

    orderedStrings.forEach((s, i) => {
      const url = this.getSampleUrl(s.stringName, s.fret!);
      
      // Try to get buffer synchronously if loaded, otherwise load it
      let buffer = this.buffers.get(url);
      
      if (buffer) {
        this.playBuffer(buffer, startTime + (i * staggerTime));
      } else {
        // If not loaded, load and play (might be slightly delayed)
        this.loadSample(url).then(buf => {
          // Recalculate time to ensure relative timing is preserved if possible, 
          // or just play immediately if time passed.
          // Since 'time' might be in the future, we still use it.
          this.playBuffer(buf, startTime + (i * staggerTime));
        });
      }
    });
  }

  private playBuffer(buffer: AudioBuffer, time: number, volume: number = 1.0) {
    const source = this.ctx!.createBufferSource();
    source.buffer = buffer;
    
    const gain = this.ctx!.createGain();
    gain.gain.value = volume;
    
    source.connect(gain);
    gain.connect(this.masterGain!);
    
    source.start(time);
  }
}

export const audioEngine = new AudioEngine();