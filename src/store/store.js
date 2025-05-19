import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/userSlice.js';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});