// // // redux/adminAuthSlice.js
// // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import API from '../../API/api';
// // import { setToken, clearToken } from '../../AuthStorage/authStorgage';

// // export const adminLogin = createAsyncThunk(
// //   'auth/admin',
// //   async (data, { rejectWithValue }) => {

// //     try {
// //       const res = await API.post('/api/auth/admin', data);
// //       console.log("-- admin --",data);
// //       await setToken(res.data.token);
// //       return res.data;
// //     } catch (err) {
// //       console.log("-- admin(err) --",err);
// //       return rejectWithValue(err.response.data.message);
// //     }
// //   },
// // );

// // export const adminLogout = createAsyncThunk('adminAuth/logout', async () => {
// //   await clearToken();
// //   return true;
// // });

// // const adminAuthSlice = createSlice({
// //   name: 'adminAuth',
// //   initialState: {
// //     admin: null,
// //     token: null,
// //     loading: false,
// //     error: null,
// //   },
// //   reducers: {
// //     logout: state => {
// //       state.admin = null;
// //       state.token = null;
// //     },
// //   },
// //   extraReducers: builder => {
// //     builder
// //       .addCase(adminLogin.pending, state => {
// //         state.loading = true;
// //       })
// //       .addCase(adminLogin.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.admin = action.payload.admin;
// //         state.token = action.payload.token;
// //         state.error = null;
// //       })
// //       .addCase(adminLogin.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload ||'Login failed';
// //       })

// //       .addCase(adminLogout.fulfilled, state => {
// //         state.admin = null;
// //         state.token = null;
// //       });
// //   },
// // });

// // // export const { logout } = adminAuthSlice.actions;
// // export default adminAuthSlice.reducer;

// // redux/adminAuthSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import API from '../../API/api';
// import { setTokens, clearTokens } from '../../AuthStorage/authStorgage'; // ← Use setTokens, not setToken

// export const adminLogin = createAsyncThunk(
//   'auth/admin',
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await API.post('/api/auth/admin', data);
//       console.log("-- admin response --", res.data);
      
//       // ✅ Store both access and refresh tokens
//       if (res.data.accessToken && res.data.refreshToken) {
//         await setTokens(res.data.accessToken, res.data.refreshToken);
//       }
      
//       return res.data;
//     } catch (err) {
//       console.log("-- admin(err) --", err);
//       return rejectWithValue(err.response?.data?.message || 'Admin login failed');
//     }
//   }
// );

// export const adminLogout = createAsyncThunk('adminAuth/logout', async () => {
//   await clearTokens(); // ← Use clearTokens
//   return true;
// });

// const adminAuthSlice = createSlice({
//   name: 'adminAuth',
//   initialState: {
//     admin: null,
//     token: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     logout: state => {
//       state.admin = null;
//       state.token = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: builder => {
//     builder
//       .addCase(adminLogin.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(adminLogin.fulfilled, (state, action) => {
//         state.loading = false;
//         // ✅ FIXED: Use 'user' instead of 'admin'
//         state.admin = action.payload.user;  
//         // ✅ FIXED: Use 'accessToken' instead of 'token'
//         state.token = action.payload.accessToken;
//         state.error = null;
//       })
//       .addCase(adminLogin.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'Login failed';
//       })
//       .addCase(adminLogout.fulfilled, state => {
//         state.admin = null;
//         state.token = null;
//       });
//   },
// });

// export const { logout, clearError } = adminAuthSlice.actions;
// export default adminAuthSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../API/api';
import { setTokens, clearTokens, getAccessToken } from '../../AuthStorage/authStorgage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_USER_KEY = '@admin_user_data';

export const adminLogin = createAsyncThunk(
  'adminAuth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post('/api/auth/admin', data);
      console.log("✅ Admin login response:", res.data);
      
      // ✅ Store tokens using the SAME method as user login
      if (res.data.accessToken && res.data.refreshToken) {
        await setTokens(res.data.accessToken, res.data.refreshToken);
      }
      
      // ✅ Store admin user data separately (optional)
      if (res.data.user) {
        await AsyncStorage.setItem(ADMIN_USER_KEY, JSON.stringify(res.data.user));
      }
      
      return {
        admin: res.data.user,
        token: res.data.accessToken,
      };
    } catch (err) {
      console.log("❌ Admin login error:", err.response?.data);
      return rejectWithValue(err.response?.data?.message || 'Admin login failed');
    }
  }
);

export const adminLogout = createAsyncThunk('adminAuth/logout', async () => {
  // ✅ Clear tokens using SAME method as user logout
  await clearTokens();
  await AsyncStorage.removeItem(ADMIN_USER_KEY);
  return true;
});

// ✅ CHECK AUTH ON APP START (same as user)
export const checkAdminAuth = createAsyncThunk(
  'adminAuth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      console.log('[Admin checkAuth] Starting...');
      
      // Check for token
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.log('[Admin checkAuth] No token found');
        return rejectWithValue('No token found');
      }
      
      // Get admin user data
      const adminDataStr = await AsyncStorage.getItem(ADMIN_USER_KEY);
      if (!adminDataStr) {
        console.log('[Admin checkAuth] No admin data found');
        return rejectWithValue('No admin data');
      }
      
      const adminData = JSON.parse(adminDataStr);
      console.log('[Admin checkAuth] Admin restored:', adminData);
      
      return {
        admin: adminData,
        token: accessToken,
      };
    } catch (err) {
      console.error('[Admin checkAuth] Failed:', err);
      await clearTokens();
      await AsyncStorage.removeItem(ADMIN_USER_KEY);
      return rejectWithValue('Auth check failed');
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
    isCheckingAuth: true, // ✅ Add this
  },
  reducers: {
    logout: (state) => {
      state.admin = null;
      state.token = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        state.error = null;
        state.isCheckingAuth = false;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isCheckingAuth = false;
      })
      
      // LOGOUT
      .addCase(adminLogout.fulfilled, (state) => {
        state.admin = null;
        state.token = null;
        state.isCheckingAuth = false;
      })
      
      // CHECK AUTH
      .addCase(checkAdminAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAdminAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
      })
      .addCase(checkAdminAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        state.admin = null;
        state.token = null;
      });
  },
});

export const { logout, clearError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;