import { InstrumentType } from '../types';

class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentInstrument: InstrumentType = 'Пианино';
  private pianoWave: PeriodicWave | null = null;

  constructor() {
    // Lazy initialization
  }

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = 0.4; // Master volume
      this.masterGain.connect(this.audioCtx.destination);

      // Pre-calculate Piano Waveform (Additive Synthesis)
      // Real: [0, 1] (Fundamental only)
      // Imag: [0, 1, 0.4, 0.2, 0.1, 0.05] (Harmonics for "Piano-like" timbre)
      const real = new Float32Array([0, 0, 0, 0, 0, 0]);
      const imag = new Float32Array([0, 1, 0.4, 0.3, 0.2, 0.1]); 
      this.pianoWave = this.audioCtx.createPeriodicWave(real, imag);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setInstrument(type: InstrumentType) {
    this.currentInstrument = type;
  }

  playChord(frequencies: number[], duration: number = 1.0, when: number = 0) {
    this.init();
    if (!this.audioCtx || !this.masterGain) return;

    const startTime = this.audioCtx.currentTime + when;
    const stopTime = startTime + duration;

    frequencies.forEach(freq => {
      const osc = this.audioCtx!.createOscillator();
      const noteGain = this.audioCtx!.createGain();

      // Configure Oscillator based on Instrument
      if (this.currentInstrument === 'Пианино' && this.pianoWave) {
        osc.setPeriodicWave(this.pianoWave);
      } else if (this.currentInstrument === 'Синтезатор') {
        osc.type = 'sawtooth';
      } else {
        // Пэд
        osc.type = 'triangle';
      }
      
      osc.frequency.value = freq;

      // Connect nodes first
      osc.connect(noteGain);
      noteGain.connect(this.masterGain!);

      // Start the oscillator
      osc.start(startTime);

      // Configure Envelope (ADSR) based on Instrument
      // We must be careful to schedule values slightly in the future if startTime is 0,
      // but AudioContext usually handles scheduling in the past by snapping to currentTime.
      noteGain.gain.setValueAtTime(0, startTime);

      if (this.currentInstrument === 'Пианино') {
        // Пианино: Резкая атака, быстрое затухание к сустейну, долгое релиз
        const attackTime = 0.02;
        const decayTime = 0.3;
        const sustainLevel = 0.3 / frequencies.length;
        
        noteGain.gain.linearRampToValueAtTime(0.8 / frequencies.length, startTime + attackTime); // Attack
        noteGain.gain.exponentialRampToValueAtTime(sustainLevel, startTime + attackTime + decayTime); // Decay
        noteGain.gain.setValueAtTime(sustainLevel, stopTime - 0.2); // Hold Sustain
        noteGain.gain.exponentialRampToValueAtTime(0.001, stopTime + 0.5); // Long Release (Pedal effect)
        
        osc.stop(stopTime + 0.5); 
      } else if (this.currentInstrument === 'Синтезатор') {
        // Синтезатор: Быстрая атака, постоянный сустейн
        noteGain.gain.linearRampToValueAtTime(0.5 / frequencies.length, startTime + 0.05);
        noteGain.gain.setValueAtTime(0.5 / frequencies.length, stopTime - 0.05);
        noteGain.gain.linearRampToValueAtTime(0.001, stopTime);
        
        osc.stop(stopTime + 0.1);
      } else {
        // Пэд: Медленная атака, полный сустейн
        noteGain.gain.linearRampToValueAtTime(0.6 / frequencies.length, startTime + 0.5); // Slow Attack
        noteGain.gain.setValueAtTime(0.6 / frequencies.length, stopTime - 0.5);
        noteGain.gain.linearRampToValueAtTime(0.001, stopTime + 0.5); // Slow Release
        
        osc.stop(stopTime + 0.5);
      }
    });
  }

  playProgression(frequenciesList: number[][], durationPerChord: number = 1.0) {
    frequenciesList.forEach((freqs, index) => {
      this.playChord(freqs, durationPerChord, index * durationPerChord);
    });
  }
}

export const audioEngine = new AudioEngine();