import { TunerResult } from '../../../domain/entities';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export class TunerService {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  private isRunning = false;
  private rafID: number | null = null;
  private buffer = new Float32Array(2048);

  // Guitar tuning notes
  private readonly guitarNotes = [
    { note: "E", octave: 2, freq: 82.41 },
    { note: "A", octave: 2, freq: 110.00 },
    { note: "D", octave: 3, freq: 146.83 },
    { note: "G", octave: 3, freq: 196.00 },
    { note: "B", octave: 3, freq: 246.94 },
    { note: "E", octave: 4, freq: 329.63 }
  ];

  private readonly noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  async start(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Ваш браузер не поддерживает доступ к микрофону или функция недоступна в текущем контексте');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.mediaStreamSource.connect(this.analyser);
      
      this.isRunning = true;
    } catch (err) {
      console.error("Error accessing microphone", err);
      const errorMessage = err instanceof Error ? err.message : "Не удалось получить доступ к микрофону. Пожалуйста, проверьте разрешения.";
      throw new Error(errorMessage);
    }
  }

  stop(): void {
    this.isRunning = false;
    if (this.rafID) {
      cancelAnimationFrame(this.rafID);
      this.rafID = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  async getPitch(): Promise<TunerResult | null> {
    if (!this.analyser || !this.audioContext || !this.isRunning) {
      return null;
    }

    return new Promise((resolve) => {
      const updatePitch = () => {
        if (!this.analyser || !this.audioContext || !this.isRunning) {
          resolve(null);
          return;
        }

        this.analyser.getFloatTimeDomainData(this.buffer);
        const frequency = this.autoCorrelate(this.buffer, this.audioContext.sampleRate);

        if (frequency !== -1) {
          const result = this.analyzeFrequency(frequency);
          resolve(result);
        } else {
          this.rafID = window.requestAnimationFrame(updatePitch);
        }
      };

      updatePitch();
    });
  }

  startContinuousAnalysis(callback: (result: TunerResult | null) => void): void {
    if (!this.isRunning) return;

    const analyze = () => {
      if (!this.analyser || !this.audioContext || !this.isRunning) {
        callback(null);
        return;
      }

      this.analyser.getFloatTimeDomainData(this.buffer);
      const frequency = this.autoCorrelate(this.buffer, this.audioContext.sampleRate);

      if (frequency !== -1) {
        const result = this.analyzeFrequency(frequency);
        callback(result);
      } else {
        callback(null);
      }

      this.rafID = window.requestAnimationFrame(analyze);
    };

    analyze();
  }

  private analyzeFrequency(frequency: number): TunerResult {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    const note = Math.round(noteNum) + 69;
    const noteName = this.noteStrings[note % 12];
    const cents = Math.floor(1200 * Math.log(frequency / this.frequencyFromNoteNumber(note)) / Math.log(2));
    const isInTune = Math.abs(cents) < 5;

    return {
      note: noteName,
      frequency: Math.round(frequency),
      cents,
      isInTune
    };
  }

  private analyzeFrequencyForGuitar(frequency: number): TunerResult {
    const closestGuitarNote = this.getClosestGuitarNote(frequency);
    const cents = Math.floor(1200 * Math.log(frequency / closestGuitarNote.freq) / Math.log(2));
    const isInTune = Math.abs(cents) < 5;

    return {
      note: closestGuitarNote.note,
      frequency: Math.round(frequency),
      cents,
      isInTune
    };
  }

  private getClosestGuitarNote(pitch: number) {
    let minDiff = Infinity;
    let closestNote = this.guitarNotes[0];

    this.guitarNotes.forEach(gNote => {
      const diff = Math.abs(pitch - gNote.freq);
      if (diff < minDiff) {
        minDiff = diff;
        closestNote = gNote;
      }
    });

    return closestNote;
  }

  private frequencyFromNoteNumber(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  private autoCorrelate(buf: Float32Array, sampleRate: number): number {
    // ACF2+ algorithm implementation
    let SIZE = buf.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      const val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);

    if (rms < 0.01) // not enough signal
      return -1;

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++)
      if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    for (let i = 1; i < SIZE / 2; i++)
      if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

    buf = buf.slice(r1, r2);
    SIZE = buf.length;

    let c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++)
      for (let j = 0; j < SIZE - i; j++)
        c[i] = c[i] + buf[j] * buf[j + i];

    let d = 0; while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  }

  isAudioRunning(): boolean {
    return this.isRunning;
  }
}

export const tunerService = new TunerService();