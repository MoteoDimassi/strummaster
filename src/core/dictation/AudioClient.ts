export class AudioClient {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;

  constructor() {
    // Lazy initialization to comply with browser autoplay policies
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.ctx.createGain();
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public async playTone(frequency: number, duration: number = 0.5, startTime: number = 0) {
    this.init();
    if (!this.ctx || !this.gainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // "Piano-like" synthesis: Triangle wave with slight exponential decay
    osc.type = 'triangle';
    osc.frequency.value = frequency;

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime + startTime;
    
    // Attack
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.6, now + 0.02);
    // Decay
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  public async playSequence(notes: { frequency: number; duration: number }[]) {
    this.init();
    if (!this.ctx) return;
    
    let currentTime = 0;
    const gap = 0.1; // Gap between notes

    notes.forEach(note => {
      this.playTone(note.frequency, note.duration, currentTime);
      currentTime += note.duration + gap;
    });
  }
}

export const audioClient = new AudioClient();