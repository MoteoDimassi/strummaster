import { configureStore } from '@reduxjs/toolkit';
import trainerReducer from './slices/trainerSlice';

export const store = configureStore({
  reducer: {
    trainer: trainerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
