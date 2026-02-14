import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import API from '../../API/api';
import { setToken, clearToken } from '../../AuthStorage/authStorgage';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    console.log('--- authSlice (data) ---', data);
    try {
      const res = await API.post('/api/auth/login', data);
      console.log('--- loginuser (data) ---', res.data);
      await setToken(res.data.token);
      return res.data;
    } catch (err) {
      console.log('--- loginuser (error) ---', err);
      return rejectWithValue(err.response?.data?.msg || 'Login failed');
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await clearToken();
  return true;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.token = null;
      });
  },
});

// export const { logout } = authSlice.actions;
export default authSlice.reducer;
