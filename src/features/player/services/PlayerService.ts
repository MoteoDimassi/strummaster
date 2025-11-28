import { Measure, StrumStep } from '../../../domain/entities';
import { audioEngineService } from '../../audio/services/AudioEngineService';
import { audioEventBus } from '../../../shared/utils/AudioEventBus';

export interface SchedulerConfig {
  bpm: number;
  lookahead: number;
  scheduleAheadTime: number;
}

export class PlayerService {
  private isPlaying = false;
  private nextNoteTime = 0;
  private currentMeasureIdx = 0;
  private currentStepIdx = 0;
  private timerID: number | null = null;
  private measures: Measure[] = [];
  private activeMeasureIdx = 0;
  private config: SchedulerConfig = {
    bpm: 90,
    lookahead: 25.0,
    scheduleAheadTime: 0.1
  };

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    audioEventBus.subscribe('play', (event) => {
      console.log('Audio play event:', event);
    });

    audioEventBus.subscribe('stop', (event) => {
      console.log('Audio stop event:', event);
      this.stop();
    });

    audioEventBus.subscribe('error', (event) => {
      console.error('Audio error event:', event);
    });
  }

  public setMeasures(measures: Measure[]): void {
    this.measures = measures;
  }

  public setActiveMeasureIdx(idx: number): void {
    this.activeMeasureIdx = idx;
    if (!this.isPlaying) {
      this.currentMeasureIdx = idx;
      this.currentStepIdx = 0;
    }
  }

  public setConfig(config: Partial<SchedulerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public async start(): Promise<void> {
    if (this.isPlaying) return;

    await audioEngineService.resume();
    this.isPlaying = true;
    
    // Start from the beginning of the CURRENT measure
    this.currentMeasureIdx = this.activeMeasureIdx;
    this.currentStepIdx = 0;
    this.nextNoteTime = audioEngineService.currentTime + 0.1;
    
    this.scheduler();
    
    audioEventBus.emitSync('play', { 
      measureIdx: this.currentMeasureIdx, 
      stepIdx: this.currentStepIdx 
    });
  }

  public stop(): void {
    if (!this.isPlaying) return;

    this.isPlaying = false;
    
    if (this.timerID) {
      window.clearTimeout(this.timerID);
      this.timerID = null;
    }
    
    audioEventBus.emitSync('stop');
  }

  public reset(): void {
    this.stop();
    this.currentMeasureIdx = this.activeMeasureIdx;
    this.currentStepIdx = 0;
  }

  private nextNote(): void {
    const secondsPerBeat = 60.0 / this.config.bpm;
    const secondsPerEighth = secondsPerBeat / 2;
    this.nextNoteTime += secondsPerEighth;
    
    // Advance logic
    const currentMeasure = this.measures[this.currentMeasureIdx];
    if (!currentMeasure) return;
    
    this.currentStepIdx += 1;

    // Check if end of measure
    if (this.currentStepIdx >= currentMeasure.steps.length) {
      this.currentStepIdx = 0;
      this.currentMeasureIdx += 1;
      
      // Loop song
      if (this.currentMeasureIdx >= this.measures.length) {
        this.currentMeasureIdx = 0;
      }
    }
  }

  private async scheduleNote(measureIdx: number, stepIdx: number, time: number): Promise<void> {
    const measure = this.measures[measureIdx];
    if (!measure) return;
    
    const step = measure.steps[stepIdx];
    if (!step) return;

    // 1. Audio
    await audioEngineService.strum(step.direction, step.chord, step.strumType, time);

    // 2. Visuals
    const currentTime = audioEngineService.currentTime;
    const delayMs = (time - currentTime) * 1000;

    if (delayMs > 0) {
      window.setTimeout(() => {
        audioEventBus.emitSync('step', { 
          measureIdx, 
          stepIdx, 
          step 
        });
      }, delayMs);
    } else {
      audioEventBus.emitSync('step', { 
        measureIdx, 
        stepIdx, 
        step 
      });
    }
  }

  private scheduler = (): void => {
    if (this.nextNoteTime < audioEngineService.currentTime - 0.2) {
      this.nextNoteTime = audioEngineService.currentTime;
    }

    while (this.nextNoteTime < audioEngineService.currentTime + this.config.scheduleAheadTime) {
      this.scheduleNote(this.currentMeasureIdx, this.currentStepIdx, this.nextNoteTime);
      this.nextNote();
    }
    
    this.timerID = window.setTimeout(this.scheduler, this.config.lookahead);
  };

  public get isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentPosition(): { measureIdx: number; stepIdx: number } {
    return {
      measureIdx: this.currentMeasureIdx,
      stepIdx: this.currentStepIdx
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
      .slice(0, this.currentMeasureIdx)
      .reduce((sum, measure) => sum + measure.steps.length, 0);
    
    const currentSteps = this.currentStepIdx;
    const totalSteps = totalStepsBefore + currentSteps;
    
    const secondsPerBeat = 60.0 / this.config.bpm;
    const secondsPerEighth = secondsPerBeat / 2;
    
    return totalSteps * secondsPerEighth;
  }
}

export const playerService = new PlayerService();