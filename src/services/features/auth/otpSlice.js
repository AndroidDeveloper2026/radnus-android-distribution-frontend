// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import API from '../../API/api';
// // import axios from 'axios';

// /* ---------------- VERIFY OTP ---------------- */
// export const verifyOtp = createAsyncThunk(
//   'auth/verify-otp',
//   async ({ mobile, otp }, { rejectWithValue }) => {
//     console.log('-- verifyOtp api mobile:--', mobile, ' --otp: ---', otp);

//     try {
//       const res = await API.post('/api/auth/verify-otp', {
//         mobile,
//         otp,
//       });
//       console.log('-- otp api (res.data) --', res.data);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || 'OTP verification failed',
//       );
//     }
//   },
// );

// /* ---------------- RESEND OTP ---------------- */
// export const resendOtp = createAsyncThunk(
//   'auth/resend-otp',
//   async ({ mobile }, { rejectWithValue }) => {
//     console.log('-- resend api mobile:--', mobile);
//     try {
//       const res = await API.post('/api/auth/resend-otp', {
//         mobile,
//       });
//       console.log('-- resend otp api --', res.data);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue('Failed to resend OTP');
//     }
//   },
// );

// const otpSlice = createSlice({
//   name: 'otp',
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
//       /* VERIFY OTP */
//       .addCase(verifyOtp.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })

//       .addCase(verifyOtp.fulfilled, (state, action) => {
//         state.loading = false;

//         if (action.payload.success) {
//           state.verified = true;
//           state.error = null;
//         } else {
//           state.verified = false;
//           state.error = action.payload.message;
//         }
//       })

//       //   .addCase(verifyOtp.fulfilled, (state, action) => {
//       //     state.loading = false;
//       //     state.verified = action.payload.success; // 🔥 important
//       //   })

//       .addCase(verifyOtp.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       /* RESEND OTP */
//       .addCase(resendOtp.pending, state => {
//         state.loading = true;
//       })
//       .addCase(resendOtp.fulfilled, state => {
//         state.loading = false;
//       })
//       .addCase(resendOtp.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { resetOtpState } = otpSlice.actions;
// export default otpSlice.reducer;

//-----------------

// services/features/auth/otpSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../API/api';

/* ---------------- VERIFY OTP ---------------- */
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ type, mobile, email, otp }, { rejectWithValue }) => {
    try {
      let url = '';
      let payload = {};

      if (type === 'register') {
        url = '/api/auth/verify-otp';
        payload = { mobile, otp };
      } else {
        url = '/api/auth/verify-reset-otp';
        payload = { email, otp };
      }

      const res = await API.post(url, payload);
      return { ...res.data, type };

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'OTP failed'
      );
    }
  }
);

/* ---------------- RESEND OTP ---------------- */
export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async ({ type, mobile, email }, { rejectWithValue }) => {
    try {
      let url = '';
      let payload = {};

      if (type === 'register') {
        url = '/api/auth/resend-otp';
        payload = { mobile };
      } else {
        url = '/api/auth/resend-reset-otp';
        payload = { email };
      }

      const res = await API.post(url, payload);
      return res.data;

    } catch (err) {
      return rejectWithValue('Failed to resend OTP');
    }
  }
);

const otpSlice = createSlice({
  name: 'otp',
  initialState: {
    loading: false,
    error: null,
    verified: false,
    type: null,
  },
  reducers: {
    resetOtpState: state => {
      state.loading = false;
      state.error = null;
      state.verified = false;
      state.type = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(verifyOtp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.success) {
          state.verified = true;
          state.type = action.payload.type;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(resendOtp.pending, state => {
        state.loading = true;
      })
      .addCase(resendOtp.fulfilled, state => {
        state.loading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOtpState } = otpSlice.actions;
export default otpSlice.reducer;