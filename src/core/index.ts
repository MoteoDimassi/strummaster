// Основной индексный файл для core модулей
// Здесь будут экспортированы все основные функциональности

// Экспорты из audio модуля
export * from './audio';

// Экспорты из player модуля
export * from './player';

// Экспорты из tuner модуля
export * from './tuner';

// Явный реэкспорт из adapters модуля для избежания конфликтов имен
import {
  AudioEngineAdapter as AdapterAudioEngineAdapter,
  audioEngineAdapter,
  PlayerAdapter,
  playerAdapter,
  TunerAdapter,
  tunerAdapter
} from './adapters';

// Реэкспорт с новыми именами для избежания конфликтов
export { AdapterAudioEngineAdapter, audioEngineAdapter, PlayerAdapter, playerAdapter, TunerAdapter, tunerAdapter };

// Также экспортируем типы из adapters
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
  PlaybackStrategyType,
  TimerAdapter,
  EventBusAdapter,
  PlayerState,
  AudioDataAdapter,
  AnimationAdapter,
  GuitarNote
} from './adapters';
