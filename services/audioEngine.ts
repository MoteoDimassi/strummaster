import { StrumDirection } from '../types';

// Chord Shapes (Frequencies in Hz)
// 6-string standard tuning references: E2=82.41, A2=110, D3=146.83, G3=196, B3=246.94, E4=329.63
const CHORD_LIBRARY: Record<string, number[]> = {
  'Am': [110.00, 164.81, 220.00, 261.63, 329.63], // X02210
  'A':  [110.00, 164.81, 220.00, 277.18, 329.63], // X02220
  'C':  [130.81, 164.81, 196.00, 261.63, 329.63], // X32010
  'D':  [146.83, 220.00, 293.66, 369.99],         // XX0232
  'Dm': [146.83, 220.00, 293.66, 349.23],         // XX0231
  'E':  [82.41, 123.47, 164.81, 207.65, 246.94, 329.63], // 022100
  'Em': [82.41, 123.47, 164.81, 196.00, 246.94, 329.63], // 022000
  'G':  [98.00, 123.47, 196.00, 293.66, 392.00], // 320003 (simplified)
  'F':  [174.61, 220.00, 261.63, 349.23], // XX3211 (easy F)
};

const DEFAULT_FREQUENCIES = CHORD_LIBRARY['Am'];

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    // Lazy initialization
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.3; // Default volume
    }
  }

  public get currentTime(): number {
    // Ensure initialized if accessing time, though usually called after resume()
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

  public strum(direction: StrumDirection, chordName: string, time?: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    // Resolve frequencies
    const frequencies = CHORD_LIBRARY[chordName] || DEFAULT_FREQUENCIES;

    // Use provided time or 'now'
    const startTime = time || this.ctx.currentTime;
    const staggerTime = 0.025; // Speed of the strum

    // Create oscillator for each string
    frequencies.forEach((freq, index) => {
      // Calculate start time based on direction
      // Down: low to high index. Up: high to low index.
      const delay = direction === 'down' 
        ? index * staggerTime 
        : (frequencies.length - 1 - index) * staggerTime;

      const stringStart = startTime + delay;
      const duration = 1.2; // Seconds

      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      // Sound design: Sawtooth/Triangle mix for brightness
      osc.type = 'triangle'; 
      osc.frequency.value = freq;

      // Filter to emulate body resonance/pluck
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, stringStart);
      filter.frequency.exponentialRampToValueAtTime(4000, stringStart + 0.05); // Attack pluck
      filter.frequency.exponentialRampToValueAtTime(600, stringStart + duration); // Decay

      // Envelope
      gain.gain.setValueAtTime(0, stringStart);
      gain.gain.linearRampToValueAtTime(0.25, stringStart + 0.015); // Quick attack
      gain.gain.exponentialRampToValueAtTime(0.001, stringStart + duration); // Long decay

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(stringStart);
      osc.stop(stringStart + duration);
    });
  }
}

export const audioEngine = new AudioEngine();