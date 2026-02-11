import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
import API from '../../API/api';
import { requestUserPermission } from '../../firebase/firebase';

// http://10.0.2.2:3000/api/auth/register - dev
// http://10.0.2.2:4000/api/auth/register - prod

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (values, { rejectWithValue }) => {
    try {
      console.log('--- Form values received:---', values);
      const fcmToken = await requestUserPermission();
      console.log('--- FCM Token: ---', fcmToken);
      const payload = {
        ...values,
        fcmToken,
      };

      console.log('---- Final payload sent to API: ---', payload);
      const response = await API.post(
        '/api/auth/register',
        payload,
      );
      console.log('--- API check response: ---', response);
      console.log('--- API success response: ---', response?.data);

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
