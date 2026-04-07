// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import API from '../../API/api';

// // Fetch all sessions
// export const fetchAllSessions = createAsyncThunk(
//   'session/fetchAll',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await API.get('/api/session');
//       return res.data.sessions;
//     } catch (err) {
//       const message = err.response?.data?.message || 'Network error.';
//       return rejectWithValue(message);
//     }
//   }
// );

// // Fetch single session by ID
// export const fetchSessionById = createAsyncThunk(
//   'session/fetchById',
//   async (sessionId, { rejectWithValue }) => {
//     try {
//       const res = await API.get(`/api/session/${sessionId}`);
//       return res.data; // ✅ FIXED: was res.data.session (undefined) because
//                        // the backend returns the session object directly,
//                        // not wrapped in { session: ... }
//     } catch (err) {
//       const message = err.response?.data?.message || 'Network error.';
//       return rejectWithValue(message);
//     }
//   }
// );

// const sessionSlice = createSlice({
//   name: 'session',
//   initialState: {
//     list:        [],
//     selected:    null,   // single session for map view
//     listState:   'idle', // idle | loading | success | error
//     detailState: 'idle', // idle | loading | success | error
//     error:       null,
//   },
//   reducers: {
//     clearSelectedSession(state) {
//       state.selected    = null;
//       state.detailState = 'idle';
//     },
//   },
//   extraReducers: (builder) => {

//     // fetchAllSessions
//     builder
//       .addCase(fetchAllSessions.pending, (state) => {
//         state.listState = 'loading';
//         state.error     = null;
//       })
//       .addCase(fetchAllSessions.fulfilled, (state, action) => {
//         state.listState = 'success';
//         state.list      = Array.isArray(action.payload) ? action.payload : [];
//       })
//       .addCase(fetchAllSessions.rejected, (state, action) => {
//         state.listState = 'error';
//         state.error     = action.payload;
//       });

//     // fetchSessionById
//     builder
//       .addCase(fetchSessionById.pending, (state) => {
//         state.detailState = 'loading';
//         state.error       = null;
//       })
//       .addCase(fetchSessionById.fulfilled, (state, action) => {
//         state.detailState = 'success';
//         state.selected    = action.payload; // now correctly holds the session object
//       })
//       .addCase(fetchSessionById.rejected, (state, action) => {
//         state.detailState = 'error';
//         state.error       = action.payload;
//       });
//   },
// });

// export const { clearSelectedSession } = sessionSlice.actions;
// export default sessionSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../API/api';

// Fetch all sessions
export const fetchAllSessions = createAsyncThunk(
  'session/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/api/session');
      return res.data.sessions;
    } catch (err) {
      const message = err.response?.data?.message || 'Network error.';
      return rejectWithValue(message);
    }
  }
);

// Fetch single session by ID
export const fetchSessionById = createAsyncThunk(
  'session/fetchById',
  async (sessionId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/api/session/${sessionId}`);
      return res.data; // ✅ backend returns session object directly, not { session: ... }
    } catch (err) {
      const message = err.response?.data?.message || 'Network error.';
      return rejectWithValue(message);
    }
  }
);

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    list:        [],
    selected:    null,   // single session for map view
    listState:   'idle', // idle | loading | success | error
    detailState: 'idle', // idle | loading | success | error
    // ✅ FIX: unified `loading` boolean so components can do a simple
    //         `useSelector(s => s.session.loading)` check without knowing
    //         which sub-state to watch
    loading:     false,
    error:       null,
  },
  reducers: {
    clearSelectedSession(state) {
      state.selected    = null;
      state.detailState = 'idle';
    },
    // ✅ FIX: allow manual error dismissal from UI
    clearSessionError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {

    // ─── fetchAllSessions ─────────────────────────────────────────────────
    builder
      .addCase(fetchAllSessions.pending, (state) => {
        state.listState = 'loading';
        state.loading   = true;   // ✅ FIX
        state.error     = null;
      })
      .addCase(fetchAllSessions.fulfilled, (state, action) => {
        state.listState = 'success';
        state.loading   = false;  // ✅ FIX
        state.list      = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllSessions.rejected, (state, action) => {
        state.listState = 'error';
        state.loading   = false;  // ✅ FIX
        state.error     = action.payload;
      });

    // ─── fetchSessionById ─────────────────────────────────────────────────
    builder
      .addCase(fetchSessionById.pending, (state) => {
        state.detailState = 'loading';
        state.loading     = true;   // ✅ FIX
        state.error       = null;
      })
      .addCase(fetchSessionById.fulfilled, (state, action) => {
        state.detailState = 'success';
        state.loading     = false;  // ✅ FIX
        state.selected    = action.payload;
      })
      .addCase(fetchSessionById.rejected, (state, action) => {
        state.detailState = 'error';
        state.loading     = false;  // ✅ FIX
        state.error       = action.payload;
      });
  },
});

export const { clearSelectedSession, clearSessionError } = sessionSlice.actions;
export default sessionSlice.reducer;