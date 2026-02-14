import { configureStore } from '@reduxjs/toolkit';
import registerReducer from '../services/features/auth/registerSlice';
import authReducer from '../services/features/auth/authSlice';
import adminReducer from '../services/features/auth/adminAuthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminReducer,
    register: registerReducer,
  },
});
