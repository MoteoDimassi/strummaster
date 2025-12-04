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
  getUserMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
  createMediaStreamSource(context: AudioContext, stream: MediaStream): MediaStreamAudioSourceNode;
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
    console.log('[WebAudioApiAdapter] Создание AudioContext');
    return new AudioContext();
  }

  createAnalyser(context: AudioContext): AnalyserNode {
    console.log('[WebAudioApiAdapter] Создание AnalyserNode');
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;
    return analyser;
  }

  async getUserMedia(constraints?: MediaStreamConstraints): Promise<MediaStream> {
    console.log('[WebAudioApiAdapter] Запрос доступа к микрофону');
    const defaultConstraints: MediaStreamConstraints = constraints || {
      audio: {
        echoCancellation: false,
        autoGainControl: false
      }
    };
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia(defaultConstraints);
      console.log('[WebAudioApiAdapter] Доступ к микрофону получен');
      return stream;
    } catch (error) {
      console.error('[WebAudioApiAdapter] Ошибка доступа к микрофону:', error);
      throw error;
    }
  }

  createMediaStreamSource(context: AudioContext, stream: MediaStream): MediaStreamAudioSourceNode {
    console.log('[WebAudioApiAdapter] Создание MediaStreamAudioSourceNode');
    return context.createMediaStreamSource(stream);
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