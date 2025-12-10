import { midiToFreq } from '../utils/musicTheory';

class AudioEngine {
  private context: AudioContext | null = null;
  private gainNode: GainNode | null = null;

  private init() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);
      this.gainNode.gain.value = 0.3; // Master volume
    }
  }

  public async resume() {
    this.init();
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  public playNote(midi: number, duration: number = 1.0, startTime?: number) {
    this.init();
    if (!this.context || !this.gainNode) return;

    const start = startTime !== undefined ? startTime : this.context.currentTime;

    const osc = this.context.createOscillator();
    const noteGain = this.context.createGain();
    
    osc.type = 'triangle'; // Soft but clear sound
    osc.frequency.setValueAtTime(midiToFreq(midi), start);

    // Envelope
    noteGain.gain.setValueAtTime(0, start);
    noteGain.gain.linearRampToValueAtTime(1, start + 0.02); // Attack
    noteGain.gain.exponentialRampToValueAtTime(0.001, start + duration); // Decay

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(start);
    osc.stop(start + duration);
  }

  public playChord(midiNotes: number[]) {
    this.init();
    // Play all notes simultaneously
    midiNotes.forEach(note => this.playNote(note, 2.0));
  }

  public playArpeggio(midiNotes: number[]) {
    this.init();
    if (!this.context) return;

    // Sort notes from low to high
    const sortedNotes = [...midiNotes].sort((a, b) => a - b);
    const stagger = 0.4; // Seconds between notes

    sortedNotes.forEach((note, index) => {
        this.playNote(note, 1.5, this.context!.currentTime + (index * stagger));
    });
  }
}

export const audioEngine = new AudioEngine();