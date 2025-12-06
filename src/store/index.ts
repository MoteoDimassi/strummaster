import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import tunerReducer from './slices/tunerSlice';
import measureReducer from '../entities/measure/model/slice';
import instrumentReducer from '../entities/instrument/model/slice';
import newTunerReducer from '../entities/tuner/model/slice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    tuner: tunerReducer,
    // New slices
    measure: measureReducer,
    instrument: instrumentReducer,
    newTuner: newTunerReducer,
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