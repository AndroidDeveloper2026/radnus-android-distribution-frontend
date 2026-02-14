// redux/adminAuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const adminLogin = createAsyncThunk(
  'auth/admin',
  async (data, { rejectWithValue }) => {
        console.log('--- Adminlogin (data) ---',data);
    try {
      const res = await axios.post(
        'http://10.0.2.2:3000/api/auth/admin',
        data
      );
            console.log('--- Adminlogin (res.data) ---',res.data)
      return res.data;
    } catch (err) {
        console.log('--- Adminlogin (error) ---',err)
      return rejectWithValue(err.response.data.message);
    }
  }
);

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    admin: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.admin = null;
      state.token = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(adminLogin.pending, state => {
        state.loading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
