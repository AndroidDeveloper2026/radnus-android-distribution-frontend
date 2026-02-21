// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import API from '../../API/api';

// export const verifyResetOtp = createAsyncThunk(
//   'auth/verifyResetOtp',
//   async ({ email, otp }, { rejectWithValue }) => {
//     try {
//       const res = await API.post('/api/auth/verify-reset-otp', { email, otp });
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message);
//     }
//   }
// );

// const resetSlice = createSlice({
//   name: 'resetOtp',
//   initialState: {
//     loading: false,
//     error: null,
//     verified: false,
//   },
//   reducers: {
//     resetOtpState: state => {
//       state.loading = false;
//       state.error = null;
//       state.verified = false;
//     },
//   },
//   extraReducers: builder => {
//     builder
//       .addCase(verifyResetOtp.pending, state => {
//         state.loading = true;
//       })
//       .addCase(verifyResetOtp.fulfilled, state => {
//         state.loading = false;
//         state.verified = true;
//       })
//       .addCase(verifyResetOtp.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { resetOtpState } = resetSlice.actions;
// export default resetSlice.reducer;