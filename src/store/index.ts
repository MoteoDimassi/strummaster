import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import tunerReducer from './slices/tunerSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    tuner: tunerReducer,
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