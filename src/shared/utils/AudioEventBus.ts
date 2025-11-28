export type AudioEventType = 'play' | 'stop' | 'pause' | 'resume' | 'step' | 'measure' | 'error';

export interface AudioEvent {
  type: AudioEventType;
  data?: any;
  timestamp: number;
}

export type AudioEventListener = (event: AudioEvent) => void;

class AudioEventBus {
  private listeners: Map<AudioEventType, Set<AudioEventListener>> = new Map();

  subscribe(eventType: AudioEventType, listener: AudioEventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    
    this.listeners.get(eventType)!.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(listener);
    };
  }

  emit(event: AudioEvent): void {
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach(listener => listener(event));
    }
  }

  emitSync(type: AudioEventType, data?: any): void {
    this.emit({
      type,
      data,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.listeners.clear();
  }

  clearEventType(eventType: AudioEventType): void {
    this.listeners.delete(eventType);
  }
}

// Singleton instance
export const audioEventBus = new AudioEventBus();