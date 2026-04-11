import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../API/api';

// ─── FETCH ALL ───────────────────────────────────────────────────────────────
export const fetchAllSessions = createAsyncThunk(
  'session/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/api/session');
      // ✅ FIX: safely handle both { sessions: [...] } and [...] shapes
      return Array.isArray(res.data) ? res.data : (res.data?.sessions ?? []);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Network error.');
    }
  },
);

// ─── FETCH BY ID ─────────────────────────────────────────────────────────────
export const fetchSessionById = createAsyncThunk(
  'session/fetchById',
  async (sessionId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/api/session/${sessionId}`);
      // ✅ FIX: handle both { session: {...} } and plain object shapes
      return res.data?.session ?? res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Network error.');
    }
  },
);

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    list: [],
    selected: null,
    listState: 'idle',   // idle | loading | success | error
    detailState: 'idle', // idle | loading | success | error
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedSession(state) {
      state.selected = null;
      state.detailState = 'idle';
    },
    clearSessionError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // fetchAllSessions
      .addCase(fetchAllSessions.pending, state => {
        state.listState = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSessions.fulfilled, (state, action) => {
        state.listState = 'success';
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllSessions.rejected, (state, action) => {
        state.listState = 'error';
        state.loading = false;
        state.error = action.payload;
      })

      // fetchSessionById
      .addCase(fetchSessionById.pending, state => {
        state.detailState = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionById.fulfilled, (state, action) => {
        state.detailState = 'success';
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchSessionById.rejected, (state, action) => {
        state.detailState = 'error';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedSession, clearSessionError } = sessionSlice.actions;
export default sessionSlice.reducer;