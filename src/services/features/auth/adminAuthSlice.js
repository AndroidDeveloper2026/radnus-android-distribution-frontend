// redux/adminAuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../API/api';
import { setToken, clearToken } from '../../AuthStorage/authStorgage';

export const adminLogin = createAsyncThunk(
  'auth/admin',
  async (data, { rejectWithValue }) => {

    try {
      const res = await API.post('/api/auth/admin', data);
      console.log("-- admin --",data);
      await setToken(res.data.token);
      return res.data;
    } catch (err) {
      console.log("-- admin(err) --",err);
      return rejectWithValue(err.response.data.message);
    }
  },
);

export const adminLogout = createAsyncThunk('adminAuth/logout', async () => {
  await clearToken();
  return true;
});

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    admin: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: state => {
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
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ||'Login failed';
      })

      .addCase(adminLogout.fulfilled, state => {
        state.admin = null;
        state.token = null;
      });
  },
});

// export const { logout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
