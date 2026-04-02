import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../API/api';
import { setTokens, clearTokens } from '../../AuthStorage/authStorgage';

export const loginUser = createAsyncThunk(
 "auth/login",
 async (data, { rejectWithValue }) => {
   try {
     const res = await API.post("/api/auth/login", data);

     await setTokens(res.data.accessToken, res.data.refreshToken);

     return res.data;

   } catch (err) {
     return rejectWithValue(
       err.response?.data?.message || "Login failed"
     );
   }
 }
);


export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  // await clearToken();
  await clearTokens();
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
        state.token = action.payload.accessToken;
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
