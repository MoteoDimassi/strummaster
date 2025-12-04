import { Measure } from '../../domain/entities/Measure';
import { StrumStep } from '../../domain/entities/StrumStep';

export interface SchedulerConfig {
  bpm: number;
  lookahead: number;
  scheduleAheadTime: number;
}

// Интерфейсы для адаптеров
export interface TimerAdapter {
  setTimeout(callback: () => void, delay: number): number | null;
  clearTimeout(timerId: number | null): void;
}

export interface AudioEngineAdapter {
  currentTime: number;
  resume(): Promise<void>;
  strum(direction: string, chord: string, strumType: string, time: number): Promise<void>;
  stopAllSounds(): void;
}

export interface EventBusAdapter {
  emitSync(event: string, data?: any): void;
  subscribe(event: string, callback: (data: any) => void): void;
}

export interface PlayerState {
  isPlaying: boolean;
  currentMeasureIdx: number;
  currentStepIdx: number;
  activeMeasureIdx: number;
}

export class PlayerCore {
  private state: PlayerState = {
    isPlaying: false,
    currentMeasureIdx: 0,
    currentStepIdx: 0,
    activeMeasureIdx: 0
  };
  
  private nextNoteTime = 0;
  private timerID: number | null = null;
  private measures: Measure[] = [];
  private config: SchedulerConfig = {
    bpm: 90,
    lookahead: 25.0,
    scheduleAheadTime: 0.1
  };

  constructor(
    private timerAdapter: TimerAdapter,
    private audioEngineAdapter: AudioEngineAdapter,
    private eventBusAdapter: EventBusAdapter
  ) {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventBusAdapter.subscribe('play', (event) => {
      console.log('Audio play event:', event);
    });

    this.eventBusAdapter.subscribe('stop', (event) => {
      console.log('Audio stop event:', event);
      this.stop();
    });

    this.eventBusAdapter.subscribe('error', (event) => {
      console.error('Audio error event:', event);
    });
  }

  public setMeasures(measures: Measure[]): void {
    this.measures = measures;
  }

  public setActiveMeasureIdx(idx: number): void {
    this.state.activeMeasureIdx = idx;
    if (!this.state.isPlaying) {
      this.state.currentMeasureIdx = idx;
      this.state.currentStepIdx = 0;
    }
  }

  public setConfig(config: Partial<SchedulerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public async start(): Promise<void> {
    if (this.state.isPlaying) return;

    await this.audioEngineAdapter.resume();
    this.state.isPlaying = true;
    
    // Start from the beginning of the CURRENT measure
    this.state.currentMeasureIdx = this.state.activeMeasureIdx;
    this.state.currentStepIdx = 0;
    this.nextNoteTime = this.audioEngineAdapter.currentTime + 0.1;
    
    this.scheduler();
    
    this.eventBusAdapter.emitSync('play', { 
      measureIdx: this.state.currentMeasureIdx, 
      stepIdx: this.state.currentStepIdx 
    });
  }

  public stop(): void {
    if (!this.state.isPlaying) return;

    this.state.isPlaying = false;
    
    if (this.timerID) {
      this.timerAdapter.clearTimeout(this.timerID);
      this.timerID = null;
    }
    
    // Глушим все активные звуки
    this.audioEngineAdapter.stopAllSounds();
    
    this.eventBusAdapter.emitSync('stop');
  }

  public reset(): void {
    this.stop();
    this.state.currentMeasureIdx = this.state.activeMeasureIdx;
    this.state.currentStepIdx = 0;
  }

  private nextNote(): void {
    const secondsPerBeat = 60.0 / this.config.bpm;
    const secondsPerEighth = secondsPerBeat / 2;
    this.nextNoteTime += secondsPerEighth;
    
    // Advance logic
    const currentMeasure = this.measures[this.state.currentMeasureIdx];
    if (!currentMeasure) return;
    
    this.state.currentStepIdx += 1;

    // Check if end of measure
    if (this.state.currentStepIdx >= currentMeasure.steps.length) {
      this.state.currentStepIdx = 0;
      this.state.currentMeasureIdx += 1;
      
      // Loop song
      if (this.state.currentMeasureIdx >= this.measures.length) {
        this.state.currentMeasureIdx = 0;
      }
    }
  }

  private async scheduleNote(measureIdx: number, stepIdx: number, time: number): Promise<void> {
    const measure = this.measures[measureIdx];
    if (!measure) return;
    
    const step = measure.steps[stepIdx];
    if (!step) return;

    // 1. Audio
    await this.audioEngineAdapter.strum(step.direction, step.chord, step.strumType, time);

    // 2. Visuals
    const currentTime = this.audioEngineAdapter.currentTime;
    const delayMs = (time - currentTime) * 1000;

    if (delayMs > 0) {
      this.timerAdapter.setTimeout(() => {
        this.eventBusAdapter.emitSync('step', { 
          measureIdx, 
          stepIdx, 
          step 
        });
      }, delayMs);
    } else {
      this.eventBusAdapter.emitSync('step', { 
        measureIdx, 
        stepIdx, 
        step 
      });
    }
  }

  private scheduler = (): void => {
    if (this.nextNoteTime < this.audioEngineAdapter.currentTime - 0.2) {
      this.nextNoteTime = this.audioEngineAdapter.currentTime;
    }

    while (this.nextNoteTime < this.audioEngineAdapter.currentTime + this.config.scheduleAheadTime) {
      this.scheduleNote(this.state.currentMeasureIdx, this.state.currentStepIdx, this.nextNoteTime);
      this.nextNote();
    }
    
    this.timerID = this.timerAdapter.setTimeout(this.scheduler, this.config.lookahead);
  };

  public get isCurrentlyPlaying(): boolean {
    return this.state.isPlaying;
  }

  public getCurrentPosition(): { measureIdx: number; stepIdx: number } {
    return {
      measureIdx: this.state.currentMeasureIdx,
      stepIdx: this.state.currentStepIdx
    };
  }

  public getDuration(): number {
    const totalSteps = this.measures.reduce((sum, measure) => sum + measure.steps.length, 0);
    const secondsPerBeat = 60.0 / this.config.bpm;
    const secondsPerEighth = secondsPerBeat / 2;
    
    return totalSteps * secondsPerEighth;
  }

  public getCurrentTime(): number {
    const totalStepsBefore = this.measures
      .slice(0, this.state.currentMeasureIdx)
      .reduce((sum, measure) => sum + measure.steps.length, 0);
    
    const currentSteps = this.state.currentStepIdx;
    const totalSteps = totalStepsBefore + currentSteps;
    
    const secondsPerBeat = 60.0 / this.config.bpm;
    const secondsPerEighth = secondsPerBeat / 2;
    
    return totalSteps * secondsPerEighth;
  }

  // Методы для получения состояния
  public getState(): PlayerState {
    return { ...this.state };
  }

  public getConfig(): SchedulerConfig {
    return { ...this.config };
  }

  public getMeasures(): Measure[] {
    return [...this.measures];
  }
}