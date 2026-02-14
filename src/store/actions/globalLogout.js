// src/store/actions/globalLogout.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { logoutUser } from '../../services/features/auth/authSlice';
import { adminLogout } from '../../services/features/auth/adminAuthSlice';

export const globalLogout = createAsyncThunk(
  'auth/globalLogout',
  async (_, { dispatch }) => {
    dispatch(logoutUser());
    dispatch(adminLogout());
  }
);
