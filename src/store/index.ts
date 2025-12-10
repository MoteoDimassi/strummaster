import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import tunerReducer from './slices/tunerSlice';
import metronomeReducer from './slices/metronomeSlice';
import chordTrainerReducer from './slices/chordTrainerSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    tuner: tunerReducer,
    metronome: metronomeReducer,
    chordTrainer: chordTrainerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Удалены правила для audio slice, так как он больше не используется
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;