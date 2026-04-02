// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import API from '../../API/api';
// import { setTokens, clearTokens, getAccessToken } from '../../AuthStorage/authStorgage';

// export const loginUser = createAsyncThunk(
//  "auth/login",
//  async (data, { rejectWithValue }) => {
//    try {
//      const res = await API.post("/api/auth/login", data);

//      await setTokens(res.data.accessToken, res.data.refreshToken);

//      return res.data;

//    } catch (err) {
//      return rejectWithValue(
//        err.response?.data?.message || "Login failed"
//      );
//    }
//  }
// );


// export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
//   // await clearToken();
//   await clearTokens();
//   return true;
// });

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     token: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     logout: state => {
//       state.user = null;
//       state.token = null;
//     },
//   },
//   extraReducers: builder => {
//     builder
//       .addCase(loginUser.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload.accessToken;
//         state.user = action.payload.user;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(logoutUser.fulfilled, state => {
//         state.user = null;
//         state.token = null;
//       });
//   },
// });

// // export const { logout } = authSlice.actions;
// export default authSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import API from '../../API/api';
// import { setTokens, clearTokens, getAccessToken } from '../../AuthStorage/authStorgage';

// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await API.post("/api/auth/login", data);
//       await setTokens(res.data.accessToken, res.data.refreshToken);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Login failed");
//     }
//   }
// );

// export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
//   await clearTokens();
//   return true;
// });

// // NEW: Check authentication on app start
// export const checkAuth = createAsyncThunk(
//   'auth/checkAuth',
//   async (_, { rejectWithValue }) => {
//     try {
//       const accessToken = await getAccessToken();
//       if (!accessToken) {
//         return rejectWithValue('No token found');
//       }

//       // Call backend to get current user
//       const res = await API.get('/api/auth/me');
//       return { user: res.data.user, accessToken };
//     } catch (err) {
//       // Token invalid or network error – clear storage
//       await clearTokens();
//       return rejectWithValue(err.response?.data?.message || 'Authentication failed');
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     token: null,
//     loading: false,
//     error: null,
//     isCheckingAuth: true, // ADD THIS
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // LOGIN
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload.accessToken;
//         state.user = action.payload.user;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // LOGOUT
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.user = null;
//         state.token = null;
//         state.isCheckingAuth = false;
//       })
      
//       // CHECK AUTH
//       .addCase(checkAuth.pending, (state) => {
//         state.isCheckingAuth = true;
//         state.error = null;
//       })
//       .addCase(checkAuth.fulfilled, (state, action) => {
//         state.isCheckingAuth = false;
//         state.user = action.payload.user;
//         state.token = action.payload.accessToken;
//       })
//       .addCase(checkAuth.rejected, (state, action) => {
//         state.isCheckingAuth = false;
//         state.user = null;
//         state.token = null;
//         state.error = action.payload;
//       });
//   },
// });

// export const { logout, clearError } = authSlice.actions;
// export default authSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import API from '../../API/api';
// import { setTokens, clearTokens, getAccessToken } from '../../AuthStorage/authStorgage';
 
// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await API.post("/api/auth/login", data);
//       await setTokens(res.data.accessToken, res.data.refreshToken);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Login failed");
//     }
//   }
// );
 
// export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
//   await clearTokens();
//   return true;
// });
 
// /**
//  * ✅ FIXED: checkAuth now only checks AsyncStorage
//  * 
//  * Don't call /api/auth/me on app startup!
//  * Just check if token exists locally
//  */
// export const checkAuth = createAsyncThunk(
//   'auth/checkAuth',
//   async (_, { rejectWithValue }) => {
//     try {
//       console.log('[checkAuth] Starting auth check...');
 
//       // ✅ CHANGE 1: Just check AsyncStorage for token
//       // Don't make API call!
//       const accessToken = await getAccessToken();
 
//       if (!accessToken) {
//         console.log('[checkAuth] No token found in AsyncStorage');
//         return rejectWithValue('No token found');
//       }
 
//       console.log('[checkAuth] Token found! User is logged in');
 
//       // ✅ CHANGE 2: Don't call /api/auth/me
//       // We'll get user data when screens that need it request it
//       // For now, just return that user is authenticated
      
//       return {
//         user: { authenticated: true }, // Minimal data - screens can load full user data if needed
//         accessToken,
//       };
//     } catch (err) {
//       console.error('[checkAuth] Auth check failed:', err);
//       // Token invalid or other error – clear storage
//       await clearTokens();
//       return rejectWithValue(err.message || 'Authentication check failed');
//     }
//   }
// );
 
// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     token: null,
//     loading: false,
//     error: null,
//     isCheckingAuth: true,
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // LOGIN
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload.accessToken;
//         state.user = action.payload.user;
//         state.isCheckingAuth = false;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.isCheckingAuth = false;
//       })
 
//       // LOGOUT
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.user = null;
//         state.token = null;
//         state.isCheckingAuth = false;
//       })
 
//       // CHECK AUTH ✅ FIXED
//       .addCase(checkAuth.pending, (state) => {
//         state.isCheckingAuth = true;
//         state.error = null;
//       })
//       .addCase(checkAuth.fulfilled, (state, action) => {
//         console.log('[authSlice] checkAuth fulfilled - user is logged in');
//         state.isCheckingAuth = false;
//         state.user = action.payload.user;
//         state.token = action.payload.accessToken;
//         state.error = null;
//       })
//       .addCase(checkAuth.rejected, (state, action) => {
//         console.log('[authSlice] checkAuth rejected - user not logged in');
//         state.isCheckingAuth = false;
//         state.user = null;
//         state.token = null;
//         state.error = action.payload;
//       });
//   },
// });
 
// export const { logout, clearError } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../API/api';
import { setTokens, clearTokens, getAccessToken } from '../../AuthStorage/authStorgage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_DATA_KEY = '@user_data';

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/api/auth/login", data);
      await setTokens(res.data.accessToken, res.data.refreshToken);
      
      // ✅ STORE USER DATA IN ASYNCSTORAGE
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(res.data.user));
      
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await clearTokens();
  await AsyncStorage.removeItem(USER_DATA_KEY); // ✅ CLEAR USER DATA
  return true;
});

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      console.log('[checkAuth] Starting auth check...');
      
      // Check for token
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.log('[checkAuth] No token found');
        return rejectWithValue('No token found');
      }
      
      // ✅ GET USER DATA FROM ASYNCSTORAGE
      const userDataStr = await AsyncStorage.getItem(USER_DATA_KEY);
      if (!userDataStr) {
        console.log('[checkAuth] No user data found');
        return rejectWithValue('No user data found');
      }
      
      const userData = JSON.parse(userDataStr);
      console.log('[checkAuth] User restored:', userData);
      
      return {
        user: userData,  // ✅ FULL USER DATA WITH ROLE
        accessToken,
      };
    } catch (err) {
      console.error('[checkAuth] Auth check failed:', err);
      await clearTokens();
      await AsyncStorage.removeItem(USER_DATA_KEY);
      return rejectWithValue(err.message || 'Authentication check failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    isCheckingAuth: true,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
        state.isCheckingAuth = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isCheckingAuth = false;
      })
 
      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isCheckingAuth = false;
      })
 
      // CHECK AUTH ✅ FIXED
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        console.log('[authSlice] checkAuth fulfilled - user is logged in');
        state.isCheckingAuth = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        console.log('[authSlice] checkAuth rejected - user not logged in');
        state.isCheckingAuth = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      });
  },
});
 
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;