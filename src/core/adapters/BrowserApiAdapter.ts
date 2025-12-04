/**
 * Адаптеры для инкапсуляции браузерных API
 * Это позволяет улучшить тестируемость кода и изолировать зависимости от браузера
 */

// Интерфейс для работы с таймерами
export interface TimerApiAdapter {
  setTimeout(callback: () => void, delay: number): number | null;
  clearTimeout(timerId: number | null): void;
}

// Интерфейс для работы с анимацией
export interface AnimationApiAdapter {
  requestAnimationFrame(callback: () => void): number;
  cancelAnimationFrame(id: number): void;
}

// Интерфейс для работы с аудио
export interface AudioApiAdapter {
  createAudioContext(): AudioContext;
  createAnalyser(context: AudioContext): AnalyserNode;
}

// Реализация адаптера для таймеров на основе браузерного API
export class WebTimerApiAdapter implements TimerApiAdapter {
  setTimeout(callback: () => void, delay: number): number | null {
    return window.setTimeout(callback, delay);
  }

  clearTimeout(timerId: number | null): void {
    if (timerId !== null) {
      window.clearTimeout(timerId);
    }
  }
}

// Реализация адаптера для анимации на основе браузерного API
export class WebAnimationApiAdapter implements AnimationApiAdapter {
  requestAnimationFrame(callback: () => void): number {
    return window.requestAnimationFrame(callback);
  }

  cancelAnimationFrame(id: number): void {
    window.cancelAnimationFrame(id);
  }
}

// Реализация адаптера для аудио на основе браузерного API
export class WebAudioApiAdapter implements AudioApiAdapter {
  createAudioContext(): AudioContext {
    return new AudioContext();
  }

  createAnalyser(context: AudioContext): AnalyserNode {
    return context.createAnalyser();
  }
}

// Фабрика для создания адаптеров по умолчанию
export class BrowserApiAdapterFactory {
  static createTimerAdapter(): TimerApiAdapter {
    return new WebTimerApiAdapter();
  }

  static createAnimationAdapter(): AnimationApiAdapter {
    return new WebAnimationApiAdapter();
  }

  static createAudioAdapter(): AudioApiAdapter {
    return new WebAudioApiAdapter();
  }
}