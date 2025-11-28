import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import tunerReducer from './slices/tunerSlice';
import audioReducer from './slices/audioSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    tuner: tunerReducer,
    audio: audioReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['audio/addLoadedSample', 'audio/addPreloadingChord', 'audio/removePreloadingChord'],
        ignoredPaths: ['audio.loadedSamples', 'audio.preloadingChords'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;