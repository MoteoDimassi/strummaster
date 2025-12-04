import { Measure, StrumStep } from '../../../domain/entities';

export interface SchedulerConfig {
  bpm: number;
  lookahead: number;
  scheduleAheadTime: number;
}

export class PlayerService {
  private measures: Measure[] = [];
  private activeMeasureIdx: number = 0;
  private config: Partial<SchedulerConfig> = {
    bpm: 120,
    lookahead: 0.1,
    scheduleAheadTime: 0.1
  };
  private isPlaying: boolean = false;
  private timerId: any = null;
  private currentStep: number = 0;

  public setMeasures(measures: Measure[]): void {
    this.measures = measures;
  }

  public setActiveMeasureIdx(idx: number): void {
    this.activeMeasureIdx = idx;
  }

  public setConfig(config: Partial<SchedulerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public async start(): Promise<void> {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.currentStep = 0;
    
    // Эмитируем событие начала воспроизведения
    this.emitPlayEvent();
    
    // Импортируем AudioEngineService динамически, чтобы избежать циклических зависимостей
    const { audioEngineService } = await import('../../audio/services/AudioEngineService');
    
    const activeMeasure = this.measures[this.activeMeasureIdx];
    if (!activeMeasure) return;
    
    const steps = activeMeasure.steps;
    const stepDuration = 60 / (this.config.bpm! * 2); // 8th notes
    
    const playNextStep = async () => {
      if (!this.isPlaying || this.currentStep >= steps.length) {
        // Переходим к следующему такту, если есть
        if (this.currentStep >= steps.length && this.activeMeasureIdx < this.measures.length - 1) {
          this.activeMeasureIdx++;
          this.currentStep = 0;
          // Рекурсивно запускаем воспроизведение следующего такта
          this.start();
          return;
        }
        this.stop();
        return;
      }
      
      const step = steps[this.currentStep];
      
      // Эмитируем событие шага для анимации
      this.emitStepEvent(this.currentStep, step);
      
      if (step && step.chord) {
        await audioEngineService.strum(
          step.direction,
          step.chord,
          step.strumType,
          undefined
        );
      }
      
      this.currentStep++;
      
      if (this.currentStep < steps.length) {
        this.timerId = setTimeout(playNextStep, stepDuration * 1000);
      } else {
        // Переходим к следующему такту, если есть
        if (this.activeMeasureIdx < this.measures.length - 1) {
          this.activeMeasureIdx++;
          this.currentStep = 0;
          // Рекурсивно запускаем воспроизведение следующего такта
          setTimeout(() => this.start(), 100); // Небольшая задержка перед следующим тактом
        } else {
          this.stop();
        }
      }
    };
    
    // Начинаем воспроизведение
    await audioEngineService.resume();
    playNextStep();
  }

  public stop(): void {
    if (!this.isPlaying) return;
    
    this.isPlaying = false;
    
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    
    // Эмитируем событие остановки
    this.emitStopEvent();
  }

  public reset(): void {
    this.stop();
    this.activeMeasureIdx = 0;
  }

  public get isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentPosition(): { measureIdx: number; stepIdx: number } {
    return { measureIdx: this.activeMeasureIdx, stepIdx: this.currentStep };
  }

  public getDuration(): number {
    const activeMeasure = this.measures[this.activeMeasureIdx];
    if (!activeMeasure) return 0;
    
    const stepDuration = 60 / (this.config.bpm! * 2); // 8th notes
    return activeMeasure.steps.length * stepDuration;
  }

  public getCurrentTime(): number {
    const stepDuration = 60 / (this.config.bpm! * 2); // 8th notes
    return this.currentStep * stepDuration;
  }

  // Приватные методы для работы с событиями
  private stepCallbacks: ((data: any) => void)[] = [];
  private playCallbacks: ((data: any) => void)[] = [];
  private stopCallbacks: ((data: any) => void)[] = [];
  private errorCallbacks: ((data: any) => void)[] = [];

  private emitStepEvent(stepIndex: number, step: StrumStep | null): void {
    const data = {
      stepIndex,
      step,
      measureIdx: this.activeMeasureIdx,
      isPlaying: this.isPlaying
    };
    this.stepCallbacks.forEach(callback => callback(data));
  }

  private emitPlayEvent(): void {
    const data = {
      isPlaying: this.isPlaying,
      measureIdx: this.activeMeasureIdx
    };
    this.playCallbacks.forEach(callback => callback(data));
  }

  private emitStopEvent(): void {
    const data = {
      isPlaying: this.isPlaying,
      measureIdx: this.activeMeasureIdx
    };
    this.stopCallbacks.forEach(callback => callback(data));
  }

  // Методы для работы с событиями
  public onStep(callback: (data: any) => void): () => void {
    this.stepCallbacks.push(callback);
    return () => {
      const index = this.stepCallbacks.indexOf(callback);
      if (index > -1) {
        this.stepCallbacks.splice(index, 1);
      }
    };
  }

  public onPlay(callback: (data: any) => void): () => void {
    this.playCallbacks.push(callback);
    return () => {
      const index = this.playCallbacks.indexOf(callback);
      if (index > -1) {
        this.playCallbacks.splice(index, 1);
      }
    };
  }

  public onStop(callback: (data: any) => void): () => void {
    this.stopCallbacks.push(callback);
    return () => {
      const index = this.stopCallbacks.indexOf(callback);
      if (index > -1) {
        this.stopCallbacks.splice(index, 1);
      }
    };
  }

  public onError(callback: (data: any) => void): () => void {
    this.errorCallbacks.push(callback);
    return () => {
      const index = this.errorCallbacks.indexOf(callback);
      if (index > -1) {
        this.errorCallbacks.splice(index, 1);
      }
    };
  }

  // Метод для синхронизации состояний
  public syncStates(): void {
    // Пустая реализация для совместимости
  }
}

export const playerService = new PlayerService();