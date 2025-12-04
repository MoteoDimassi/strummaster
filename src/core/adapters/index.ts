// Экспортируем все адаптеры для удобного использования
export { AudioEngineAdapter, audioEngineAdapter } from './AudioEngineAdapter';
export { PlayerAdapter, playerAdapter } from './PlayerAdapter';
export { TunerAdapter, tunerAdapter } from './TunerAdapter';

// Экспортируем браузерные адаптеры
export type {
  TimerApiAdapter,
  AnimationApiAdapter,
  AudioApiAdapter
} from './BrowserApiAdapter';

export {
  WebTimerApiAdapter,
  WebAnimationApiAdapter,
  WebAudioApiAdapter,
  BrowserApiAdapterFactory
} from './BrowserApiAdapter';

// Также экспортируем адаптеры для прямого доступа к core-модулям
export { AudioEngineCore } from '../audio/AudioEngineCore';
export { PlayerCore } from '../player/PlayerCore';
export { TunerCore } from '../tuner/TunerCore';

// Экспортируем интерфейсы для работы с адаптерами
export type {
  AudioContextAdapter,
  GainNodeAdapter,
  AudioBufferSourceNodeAdapter,
  AudioSampleAdapter,
  ChordSampleAdapter,
  AudioSampleFactoryAdapter,
  PlaybackStrategyAdapter,
  PlaybackStrategyFactoryAdapter,
  AudioEventBusAdapter,
  PlaybackStrategyType
} from '../audio/AudioEngineCore';

export type {
  TimerAdapter,
  AudioEngineAdapter as PlayerAudioEngineAdapter,
  EventBusAdapter,
  PlayerState
} from '../player/PlayerCore';

export type {
  AudioDataAdapter,
  AnimationAdapter,
  GuitarNote
} from '../tuner/TunerCore';