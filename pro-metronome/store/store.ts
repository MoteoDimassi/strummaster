import { configureStore } from '@reduxjs/toolkit';
import metronomeReducer from './metronomeSlice';

export const store = configureStore({
  reducer: {
    metronome: metronomeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
