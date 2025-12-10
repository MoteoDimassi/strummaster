import { SoundType, Rhythm } from '../types';

/**
 * Defines the timing offsets (0.0 to 1.0) for each note within a single beat
 * for every available rhythm type.
 */
const RhythmPatterns: Record<Rhythm, number[]> = {
  [Rhythm.Quarter]: [0],
  [Rhythm.Eighth]: [0, 0.5],
  [Rhythm.Triplet]: [0, 1/3, 2/3],
  [Rhythm.Sixteenth]: [0, 0.25, 0.5, 0.75],
  [Rhythm.DottedEighthSixteenth]: [0, 0.75],
  [Rhythm.SixteenthDottedEighth]: [0, 0.25],
  [Rhythm.TripletQuarterEighth]: [0, 2/3], // Quarter (2/3) + Eighth (1/3)
};

class AudioEngine {
  private audioContext: AudioContext | null = null;
  private isPlaying: boolean = false;
  private nextNoteTime: number = 0.0;
  private timerID: number | null = null;
  
  // Configuration
  private bpm: number = 120;
  private beatsPerBar: number = 4;
  private rhythm: Rhythm = Rhythm.Quarter;
  private accentFirstBeat: boolean = true;
  private volume: number = 0.8;
  private soundType: SoundType = SoundType.Click;

  // State for scheduling
  private currentBeatIndex: number = 0; // The main beat number (0 to beatsPerBar - 1)
  private currentSubNoteIndex: number = 0; // The index within the current rhythm pattern
  
  private onBeatCallback: ((beat: number, isAccent: boolean) => void) | null = null;

  private readonly lookahead = 25.0; 
  private readonly scheduleAheadTime = 0.1; 

  constructor() {}

  public init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  public setCallback(cb: (beat: number, isAccent: boolean) => void) {
    this.onBeatCallback = cb;
  }

  public start() {
    if (this.isPlaying) return;
    this.init();
    if (!this.audioContext) return;

    this.isPlaying = true;
    this.currentBeatIndex = 0;
    this.currentSubNoteIndex = 0;
    this.nextNoteTime = this.audioContext.currentTime + 0.05;
    this.scheduler();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerID !== null) {
      window.clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  public updateSettings(params: { 
    bpm?: number; 
    beatsPerBar?: number; 
    subdivision?: Rhythm;
    accentFirstBeat?: boolean;
    volume?: number;
    soundType?: SoundType;
  }) {
    if (params.bpm !== undefined) this.bpm = params.bpm;
    if (params.beatsPerBar !== undefined) this.beatsPerBar = params.beatsPerBar;
    if (params.subdivision !== undefined) {
      // If rhythm changes, reset sub-index to avoid out-of-bounds
      if (this.rhythm !== params.subdivision) {
         this.rhythm = params.subdivision;
         this.currentSubNoteIndex = 0; 
      }
    }
    if (params.accentFirstBeat !== undefined) this.accentFirstBeat = params.accentFirstBeat;
    if (params.volume !== undefined) this.volume = params.volume;
    if (params.soundType !== undefined) this.soundType = params.soundType;
  }

  private nextNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    const pattern = RhythmPatterns[this.rhythm];
    
    // Calculate duration until next note
    let deltaSteps = 0;
    
    if (this.currentSubNoteIndex < pattern.length - 1) {
      // Delta to next note in same beat
      deltaSteps = pattern[this.currentSubNoteIndex + 1] - pattern[this.currentSubNoteIndex];
      this.currentSubNoteIndex++;
    } else {
      // Delta to first note of NEXT beat
      // (1.0 - currentOffset) + nextBeatFirstOffset (usually 0)
      deltaSteps = (1.0 - pattern[this.currentSubNoteIndex]) + pattern[0];
      
      this.currentSubNoteIndex = 0;
      this.currentBeatIndex++;
      if (this.currentBeatIndex >= this.beatsPerBar) {
        this.currentBeatIndex = 0;
      }
    }

    this.nextNoteTime += deltaSteps * secondsPerBeat;
  }

  private scheduleNote(beatIndex: number, subIndex: number, time: number) {
    if (!this.audioContext) return;

    // Main beats are always the first note of the pattern (offset 0)
    const isMainBeat = subIndex === 0;

    // Determine accent
    let isAccent = false;
    if (this.accentFirstBeat) {
      isAccent = beatIndex === 0 && isMainBeat;
    }

    // Create oscillator
    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    osc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const applyEnvelope = (startVol: number, decay: number) => {
        gainNode.gain.setValueAtTime(startVol * this.volume, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + decay);
        osc.stop(time + decay);
    };

    osc.start(time);

    switch (this.soundType) {
        case SoundType.Woodblock:
            osc.type = 'sine'; // Sine often sounds closer to woodblock if pitched right with fast decay
            // To make it more wood-like, we could use a custom periodic wave, but sine is okay
            // Woodblock is high pitch, short decay
            if (isAccent) {
                osc.frequency.setValueAtTime(1200, time);
                applyEnvelope(1.0, 0.05);
            } else if (isMainBeat) {
                osc.frequency.setValueAtTime(800, time);
                applyEnvelope(0.8, 0.05);
            } else {
                osc.frequency.setValueAtTime(600, time);
                applyEnvelope(0.4, 0.05);
            }
            break;
        
        case SoundType.Beep:
            osc.type = 'square';
            if (isAccent) {
                osc.frequency.setValueAtTime(880, time);
                applyEnvelope(0.5, 0.1);
            } else if (isMainBeat) {
                osc.frequency.setValueAtTime(440, time);
                applyEnvelope(0.4, 0.1);
            } else {
                osc.frequency.setValueAtTime(220, time);
                applyEnvelope(0.2, 0.05);
            }
            break;

        case SoundType.Drum:
            osc.type = 'sine';
            if (isAccent) {
                // Kick drum-ish
                osc.frequency.setValueAtTime(150, time);
                osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.1);
                applyEnvelope(1.0, 0.15);
            } else if (isMainBeat) {
                // Higher tom
                osc.frequency.setValueAtTime(300, time);
                osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.1);
                applyEnvelope(0.8, 0.1);
            } else {
                // Stick click
                osc.frequency.setValueAtTime(800, time);
                applyEnvelope(0.3, 0.03);
            }
            break;

        case SoundType.Click:
        default:
            osc.type = 'triangle'; 
            if (isAccent) {
                osc.frequency.setValueAtTime(1500, time);
                applyEnvelope(1.0, 0.05);
            } else if (isMainBeat) {
                osc.frequency.setValueAtTime(1000, time);
                applyEnvelope(0.8, 0.05);
            } else {
                osc.frequency.setValueAtTime(800, time);
                applyEnvelope(0.4, 0.05);
            }
            break;
    }

    // Visual Callback (only on main beats)
    if (isMainBeat) {
        const delay = Math.max(0, (time - this.audioContext.currentTime) * 1000);
        setTimeout(() => {
            if (this.onBeatCallback && this.isPlaying) {
                this.onBeatCallback(beatIndex, isAccent);
            }
        }, delay);
    }
  }

  private scheduler() {
    if (!this.audioContext) return;

    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentBeatIndex, this.currentSubNoteIndex, this.nextNoteTime);
      this.nextNote();
    }

    if (this.isPlaying) {
      this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
    }
  }
}

export const audioEngine = new AudioEngine();
