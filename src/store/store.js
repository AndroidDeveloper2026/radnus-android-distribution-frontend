import { configureStore } from '@reduxjs/toolkit';
import registerReducer from '../services/features/auth/registerSlice';
import authReducer from '../services/features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    register: registerReducer,
  },
});
