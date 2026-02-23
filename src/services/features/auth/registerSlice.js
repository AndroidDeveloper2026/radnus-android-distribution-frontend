import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../API/api';
import { requestUserPermission } from '../../firebase/firebase';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (values, { rejectWithValue }) => {
    try {

      const fcmToken = await requestUserPermission();

      const payload = {
        ...values,
        fcmToken,
      };

      const response = await API.post(
        '/api/auth/register',
        payload,
      );


      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

const registerSlice = createSlice({
  name: 'register',
  initialState: {
    loading: false,
    user: null,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default registerSlice.reducer;
